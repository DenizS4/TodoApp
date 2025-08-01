"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Todo } from "@/app/page"

interface CalendarProps {
  year: number
  onDateClick: (date: string) => void
  getTodosForDate: (date: string) => Todo[]
}

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

export function Calendar({ year, onDateClick, getTodosForDate }: CalendarProps) {
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

  const renderMonth = (monthIndex: number) => {
    const daysInMonth = getDaysInMonth(monthIndex, year)
    const firstDay = getFirstDayOfMonth(monthIndex, year)
    const days = []

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-8" />)
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = formatDate(year, monthIndex, day)
      const todosForDate = getTodosForDate(date)
      const completedTodos = todosForDate.filter((todo) => todo.completed).length
      const totalTodos = todosForDate.length

      days.push(
        <Button
          key={day}
          variant="ghost"
          size="sm"
          className={`h-8 w-8 p-0 relative hover:bg-white/20 text-white ${
            isToday(year, monthIndex, day) ? "bg-white/30 font-bold" : ""
          }`}
          onClick={() => onDateClick(date)}
        >
          <span className="text-xs">{day}</span>
          {totalTodos > 0 && (
            <Badge
              variant="secondary"
              className={`absolute -top-1 -right-1 h-4 w-4 p-0 text-xs flex items-center justify-center ${
                completedTodos === totalTodos ? "bg-green-500" : "bg-blue-500"
              } text-white`}
            >
              {totalTodos}
            </Badge>
          )}
        </Button>,
      )
    }

    return (
      <Card key={monthIndex} className="p-4 bg-white/10 backdrop-blur-sm border-white/20">
        <h3 className="text-lg font-semibold text-white mb-3 text-center">{MONTHS[monthIndex]}</h3>
        <div className="grid grid-cols-7 gap-1 mb-2">
          {DAYS.map((day) => (
            <div key={day} className="text-xs font-medium text-white/70 text-center p-1">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">{days}</div>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {Array.from({ length: 12 }, (_, i) => renderMonth(i))}
    </div>
  )
}
