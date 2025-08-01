"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { X, Plus, Trash2, Clock } from "lucide-react"
import type { Todo } from "@/app/page"

interface TodoPanelProps {
  date: string
  time: string
  todos: Todo[]
  onAddTodo: (text: string) => void
  onToggleTodo: (id: string) => void
  onDeleteTodo: (id: string) => void
  onClose: () => void
}

export function TodoPanel({ date, time, todos, onAddTodo, onToggleTodo, onDeleteTodo, onClose }: TodoPanelProps) {
  const [newTodoText, setNewTodoText] = useState("")

  const handleAddTodo = () => {
    if (newTodoText.trim()) {
      onAddTodo(newTodoText.trim())
      setNewTodoText("")
    }
  }

  const formatDateTime = (dateString: string, timeString: string) => {
    const date = new Date(dateString)
    const dayName = date.toLocaleDateString("en-US", { weekday: "long" })
    const monthDay = date.toLocaleDateString("en-US", { month: "long", day: "numeric" })
    const year = date.getFullYear()

    // Convert 24-hour to 12-hour format
    const [hours, minutes] = timeString.split(":")
    const hour12 = Number.parseInt(hours) % 12 || 12
    const ampm = Number.parseInt(hours) >= 12 ? "PM" : "AM"
    const time12 = `${hour12}:${minutes} ${ampm}`

    return {
      dayName,
      date: `${monthDay}, ${year}`,
      time: time12,
    }
  }

  const { dayName, date: formattedDate, time: formattedTime } = formatDateTime(date, time)

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md bg-white/95 backdrop-blur-sm border-white/20">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">{dayName}</h2>
              <p className="text-sm text-gray-600">{formattedDate}</p>
              <div className="flex items-center gap-1 text-blue-600 mt-1">
                <Clock className="w-4 h-4" />
                <span className="text-sm font-medium">{formattedTime}</span>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-4">
            {/* Add new todo */}
            <div className="flex gap-2">
              <Input
                placeholder="Add a task for this time slot..."
                value={newTodoText}
                onChange={(e) => setNewTodoText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddTodo()}
                className="flex-1"
              />
              <Button onClick={handleAddTodo} size="sm">
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            {/* Todo list */}
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {todos.length === 0 ? (
                <div className="text-center py-8">
                  <Clock className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500">No tasks scheduled for this time</p>
                </div>
              ) : (
                todos.map((todo) => (
                  <div key={todo.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 group">
                    <Checkbox checked={todo.completed} onCheckedChange={() => onToggleTodo(todo.id)} />
                    <span className={`flex-1 ${todo.completed ? "line-through text-gray-500" : "text-gray-800"}`}>
                      {todo.text}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeleteTodo(todo.id)}
                      className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))
              )}
            </div>

            {/* Stats */}
            {todos.length > 0 && (
              <div className="text-sm text-gray-600 text-center pt-4 border-t">
                {todos.filter((t) => t.completed).length} of {todos.length} tasks completed
                {todos.filter((t) => t.completed).length === todos.length && todos.length > 0 && (
                  <span className="text-green-600 ml-2">🎉 Time slot complete!</span>
                )}
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}
