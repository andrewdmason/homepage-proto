'use client'

import { Button } from "@/components/ui/button"
import {
  ChevronDown,
  Home,
  Menu,
  Search,
  Bell,
  Plus,
  Settings,
  User,
  FileText,
  Link as LinkIcon,
  Mic,
  Image as ImageIcon,
  PaperclipIcon,
  Wand2,
  X
} from "lucide-react"
import { useRouter } from 'next/navigation'
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import Image from 'next/image'
import { useState, useRef } from "react"
import { cn } from "@/lib/utils"

export default function EditorBlankPage() {
  const router = useRouter()
  
  // Add AI Speaker dialog state
  const [showAISpeakerDialog, setShowAISpeakerDialog] = useState(false)
  const [selectedVoice, setSelectedVoice] = useState<string>('')
  const [showAvatarSetup, setShowAvatarSetup] = useState(false)
  const [activeTab, setActiveTab] = useState<string>("generate")
  const [avatarPrompt, setAvatarPrompt] = useState("")
  const [isGeneratingAvatar, setIsGeneratingAvatar] = useState(false)
  const [generatedAvatar, setGeneratedAvatar] = useState<string | null>(null)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Add voice options
  const voiceOptions = [
    { id: 'adam', name: 'Adam', description: 'Professional male voice' },
    { id: 'emily', name: 'Emily', description: 'Professional female voice' },
    { id: 'james', name: 'James', description: 'British male voice' },
    { id: 'sarah', name: 'Sarah', description: 'British female voice' },
    { id: 'michael', name: 'Michael', description: 'Casual male voice' },
    { id: 'sophia', name: 'Sophia', description: 'Casual female voice' }
  ]

  const handleGenerateAvatar = () => {
    setIsGeneratingAvatar(true)
    // Simulate API call
    setTimeout(() => {
      setIsGeneratingAvatar(false)
      setGeneratedAvatar("https://images.unsplash.com/photo-1544502062-f82887f03d1c?w=800&auto=format&fit=crop&q=60")
    }, 3000)
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setUploadedFile(file)
    }
  }

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Top Navigation */}
      <header className="border-b flex items-center h-12 px-4">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Menu className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Home className="h-4 w-4" />
            </Button>
          </div>
          <div className="h-4 w-px bg-gray-200" />
          <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" className="gap-2">
                  <span>Editor Blank Slate</span>
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
                  <Button
                    variant="ghost"
                    className="justify-start font-normal"
                    onClick={() => router.push('/editor-blank')}
                  >
                    Editor Blank Slate
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
            <span className="text-muted-foreground">/</span>
            <span>Project name</span>
          </div>
        </div>
        <div className="flex-1" />
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Search className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Bell className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Plus className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Settings className="h-4 w-4" />
          </Button>
          <Button size="sm" className="h-8 bg-black hover:bg-gray-800 text-white rounded px-3">
            Publish
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <User className="h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* Main Content - Upload Interface */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="max-w-xl w-full space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-semibold">Upload file</h1>
            <p className="text-sm text-gray-500">Click to browse or drag & drop a file here</p>
          </div>

          <div className="border-2 border-dashed border-gray-200 rounded-lg p-12 text-center space-y-6">
            <div className="flex justify-center gap-4">
              <Button className="h-10 px-4 gap-2">
                <FileText className="h-4 w-4" />
                Record
              </Button>
              <Button className="h-10 px-4 gap-2">
                <LinkIcon className="h-4 w-4" />
                Import from link
              </Button>
              <Button 
                className="h-10 px-4 gap-2"
                onClick={() => setShowAISpeakerDialog(true)}
              >
                <Mic className="h-4 w-4" />
                AI Speaker
              </Button>
            </div>
            <p className="text-sm text-gray-500">paste from clipboard or press Enter to continue with an empty script</p>
          </div>
        </div>
      </div>

      {/* AI Speaker Dialog */}
      <Dialog 
        open={showAISpeakerDialog} 
        onOpenChange={(open) => {
          if (!open) {
            setShowAvatarSetup(false)
            setActiveTab("generate")
            setGeneratedAvatar(null)
            setAvatarPrompt("")
            setUploadedFile(null)
          }
          setShowAISpeakerDialog(open)
        }}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Set Up AI Speaker</DialogTitle>
            <DialogDescription>
              Choose a voice for your AI speaker and optionally set up a visual avatar.
            </DialogDescription>
          </DialogHeader>

          {!showAvatarSetup ? (
            <div className="space-y-6 py-4">
              {/* Voice Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Select Voice</label>
                <select 
                  className="w-full px-3 py-2 border rounded-md bg-white"
                  value={selectedVoice}
                  onChange={(e) => setSelectedVoice(e.target.value)}
                >
                  <option value="">Choose a voice...</option>
                  {voiceOptions.map((voice) => (
                    <option key={voice.id} value={voice.id}>
                      {voice.name} - {voice.description}
                    </option>
                  ))}
                </select>
              </div>

              {/* Avatar Setup */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Visual Avatar (Optional)</label>
                <Button
                  variant="outline"
                  onClick={() => setShowAvatarSetup(true)}
                  className="w-full justify-start text-left"
                >
                  <ImageIcon className="h-4 w-4 mr-2" />
                  Set up avatar image
                </Button>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowAISpeakerDialog(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    // Handle saving AI speaker settings
                    setShowAISpeakerDialog(false)
                  }}
                  disabled={!selectedVoice}
                >
                  Create Speaker
                </Button>
              </DialogFooter>
            </div>
          ) : (
            <div className="space-y-6 py-4">
              <DialogHeader>
                <DialogTitle className="text-2xl">Create Your AI Avatar</DialogTitle>
                <DialogDescription className="pt-4">
                  Choose how you'd like to create your AI avatar
                </DialogDescription>
              </DialogHeader>

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
                          setShowAvatarSetup(false)
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
                                  "A tech-savvy developer with a casual hoodie and geometric glasses, cyberpunk neon style"
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

                      <Button
                        disabled={!generatedAvatar}
                        onClick={() => setShowAvatarSetup(false)}
                        className="w-full"
                      >
                        Use This Avatar
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="gallery" className="mt-4">
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { name: "Andrew", image: "/images/avatars/andrew.jpg", description: "Professional male with glasses in blue shirt" },
                      { name: "Tyler", image: "/images/avatars/tyler.jpg", description: "Professional male with beard and glasses in green shirt" },
                      { name: "Professional 1", image: "https://images.unsplash.com/photo-1544502062-f82887f03d1c?w=800&auto=format&fit=crop&q=60" },
                      { name: "Creative 1", image: "https://images.unsplash.com/photo-1544502062-f82887f03d1c?w=800&auto=format&fit=crop&q=60" },
                      { name: "Business 1", image: "https://images.unsplash.com/photo-1544502062-f82887f03d1c?w=800&auto=format&fit=crop&q=60" },
                      { name: "Casual 1", image: "https://images.unsplash.com/photo-1544502062-f82887f03d1c?w=800&auto=format&fit=crop&q=60" }
                    ].map((avatar, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setGeneratedAvatar(avatar.image)
                          setShowAvatarSetup(false)
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
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
} 