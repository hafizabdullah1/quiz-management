"use client"

import { useState } from "react"
import { QuestionBankItem, deleteBankQuestion, saveToBank } from "@/app/dashboard/question-bank/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Search, Trash2, Edit2, Upload, FileUp } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { QuestionBankFormModal } from "./question-bank-form-modal"
import { CsvImportModal } from "./csv-import-modal"

interface QuestionBankListProps {
  initialQuestions: QuestionBankItem[]
}

export function QuestionBankList({ initialQuestions }: QuestionBankListProps) {
  const [questions, setQuestions] = useState<QuestionBankItem[]>(initialQuestions)
  const [search, setSearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [difficultyFilter, setDifficultyFilter] = useState("all")
  
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [isCsvModalOpen, setIsCsvModalOpen] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState<QuestionBankItem | null>(null)

  // Extract unique categories for filter
  const categories = Array.from(new Set(questions.map(q => q.category).filter(Boolean))) as string[]

  const filteredQuestions = questions.filter((q) => {
    const matchesSearch = q.question_text.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = categoryFilter === "all" || q.category === categoryFilter
    const matchesDifficulty = difficultyFilter === "all" || q.difficulty === difficultyFilter
    return matchesSearch && matchesCategory && matchesDifficulty
  })

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this question?")) {
      try {
        await deleteBankQuestion(id)
        setQuestions(questions.filter(q => q.id !== id))
      } catch (error) {
        alert("Failed to delete question")
      }
    }
  }

  const handleEdit = (question: QuestionBankItem) => {
    setEditingQuestion(question)
    setIsFormModalOpen(true)
  }

  const handleSaveSuccess = (savedQuestion: QuestionBankItem) => {
    if (editingQuestion) {
      setQuestions(questions.map(q => q.id === savedQuestion.id ? savedQuestion : q))
    } else {
      setQuestions([savedQuestion, ...questions])
    }
    setIsFormModalOpen(false)
    setEditingQuestion(null)
  }

  const handleCsvImportSuccess = (importedQuestions: QuestionBankItem[]) => {
    setQuestions([...importedQuestions, ...questions])
    setIsCsvModalOpen(false)
  }

  return (
    <div className="space-y-6">
      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="flex-1 w-full sm:w-auto flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input 
              placeholder="Search questions..." 
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full sm:w-[150px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(c => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
            <SelectTrigger className="w-full sm:w-[150px]">
              <SelectValue placeholder="Difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Difficulties</SelectItem>
              <SelectItem value="Easy">Easy</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Hard">Hard</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" onClick={() => setIsCsvModalOpen(true)}>
            <FileUp className="w-4 h-4 mr-2" />
            Import CSV
          </Button>
          <Button onClick={() => { setEditingQuestion(null); setIsFormModalOpen(true) }} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Question
          </Button>
        </div>
      </div>

      {/* List */}
      <div className="grid gap-4">
        {filteredQuestions.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-100 shadow-sm">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No questions found</h3>
            <p className="text-gray-500 mt-1">Try adjusting your filters or add a new question.</p>
          </div>
        ) : (
          filteredQuestions.map((question) => (
            <Card key={question.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <div className="flex gap-2 mb-2">
                      {question.category && (
                        <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-100">
                          {question.category}
                        </Badge>
                      )}
                      <Badge variant="outline" className={
                        question.difficulty === 'Easy' ? 'border-green-200 text-green-700' :
                        question.difficulty === 'Medium' ? 'border-yellow-200 text-yellow-700' :
                        'border-red-200 text-red-700'
                      }>
                        {question.difficulty}
                      </Badge>
                    </div>
                    <p className="font-medium text-gray-900 text-lg mb-4">{question.question_text}</p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                      <div className={`p-2 rounded border ${question.correct_answer === 'A' ? 'bg-green-50 border-green-200 font-medium' : 'bg-gray-50 border-gray-100'}`}>
                        A. {question.option_a}
                      </div>
                      <div className={`p-2 rounded border ${question.correct_answer === 'B' ? 'bg-green-50 border-green-200 font-medium' : 'bg-gray-50 border-gray-100'}`}>
                        B. {question.option_b}
                      </div>
                      <div className={`p-2 rounded border ${question.correct_answer === 'C' ? 'bg-green-50 border-green-200 font-medium' : 'bg-gray-50 border-gray-100'}`}>
                        C. {question.option_c}
                      </div>
                      <div className={`p-2 rounded border ${question.correct_answer === 'D' ? 'bg-green-50 border-green-200 font-medium' : 'bg-gray-50 border-gray-100'}`}>
                        D. {question.option_d}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(question)} className="text-gray-500 hover:text-blue-600">
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(question.id!)} className="text-gray-500 hover:text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <QuestionBankFormModal 
        isOpen={isFormModalOpen}
        onClose={() => { setIsFormModalOpen(false); setEditingQuestion(null); }}
        editingQuestion={editingQuestion}
        onSuccess={handleSaveSuccess}
      />

      <CsvImportModal
        isOpen={isCsvModalOpen}
        onClose={() => setIsCsvModalOpen(false)}
        onSuccess={handleCsvImportSuccess}
      />
    </div>
  )
}
