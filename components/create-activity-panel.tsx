"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X, Star, Calendar, Clock } from "lucide-react"
import type { Activity } from "@/app/page"

interface CreateActivityPanelProps {
  weekStart: Date
  colors: string[]
  onCreateActivity: (activity: Omit<Activity, "id">) => void
  onClose: () => void
}

export function CreateActivityPanel({ weekStart, colors, onCreateActivity, onClose }: CreateActivityPanelProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [selectedDate, setSelectedDate] = useState("")
  const [startTime, setStartTime] = useState("09:00")
  const [endTime, setEndTime] = useState("10:00")
  const [selectedColor, setSelectedColor] = useState(colors[0])
  const [importance, setImportance] = useState<1 | 2 | 3>(1)

  const getWeekDays = () => {
    const days = []
    for (let i = 0; i < 7; i++) {
      const day = new Date(weekStart)
      day.setDate(weekStart.getDate() + i)
      days.push(day)
    }
    return days
  }

  const formatDate = (date: Date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
  }

  const formatDateDisplay = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    })
  }

  const generateTimeOptions = () => {
    const times = []
    for (let hour = 6; hour <= 23; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeStr = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`
        times.push(timeStr)
      }
    }
    return times
  }

  const handleCreate = () => {
    if (!title.trim() || !selectedDate) return

    // Validate end time is after start time
    const startMinutes = Number.parseInt(startTime.split(":")[0]) * 60 + Number.parseInt(startTime.split(":")[1])
    const endMinutes = Number.parseInt(endTime.split(":")[0]) * 60 + Number.parseInt(endTime.split(":")[1])

    if (endMinutes <= startMinutes) {
      alert("End time must be after start time")
      return
    }

    onCreateActivity({
      title: title.trim(),
      description: description.trim(),
      date: selectedDate,
      startTime,
      endTime,
      color: selectedColor,
      importance,
      completed: false,
    })

    onClose()
  }

  const weekDays = getWeekDays()
  const timeOptions = generateTimeOptions()

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-2 lg:p-4 z-50">
      <Card className="w-full max-w-lg bg-white/95 backdrop-blur-sm border-white/20 max-h-[90vh] overflow-y-auto">
        <div className="p-4 lg:p-6">
          <div className="flex items-center justify-between mb-4 lg:mb-6">
            <h2 className="text-xl lg:text-2xl font-semibold text-gray-800">Create New Activity</h2>
            <Button variant="ghost" size="sm" onClick={onClose} className="text-gray-500 hover:text-gray-700 p-1">
              <X className="w-5 h-5" />
            </Button>
          </div>

          <div className="space-y-4 lg:space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Activity Title</label>
              <Input
                placeholder="Enter activity title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description (Optional)</label>
              <Textarea
                placeholder="Add activity description..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full h-16 lg:h-20"
              />
            </div>

            {/* Date Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Date
              </label>
              <Select value={selectedDate} onValueChange={setSelectedDate}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a date" />
                </SelectTrigger>
                <SelectContent>
                  {weekDays.map((day) => (
                    <SelectItem key={formatDate(day)} value={formatDate(day)}>
                      {formatDateDisplay(day)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Time Selection */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Clock className="w-4 h-4 inline mr-1" />
                  Start Time
                </label>
                <Select value={startTime} onValueChange={setStartTime}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {timeOptions.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
                <Select value={endTime} onValueChange={setEndTime}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {timeOptions.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Color Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Activity Color</label>
              <div className="flex flex-wrap gap-2">
                {colors.map((color) => (
                  <button
                    key={color}
                    className={`w-6 h-6 lg:w-8 lg:h-8 rounded-full border-2 transition-all ${
                      selectedColor === color ? "border-gray-800 scale-110" : "border-gray-300 hover:scale-105"
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => setSelectedColor(color)}
                  />
                ))}
              </div>
            </div>

            {/* Importance Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Importance Level</label>
              <div className="flex gap-2">
                {[1, 2, 3].map((level) => (
                  <Button
                    key={level}
                    variant={importance >= level ? "default" : "outline"}
                    size="sm"
                    onClick={() => setImportance(level as 1 | 2 | 3)}
                    className="flex items-center gap-1"
                  >
                    <Star className={`w-4 h-4 ${importance >= level ? "fill-yellow-300 text-yellow-300" : ""}`} />
                    {level}
                  </Button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col lg:flex-row gap-3 pt-4">
              <Button onClick={handleCreate} className="flex-1" disabled={!title.trim() || !selectedDate}>
                Create Activity
              </Button>
              <Button variant="outline" onClick={onClose} className="flex-1 lg:flex-none bg-transparent">
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
