import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { TeacherNav } from "@/components/teacher-nav"
import { TeacherSidebar } from "@/components/teacher-sidebar"
import { QuestionBankList } from "@/components/question-bank-list"
import { getBankQuestions } from "./actions"

export default async function QuestionBankPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const initialQuestions = await getBankQuestions()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 flex">
      <TeacherSidebar user={user} />

      <main className="flex-1 min-h-screen overflow-hidden flex flex-col">
        <TeacherNav user={user} />
        
        <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  Question Bank
                </h1>
                <p className="text-gray-600 mt-1">Manage and organize your reusable questions.</p>
              </div>
            </div>

            {/* Client component to handle interactivity */}
            <QuestionBankList initialQuestions={initialQuestions} />
          </div>
        </div>
      </main>
    </div>
  )
}
