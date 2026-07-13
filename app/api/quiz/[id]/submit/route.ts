import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: quizId } = await params;
    const body = await request.json()
    const { attemptId, answers, warnings, terminated } = body

    if (!attemptId || !answers) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // 1. Fetch correct answers for the quiz
    const { data: questions, error: questionsError } = await supabase
      .from("questions")
      .select("id, correct_answer")
      .eq("quiz_id", quizId)

    if (questionsError || !questions) {
      console.error("Error fetching questions:", questionsError)
      return NextResponse.json({ error: "Failed to fetch quiz questions" }, { status: 500 })
    }

    // 2. Evaluate answers and prepare insertion data
    // First, verify the attempt still exists (handles stale local storage)
    const { data: attempt, error: attemptCheckError } = await supabase
      .from("quiz_attempts")
      .select("id")
      .eq("id", attemptId)
      .single()

    if (attemptCheckError || !attempt) {
      console.error("Attempt not found:", attemptId)
      return NextResponse.json({ error: "Attempt not found or invalid" }, { status: 404 })
    }

    let correctAnswersCount = 0
    const studentAnswersToInsert = []

    for (const question of questions) {
      const studentAnswer = answers[question.id] || ""
      const isCorrect = studentAnswer === question.correct_answer

      if (isCorrect) correctAnswersCount++

      studentAnswersToInsert.push({
        attempt_id: attemptId,
        question_id: question.id,
        selected_answer: studentAnswer === "" ? null : studentAnswer,
        is_correct: isCorrect,
      })
    }

    // 3. Save student answers
    // Delete any existing answers for this attempt to prevent unique constraint errors on retry
    await supabase.from("student_answers").delete().eq("attempt_id", attemptId)

    const { error: answersError } = await supabase
      .from("student_answers")
      .insert(studentAnswersToInsert)

    if (answersError) {
      console.error("Error saving answers:", answersError)
      return NextResponse.json({ error: "Failed to save answers", details: answersError.message }, { status: 500 })
    }

    // 4. Update the attempt with the final score
    const updateData = {
      completed_at: new Date().toISOString(),
      score: correctAnswersCount,
      total_questions: questions.length,
      warnings_count: body.warnings || 0, // Fallback for old clients
      tab_switches_count: body.tabSwitches || 0,
      window_blurs_count: body.windowBlurs || 0,
      fullscreen_leaves_count: body.fullscreenLeaves || 0,
      proctoring_logs: body.proctoringLogs || [],
      is_terminated: body.terminated || false,
      terminated_reason: body.terminated ? "Suspicious activity limit exceeded" : null
    }

    const { error: attemptError } = await supabase
      .from("quiz_attempts")
      .update(updateData)
      .eq("id", attemptId)

    if (attemptError) {
      console.error("Error updating attempt:", attemptError)
      return NextResponse.json({ error: "Failed to update attempt", details: attemptError.message }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      score: correctAnswersCount, 
      total: questions.length 
    })
  } catch (error) {
    console.error("Error submitting quiz:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
