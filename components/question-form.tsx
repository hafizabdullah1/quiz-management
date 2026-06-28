"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trash2, Save, Loader2, Check } from "lucide-react"
import { useState } from "react"
import { saveToBank } from "@/app/dashboard/question-bank/actions"

interface Question {
  id: string
  question: string
  option_a: string
  option_b: string
  option_c: string
  option_d: string
  correct_answer: "A" | "B" | "C" | "D"
}

interface QuestionFormProps {
  question: Question
  index: number
  onUpdate: (id: string, field: keyof Question, value: string) => void
  onDelete: (id: string) => void
  canDelete: boolean
}

export function QuestionForm({ question, index, onUpdate, onDelete, canDelete }: QuestionFormProps) {
  const [savingToBank, setSavingToBank] = useState(false)
  const [savedToBank, setSavedToBank] = useState(false)

  const handleSaveToBank = async () => {
    if (!question.question || !question.option_a || !question.option_b || !question.option_c || !question.option_d) {
      alert("Please fill all fields before saving to bank.")
      return
    }

    setSavingToBank(true)
    try {
      await saveToBank({
        question_text: question.question,
        option_a: question.option_a,
        option_b: question.option_b,
        option_c: question.option_c,
        option_d: question.option_d,
        correct_answer: question.correct_answer,
        category: null,
        difficulty: "Medium"
      })
      setSavedToBank(true)
      setTimeout(() => setSavedToBank(false), 3000)
    } catch (error) {
      alert("Failed to save to bank")
    } finally {
      setSavingToBank(false)
    }
  }

  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg">Question {index + 1}</CardTitle>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSaveToBank}
            disabled={savingToBank || savedToBank}
            className={savedToBank ? "text-green-600 border-green-200 bg-green-50" : "text-primary border-primary/20 hover:bg-primary/5"}
            title="Save to Question Bank"
          >
            {savingToBank ? <Loader2 className="w-4 h-4 animate-spin" /> : savedToBank ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          </Button>
          {canDelete && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(question.id)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
              title="Delete Question"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor={`question-${question.id}`}>Question Text</Label>
          <Textarea
            id={`question-${question.id}`}
            value={question.question}
            onChange={(e) => onUpdate(question.id, "question", e.target.value)}
            placeholder="Enter your question here..."
            className="mt-1"
            rows={3}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor={`option-a-${question.id}`}>Option A</Label>
            <Input
              id={`option-a-${question.id}`}
              value={question.option_a}
              onChange={(e) => onUpdate(question.id, "option_a", e.target.value)}
              placeholder="Option A"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor={`option-b-${question.id}`}>Option B</Label>
            <Input
              id={`option-b-${question.id}`}
              value={question.option_b}
              onChange={(e) => onUpdate(question.id, "option_b", e.target.value)}
              placeholder="Option B"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor={`option-c-${question.id}`}>Option C</Label>
            <Input
              id={`option-c-${question.id}`}
              value={question.option_c}
              onChange={(e) => onUpdate(question.id, "option_c", e.target.value)}
              placeholder="Option C"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor={`option-d-${question.id}`}>Option D</Label>
            <Input
              id={`option-d-${question.id}`}
              value={question.option_d}
              onChange={(e) => onUpdate(question.id, "option_d", e.target.value)}
              placeholder="Option D"
              className="mt-1"
            />
          </div>
        </div>

        <div>
          <Label>Correct Answer</Label>
          <RadioGroup
            value={question.correct_answer}
            onValueChange={(value) => onUpdate(question.id, "correct_answer", value)}
            className="flex flex-row space-x-6 mt-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="A" id={`correct-a-${question.id}`} />
              <Label htmlFor={`correct-a-${question.id}`}>A</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="B" id={`correct-b-${question.id}`} />
              <Label htmlFor={`correct-b-${question.id}`}>B</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="C" id={`correct-c-${question.id}`} />
              <Label htmlFor={`correct-c-${question.id}`}>C</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="D" id={`correct-d-${question.id}`} />
              <Label htmlFor={`correct-d-${question.id}`}>D</Label>
            </div>
          </RadioGroup>
        </div>
      </CardContent>
    </Card>
  )
}
