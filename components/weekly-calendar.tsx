"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Star } from "lucide-react"
import type { Activity } from "@/app/page"

interface WeeklyCalendarProps {
  weekStart: Date
  activities: Activity[]
  onActivityClick: (activity: Activity) => void
  getActivitiesForDate: (date: string) => Activity[]
}

const HOURS = [
  "06:00",
  "07:00",
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
  "21:00",
  "22:00",
  "23:00",
]

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const DAYS_FULL = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

export function WeeklyCalendar({ weekStart, activities, onActivityClick, getActivitiesForDate }: WeeklyCalendarProps) {
  const formatDate = (date: Date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  const getCurrentHour = () => {
    const now = new Date()
    return `${String(now.getHours()).padStart(2, "0")}:00`
  }

  const isCurrentHour = (date: Date, time: string) => {
    return isToday(date) && time === getCurrentHour()
  }

  const getWeekDays = () => {
    const days = []
    for (let i = 0; i < 7; i++) {
      const day = new Date(weekStart)
      day.setDate(weekStart.getDate() + i)
      days.push(day)
    }
    return days
  }

  const timeToMinutes = (time: string) => {
    const [hours, minutes] = time.split(":").map(Number)
    return hours * 60 + minutes
  }

  const getActivityPosition = (activity: Activity) => {
    const startMinutes = timeToMinutes(activity.startTime)
    const endMinutes = timeToMinutes(activity.endTime)
    const duration = endMinutes - startMinutes

    // Calculate position relative to 6 AM (360 minutes)
    const startOffset = startMinutes - 360 // 6 AM = 360 minutes

    // Use consistent hour height for both mobile and desktop
    const hourHeight = window.innerWidth < 1024 ? 48 : 64 // Mobile: 48px, Desktop: 64px

    const top = (startOffset / 60) * hourHeight
    const height = (duration / 60) * hourHeight

    return { top, height }
  }

  const weekDays = getWeekDays()

  return (
    <Card className="bg-white/10 border-white/20 overflow-hidden">
      <div className="flex">
        {/* Time column - always on left */}
        <div className="w-12 lg:w-20 bg-white/5 flex-shrink-0">
          {/* Empty header cell */}
          <div className="h-12 lg:h-16 border-b border-white/10 flex items-center justify-center">
            <span className="text-white/70 text-xs lg:text-sm font-medium">Time</span>
          </div>

          {/* Hour labels - vertical layout */}
          {HOURS.map((hour) => (
            <div key={hour} className="h-12 lg:h-16 border-b border-white/10 flex items-center justify-center">
              <span className="text-white/90 text-xs lg:text-sm font-medium">
                {/* Show shorter format on mobile */}
                <span className="lg:hidden">{hour.slice(0, 2)}</span>
                <span className="hidden lg:inline">{hour}</span>
              </span>
            </div>
          ))}
        </div>

        {/* Days columns */}
        <div className="flex-1 overflow-x-auto">
          <div className="flex min-w-full">
            {weekDays.map((day, dayIndex) => {
              const dateStr = formatDate(day)
              const dayActivities = getActivitiesForDate(dateStr)

              return (
                <div key={dayIndex} className="flex-1 min-w-[100px] lg:min-w-[140px] border-l border-white/10 relative">
                  {/* Day header */}
                  <div
                    className={`h-12 lg:h-16 border-b border-white/10 flex flex-col items-center justify-center px-1 ${
                      isToday(day) ? "bg-white/20" : ""
                    }`}
                  >
                    <span
                      className={`text-xs lg:text-sm font-medium ${isToday(day) ? "text-yellow-300" : "text-white/90"}`}
                    >
                      <span className="lg:hidden">{DAYS[day.getDay()]}</span>
                      <span className="hidden lg:inline">{DAYS_FULL[day.getDay()]}</span>
                    </span>
                    <span className={`text-sm lg:text-lg font-bold ${isToday(day) ? "text-yellow-300" : "text-white"}`}>
                      {day.getDate()}
                    </span>
                  </div>

                  {/* Time slots background */}
                  <div className="relative">
                    {HOURS.map((hour) => (
                      <div
                        key={hour}
                        className={`h-12 lg:h-16 border-b border-white/10 ${
                          isCurrentHour(day, hour) ? "bg-white/15 ring-1 ring-white/30" : ""
                        }`}
                      />
                    ))}

                    {/* Activities overlay */}
                    {dayActivities.map((activity) => {
                      const { top, height } = getActivityPosition(activity)

                      return (
                        <Button
                          key={activity.id}
                          variant="ghost"
                          className={`absolute left-0.5 right-0.5 lg:left-1 lg:right-1 p-1 lg:p-2 rounded text-left hover:opacity-80 transition-all text-xs lg:text-sm ${
                            activity.completed ? "opacity-60 ring-1 lg:ring-2 ring-green-400" : ""
                          }`}
                          style={{
                            top: `${top}px`,
                            height: `${Math.max(height, 20)}px`, // Minimum height for visibility
                            backgroundColor: activity.completed ? `${activity.color}80` : activity.color,
                            color: "white",
                          }}
                          onClick={() => onActivityClick(activity)}
                        >
                          <div className="flex flex-col h-full justify-between overflow-hidden">
                            <div className="flex items-start justify-between">
                              <span
                                className={`font-medium truncate flex-1 ${activity.completed ? "line-through" : ""}`}
                              >
                                {activity.title}
                              </span>
                              <div className="flex items-center gap-0.5 ml-1 flex-shrink-0">
                                {activity.completed && <span className="text-green-300 text-xs">✓</span>}
                                <div className="flex">
                                  {Array.from({ length: activity.importance }).map((_, i) => (
                                    <Star key={i} className="w-2 h-2 lg:w-3 lg:h-3 fill-yellow-300 text-yellow-300" />
                                  ))}
                                </div>
                              </div>
                            </div>
                            {/* Only show time if activity is tall enough */}
                            {height > 30 && (
                              <div className={`text-xs opacity-90 ${activity.completed ? "line-through" : ""}`}>
                                <span className="lg:hidden">
                                  {activity.startTime.slice(0, 5)} - {activity.endTime.slice(0, 5)}
                                </span>
                                <span className="hidden lg:inline">
                                  {activity.startTime} - {activity.endTime}
                                </span>
                              </div>
                            )}
                          </div>
                        </Button>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </Card>
  )
}
