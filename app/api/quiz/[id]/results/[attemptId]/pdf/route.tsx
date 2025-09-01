import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"
import { jsPDF } from "jspdf"

export async function GET(request: NextRequest, { params }: { params: { id: string; attemptId: string } }) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Fetch attempt details first
    const { data: attempt, error: attemptError } = await supabase
      .from("quiz_attempts")
      .select(`
        *,
        quizzes!inner(
          *,
          teacher_id
        )
      `)
      .eq("id", params.attemptId)
      .eq("quiz_id", params.id)
      .single()

    // Fetch student answers separately
    const { data: studentAnswers, error: answersError } = await supabase
      .from("student_answers")
      .select("*")
      .eq("attempt_id", params.attemptId)

    // Fetch questions separately
    const { data: questions, error: questionsError } = await supabase
      .from("questions")
      .select("*")
      .eq("quiz_id", params.id)

    // Combine the data
    if (attempt && studentAnswers && questions) {
      attempt.student_answers = studentAnswers.map(answer => ({
        ...answer,
        questions: questions.find(q => q.id === answer.question_id)
      }))
      
      // Calculate correct score from individual answers
      const correctAnswers = studentAnswers.filter(answer => answer.is_correct).length
      attempt.score = correctAnswers
    }

    if (attemptError || !attempt) {
      console.error("PDF Error - Attempt not found:", attemptError)
      return NextResponse.json({ error: "Attempt not found" }, { status: 404 })
    }

    console.log("PDF - Attempt data:", attempt)
    console.log("PDF - Student answers raw:", studentAnswers)
    console.log("PDF - Questions raw:", questions)
    console.log("PDF - Combined student answers:", attempt.student_answers)
    console.log("PDF - First answer question:", attempt.student_answers?.[0]?.questions)

    // Check if user owns this quiz
    if (attempt.quizzes.teacher_id !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Generate PDF content
    const pdfBuffer = await generatePDF(attempt)

    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="quiz-result-${attempt.student_name.replace(/\s+/g, "-")}.pdf"`,
      },
    })
  } catch (error) {
    console.error("Error generating PDF:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

async function generatePDF(attempt: any) {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  let yPosition = 20

  // Helper function to add text with word wrap
  const addText = (text: string, x: number, y: number, maxWidth?: number) => {
    const lines = doc.splitTextToSize(text, maxWidth || pageWidth - 40)
    doc.text(lines, x, y)
    return y + (lines.length * 7)
  }

  // Helper function to check if we need a new page
  const checkNewPage = (requiredSpace: number) => {
    if (yPosition + requiredSpace > pageHeight - 20) {
      doc.addPage()
      yPosition = 20
    }
  }

  // Title
  doc.setFontSize(20)
  doc.setFont("helvetica", "bold")
  yPosition = addText(attempt.quizzes.title.toUpperCase(), 20, yPosition)
  yPosition += 10

  // Student Info
  doc.setFontSize(12)
  doc.setFont("helvetica", "normal")
  yPosition = addText(`Student: ${attempt.student_name}`, 20, yPosition)
  yPosition = addText(`Date: ${new Date(attempt.completed_at).toLocaleDateString()}`, 20, yPosition)
  yPosition = addText(`Score: ${attempt.score}/${attempt.total_questions} (${Math.round((attempt.score / attempt.total_questions) * 100)}%)`, 20, yPosition)
  yPosition += 10

  // Quiz Details
  doc.setFont("helvetica", "bold")
  yPosition = addText("Quiz Details:", 20, yPosition)
  doc.setFont("helvetica", "normal")
  yPosition = addText(`Total Questions: ${attempt.total_questions}`, 20, yPosition)
  yPosition = addText("Duration: No time limit", 20, yPosition)
  if (attempt.quizzes.description) {
    yPosition = addText(`Description: ${attempt.quizzes.description}`, 20, yPosition)
  }
  yPosition += 10

  // Questions and Answers
  doc.setFont("helvetica", "bold")
  yPosition = addText("Questions & Answers:", 20, yPosition)
  yPosition += 5

  doc.setFont("helvetica", "normal")
  attempt.student_answers.forEach((answer: any, index: number) => {
    const question = answer.questions
    if (!question) return

    checkNewPage(50)

    // Question number and text
    doc.setFont("helvetica", "bold")
    yPosition = addText(`Question ${index + 1}:`, 20, yPosition)
    doc.setFont("helvetica", "normal")
    yPosition = addText(question.question_text, 20, yPosition, pageWidth - 40)
    yPosition += 5

    // Student's answer
    const selectedOptionKey = `option_${answer.selected_answer.toLowerCase()}`
    const selectedText = question[selectedOptionKey] || "Not available"
    yPosition = addText(`Student's Answer: ${answer.selected_answer}. ${selectedText}`, 20, yPosition, pageWidth - 40)
    
    // Correct answer
    const correctOptionKey = `option_${question.correct_answer.toLowerCase()}`
    const correctText = question[correctOptionKey] || "Not available"
    yPosition = addText(`Correct Answer: ${question.correct_answer}. ${correctText}`, 20, yPosition, pageWidth - 40)
    
    // Score
    yPosition = addText(`Score: ${answer.is_correct ? "1/1" : "0/1"}`, 20, yPosition)
    yPosition += 10
  })

  // Footer
  const footerY = pageHeight - 20
  doc.setFontSize(10)
  doc.setFont("helvetica", "normal")
  doc.text(`Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`, 20, footerY)
  doc.text("Quiz Management System", pageWidth - 60, footerY)

  return doc.output("arraybuffer")
}
