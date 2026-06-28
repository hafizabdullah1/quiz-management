"use client"

import { useState, useEffect } from "react"
import { QuestionBankItem, getBankQuestions } from "@/app/dashboard/question-bank/actions"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Search, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

interface QuestionBankModalProps {
  isOpen: boolean
  onClose: () => void
  onImport: (questions: QuestionBankItem[]) => void
}

export function QuestionBankModal({ isOpen, onClose, onImport }: QuestionBankModalProps) {
  const [loading, setLoading] = useState(true)
  const [bankQuestions, setBankQuestions] = useState<QuestionBankItem[]>([])
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  
  const [search, setSearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [difficultyFilter, setDifficultyFilter] = useState("all")

  useEffect(() => {
    if (isOpen) {
      loadBankQuestions()
      setSelectedIds(new Set())
    }
  }, [isOpen])

  const loadBankQuestions = async () => {
    setLoading(true)
    try {
      const data = await getBankQuestions()
      setBankQuestions(data)
    } catch (error) {
      console.error("Failed to load question bank:", error)
    } finally {
      setLoading(false)
    }
  }

  const toggleSelection = (id: string) => {
    const newSelection = new Set(selectedIds)
    if (newSelection.has(id)) {
      newSelection.delete(id)
    } else {
      newSelection.add(id)
    }
    setSelectedIds(newSelection)
  }

  const handleImport = () => {
    const questionsToImport = bankQuestions.filter(q => selectedIds.has(q.id!))
    onImport(questionsToImport)
    onClose()
  }

  const categories = Array.from(new Set(bankQuestions.map(q => q.category).filter(Boolean))) as string[]

  const filteredQuestions = bankQuestions.filter((q) => {
    const matchesSearch = q.question_text.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = categoryFilter === "all" || q.category === categoryFilter
    const matchesDifficulty = difficultyFilter === "all" || q.difficulty === difficultyFilter
    return matchesSearch && matchesCategory && matchesDifficulty
  })

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Import from Question Bank</DialogTitle>
          <DialogDescription>
            Select questions from your bank to add them directly to this quiz.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col gap-4 py-4 overflow-hidden">
          <div className="flex gap-2 shrink-0">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input 
                placeholder="Search questions..." 
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[140px]">
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
              <SelectTrigger className="w-[140px]">
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

          <div className="flex-1 overflow-y-auto border rounded-md">
            {loading ? (
              <div className="flex justify-center items-center h-32">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : filteredQuestions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No questions found in the bank.
              </div>
            ) : (
              <div className="divide-y">
                {filteredQuestions.map((q) => (
                  <div 
                    key={q.id} 
                    className={`flex items-start p-4 hover:bg-gray-50 transition-colors cursor-pointer ${selectedIds.has(q.id!) ? 'bg-primary/5/50' : ''}`}
                    onClick={() => toggleSelection(q.id!)}
                  >
                    <Checkbox 
                      checked={selectedIds.has(q.id!)} 
                      onCheckedChange={() => toggleSelection(q.id!)}
                      className="mt-1"
                    />
                    <div className="ml-3 flex-1">
                      <div className="flex gap-2 mb-1">
                        {q.category && <Badge variant="secondary" className="text-xs">{q.category}</Badge>}
                        <Badge variant="outline" className="text-xs">{q.difficulty}</Badge>
                      </div>
                      <p className="font-medium text-sm text-gray-900 line-clamp-2">{q.question_text}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="shrink-0 pt-2 border-t">
          <div className="flex-1 flex items-center text-sm text-gray-500">
            {selectedIds.size} question{selectedIds.size !== 1 ? 's' : ''} selected
          </div>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleImport} disabled={selectedIds.size === 0} className="bg-primary hover:bg-primary-hover">
            Import Selected
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
