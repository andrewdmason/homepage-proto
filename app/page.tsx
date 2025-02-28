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
  Upload,
  Users,
  X,
} from "lucide-react"
import { AttachMenu } from "@/components/attach-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useState, useRef } from "react"
import { cn } from "@/lib/utils"
import Image from "next/image"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { useRouter } from 'next/navigation'

export default function Page() {
  const router = useRouter()
  const [inputValue, setInputValue] = useState("")
  const [showTooltip, setShowTooltip] = useState(false)
  const [showRecordDialog, setShowRecordDialog] = useState(false)
  const [showAvatarDialog, setShowAvatarDialog] = useState(false)
  const [showAvatarPromptDialog, setShowAvatarPromptDialog] = useState(false)
  const [isGeneratingAvatar, setIsGeneratingAvatar] = useState(false)
  const [generatedAvatar, setGeneratedAvatar] = useState<string | null>(null)
  const [showThemeSelector, setShowThemeSelector] = useState(false)
  const [avatarPrompt, setAvatarPrompt] = useState("")
  const [isInputFlashing, setIsInputFlashing] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [filePillWidth, setFilePillWidth] = useState(56) // Default left padding
  const inputRef = useRef<HTMLInputElement>(null)
  const [activeTab, setActiveTab] = useState<string>("generate")
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

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
    setShowAvatarPromptDialog(false)
    setShowThemeSelector(false)
    setInputValue(`create a video with my AI avatar using the ${themeId} theme`)
    highlightInput()
    // Reset states
    setAvatarPrompt("")
    setGeneratedAvatar(null)
  }

  const handleMakePodcast = () => {
    router.push(`/ai-chat?intent=podcast`)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setUploadedFile(file)
    }
  }

  const handleSubmit = () => {
    if (!inputValue) return

    // For translation, check if file is attached
    if (inputValue.toLowerCase().includes("translate") && selectedFile) {
      // Redirect to AI chat with file and translation intent
      router.push(`/ai-chat?intent=translate&hasFile=true`)
    } else if (inputValue.toLowerCase().includes("translate")) {
      // Redirect to AI chat with just translation intent
      router.push(`/ai-chat?intent=translate&hasFile=false`)
    } else {
      // For other cases like video maker, just pass the intent
      router.push(`/ai-chat?intent=video-maker`)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container flex h-14 items-center justify-between">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" className="gap-2">
                <span>Homepage</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48">
              <div className="grid gap-1">
                <Button
                  variant="ghost"
                  className="justify-start font-normal"
                  onClick={() => router.push('/')}
                >
                  Homepage
                </Button>
                <Button
                  variant="ghost"
                  className="justify-start font-normal"
                  onClick={() => router.push('/editor')}
                >
                  Editor
                </Button>
              </div>
            </PopoverContent>
          </Popover>
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
                setShowAvatarPromptDialog(true)
                setActiveTab("upload")
                setGeneratedAvatar(null)
                setShowThemeSelector(false)
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
                setActiveTab("generate")
                setGeneratedAvatar(null)
                setShowThemeSelector(false)
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
                setShowAvatarPromptDialog(true)
                setActiveTab("gallery")
                setGeneratedAvatar(null)
                setShowThemeSelector(false)
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
              Create AI Avatar Video
            </DialogTitle>
            <div className="flex items-center justify-center gap-8 pt-4 pb-4">
              <button 
                onClick={() => showThemeSelector && setShowThemeSelector(false)}
                className="flex items-center gap-3"
              >
                <div className={cn(
                  "h-12 w-12 rounded-full flex items-center justify-center text-xl font-semibold",
                  !showThemeSelector ? "bg-black text-white" : "bg-gray-200 text-gray-500"
                )}>
                  1
                </div>
                <span className={cn(
                  "text-sm font-medium",
                  !showThemeSelector ? "text-black" : "text-gray-500"
                )}>
                  Avatar
                </span>
              </button>
              <div className="flex items-center gap-3">
                <div className={cn(
                  "h-12 w-12 rounded-full flex items-center justify-center text-xl font-semibold",
                  showThemeSelector ? "bg-black text-white" : "bg-gray-200 text-gray-500"
                )}>
                  2
                </div>
                <span className={cn(
                  "text-sm font-medium",
                  showThemeSelector ? "text-black" : "text-gray-500"
                )}>
                  Theme
                </span>
              </div>
            </div>
          </DialogHeader>
          
          {!showThemeSelector ? (
            <Tabs defaultValue={activeTab} onValueChange={(value) => setActiveTab(value)} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="upload">
                  <PaperclipIcon className="h-4 w-4 mr-2" />
                  Upload
                </TabsTrigger>
                <TabsTrigger value="generate">
                  <Wand2 className="h-4 w-4 mr-2" />
                  Generate
                </TabsTrigger>
                <TabsTrigger value="gallery">
                  <User className="h-4 w-4 mr-2" />
                  Gallery
                </TabsTrigger>
              </TabsList>

              <TabsContent value="upload" className="mt-4">
                <div className="space-y-4">
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileUpload}
                  />
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="aspect-square max-w-[300px] mx-auto rounded-lg bg-gray-50 flex flex-col items-center justify-center p-8 border border-dashed cursor-pointer hover:bg-gray-100 transition-colors"
                  >
                    {uploadedFile ? (
                      <div className="relative w-full h-full">
                        <Image
                          src={URL.createObjectURL(uploadedFile)}
                          alt="Uploaded photo"
                          fill
                          className="object-cover rounded-lg"
                        />
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setUploadedFile(null)
                            if (fileInputRef.current) {
                              fileInputRef.current.value = ''
                            }
                          }}
                          className="absolute top-2 right-2 p-1 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
                        >
                          <X className="h-4 w-4 text-white" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <PaperclipIcon className="h-12 w-12 text-gray-400" />
                        <p className="mt-4 text-sm text-muted-foreground text-center">
                          Drop your photo here or click to upload
                        </p>
                      </>
                    )}
                  </div>
                  <Button 
                    className="w-full"
                    disabled={!uploadedFile}
                    onClick={() => {
                      // Handle avatar creation from uploaded photo
                      setIsGeneratingAvatar(true)
                      setTimeout(() => {
                        setIsGeneratingAvatar(false)
                        setGeneratedAvatar("https://images.unsplash.com/photo-1544502062-f82887f03d1c?w=800&auto=format&fit=crop&q=60")
                        setShowThemeSelector(true)
                      }, 3000)
                    }}
                  >
                    {uploadedFile ? 'Create Avatar' : 'Upload Photo'}
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="generate" className="mt-4">
                <div className="space-y-8">
                  {/* Preview area */}
                  <div className="aspect-square max-w-[300px] mx-auto rounded-lg bg-gray-50 flex flex-col items-center justify-center p-8 border border-dashed">
                    {isGeneratingAvatar ? (
                      <div className="flex flex-col items-center gap-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-gray-600" />
                        <p className="text-sm text-muted-foreground">Generating your avatar...</p>
                      </div>
                    ) : generatedAvatar ? (
                      <div className="relative w-full h-full">
                        <Image 
                          src={generatedAvatar} 
                          alt="Generated avatar"
                          className="object-cover rounded-lg"
                          fill
                          sizes="(max-width: 300px) 100vw, 300px"
                        />
                      </div>
                    ) : (
                      <>
                        <User className="h-12 w-12 text-gray-400" />
                        <p className="mt-4 text-sm text-muted-foreground text-center">
                          Your generated avatar will appear here
                        </p>
                      </>
                    )}
                  </div>

                  {/* Input form */}
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label htmlFor="prompt" className="text-sm font-medium">
                            Prompt
                          </label>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-auto p-0 text-sm text-muted-foreground hover:text-foreground"
                            onClick={() => {
                              const prompts = [
                                "A charismatic CEO in their 40s with a confident smile, wearing a modern suit, photorealistic style",
                                "A creative artist with vibrant blue hair and eccentric fashion, anime-inspired digital art style",
                                "A wise professor with silver hair and round glasses, wearing a tweed jacket, oil painting style",
                                "A friendly fitness trainer in athletic wear with an energetic expression, 3D rendered style",
                                "A tech-savvy developer with a casual hoodie and geometric glasses, cyberpunk neon style",
                                "A nature photographer with rugged outdoor gear and a adventurous look, watercolor artistic style",
                                "A professional chef in white uniform with a warm personality, cinematic portrait style",
                                "A fashion designer with avant-garde clothing and bold makeup, vector art style",
                                "A medical professional in scrubs with a compassionate smile, realistic 3D style",
                                "A musician with vintage-inspired style and artistic flair, hand-drawn sketch aesthetic"
                              ];
                              const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
                              setAvatarPrompt(randomPrompt);
                            }}
                          >
                            Surprise me
                          </Button>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="relative flex-1">
                            <Input
                              id="prompt"
                              placeholder="Example: A professional woman in her 30s with short brown hair wearing a blue blazer"
                              value={avatarPrompt}
                              onChange={(e) => setAvatarPrompt(e.target.value)}
                              className="h-auto py-2"
                            />
                          </div>
                          <Button
                            size="default"
                            variant="outline"
                            disabled={!avatarPrompt || isGeneratingAvatar}
                            onClick={handleGenerateAvatar}
                            className="h-10 flex items-center gap-1.5"
                          >
                            <Wand2 className={cn(
                              "h-4 w-4 transition-colors",
                              !avatarPrompt || isGeneratingAvatar ? "text-muted-foreground" : "text-foreground"
                            )} />
                            <span className={cn(
                              "transition-colors",
                              !avatarPrompt || isGeneratingAvatar ? "text-muted-foreground" : "text-foreground"
                            )}>
                              Generate
                            </span>
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Style presets section */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium">Style presets</h4>
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="grid grid-cols-4 gap-4">
                        {[
                          {
                            name: 'Cyberpunk',
                            image: '/images/cyberpunk-style.png',
                            style: 'cyberpunk style with neon lighting and futuristic elements'
                          },
                          {
                            name: 'Watercolor',
                            image: '/images/watercolor-style.png',
                            style: 'soft watercolor artistic style'
                          },
                          {
                            name: 'Miniature',
                            image: '/images/miniature-style.png',
                            style: '3D miniature character style'
                          },
                          {
                            name: 'Sketch',
                            image: '/images/sketch-style.png',
                            style: 'hand-drawn pencil sketch style'
                          }
                        ].map((style) => (
                          <button
                            key={style.name}
                            onClick={() => {
                              setAvatarPrompt(prev => {
                                const basePrompt = prev.split(',')[0]; // Get the part before any existing style
                                return `${basePrompt}, ${style.style}`;
                              });
                            }}
                            className="group relative aspect-[16/9] rounded-lg overflow-hidden"
                          >
                            <Image
                              src={style.image}
                              alt={style.name}
                              fill
                              className="object-cover transition-transform group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/40 transition-opacity group-hover:bg-black/50" />
                            <div className="absolute inset-0 flex items-end p-2">
                              <span className="text-sm font-medium text-white">{style.name}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button
                        disabled={!generatedAvatar}
                        onClick={() => setShowThemeSelector(true)}
                        className="w-full bg-black hover:bg-gray-800 text-white"
                      >
                        Continue
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="gallery" className="mt-4">
                <div className="grid grid-cols-3 gap-4">
                  {[
                    {
                      name: 'Professional',
                      image: 'https://images.unsplash.com/photo-1544502062-f82887f03d1c?w=800&auto=format&fit=crop&q=60'
                    },
                    {
                      name: 'Creative',
                      image: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800&auto=format&fit=crop&q=60'
                    },
                    {
                      name: 'Tech',
                      image: 'https://images.unsplash.com/photo-1555952517-2e8e729e0b44?w=800&auto=format&fit=crop&q=60'
                    },
                    {
                      name: 'Casual',
                      image: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?w=800&auto=format&fit=crop&q=60'
                    },
                    {
                      name: 'Elegant',
                      image: 'https://images.unsplash.com/photo-1544502062-f82887f03d1c?w=800&auto=format&fit=crop&q=60'
                    },
                    {
                      name: 'Artistic',
                      image: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800&auto=format&fit=crop&q=60'
                    },
                    {
                      name: 'Modern',
                      image: 'https://images.unsplash.com/photo-1555952517-2e8e729e0b44?w=800&auto=format&fit=crop&q=60'
                    },
                    {
                      name: 'Minimal',
                      image: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?w=800&auto=format&fit=crop&q=60'
                    },
                    {
                      name: 'Bold',
                      image: 'https://images.unsplash.com/photo-1544502062-f82887f03d1c?w=800&auto=format&fit=crop&q=60'
                    }
                  ].map((avatar, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setGeneratedAvatar(avatar.image)
                        setShowThemeSelector(true)
                      }}
                      className="group relative aspect-square rounded-lg overflow-hidden bg-gray-100 hover:bg-gray-200 transition-all hover:scale-105"
                    >
                      <Image
                        src={avatar.image}
                        alt={avatar.name}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 transition-opacity group-hover:bg-black/50" />
                      <div className="absolute inset-0 flex items-end p-2">
                        <span className="text-sm font-medium text-white">{avatar.name}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          ) : (
            <div className="space-y-6">
              <div className="aspect-square max-w-[300px] mx-auto relative rounded-lg overflow-hidden border mb-8">
                <Image 
                  src={generatedAvatar!} 
                  alt="Your avatar"
                  className="object-cover"
                  fill
                  sizes="(max-width: 300px) 100vw, 300px"
                />
              </div>
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
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSubmit()
                }
              }}
              className={cn(
                "h-auto py-4 text-lg rounded-2xl border-[#DADADA] hover:border-[#999999] focus-visible:ring-0 focus-visible:border-[#999999] shadow-[0_0_10px_rgba(0,0,0,0.05)]",
                "pr-14",
                isInputFlashing && "animate-highlight"
              )}
              style={{ paddingLeft: `${filePillWidth}px` }}
            />
            <TooltipProvider>
              <Tooltip open={showTooltip}>
                <TooltipTrigger asChild>
                  <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    <AttachMenu 
                      onFileSelect={setSelectedFile} 
                      onWidthChange={setFilePillWidth}
                    />
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
                onClick={handleSubmit}
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
              onClick={handleMakePodcast}
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
              onClick={() => router.push('/ai-chat?intent=video-maker')}
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

