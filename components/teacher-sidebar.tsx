"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Plus,
  BookOpen,
  Users,
  BarChart3,
  Settings,
  Menu,
  X,
  FileText,
  ClipboardList,
  TrendingUp,
  UserCheck
} from "lucide-react"

interface TeacherSidebarProps {
  user: {
    email?: string
    user_metadata?: {
      full_name?: string
    }
  }
}

export function TeacherSidebar({ user }: TeacherSidebarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const fullName = user.user_metadata?.full_name || user.email?.split("@")[0] || "Teacher"

  const navigation = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      current: pathname === "/dashboard"
    },
    {
      name: "Create Quiz",
      href: "/dashboard/create-quiz",
      icon: Plus,
      current: pathname === "/dashboard/create-quiz"
    },
    {
      name: "All Quizzes",
      href: "/dashboard/quizzes",
      icon: BookOpen,
      current: pathname.startsWith("/dashboard/quiz") && pathname !== "/dashboard/create-quiz"
    }
  ]

  const comingSoon = [
    {
      name: "Question Bank",
      icon: FileText,
      disabled: true
    },
    {
      name: "Student Management",
      icon: Users,
      disabled: true
    },
    {
      name: "Analytics",
      icon: BarChart3,
      disabled: true
    },
    {
      name: "Reports",
      icon: ClipboardList,
      disabled: true
    }
  ]

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          className="bg-white shadow-lg"
        >
          {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center px-6 py-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Quiz Manager
                </h1>
                <p className="text-xs text-gray-500">Teacher Dashboard</p>
              </div>
            </div>
          </div>

          {/* User Info */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {fullName.split(" ").map(n => n[0]).join("").toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{fullName}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-2">
            <div className="space-y-1">
              <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Main
              </p>
              {navigation.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                      item.current
                        ? "bg-blue-50 text-blue-700 border border-blue-200"
                        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    <Icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </Link>
                )
              })}
            </div>

            <div className="space-y-1 pt-4">
              <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Coming Soon
              </p>
              {comingSoon.map((item) => {
                const Icon = item.icon
                return (
                  <div
                    key={item.name}
                    className="flex items-center px-3 py-2 text-sm font-medium rounded-lg text-gray-400 cursor-not-allowed"
                  >
                    <Icon className="mr-3 h-5 w-5" />
                    {item.name}
                    <span className="ml-auto text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full">
                      Soon
                    </span>
                  </div>
                )
              })}
            </div>
          </nav>

          {/* Footer */}
          <div className="px-4 py-4 border-t border-gray-200">
            <div className="flex items-center space-x-3 text-sm text-gray-500">
              <TrendingUp className="h-4 w-4" />
              <span>Version 1.0 MVP</span>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}
