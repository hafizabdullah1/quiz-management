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
    const { student_name, student_email, browser_fingerprint } = body

    if (!student_name || !student_email) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 })
    }

    // Get total questions for this quiz
    const { data: quiz, error: quizError } = await supabase
      .from("quizzes")
      .select(`id, questions(count)`)
      .eq("id", quizId)
      .single()

    if (quizError || !quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 })
    }

    const total_questions = quiz.questions[0].count

    // Create attempt
    const { data: attempt, error } = await supabase
      .from("quiz_attempts")
      .insert({
        quiz_id: quizId,
        student_name,
        student_email,
        browser_fingerprint,
        total_questions,
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating attempt:", error)
      return NextResponse.json({ error: "Failed to create attempt" }, { status: 500 })
    }

    return NextResponse.json(attempt)
  } catch (error) {
    console.error("Error starting quiz:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
