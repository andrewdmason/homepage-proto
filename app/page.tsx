'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ActionButton } from "@/components/action-button"
import { FeatureCard } from "@/components/feature-card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Edit,
  Video,
  FileText,
  User,
  Languages,
  Mic,
  SendHorizontal,
  PaperclipIcon,
  MonitorSmartphone,
  Type,
  Wand2,
  Music,
  ChevronDown,
} from "lucide-react"
import { AttachMenu } from "@/components/attach-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useState, useRef } from "react"
import { cn } from "@/lib/utils"

export default function Page() {
  const [inputValue, setInputValue] = useState("")
  const [showTooltip, setShowTooltip] = useState(false)
  const [showRecordDialog, setShowRecordDialog] = useState(false)
  const [showAvatarDialog, setShowAvatarDialog] = useState(false)
  const [showAvatarPromptDialog, setShowAvatarPromptDialog] = useState(false)
  const [isGeneratingAvatar, setIsGeneratingAvatar] = useState(false)
  const [generatedAvatar, setGeneratedAvatar] = useState<string | null>(null)
  const [showThemeSelector, setShowThemeSelector] = useState(false)
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null)
  const [avatarPrompt, setAvatarPrompt] = useState("")
  const [isInputFlashing, setIsInputFlashing] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const themes = [
    { id: 'professional', name: 'Professional', description: 'Clean and corporate style with subtle animations', background: 'bg-gradient-to-br from-gray-50 to-gray-100' },
    { id: 'modern', name: 'Modern', description: 'Bold and contemporary with dynamic transitions', background: 'bg-gradient-to-br from-purple-50 to-blue-50' },
    { id: 'minimal', name: 'Minimal', description: 'Simple and elegant with focus on content', background: 'bg-gradient-to-br from-white to-gray-50' },
    { id: 'creative', name: 'Creative', description: 'Artistic style with colorful elements', background: 'bg-gradient-to-br from-pink-50 to-purple-50' },
    { id: 'tech', name: 'Tech', description: 'Futuristic look with geometric patterns', background: 'bg-gradient-to-br from-cyan-50 to-blue-50' },
    { id: 'casual', name: 'Casual', description: 'Friendly and approachable with soft colors', background: 'bg-gradient-to-br from-orange-50 to-yellow-50' },
    { id: 'dramatic', name: 'Dramatic', description: 'High contrast with cinematic transitions', background: 'bg-gradient-to-br from-gray-900 to-gray-800 text-white' },
    { id: 'playful', name: 'Playful', description: 'Fun and energetic with bouncy animations', background: 'bg-gradient-to-br from-green-50 to-emerald-50' },
    { id: 'elegant', name: 'Elegant', description: 'Sophisticated style with smooth transitions', background: 'bg-gradient-to-br from-amber-50 to-yellow-50' },
  ]

  const showTooltipWithTimeout = () => {
    setShowTooltip(true)
    setTimeout(() => setShowTooltip(false), 5000)
  }

  const highlightInput = () => {
    // Scroll the input into view with smooth behavior
    inputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    
    // Trigger the flash animation
    setIsInputFlashing(true)
    setTimeout(() => setIsInputFlashing(false), 1000)
  }

  const handleEditVideo = () => {
    setInputValue("edit this video to make it more engaging")
    showTooltipWithTimeout()
    highlightInput()
  }

  const handleCreateCaptions = () => {
    setInputValue("create captions for this video")
    showTooltipWithTimeout()
    highlightInput()
  }

  const handleTranslateVideo = () => {
    setInputValue("translate this video to Spanish")
    showTooltipWithTimeout()
    highlightInput()
  }

  const handleTranscribeFile = () => {
    setInputValue("transcribe this audio file")
    showTooltipWithTimeout()
    highlightInput()
  }

  const handleRemoveFillerWords = () => {
    setInputValue("remove the filler words from this recording")
    showTooltipWithTimeout()
    highlightInput()
  }

  const handleMakeSocialClips = () => {
    setInputValue("create social media clips from this video")
    showTooltipWithTimeout()
    highlightInput()
  }

  const handleEnhanceAudio = () => {
    setInputValue("improve the audio of this file")
    showTooltipWithTimeout()
    highlightInput()
  }

  const handleRecordScreen = () => {
    setShowRecordDialog(true)
  }

  const handleCreateAvatar = () => {
    setShowAvatarDialog(true)
  }

  const handleGenerateAvatar = () => {
    setIsGeneratingAvatar(true)
    // Simulate API call
    setTimeout(() => {
      setIsGeneratingAvatar(false)
      setGeneratedAvatar("https://images.unsplash.com/photo-1544502062-f82887f03d1c?w=800&auto=format&fit=crop&q=60")
    }, 3000)
  }

  const handleThemeSelect = (themeId: string) => {
    setSelectedTheme(themeId)
    setShowAvatarPromptDialog(false)
    setShowThemeSelector(false)
    setInputValue("create a video with my AI avatar using the ${themeId} theme")
    highlightInput()
    // Reset states
    setAvatarPrompt("")
    setGeneratedAvatar(null)
    setSelectedTheme(null)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container flex h-14 items-center justify-end">
          <Button variant="ghost" className="gap-2">
            <span>asmith@descript.com</span>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* Record Screen Dialog */}
      <Dialog open={showRecordDialog} onOpenChange={setShowRecordDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Opening Screen Recorder</DialogTitle>
            <DialogDescription className="pt-4">
              This would redirect you to the Descript editor where you can start recording your screen.
              <div className="mt-4 p-4 bg-gray-50 rounded-lg text-sm text-gray-500">
                Note: This is a prototype, so the redirect is not implemented.
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      {/* Avatar Creation Dialog */}
      <Dialog open={showAvatarDialog} onOpenChange={setShowAvatarDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-2xl">Create Your AI Avatar</DialogTitle>
            <DialogDescription className="pt-4">
              Choose how you'd like to create your AI avatar
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 pt-4">
            <button 
              onClick={() => {
                setShowAvatarDialog(false)
                setInputValue("create an AI avatar from my photo")
                highlightInput()
              }}
              className="flex items-center gap-4 p-4 rounded-lg border border-[#E5E5E5] hover:bg-gray-50 transition-colors text-left"
            >
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <PaperclipIcon className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <h3 className="font-medium">Upload a photo</h3>
                <p className="text-sm text-muted-foreground">Use your own photo to create a personalized avatar</p>
              </div>
            </button>

            <button 
              onClick={() => {
                setShowAvatarDialog(false)
                setShowAvatarPromptDialog(true)
              }}
              className="flex items-center gap-4 p-4 rounded-lg border border-[#E5E5E5] hover:bg-gray-50 transition-colors text-left"
            >
              <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                <Wand2 className="h-6 w-6 text-purple-500" />
              </div>
              <div>
                <h3 className="font-medium">Generate from prompt</h3>
                <p className="text-sm text-muted-foreground">Describe your ideal avatar and let AI create it</p>
              </div>
            </button>

            <button 
              onClick={() => {
                setShowAvatarDialog(false)
                setInputValue("show me the gallery of AI avatars to choose from")
                highlightInput()
              }}
              className="flex items-center gap-4 p-4 rounded-lg border border-[#E5E5E5] hover:bg-gray-50 transition-colors text-left"
            >
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                <User className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <h3 className="font-medium">Choose from gallery</h3>
                <p className="text-sm text-muted-foreground">Select from our collection of pre-made avatars</p>
              </div>
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Avatar Prompt Dialog */}
      <Dialog open={showAvatarPromptDialog} onOpenChange={setShowAvatarPromptDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              {showThemeSelector ? "Choose Your Video Style" : "Generate Your AI Avatar"}
            </DialogTitle>
            <DialogDescription className="pt-4">
              {showThemeSelector 
                ? "Select a theme for your avatar video" 
                : "Describe how you want your avatar to look"
              }
            </DialogDescription>
          </DialogHeader>

          {!isGeneratingAvatar && !generatedAvatar && !showThemeSelector && (
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="prompt" className="text-sm font-medium">
                    Prompt
                  </label>
                  <Input
                    id="prompt"
                    placeholder="Example: A professional woman in her 30s with short brown hair wearing a blue blazer"
                    value={avatarPrompt}
                    onChange={(e) => setAvatarPrompt(e.target.value)}
                    className="h-auto py-2"
                  />
                </div>
                <div className="text-sm text-muted-foreground">
                  Try to include: age, gender, style, clothing, and any specific features you want.
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-medium">Example prompts:</h4>
                <div className="grid gap-2">
                  {[
                    "A confident male tech executive in his 40s wearing a black turtleneck",
                    "A friendly female teacher in her 20s with glasses and a warm smile",
                    "A creative artist with colorful hair and an edgy style"
                  ].map((example) => (
                    <button
                      key={example}
                      onClick={() => setAvatarPrompt(example)}
                      className="text-left text-sm p-2 rounded hover:bg-gray-50 text-muted-foreground"
                    >
                      {example}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowAvatarPromptDialog(false)
                    setAvatarPrompt("")
                    setGeneratedAvatar(null)
                  }}
                >
                  Cancel
                </Button>
                <Button
                  disabled={!avatarPrompt}
                  onClick={handleGenerateAvatar}
                  className="bg-black hover:bg-gray-800 text-white"
                >
                  Generate Avatar
                </Button>
              </div>
            </div>
          )}

          {isGeneratingAvatar && (
            <div className="py-8 space-y-6">
              <div className="w-24 h-24 rounded-full bg-gray-100 mx-auto animate-pulse" />
              <div className="text-center space-y-2">
                <p className="font-medium">Generating your avatar...</p>
                <p className="text-sm text-muted-foreground">This usually takes about 30 seconds</p>
              </div>
            </div>
          )}

          {generatedAvatar && !isGeneratingAvatar && !showThemeSelector && (
            <div className="space-y-6">
              <div className="aspect-square max-w-[300px] mx-auto relative rounded-lg overflow-hidden">
                <img 
                  src={generatedAvatar} 
                  alt="Generated avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="flex justify-between gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setGeneratedAvatar(null)
                    setAvatarPrompt("")
                  }}
                >
                  Try Again
                </Button>
                <Button
                  onClick={() => setShowThemeSelector(true)}
                  className="bg-black hover:bg-gray-800 text-white"
                >
                  Choose Theme
                </Button>
              </div>
            </div>
          )}

          {showThemeSelector && (
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                {themes.map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => handleThemeSelect(theme.id)}
                    className={cn(
                      "group relative aspect-video rounded-lg p-4 text-left transition-all hover:scale-105",
                      theme.background
                    )}
                  >
                    <div className="space-y-1">
                      <h3 className="font-medium">{theme.name}</h3>
                      <p className="text-xs text-muted-foreground line-clamp-2">{theme.description}</p>
                    </div>
                    <div className="absolute inset-0 rounded-lg ring-1 ring-inset ring-gray-900/10 group-hover:ring-gray-900/20" />
                  </button>
                ))}
              </div>

              <div className="flex justify-between gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowThemeSelector(false)}
                >
                  Back
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Main Content */}
      <main className="container mx-auto max-w-4xl space-y-12 px-4 py-12">
        <div className="space-y-4 text-center">
          <h1 className="text-4xl font-semibold tracking-tight">What do you want to make?</h1>
          <p className="text-lg text-muted-foreground">
            Add a sentence or two about your video and we'll get you started.
          </p>
        </div>

        {/* Input Section */}
        <div className="space-y-6">
          <div className="relative">
            <Input 
              ref={inputRef}
              placeholder="I want to make..." 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className={cn(
                "h-auto py-4 pl-14 pr-14 text-lg rounded-2xl border-[#DADADA] hover:border-[#999999] focus-visible:ring-0 focus-visible:border-[#999999] shadow-[0_0_10px_rgba(0,0,0,0.05)]",
                isInputFlashing && "animate-highlight"
              )}
            />
            <TooltipProvider>
              <Tooltip open={showTooltip}>
                <TooltipTrigger asChild>
                  <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    <AttachMenu />
                  </div>
                </TooltipTrigger>
                <TooltipContent 
                  side="top" 
                  align="start" 
                  sideOffset={16}
                  className="bg-black text-white"
                >
                  Click here to upload your file
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <div className="absolute right-2 top-1/2 -translate-y-1/2">
              <Button 
                size="sm" 
                disabled={!inputValue}
                className={cn(
                  "transition-all duration-200",
                  inputValue 
                    ? "bg-black hover:bg-gray-800 text-white animate-scale-in" 
                    : "bg-transparent hover:bg-transparent"
                )}
              >
                <SendHorizontal className={cn(
                  "h-6 w-6 transition-all duration-200",
                  inputValue 
                    ? "text-white" 
                    : "text-[#999999] opacity-60 hover:opacity-100"
                )} />
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center gap-2">
            <ActionButton 
              icon={<Edit className="h-5 w-5 text-blue-500" />} 
              label="Edit a video" 
              className="bg-white hover:bg-gray-50 shadow-[0_0_10px_rgba(0,0,0,0.05)] border-[#E5E5E5]"
              onClick={handleEditVideo}
            />
            <ActionButton 
              icon={<MonitorSmartphone className="h-5 w-5 text-red-500" />} 
              label="Record my screen" 
              className="bg-white hover:bg-gray-50 shadow-[0_0_10px_rgba(0,0,0,0.05)] border-[#E5E5E5]"
              onClick={handleRecordScreen}
            />
            <ActionButton 
              icon={<FileText className="h-5 w-5 text-emerald-500" />} 
              label="Create captions" 
              className="bg-white hover:bg-gray-50 shadow-[0_0_10px_rgba(0,0,0,0.05)] border-[#E5E5E5]"
              onClick={handleCreateCaptions}
            />
            <ActionButton 
              icon={<User className="h-5 w-5 text-violet-500" />} 
              label="Create an AI Avatar" 
              className="bg-white hover:bg-gray-50 shadow-[0_0_10px_rgba(0,0,0,0.05)] border-[#E5E5E5]"
              onClick={handleCreateAvatar}
            />
            <ActionButton 
              icon={<Languages className="h-5 w-5 text-sky-500" />} 
              label="Translate a video" 
              className="bg-white hover:bg-gray-50 shadow-[0_0_10px_rgba(0,0,0,0.05)] border-[#E5E5E5]"
              onClick={handleTranslateVideo}
            />
            <ActionButton 
              icon={<Type className="h-5 w-5 text-orange-500" />} 
              label="Transcribe a file" 
              className="bg-white hover:bg-gray-50 shadow-[0_0_10px_rgba(0,0,0,0.05)] border-[#E5E5E5]"
              onClick={handleTranscribeFile}
            />
            <ActionButton 
              icon={<Wand2 className="h-5 w-5 text-purple-500" />} 
              label="Remove filler words" 
              className="bg-white hover:bg-gray-50 shadow-[0_0_10px_rgba(0,0,0,0.05)] border-[#E5E5E5]"
              onClick={handleRemoveFillerWords}
            />
            <ActionButton 
              icon={<Video className="h-5 w-5 text-indigo-500" />} 
              label="Make social clips" 
              className="bg-white hover:bg-gray-50 shadow-[0_0_10px_rgba(0,0,0,0.05)] border-[#E5E5E5]"
              onClick={handleMakeSocialClips}
            />
            <ActionButton 
              icon={<Mic className="h-5 w-5 text-rose-500" />} 
              label="Make a podcast" 
              className="bg-white hover:bg-gray-50 shadow-[0_0_10px_rgba(0,0,0,0.05)] border-[#E5E5E5]" 
            />
            <ActionButton 
              icon={<Music className="h-5 w-5 text-teal-500" />} 
              label="Enhance audio" 
              className="bg-white hover:bg-gray-50 shadow-[0_0_10px_rgba(0,0,0,0.05)] border-[#E5E5E5]"
              onClick={handleEnhanceAudio}
            />
          </div>
        </div>

        {/* Featured Section */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Featured</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <FeatureCard
              title="AI Avatars"
              description="Turn text into a video narrated by an AI."
              imageSrc="https://images.unsplash.com/photo-1555952517-2e8e729e0b44?w=800&auto=format&fit=crop&q=60"
              isNew
              onClick={handleCreateAvatar}
            />
            <FeatureCard
              title="AI Video Maker"
              description="Instant video from a prompt or a script."
              imageSrc="https://images.unsplash.com/photo-1536240478700-b869070f9279?w=800&auto=format&fit=crop&q=60"
            />
            <FeatureCard
              title="Translation"
              description="30 languages of captions, audio, and video."
              imageSrc="https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800&auto=format&fit=crop&q=60"
            />
          </div>
        </div>
      </main>
    </div>
  )
}

