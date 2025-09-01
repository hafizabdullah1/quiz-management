import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { TeacherNav } from "@/components/teacher-nav"
import { StudentResultDetails } from "@/components/student-result-details"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { DownloadButton } from "@/components/download-button"

export default async function StudentResultDetailPage({ params }: { params: { id: string; attemptId: string } }) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
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
      question: questions.find(q => q.id === answer.question_id)
    }))
    
    // Calculate correct score from individual answers
    const correctAnswers = studentAnswers.filter(answer => answer.is_correct).length
    attempt.score = correctAnswers
  }

  console.log("Attempt data:", attempt)
  console.log("Attempt error:", attemptError)
  console.log("Student answers raw:", studentAnswers)
  console.log("Student answers error:", answersError)
  console.log("Questions raw:", questions)
  console.log("Questions error:", questionsError)
  console.log("Combined student answers:", attempt?.student_answers)
  console.log("First answer question:", attempt?.student_answers?.[0]?.question)

  if (!attempt || attempt.quizzes.teacher_id !== user.id) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <TeacherNav user={user} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button variant="outline" asChild>
              <Link href={`/dashboard/quiz/${params.id}/results`}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Results
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Student Result Details</h1>
              <p className="text-gray-600 mt-1">{attempt.quizzes.title}</p>
            </div>
          </div>
          <DownloadButton 
            quizId={params.id} 
            attemptId={params.attemptId} 
          />
        </div>

        {/* Student Result Details */}
        <StudentResultDetails 
          attempt={attempt} 
          answers={attempt.student_answers || []} 
        />
        
        {/* Debug info */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-8 p-4 bg-gray-100 rounded-lg">
            <h3 className="font-bold mb-2">Debug Info:</h3>
            <p>Student Answers Count: {attempt.student_answers?.length || 0}</p>
            <p>First Answer Question: {attempt.student_answers?.[0]?.question ? "Present" : "Missing"}</p>
            <p>First Answer Question Text: {attempt.student_answers?.[0]?.question?.question_text || "Not available"}</p>
            <p>First Answer Option A: {attempt.student_answers?.[0]?.question?.option_a || "Not available"}</p>
            <p>First Answer Option B: {attempt.student_answers?.[0]?.question?.option_b || "Not available"}</p>
            <p>First Answer Option C: {attempt.student_answers?.[0]?.question?.option_c || "Not available"}</p>
            <p>First Answer Option D: {attempt.student_answers?.[0]?.question?.option_d || "Not available"}</p>
            <p>First Answer Correct Option: {attempt.student_answers?.[0]?.question?.correct_answer || "Not available"}</p>
            <details>
              <summary className="cursor-pointer font-bold">Full Student Answers Data</summary>
              <pre className="text-xs overflow-auto mt-2">
                {JSON.stringify(attempt.student_answers, null, 2)}
              </pre>
            </details>
          </div>
        )}
      </div>
    </div>
  )
}
