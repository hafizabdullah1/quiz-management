"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export interface QuestionBankItem {
  id?: string
  question_text: string
  option_a: string
  option_b: string
  option_c: string
  option_d: string
  correct_answer: "A" | "B" | "C" | "D"
  category: string | null
  difficulty: "Easy" | "Medium" | "Hard"
}

export async function getBankQuestions() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Unauthorized")
  }

  const { data, error } = await supabase
    .from("question_bank")
    .select("*")
    .eq("teacher_id", user.id)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching question bank:", error)
    throw new Error("Failed to fetch questions")
  }

  return data
}

export async function saveToBank(question: Omit<QuestionBankItem, "id">) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Unauthorized")
  }

  const { data, error } = await supabase
    .from("question_bank")
    .insert({
      teacher_id: user.id,
      question_text: question.question_text,
      option_a: question.option_a,
      option_b: question.option_b,
      option_c: question.option_c,
      option_d: question.option_d,
      correct_answer: question.correct_answer,
      category: question.category || null,
      difficulty: question.difficulty || "Medium"
    })
    .select()
    .single()

  if (error) {
    console.error("Error saving to question bank:", error)
    throw new Error("Failed to save question")
  }

  revalidatePath("/dashboard/question-bank")
  return data
}

export async function updateBankQuestion(id: string, updates: Partial<QuestionBankItem>) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Unauthorized")
  }

  const { data, error } = await supabase
    .from("question_bank")
    .update({
      question_text: updates.question_text,
      option_a: updates.option_a,
      option_b: updates.option_b,
      option_c: updates.option_c,
      option_d: updates.option_d,
      correct_answer: updates.correct_answer,
      category: updates.category || null,
      difficulty: updates.difficulty || "Medium"
    })
    .eq("id", id)
    .eq("teacher_id", user.id)
    .select()
    .single()

  if (error) {
    console.error("Error updating question bank:", error)
    throw new Error("Failed to update question")
  }

  revalidatePath("/dashboard/question-bank")
  return data
}

export async function deleteBankQuestion(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Unauthorized")
  }

  const { error } = await supabase
    .from("question_bank")
    .delete()
    .eq("id", id)
    .eq("teacher_id", user.id)

  if (error) {
    console.error("Error deleting from question bank:", error)
    throw new Error("Failed to delete question")
  }

  revalidatePath("/dashboard/question-bank")
  return { success: true }
}
