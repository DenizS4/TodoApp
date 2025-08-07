"use client"

import { useState, useEffect } from "react"
import { WeeklyCalendar } from "@/components/weekly-calendar"
import { ActivityPanel } from "@/components/activity-panel"
import { CreateActivityPanel } from "@/components/create-activity-panel"
import { BackgroundSelector } from "@/components/background-selector"
import { Button } from "@/components/ui/button"
import { Settings, CalendarIcon, ChevronLeft, ChevronRight, Plus } from "lucide-react"

export interface Todo {
  id: string
  text: string
  completed: boolean
}

export interface Activity {
  id: string
  title: string
  description?: string
  date: string
  startTime: string // Format: "HH:mm"
  endTime: string // Format: "HH:mm"
  color: string
  importance: 1 | 2 | 3 // Star rating
  completed: boolean
}

export interface BackgroundOption {
  id: string
  name: string
  url: string
  type: "preset" | "custom"
}

const ACTIVITY_COLORS = [
  "#3B82F6", // Blue
  "#EF4444", // Red
  "#10B981", // Green
  "#F59E0B", // Yellow
  "#8B5CF6", // Purple
  "#EC4899", // Pink
  "#06B6D4", // Cyan
  "#84CC16", // Lime
  "#F97316", // Orange
  "#6366F1", // Indigo
]

