"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { X, Star, Trash2, Edit, Clock, Calendar } from "lucide-react"
import type { Activity } from "@/app/page"
import { useToast } from "@/hooks/use-toast"
import { DeleteConfirmationDialog } from "@/components/delete-confirmation-dialog"

interface ActivityPanelProps {
  activity: Activity
  colors: string[]
  onUpdateActivity: (activity: Activity) => void
  onDeleteActivity: (id: string) => void
  onClose: () => void
}

export function ActivityPanel({ activity, colors, onUpdateActivity, onDeleteActivity, onClose }: ActivityPanelProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(activity.title)
  const [editDescription, setEditDescription] = useState(activity.description || "")
  const [editColor, setEditColor] = useState(activity.color)
  const [editImportance, setEditImportance] = useState(activity.importance)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const { toast } = useToast()

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":")
    const hour12 = Number.parseInt(hours) % 12 || 12
    const ampm = Number.parseInt(hours) >= 12 ? "PM" : "AM"
    return `${hour12}:${minutes} ${ampm}`
  }

  const calculateDuration = () => {
    const startMinutes =
      Number.parseInt(activity.startTime.split(":")[0]) * 60 + Number.parseInt(activity.startTime.split(":")[1])
    const endMinutes =
      Number.parseInt(activity.endTime.split(":")[0]) * 60 + Number.parseInt(activity.endTime.split(":")[1])
    const durationMinutes = endMinutes - startMinutes

    const hours = Math.floor(durationMinutes / 60)
    const minutes = durationMinutes % 60

    if (hours === 0) return `${minutes}m`
    if (minutes === 0) return `${hours}h`
    return `${hours}h ${minutes}m`
  }

  const handleSave = () => {
    if (!editTitle.trim()) return

    onUpdateActivity({
      ...activity,
      title: editTitle.trim(),
      description: editDescription.trim(),
      color: editColor,
      importance: editImportance,
    })
    setIsEditing(false)

    // Show save toast
    toast({
      title: "Activity Updated",
      description: `"${editTitle.trim()}" has been successfully updated.`,
      variant: "default",
    })
  }

  const handleToggleComplete = () => {
    const newCompletedState = !activity.completed

    onUpdateActivity({
      ...activity,
      completed: newCompletedState,
    })

    // Show toast notification
    if (newCompletedState) {
      toast({
        title: "Activity Completed! 🎉",
        description: `"${activity.title}" has been marked as completed.`,
        variant: "success",
      })
    } else {
      toast({
        title: "Activity Reopened",
        description: `"${activity.title}" has been marked as incomplete.`,
        variant: "default",
      })
    }

    // Auto-close modal for both complete and uncomplete actions
    setTimeout(() => {
      onClose()
    }, 1000)
  }

  const handleDeleteClick = () => {
    setShowDeleteDialog(true)
  }

  const handleDeleteConfirm = () => {
    onDeleteActivity(activity.id)

    // Show delete toast notification
    toast({
      title: "Activity Deleted",
      description: `"${activity.title}" has been permanently deleted.`,
      variant: "destructive",
    })

    setShowDeleteDialog(false)
    onClose()
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-2 lg:p-4 z-50">
        <Card className="w-full max-w-md bg-white/95 backdrop-blur-sm border-white/20 max-h-[90vh] overflow-y-auto">
          <div className="p-4 lg:p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: activity.color }} />
                <h2 className="text-lg lg:text-xl font-semibold text-gray-800">Activity Details</h2>
              </div>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditing(!isEditing)}
                  className="text-gray-500 hover:text-gray-700 p-1"
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={onClose} className="text-gray-500 hover:text-gray-700 p-1">
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              {/* Title */}
              <div>
                {isEditing ? (
                  <Input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="text-base lg:text-lg font-semibold"
                  />
                ) : (
                  <h3
                    className={`text-base lg:text-lg font-semibold ${activity.completed ? "line-through text-gray-500" : ""}`}
                  >
                    {activity.title}
                  </h3>
                )}
              </div>

              {/* Importance Stars */}
              <div className="flex items-center gap-1">
                <span className="text-sm text-gray-600 mr-2">Importance:</span>
                {isEditing ? (
                  <div className="flex gap-1">
                    {[1, 2, 3].map((level) => (
                      <Button
                        key={level}
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditImportance(level as 1 | 2 | 3)}
                        className="p-1"
                      >
                        <Star
                          className={`w-4 h-4 ${
                            editImportance >= level ? "fill-yellow-300 text-yellow-300" : "text-gray-300"
                          }`}
                        />
                      </Button>
                    ))}
                  </div>
                ) : (
                  <div className="flex">
                    {Array.from({ length: activity.importance }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-300 text-yellow-300" />
                    ))}
                  </div>
                )}
              </div>

              {/* Date and Time */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span className="text-xs lg:text-sm">{formatDate(activity.date)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span className="text-xs lg:text-sm">
                    {formatTime(activity.startTime)} - {formatTime(activity.endTime)} ({calculateDuration()})
                  </span>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                {isEditing ? (
                  <Textarea
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    placeholder="Add description..."
                    className="h-16 lg:h-20 text-sm"
                  />
                ) : (
                  <p className="text-sm text-gray-600 min-h-[2rem]">
                    {activity.description || "No description provided"}
                  </p>
                )}
              </div>

              {/* Color Selection (Edit Mode) */}
              {isEditing && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                  <div className="flex flex-wrap gap-2">
                    {colors.map((color) => (
                      <button
                        key={color}
                        className={`w-6 h-6 lg:w-8 lg:h-8 rounded-full border-2 transition-all ${
                          editColor === color ? "border-gray-800 scale-110" : "border-gray-300 hover:scale-105"
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={() => setEditColor(color)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Completion Status */}
              <div
                className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                  activity.completed ? "bg-green-50 border border-green-200" : "bg-gray-50"
                }`}
              >
                <Checkbox checked={activity.completed} onCheckedChange={handleToggleComplete} />
                <span className={`text-sm ${activity.completed ? "text-green-700 font-medium" : "text-gray-700"}`}>
                  {activity.completed ? "✓ Completed" : "Mark as completed"}
                </span>
                {activity.completed && (
                  <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full ml-auto">Done!</span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col lg:flex-row gap-2 pt-4">
                {isEditing ? (
                  <>
                    <Button onClick={handleSave} className="flex-1" disabled={!editTitle.trim()}>
                      Save Changes
                    </Button>
                    <Button variant="outline" onClick={() => setIsEditing(false)} className="flex-1 lg:flex-none">
                      Cancel
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      onClick={handleDeleteClick}
                      className="text-red-600 hover:text-red-700 bg-transparent hover:bg-red-50 w-full"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        activityTitle={activity.title}
        onConfirm={handleDeleteConfirm}
      />
    </>
  )
}
