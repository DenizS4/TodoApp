"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { X, Upload, Trash2, Check } from "lucide-react"
import type { BackgroundOption } from "@/app/page"

interface BackgroundSelectorProps {
  presetBackgrounds: BackgroundOption[]
  customBackgrounds: BackgroundOption[]
  currentBackground: BackgroundOption
  onSelectBackground: (bg: BackgroundOption) => void
  onAddCustomBackground: (bg: BackgroundOption) => void
  onDeleteCustomBackground: (id: string) => void
  onClose: () => void
}

export function BackgroundSelector({
  presetBackgrounds,
  customBackgrounds,
  currentBackground,
  onSelectBackground,
  onAddCustomBackground,
  onDeleteCustomBackground,
  onClose,
}: BackgroundSelectorProps) {
  const [uploadingFile, setUploadingFile] = useState(false)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploadingFile(true)
    const reader = new FileReader()

    reader.onload = (e) => {
      const result = e.target?.result as string
      const newBackground: BackgroundOption = {
        id: Date.now().toString(),
        name: file.name.split(".")[0],
        url: result,
        type: "custom",
      }
      onAddCustomBackground(newBackground)
      setUploadingFile(false)
    }

    reader.readAsDataURL(file)
  }

  const BackgroundPreview = ({ bg }: { bg: BackgroundOption }) => {
    const isSelected = bg.id === currentBackground.id

    return (
      <div
        className={`relative h-32 rounded-lg cursor-pointer border-2 transition-all overflow-hidden ${
          isSelected ? "border-blue-500 ring-2 ring-blue-200" : "border-gray-200 hover:border-gray-300"
        }`}
        onClick={() => onSelectBackground(bg)}
      >
        <img src={bg.url || "/placeholder.svg"} alt={bg.name} className="w-full h-full object-cover" loading="lazy" />
        {isSelected && (
          <div className="absolute top-2 right-2 bg-blue-500 rounded-full p-1">
            <Check className="w-4 h-4 text-white" />
          </div>
        )}
        {bg.type === "custom" && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-2 left-2 bg-red-500 hover:bg-red-600 text-white p-1 h-8 w-8"
            onClick={(e) => {
              e.stopPropagation()
              onDeleteCustomBackground(bg.id)
            }}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        )}
        <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-sm p-2">{bg.name}</div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl bg-white/95 backdrop-blur-sm border-white/20 max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">Choose Background</h2>
            <Button variant="ghost" size="sm" onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="w-5 h-5" />
            </Button>
          </div>

          <div className="space-y-8">
            {/* Upload custom background */}
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-4">Upload Custom Background</h3>
              <div className="flex items-center gap-3">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={uploadingFile}
                  className="flex-1"
                />
                <Button disabled={uploadingFile} variant="outline">
                  <Upload className="w-4 h-4 mr-2" />
                  {uploadingFile ? "Uploading..." : "Upload"}
                </Button>
              </div>
            </div>

            {/* Custom backgrounds */}
            {customBackgrounds.length > 0 && (
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-4">Your Backgrounds</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {customBackgrounds.map((bg) => (
                    <BackgroundPreview key={bg.id} bg={bg} />
                  ))}
                </div>
              </div>
            )}

            {/* Preset backgrounds */}
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-4">Nature & Landscape Backgrounds</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {presetBackgrounds.map((bg) => (
                  <BackgroundPreview key={bg.id} bg={bg} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