const PRESET_BACKGROUNDS: BackgroundOption[] = [
  { id: "mountain1", name: "Mountain Peak", url: "https://upload.wikimedia.org/wikipedia/commons/6/60/Matterhorn_from_Domh%C3%BCtte_-_2.jpg", type: "preset" },
  { id: "beach1", name: "Tropical Beach", url: "https://muralsyourway.vtexassets.com/arquivos/ids/236286/Tropical-Beach-At-Sunset-Mural-Wallpaper.jpg?v=638164405127130000", type: "preset" },
  { id: "forest1", name: "Misty Forest", url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHckoDKARmfMFPL85870M3IPfkqdDulUscwg&s", type: "preset" },
  { id: "lake1", name: "Mountain Lake", url: "https://www.rockymountaineer.com/sites/default/files/bp_summary_image/Emerald%20Lake%20-%20Credit%20Suran%20Gaw%2C%20Adobe%20Stock_1_0.jpeg", type: "preset" },
  { id: "sunset1", name: "Desert Sunset", url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQbtKs_MrPl3TyM16oBfevVcLKwG4gE32aE5Q&s", type: "preset" },
  { id: "field1", name: "Lavender Field", url: "https://media.istockphoto.com/id/480975194/photo/sunrise-and-dramatic-clouds-over-lavender-field.jpg?s=612x612&w=0&k=20&c=9oOUcyMJrutCRxdOp0HYUz0avbuT4akmwKvL-aa_QkI=", type: "preset" },
  { id: "ocean1", name: "Ocean Cliffs", url: "https://images.stockcake.com/public/4/a/0/4a0df6dc-9bc1-4045-b38a-21714cb3b965_large/cliffside-ocean-waves-stockcake.jpg", type: "preset" },
  { id: "aurora1", name: "Northern Lights", url: "https://res.cloudinary.com/icelandtours/g_auto,f_auto,c_auto,w_3840,q_auto:good/northern_lights_above_glacier_lagoon_v2osk_unsplash_7d39ca647f.jpg", type: "preset" },
  { id: "valley1", name: "Green Valley", url: "https://static.vecteezy.com/system/resources/thumbnails/053/729/892/small_2x/serene-green-valley-river-landscape-sunrise-nature-scene-photo.jpeg", type: "preset" },
  { id: "waterfall1", name: "Waterfall", url: "https://media.cntraveler.com/photos/571945e380cf3e034f974b7d/4:3/w_2048,h_1536,c_limit/waterfalls-Seljalandsfoss-GettyImages-457381095.jpg", type: "preset" },
]

export default function WeeklyPlanner() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null)
  const [showActivityPanel, setShowActivityPanel] = useState(false)
  const [showCreatePanel, setShowCreatePanel] = useState(false)
  const [showBackgroundSelector, setShowBackgroundSelector] = useState(false)
  const [currentBackground, setCurrentBackground] = useState<BackgroundOption>(PRESET_BACKGROUNDS[0])
  const [customBackgrounds, setCustomBackgrounds] = useState<BackgroundOption[]>([])
  const [backgroundAttachment, setBackgroundAttachment] = useState('fixed');

  // Week navigation
  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    const today = new Date()
    const dayOfWeek = today.getDay()
    const weekStart = new Date(today)
    weekStart.setDate(today.getDate() - dayOfWeek)
    return weekStart
  })

  // Load data from localStorage on mount
  useEffect(() => {
    const savedActivities = localStorage.getItem("weekly-planner-activities")
    const savedBackground = localStorage.getItem("weekly-planner-background")
    const savedCustomBgs = localStorage.getItem("weekly-planner-custom-backgrounds")

    if (savedActivities) {
      setActivities(JSON.parse(savedActivities))
    }
    if (savedBackground) {
      setCurrentBackground(JSON.parse(savedBackground))
    }
    if (savedCustomBgs) {
      setCustomBackgrounds(JSON.parse(savedCustomBgs))
    }
  }, [])

  // Save activities to localStorage
  useEffect(() => {
    localStorage.setItem("weekly-planner-activities", JSON.stringify(activities))
  }, [activities])

  // Save background to localStorage
  useEffect(() => {
    localStorage.setItem("weekly-planner-background", JSON.stringify(currentBackground))
  }, [currentBackground])

  // Save custom backgrounds to localStorage
  useEffect(() => {
    localStorage.setItem("weekly-planner-custom-backgrounds", JSON.stringify(customBackgrounds))
  }, [customBackgrounds])
  useEffect(() => {
    // Only runs on client
    if (window.innerWidth < 768) {
      setBackgroundAttachment('scroll');
    }
  }, []);
  const handleActivityClick = (activity: Activity) => {
    setSelectedActivity(activity)
    setShowActivityPanel(true)
  }

  const createActivity = (activityData: Omit<Activity, "id">) => {
    const newActivity: Activity = {
      ...activityData,
      id: Date.now().toString(),
    }
    setActivities([...activities, newActivity])
  }

  const updateActivity = (updatedActivity: Activity) => {
    setActivities(activities.map((activity) => (activity.id === updatedActivity.id ? updatedActivity : activity)))
  }

  const deleteActivity = (id: string) => {
    setActivities(activities.filter((activity) => activity.id !== id))
  }

  const getActivitiesForDate = (date: string) => {
    return activities.filter((activity) => activity.date === date)
  }

  const navigateWeek = (direction: "prev" | "next") => {
    const newWeekStart = new Date(currentWeekStart)
    if (direction === "prev") {
      newWeekStart.setDate(currentWeekStart.getDate() - 7)
    } else {
      newWeekStart.setDate(currentWeekStart.getDate() + 7)
    }
    setCurrentWeekStart(newWeekStart)
  }

  const goToCurrentWeek = () => {
    const today = new Date()
    const dayOfWeek = today.getDay()
    const weekStart = new Date(today)
    weekStart.setDate(today.getDate() - dayOfWeek)
    setCurrentWeekStart(weekStart)
  }

  const formatWeekRange = () => {
    const weekEnd = new Date(currentWeekStart)
    weekEnd.setDate(currentWeekStart.getDate() + 6)

    const startMonth = currentWeekStart.toLocaleDateString("en-US", { month: "short" })
    const endMonth = weekEnd.toLocaleDateString("en-US", { month: "short" })
    const startDay = currentWeekStart.getDate()
    const endDay = weekEnd.getDate()
    const year = currentWeekStart.getFullYear()

    if (startMonth === endMonth) {
      return `${startMonth} ${startDay} - ${endDay}, ${year}`
    } else {
      return `${startMonth} ${startDay} - ${endMonth} ${endDay}, ${year}`
    }
  }

  const backgroundStyle = {
    backgroundImage: `url(${currentBackground.url})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundAttachment: backgroundAttachment,
  };

  return (
    <div className="min-h-screen transition-all duration-500 relative" style={backgroundStyle}>
      {/* Overlay for better readability */}
      <div className="absolute inset-0 bg-black/30" />

      <div className="relative z-10 p-2 lg:p-4">
        {/* Header */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-4 lg:mb-6 gap-4">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-2 lg:gap-4 w-full lg:w-auto">
            <div className="flex items-center gap-2 lg:gap-3">
              <CalendarIcon className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
              <h1 className="text-xl lg:text-3xl font-bold text-white">Weekly Planner</h1>
            </div>

            {/* Week Navigation */}
            <div className="flex items-center gap-1 lg:gap-2 bg-white/20 backdrop-blur-sm rounded-lg p-1 lg:p-2 w-full lg:w-auto">
              <Button
                onClick={() => navigateWeek("prev")}
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20 p-1 lg:p-2"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>

              <div className="text-white font-semibold text-sm lg:text-base min-w-[160px] lg:min-w-[200px] text-center px-1">
                {formatWeekRange()}
              </div>

              <Button
                onClick={() => navigateWeek("next")}
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20 p-1 lg:p-2"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 w-full lg:w-auto">
            <Button
              onClick={() => setShowCreatePanel(true)}
              variant="secondary"
              size="sm"
              className="bg-green-500 hover:bg-green-600 text-white border-green-600 flex-1 lg:flex-none"
            >
              <Plus className="w-4 h-4 mr-1 lg:mr-2" />
              <span className="hidden sm:inline">Create Activity</span>
              <span className="sm:hidden">Create</span>
            </Button>
            <Button
              onClick={goToCurrentWeek}
              variant="secondary"
              size="sm"
              className="bg-white/20 hover:bg-white/30 text-white border-white/30 flex-1 lg:flex-none"
            >
              <span className="hidden sm:inline">This Week</span>
              <span className="sm:hidden">Today</span>
            </Button>
            <Button
              onClick={() => setShowBackgroundSelector(true)}
              variant="secondary"
              size="sm"
              className="bg-white/20 hover:bg-white/30 text-white border-white/30 flex-1 lg:flex-none"
            >
              <Settings className="w-4 h-4 mr-1 lg:mr-2" />
              <span className="hidden sm:inline">Backgrounds</span>
              <span className="sm:hidden">BG</span>
            </Button>
          </div>
        </div>

        {/* Calendar */}
        <WeeklyCalendar
          weekStart={currentWeekStart}
          activities={activities}
          onActivityClick={handleActivityClick}
          getActivitiesForDate={getActivitiesForDate}
        />

        {/* Create Activity Panel */}
        {showCreatePanel && (
          <CreateActivityPanel
            weekStart={currentWeekStart}
            colors={ACTIVITY_COLORS}
            onCreateActivity={createActivity}
            onClose={() => setShowCreatePanel(false)}
          />
        )}

        {/* Activity Panel */}
        {showActivityPanel && selectedActivity && (
          <ActivityPanel
            activity={selectedActivity}
            colors={ACTIVITY_COLORS}
            onUpdateActivity={updateActivity}
            onDeleteActivity={deleteActivity}
            onClose={() => {
              setShowActivityPanel(false)
              setSelectedActivity(null)
            }}
          />
        )}

        {/* Background Selector */}
        {showBackgroundSelector && (
          <BackgroundSelector
            presetBackgrounds={PRESET_BACKGROUNDS}
            customBackgrounds={customBackgrounds}
            currentBackground={currentBackground}
            onSelectBackground={setCurrentBackground}
            onAddCustomBackground={(bg) => setCustomBackgrounds([...customBackgrounds, bg])}
            onDeleteCustomBackground={(id) => setCustomBackgrounds(customBackgrounds.filter((bg) => bg.id !== id))}
            onClose={() => setShowBackgroundSelector(false)}
          />
        )}
      </div>
    </div>
  )
}

export { ACTIVITY_COLORS }
