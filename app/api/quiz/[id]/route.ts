import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// Use service role key to bypass RLS for this specific controlled operation
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: quizId } = await params;

    // Fetch quiz and questions securely
    const { data, error } = await supabase
      .from("quizzes")
      .select(`
        *,
        questions(
          id,
          question_text,
          option_a,
          option_b,
          option_c,
          option_d,
          question_order
        )
      `)
      .eq("id", quizId)
      .eq("is_active", true)
      .single()

    if (error || !data) {
      console.error("Quiz loading error:", error)
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 })
    }

    // Sort questions by order (Supabase nested order can sometimes be tricky)
    if (data.questions) {
      data.questions.sort((a: any, b: any) => a.question_order - b.question_order)
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching quiz:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
