import { createClient } from "@/lib/supabase/server-new"
import { redirect } from "next/navigation"

export default async function TestPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-2xl font-bold">Test Page</h1>
      <p>User: {user.email}</p>
    </div>
  )
}
