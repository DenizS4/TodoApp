"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Todo } from "@/app/page"

interface MonthlyCalendarProps {
  month: number
  year: number
  onDateClick: (date: string) => void
  getTodosForDate: (date: string) => Todo[]
}

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

export function MonthlyCalendar({ month, year, onDateClick, getTodosForDate }: MonthlyCalendarProps) {
  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay()
  }

  const formatDate = (year: number, month: number, day: number) => {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
  }

  const isToday = (year: number, month: number, day: number) => {
    const today = new Date()
    return today.getFullYear() === year && today.getMonth() === month && today.getDate() === day
  }

  const daysInMonth = getDaysInMonth(month, year)
  const firstDay = getFirstDayOfMonth(month, year)
  const days = []

  // Empty cells for days before the first day of the month
  for (let i = 0; i < firstDay; i++) {
    days.push(<div key={`empty-${i}`} className="h-24 bg-white/5 rounded-lg border border-white/10" />)
  }

  // Days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const date = formatDate(year, month, day)
    const todosForDate = getTodosForDate(date)
    const completedTodos = todosForDate.filter((todo) => todo.completed).length
    const totalTodos = todosForDate.length

    days.push(
      <Button
        key={day}
        variant="ghost"
        className={`h-24 p-2 flex flex-col items-start justify-start hover:bg-white/20 text-white border border-white/10 rounded-lg relative ${
          isToday(year, month, day) ? "bg-white/20 ring-2 ring-white/50" : "bg-white/10"
        }`}
        onClick={() => onDateClick(date)}
      >
        <div className="flex items-center justify-between w-full">
          <span className={`text-lg font-semibold ${isToday(year, month, day) ? "text-yellow-300" : ""}`}>{day}</span>
          {totalTodos > 0 && (
            <Badge
              variant="secondary"
              className={`h-5 w-5 p-0 text-xs flex items-center justify-center ${
                completedTodos === totalTodos ? "bg-green-500" : "bg-blue-500"
              } text-white`}
            >
              {totalTodos}
            </Badge>
          )}
        </div>

        {/* Show first few todos */}
        <div className="w-full mt-1 space-y-1">
          {todosForDate.slice(0, 2).map((todo) => (
            <div
              key={todo.id}
              className={`text-xs truncate w-full text-left ${
                todo.completed ? "line-through text-white/60" : "text-white/90"
              }`}
            >
              • {todo.text}
            </div>
          ))}
          {totalTodos > 2 && <div className="text-xs text-white/60">+{totalTodos - 2} more</div>}
        </div>
      </Button>,
    )
  }

  return (
    <Card className="p-6 bg-white/10 backdrop-blur-sm border-white/20">
      {/* Day headers */}
      <div className="grid grid-cols-7 gap-2 mb-4">
        {DAYS.map((day) => (
          <div key={day} className="text-center font-semibold text-white/90 py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-2">{days}</div>
    </Card>
  )
}
