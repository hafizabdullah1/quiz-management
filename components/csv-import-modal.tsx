"use client"

import { useState, useRef } from "react"
import { QuestionBankItem, saveToBank } from "@/app/dashboard/question-bank/actions"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Loader2, UploadCloud, FileText, CheckCircle, AlertCircle } from "lucide-react"

interface CsvImportModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (importedQuestions: QuestionBankItem[]) => void
}

export function CsvImportModal({ isOpen, onClose, onSuccess }: CsvImportModalProps) {
  const [loading, setLoading] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState<string>("")
  const [successCount, setSuccessCount] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError("")
    setSuccessCount(0)
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      if (selectedFile.type !== "text/csv" && !selectedFile.name.endsWith(".csv")) {
        setError("Please upload a valid CSV file.")
        setFile(null)
        return
      }
      setFile(selectedFile)
    }
  }

  const handleImport = async () => {
    if (!file) return
    setLoading(true)
    setError("")

    try {
      const text = await file.text()
      // Basic CSV parsing (assuming comma-separated and handling basic quotes)
      const rows = text.split("\n").filter(row => row.trim().length > 0)
      
      if (rows.length <= 1) {
        throw new Error("CSV file seems empty or only contains headers.")
      }

      // Headers should be: question_text,option_a,option_b,option_c,option_d,correct_answer,category,difficulty
      const imported: QuestionBankItem[] = []
      let errors = 0

      // Skip header row
      for (let i = 1; i < rows.length; i++) {
        // Handle basic CSV splitting (this is simplified, a real CSV parser like papaparse is better for production)
        const columns = rows[i].split(",").map(c => c.trim().replace(/^"|"$/g, ""))
        
        if (columns.length < 6) {
          errors++
          continue
        }

        const [question_text, option_a, option_b, option_c, option_d, correct_answer, category, difficulty] = columns

        const isValidAnswer = ['A', 'B', 'C', 'D'].includes(correct_answer?.toUpperCase())

        if (!question_text || !option_a || !option_b || !option_c || !option_d || !isValidAnswer) {
          errors++
          continue
        }

        try {
          const payload: Omit<QuestionBankItem, "id"> = {
            question_text,
            option_a,
            option_b,
            option_c,
            option_d,
            correct_answer: correct_answer.toUpperCase() as any,
            category: category || null,
            difficulty: (['Easy', 'Medium', 'Hard'].includes(difficulty) ? difficulty : "Medium") as any
          }
          
          const saved = await saveToBank(payload)
          imported.push(saved)
        } catch (e) {
          errors++
        }
      }

      setSuccessCount(imported.length)
      if (errors > 0) {
        setError(`Imported ${imported.length} questions, but failed to import ${errors} rows due to formatting errors.`)
      }

      if (imported.length > 0) {
        setTimeout(() => {
          onSuccess(imported)
          setFile(null)
          setSuccessCount(0)
        }, 2000)
      }

    } catch (err: any) {
      setError(err.message || "Failed to process the CSV file.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && !loading && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Import Questions from CSV</DialogTitle>
          <DialogDescription>
            Upload a CSV file to bulk import questions into your Question Bank.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="bg-primary/5 text-primary text-sm p-3 rounded-md mb-4 border border-purple-100">
            <strong>Required CSV Columns:</strong>
            <ul className="list-disc ml-5 mt-1 opacity-90 text-xs">
              <li>question_text</li>
              <li>option_a</li>
              <li>option_b</li>
              <li>option_c</li>
              <li>option_d</li>
              <li>correct_answer (A, B, C, or D)</li>
              <li>category (Optional)</li>
              <li>difficulty (Easy, Medium, or Hard)</li>
            </ul>
          </div>

          <div 
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${file ? 'border-primary/40 bg-primary/5' : 'border-gray-200 hover:border-primary/40 hover:bg-gray-50'}`}
          >
            <input 
              type="file" 
              accept=".csv" 
              className="hidden" 
              ref={fileInputRef}
              onChange={handleFileChange}
            />
            
            {!file ? (
              <div className="flex flex-col items-center cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-3">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <p className="text-sm font-medium text-gray-900">Click to upload CSV file</p>
                <p className="text-xs text-gray-500 mt-1">.csv files only</p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-3">
                  <FileText className="w-6 h-6" />
                </div>
                <p className="text-sm font-medium text-gray-900">{file.name}</p>
                <p className="text-xs text-gray-500 mt-1">{(file.size / 1024).toFixed(1)} KB</p>
                <Button variant="link" size="sm" className="mt-2 text-red-600" onClick={() => setFile(null)} disabled={loading}>
                  Remove file
                </Button>
              </div>
            )}
          </div>

          {error && (
            <div className="flex items-start gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-md">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {successCount > 0 && !error && (
            <div className="flex items-center justify-center gap-2 text-green-600 text-sm bg-green-50 p-3 rounded-md">
              <CheckCircle className="w-4 h-4" />
              <p>Successfully imported {successCount} questions!</p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button 
            onClick={handleImport} 
            className="bg-primary hover:bg-primary-hover" 
            disabled={!file || loading || successCount > 0}
          >
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Import Questions
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
