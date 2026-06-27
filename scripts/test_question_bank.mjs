import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase URL or Service Role Key")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function runTests() {
  console.log("Starting Question Bank Tests...\n")
  let teacherId = null

  try {
    // 1. Get a random teacher to act as our user
    const { data: teachers, error: tError } = await supabase.from('teachers').select('id').limit(1)
    if (tError || !teachers || teachers.length === 0) {
      throw new Error("No teachers found in DB. Cannot test RLS/Foreign Key constraints properly.")
    }
    teacherId = teachers[0].id
    console.log(`✅ Fetched teacher for test: ${teacherId}`)

    // 2. Insert a question
    const newQuestion = {
      teacher_id: teacherId,
      question_text: "What is 2 + 2?",
      option_a: "3",
      option_b: "4",
      option_c: "5",
      option_d: "6",
      correct_answer: "B",
      category: "Math Test",
      difficulty: "Easy"
    }
    
    const { data: insertedQuestion, error: insertError } = await supabase
      .from('question_bank')
      .insert(newQuestion)
      .select()
      .single()
      
    if (insertError) throw new Error("Insert failed: " + insertError.message)
    console.log(`✅ Successfully inserted question: ID ${insertedQuestion.id}`)

    // 3. Read the question
    const { data: readQuestions, error: readError } = await supabase
      .from('question_bank')
      .select('*')
      .eq('teacher_id', teacherId)
      .eq('category', 'Math Test')
      
    if (readError) throw new Error("Read failed: " + readError.message)
    if (readQuestions.length === 0) throw new Error("Read failed: Question not found")
    console.log(`✅ Successfully read question. Found ${readQuestions.length} matches.`)

    // 4. Update the question
    const { data: updatedQuestion, error: updateError } = await supabase
      .from('question_bank')
      .update({ difficulty: 'Hard' })
      .eq('id', insertedQuestion.id)
      .select()
      .single()

    if (updateError) throw new Error("Update failed: " + updateError.message)
    if (updatedQuestion.difficulty !== 'Hard') throw new Error("Update failed to change difficulty")
    console.log(`✅ Successfully updated question. Difficulty is now ${updatedQuestion.difficulty}`)

    // 5. Delete the question
    const { error: deleteError } = await supabase
      .from('question_bank')
      .delete()
      .eq('id', insertedQuestion.id)

    if (deleteError) throw new Error("Delete failed: " + deleteError.message)

    // Verify deletion
    const { data: checkDeleted } = await supabase.from('question_bank').select('*').eq('id', insertedQuestion.id)
    if (checkDeleted && checkDeleted.length > 0) throw new Error("Delete failed: Record still exists")
    
    console.log(`✅ Successfully deleted question.`)
    console.log("\n🎉 ALL TESTS PASSED SUCCESSFULLY!")

  } catch (error) {
    console.error("\n❌ TEST FAILED:", error.message)
  }
}

runTests()
