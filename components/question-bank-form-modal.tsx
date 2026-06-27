"use client"

import { useState, useEffect } from "react"
import { QuestionBankItem, saveToBank, updateBankQuestion } from "@/app/dashboard/question-bank/actions"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"

interface QuestionBankFormModalProps {
  isOpen: boolean
  onClose: () => void
  editingQuestion: QuestionBankItem | null
  onSuccess: (question: QuestionBankItem) => void
}

export function QuestionBankFormModal({ isOpen, onClose, editingQuestion, onSuccess }: QuestionBankFormModalProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<Partial<QuestionBankItem>>({
    question_text: "",
    option_a: "",
    option_b: "",
    option_c: "",
    option_d: "",
    correct_answer: "A",
    category: "",
    difficulty: "Medium"
  })

  useEffect(() => {
    if (editingQuestion) {
      setFormData(editingQuestion)
    } else {
      setFormData({
        question_text: "",
        option_a: "",
        option_b: "",
        option_c: "",
        option_d: "",
        correct_answer: "A",
        category: "",
        difficulty: "Medium"
      })
    }
  }, [editingQuestion, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const payload: Omit<QuestionBankItem, "id"> = {
        question_text: formData.question_text!,
        option_a: formData.option_a!,
        option_b: formData.option_b!,
        option_c: formData.option_c!,
        option_d: formData.option_d!,
        correct_answer: formData.correct_answer as any,
        category: formData.category || null,
        difficulty: formData.difficulty as any || "Medium"
      }

      let saved: QuestionBankItem
      if (editingQuestion?.id) {
        saved = await updateBankQuestion(editingQuestion.id, payload)
      } else {
        saved = await saveToBank(payload)
      }
      
      onSuccess(saved)
    } catch (error) {
      alert("Failed to save question.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editingQuestion ? "Edit Question" : "Add New Question"}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-4">
            <div>
              <Label>Question Text *</Label>
              <Textarea
                required
                value={formData.question_text || ""}
                onChange={(e) => setFormData({ ...formData, question_text: e.target.value })}
                placeholder="Enter your question here..."
                className="mt-1"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Option A *</Label>
                <Input required value={formData.option_a || ""} onChange={(e) => setFormData({ ...formData, option_a: e.target.value })} className="mt-1" />
              </div>
              <div>
                <Label>Option B *</Label>
                <Input required value={formData.option_b || ""} onChange={(e) => setFormData({ ...formData, option_b: e.target.value })} className="mt-1" />
              </div>
              <div>
                <Label>Option C *</Label>
                <Input required value={formData.option_c || ""} onChange={(e) => setFormData({ ...formData, option_c: e.target.value })} className="mt-1" />
              </div>
              <div>
                <Label>Option D *</Label>
                <Input required value={formData.option_d || ""} onChange={(e) => setFormData({ ...formData, option_d: e.target.value })} className="mt-1" />
              </div>
            </div>

            <div>
              <Label>Correct Answer *</Label>
              <RadioGroup
                value={formData.correct_answer}
                onValueChange={(val) => setFormData({ ...formData, correct_answer: val as any })}
                className="flex flex-row space-x-6 mt-2"
              >
                {['A', 'B', 'C', 'D'].map((opt) => (
                  <div key={opt} className="flex items-center space-x-2">
                    <RadioGroupItem value={opt} id={`correct-${opt}`} />
                    <Label htmlFor={`correct-${opt}`}>{opt}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
              <div>
                <Label>Category (Optional)</Label>
                <Input 
                  placeholder="e.g. Science, Math" 
                  value={formData.category || ""} 
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })} 
                  className="mt-1" 
                />
              </div>
              <div>
                <Label>Difficulty</Label>
                <Select value={formData.difficulty || "Medium"} onValueChange={(val) => setFormData({ ...formData, difficulty: val as any })}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Easy">Easy</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={loading}>
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {editingQuestion ? "Update Question" : "Save Question"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
