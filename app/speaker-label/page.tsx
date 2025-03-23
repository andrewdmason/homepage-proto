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
  ChevronRight,
  Wand2,
  MoreHorizontal,
  Play,
  Edit,
  User2,
  AudioLines,
  Upload,
  ImagePlus,
  Sparkles,
  Speech,
  Camera
} from "lucide-react"
import { useRouter } from 'next/navigation'
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { useState, useRef } from "react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent } from "@/components/ui/card"

interface AIVoice {
  type: 'clone' | 'library';
  verifiedAt: string;
  description: string;
  name?: string;
}

interface AIAvatar {
  type: 'upload' | 'generate' | 'gallery';
  image: string;
  previewImage: string;
}

interface Speaker {
  id: string;
  name: string;
  image: string;
  aiVoice?: AIVoice | null;
  aiAvatar?: AIAvatar | null;
}

export default function SpeakerLabelPage() {
  const router = useRouter()
  const [selectedSpeaker, setSelectedSpeaker] = useState<(typeof allAvailableSpeakers[0]) | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [newlySpeakers, setNewlySpeakers] = useState<Set<string>>(new Set())
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [newSpeakerName, setNewSpeakerName] = useState("")
  const [addAI, setAddAI] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showStandaloneVoiceSetup, setShowStandaloneVoiceSetup] = useState(false)
  const [showStandaloneAvatarSetup, setShowStandaloneAvatarSetup] = useState(false)
  const [editingSpeaker, setEditingSpeaker] = useState<typeof allAvailableSpeakers[0] | null>(null)
  const [editName, setEditName] = useState("")
  const [editColor, setEditColor] = useState("purple")
  const [hasAIVoice, setHasAIVoice] = useState(false)
  const [hasAIAvatar, setHasAIAvatar] = useState(false)
  const [showAISetupDialog, setShowAISetupDialog] = useState(false)
  const [setupStep, setSetupStep] = useState<'avatar' | 'voice'>('avatar')
  const [pendingSpeaker, setPendingSpeaker] = useState<{
    id: string;
    name: string;
    image: string;
  } | null>(null)
  const [voiceOption, setVoiceOption] = useState<'none' | 'clone' | 'library'>('none')
  const [avatarOption, setAvatarOption] = useState<'upload' | 'generate' | 'gallery'>('upload')
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [showAISelectionDialog, setShowAISelectionDialog] = useState(false)
  const [showLayoutPromptDialog, setShowLayoutPromptDialog] = useState(false)
  const [dontShowLayoutPrompt, setDontShowLayoutPrompt] = useState(false)

  // All available speakers with AI capabilities
  const allAvailableSpeakers = [
    { 
      id: 'andrew', 
      name: 'Andrew', 
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=64&h=64&fit=crop&crop=face',
      aiVoice: { 
        type: 'clone',
        verifiedAt: '2024-03-15T14:30:00Z',
        description: 'Verified voice clone from recording session'
      },
      aiAvatar: { 
        type: 'custom', 
        image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=256&h=256&fit=crop&crop=face',
        previewImage: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=512&h=512&fit=crop&crop=face'
      }
    },
    { 
      id: 'cedric', 
      name: 'Cedric', 
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face',
      aiVoice: { type: 'stock', name: 'James' },
      aiAvatar: null
    },
    { 
      id: 'lawrence', 
      name: 'Lawrence', 
      image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=64&h=64&fit=crop&crop=face',
      aiVoice: null,
      aiAvatar: { type: 'custom', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=64&h=64&fit=crop&crop=face' }
    },
    { 
      id: 'andrew-new', 
      name: 'Andrew New March 2025', 
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face',
      aiVoice: { type: 'stock', name: 'Michael' },
      aiAvatar: { type: 'custom', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face' }
    },
    { 
      id: 'lila', 
      name: 'Lila', 
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face',
      aiVoice: { type: 'clone' },
      aiAvatar: null
    },
    { 
      id: 'oscar', 
      name: 'Oscar', 
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face',
      aiVoice: { type: 'stock', name: 'David' },
      aiAvatar: { type: 'custom', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face' }
    },
    { 
      id: 'oscar-2', 
      name: 'Oscar 2', 
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=64&h=64&fit=crop&crop=face',
      aiVoice: null,
      aiAvatar: null
    },
    { 
      id: 'ramdy', 
      name: 'Ramdy', 
      image: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=64&h=64&fit=crop&crop=face',
      aiVoice: { type: 'stock', name: 'Thomas' },
      aiAvatar: null
    },
    { 
      id: 'robert', 
      name: 'Robert', 
      image: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=64&h=64&fit=crop&crop=face',
      aiVoice: { type: 'clone' },
      aiAvatar: { type: 'custom', image: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=64&h=64&fit=crop&crop=face' }
    },
    { 
      id: 'sebastian', 
      name: 'Sebastian', 
      image: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=64&h=64&fit=crop&crop=face',
      aiVoice: { type: 'stock', name: 'William' },
      aiAvatar: { type: 'custom', image: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=64&h=64&fit=crop&crop=face' }
    },
    { 
      id: 'vitts', 
      name: 'Vitts', 
      image: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=64&h=64&fit=crop&crop=face',
      aiVoice: null,
      aiAvatar: { type: 'custom', image: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=64&h=64&fit=crop&crop=face' }
    }
  ]

  const [projectSpeakers, setProjectSpeakers] = useState<typeof allAvailableSpeakers>([])

  // Filter speakers based on search term
  const filteredSpeakers = searchTerm 
    ? allAvailableSpeakers.filter(speaker => 
        speaker.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : null

  const handleCreateSpeaker = () => {
    const newSpeaker = {
      id: `new-${searchTerm.toLowerCase().replace(/\s+/g, '-')}`,
      name: searchTerm,
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face',
      aiVoice: null,
      aiAvatar: null
    }
    setProjectSpeakers(prev => [newSpeaker, ...prev])
    setSelectedSpeaker(newSpeaker)
    setNewlySpeakers(prev => new Set(prev).add(newSpeaker.id))
    setSearchTerm("")
    setIsOpen(false)
  }

  const handleSpeakerSelect = (speaker: typeof allAvailableSpeakers[0]) => {
    setSelectedSpeaker(speaker)
    setSearchTerm("")
    setIsOpen(false)
    // Add to project speakers if not already there
    if (!projectSpeakers.some(s => s.id === speaker.id)) {
      setProjectSpeakers(prev => [speaker, ...prev])
    }
  }

  const handleCreateSpeakerFromDialog = () => {
    const newSpeaker = {
      id: `new-${newSpeakerName.toLowerCase().replace(/\s+/g, '-')}`,
      name: newSpeakerName,
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face',
    }

    if (addAI) {
      setPendingSpeaker(newSpeaker)
      setShowCreateDialog(false)
      setShowAISetupDialog(true)
    } else {
      // Create speaker without AI capabilities
      setProjectSpeakers(prev => [
        { ...newSpeaker, aiVoice: null, aiAvatar: null },
        ...prev
      ])
      setSelectedSpeaker({ ...newSpeaker, aiVoice: null, aiAvatar: null })
      setNewSpeakerName("")
      setAddAI(false)
      setShowCreateDialog(false)
    }
  }

  const finalizeSpeakerCreation = (
    speaker: typeof pendingSpeaker,
    voiceType: 'none' | 'clone' | 'library',
    avatarType: 'upload' | 'generate' | 'gallery'
  ) => {
    if (!speaker) return

    const newSpeaker = {
      ...speaker,
      aiVoice: voiceType === 'none' ? null : { type: voiceType },
      aiAvatar: { type: avatarType, image: speaker.image }
    }

    // Update existing speaker if it exists, otherwise add as new
    setProjectSpeakers(prev => {
      const existingIndex = prev.findIndex(s => s.id === speaker.id);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = newSpeaker;
        return updated;
      }
      return [newSpeaker, ...prev];
    })

    setSelectedSpeaker(newSpeaker)
    setNewlySpeakers(prev => new Set(prev).add(newSpeaker.id))
    
    // Reset all states
    setNewSpeakerName("")
    setAddAI(false)
    setPendingSpeaker(null)
    setVoiceOption('none')
    setAvatarOption('upload')
    setShowAISetupDialog(false)
    setIsOpen(false)
  }

  const handleEditSpeaker = (speaker: typeof allAvailableSpeakers[0]) => {
    setEditingSpeaker(speaker)
    setEditName(speaker.name)
    setEditColor("purple") // Default color or get from speaker if implemented
    setHasAIVoice(newlySpeakers.has(speaker.id))
    setHasAIAvatar(newlySpeakers.has(speaker.id))
    setShowEditDialog(true)
  }

  const handleSaveEdit = () => {
    if (editingSpeaker) {
      setProjectSpeakers(prev => prev.map(s => 
        s.id === editingSpeaker.id 
          ? { ...s, name: editName }
          : s
      ))
      
      // Update AI capabilities
      if (hasAIVoice || hasAIAvatar) {
        setNewlySpeakers(prev => new Set(prev).add(editingSpeaker.id))
      } else {
        setNewlySpeakers(prev => {
          const next = new Set(prev)
          next.delete(editingSpeaker.id)
          return next
        })
      }

      // Update selected speaker if it's the one being edited
      if (selectedSpeaker?.id === editingSpeaker.id) {
        setSelectedSpeaker(prev => prev ? { ...prev, name: editName } : null)
      }
    }
    setShowEditDialog(false)
  }

  const handleStandaloneVoiceSetup = () => {
    if (editingSpeaker) {
      setPendingSpeaker({
        id: editingSpeaker.id,
        name: editingSpeaker.name,
        image: editingSpeaker.image
      });
      setShowEditDialog(false);
      setShowStandaloneVoiceSetup(true);
    }
  }

  const handleStandaloneAvatarSetup = () => {
    if (editingSpeaker) {
      setPendingSpeaker({
        id: editingSpeaker.id,
        name: editingSpeaker.name,
        image: editingSpeaker.image
      });
      setUploadedImage(editingSpeaker.image);
      setShowEditDialog(false);
      setShowStandaloneAvatarSetup(true);
    }
  }

  const finalizeStandaloneVoiceSetup = (
    speaker: Speaker | null,
    voiceType: 'none' | 'clone' | 'library'
  ) => {
    if (!speaker) return;

    const updatedSpeaker: Speaker = {
      ...speaker,
      aiVoice: voiceType === 'none' ? null : {
        type: voiceType,
        verifiedAt: new Date().toISOString(),
        description: voiceType === 'clone' ? 'Voice clone created' : 'Library voice selected'
      }
    };

    setProjectSpeakers(prev => {
      const existingIndex = prev.findIndex(s => s.id === speaker.id);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...prev[existingIndex],
          aiVoice: updatedSpeaker.aiVoice
        };
        return updated;
      }
      return prev;
    });

    if (selectedSpeaker?.id === speaker.id) {
      setSelectedSpeaker(prev => prev ? {
        ...prev,
        aiVoice: updatedSpeaker.aiVoice
      } : null);
    }

    setPendingSpeaker(null);
    setVoiceOption('none');
    setShowStandaloneVoiceSetup(false);
    setShowEditDialog(true);
  }

  const finalizeStandaloneAvatarSetup = (
    speaker: Speaker | null,
    avatarType: 'upload' | 'generate' | 'gallery'
  ) => {
    if (!speaker) return;

    const updatedSpeaker: Speaker = {
      ...speaker,
      aiAvatar: {
        type: avatarType,
        image: speaker.image,
        previewImage: speaker.image
      }
    };

    setProjectSpeakers(prev => {
      const existingIndex = prev.findIndex(s => s.id === speaker.id);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...prev[existingIndex],
          aiAvatar: updatedSpeaker.aiAvatar
        };
        return updated;
      }
      return prev;
    });

    if (selectedSpeaker?.id === speaker.id) {
      setSelectedSpeaker(prev => prev ? {
        ...prev,
        aiAvatar: updatedSpeaker.aiAvatar
      } : null);
    }

    setPendingSpeaker(null);
    setAvatarOption('upload');
    setUploadedImage(null);
    setShowStandaloneAvatarSetup(false);
    setShowEditDialog(true);
  }

  const renderBasicSpeakerItem = (speaker: typeof allAvailableSpeakers[0]): JSX.Element => (
    <div
      key={speaker.id}
      className="flex items-center gap-2 px-2 py-1.5 hover:bg-gray-100 rounded-md cursor-pointer"
      onClick={() => handleSpeakerSelect(speaker)}
    >
      <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden">
        {speaker.aiAvatar ? (
          <img 
            src={speaker.image} 
            alt={speaker.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <User2 className="h-4 w-4 text-gray-400" />
          </div>
        )}
      </div>
      <div className="flex-1 text-sm font-medium">{speaker.name}</div>
      {(speaker.aiVoice || speaker.aiAvatar) && (
        <div className="flex items-center">
          {speaker.aiVoice && speaker.aiAvatar ? (
            <Speech className="h-3.5 w-3.5 text-gray-400" />
          ) : speaker.aiAvatar ? (
            <User2 className="h-3.5 w-3.5 text-gray-400" />
          ) : (
            <AudioLines className="h-3.5 w-3.5 text-gray-400" />
          )}
        </div>
      )}
    </div>
  )

  const renderProjectSpeakerItem = (speaker: typeof allAvailableSpeakers[0]): JSX.Element => (
    <div
      key={speaker.id}
      className="flex items-center gap-2 px-2 py-1.5 hover:bg-gray-100 rounded-md cursor-pointer group"
    >
      <div
        className="flex-1 flex items-center gap-2"
        onClick={() => handleSpeakerSelect(speaker)}
      >
        <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden">
          {speaker.aiAvatar ? (
            <img 
              src={speaker.image} 
              alt={speaker.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <User2 className="h-4 w-4 text-gray-400" />
            </div>
          )}
        </div>
        <div className="flex-1 text-sm font-medium">{speaker.name}</div>
        {(speaker.aiVoice || speaker.aiAvatar) && (
          <div className="flex items-center">
            {speaker.aiVoice && speaker.aiAvatar ? (
              <Speech className="h-3.5 w-3.5 text-gray-400" />
            ) : speaker.aiAvatar ? (
              <User2 className="h-3.5 w-3.5 text-gray-400" />
            ) : (
              <AudioLines className="h-3.5 w-3.5 text-gray-400" />
            )}
          </div>
        )}
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          align="start" 
          side="right" 
          className="w-[200px]"
          alignOffset={-5}
          sideOffset={-5}
        >
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation()
              handleEditSpeaker(speaker)
            }}
          >
            Edit speaker...
          </DropdownMenuItem>
          <DropdownMenuItem>
            Merge with another speaker...
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-red-600"
            onClick={(e) => {
              e.stopPropagation();
              setProjectSpeakers(prev => prev.filter(s => s.id !== speaker.id));
              if (selectedSpeaker?.id === speaker.id) {
                setSelectedSpeaker(null);
              }
            }}
          >
            Remove from project
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )

  // Get non-project speakers
  const availableSpeakers = allAvailableSpeakers.filter(
    speaker => !projectSpeakers.some(ps => ps.id === speaker.id)
  )

  const handleFileUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      // TODO: Show error toast
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result
      if (typeof result === 'string') {
        setUploadedImage(result)
        if (pendingSpeaker) {
          setPendingSpeaker({
            ...pendingSpeaker,
            image: result
          })
        }
      }
    }
    reader.readAsDataURL(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0])
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleInsertAISpeaker = () => {
    if (projectSpeakers.length === 0) {
      setShowAISelectionDialog(true)
    } else {
      setIsOpen(true)
    }
  }

  const handleLayoutClick = () => {
    if (!selectedSpeaker) {
      setShowLayoutPromptDialog(true)
    }
    // Handle normal layout click if speaker exists
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
                  <span>Speaker Label Prototype</span>
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
                  <Button
                    variant="ghost"
                    className="justify-start font-normal"
                    onClick={() => router.push('/speaker-label')}
                  >
                    Speaker Label Prototype
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
            <span className="text-muted-foreground">/</span>
            <span>Speaker selection demo</span>
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

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-[80px] font-bold mb-16">Speaker selection demo</h1>
          
          {/* Canvas Section */}
          <div className="mb-8">
            <div className="aspect-video w-full bg-black rounded-lg overflow-hidden relative">
              {selectedSpeaker?.aiAvatar && (
                <img 
                  src={selectedSpeaker.aiAvatar.image} 
                  alt={selectedSpeaker.name}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <div className="flex items-center justify-center mt-4">
              <div className="inline-flex items-center bg-gray-50 rounded-full p-1">
                <Button 
                  variant="ghost" 
                  className="rounded-full text-sm"
                  onClick={handleLayoutClick}
                >
                  Layout
                </Button>
                <Button variant="ghost" className="rounded-full text-sm flex items-center gap-2">
                  <Camera className="h-4 w-4" />
                  Camera
                </Button>
                <Button variant="ghost" className="rounded-full text-sm">
                  Background
                </Button>
              </div>
            </div>
          </div>
          
          {/* Speaker Card */}
          <div className="border rounded-lg p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium">Andrew Mason-1</h2>
            </div>
            
            <div className="space-y-2 text-gray-600">
              <div className="flex items-center gap-2">
                <Popover open={isOpen} onOpenChange={setIsOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      className="h-8 px-0 text-gray-600 font-normal hover:bg-transparent group"
                    >
                      {selectedSpeaker ? (
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-purple-600">
                            {selectedSpeaker.name}
                          </span>
                        </div>
                      ) : (
                        "Assign speaker"
                      )}
                    </Button>
                  </PopoverTrigger>
                  {selectedSpeaker && newlySpeakers.has(selectedSpeaker.id) && (
                    <TooltipProvider delayDuration={0}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Wand2 
                            className="h-4 w-4 text-gray-400 cursor-pointer hover:text-gray-600 ml-2" 
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              // Set up pending speaker with all necessary info
                              setPendingSpeaker({
                                id: selectedSpeaker.id,
                                name: selectedSpeaker.name,
                                image: selectedSpeaker.image || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face'
                              });
                              // Reset AI setup states
                              setSetupStep('avatar');
                              setVoiceOption('none');
                              setAvatarOption('upload');
                              setUploadedImage(selectedSpeaker.image || null);
                              // Close dropdown and open AI setup dialog
                              setIsOpen(false);
                              setShowAISetupDialog(true);
                            }}
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Add AI to this speaker</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                  <PopoverContent className="w-[300px] p-0" align="start">
                    <div className="p-2">
                      <Input 
                        placeholder="Search speakers..." 
                        className="mb-2"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      
                      {!searchTerm ? (
                        <>
                          {/* Show all speakers in root if no project speakers, otherwise show project speakers */}
                          <div className="mb-4">
                            <div className="space-y-1">
                              {projectSpeakers.length === 0 
                                ? allAvailableSpeakers.map(renderBasicSpeakerItem)
                                : projectSpeakers.map(renderProjectSpeakerItem)
                              }
                            </div>
                          </div>

                          {/* Only show More Speakers if we have project speakers and available speakers */}
                          {projectSpeakers.length > 0 && availableSpeakers.length > 0 && (
                            <div className="border-t">
                              <div className="px-2 py-1.5">
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <div
                                      onMouseEnter={(e) => {
                                        const target = e.currentTarget.querySelector('button');
                                        if (target) target.click();
                                      }}
                                    >
                                      <Button
                                        variant="ghost"
                                        className="w-full justify-between text-sm font-normal"
                                      >
                                        <span>More speakers</span>
                                        <ChevronRight className="h-4 w-4 text-gray-400" />
                                      </Button>
                                    </div>
                                  </PopoverTrigger>
                                  <PopoverContent 
                                    className="w-[200px] p-1" 
                                    align="start" 
                                    side="right"
                                    alignOffset={-5}
                                    sideOffset={-5}
                                    onMouseLeave={(e) => {
                                      if (!e.relatedTarget || !e.currentTarget.contains(e.relatedTarget as Node)) {
                                        const trigger = document.querySelector('[role="dialog"]');
                                        if (trigger) trigger.parentElement?.querySelector('button')?.click();
                                      }
                                    }}
                                  >
                                    <div className="space-y-1">
                                      {availableSpeakers.map(renderBasicSpeakerItem)}
                                    </div>
                                  </PopoverContent>
                                </Popover>
                              </div>
                            </div>
                          )}

                          {/* Create New Speaker Button */}
                          <div className={projectSpeakers.length > 0 ? "border-t" : ""}>
                            <div className="px-2 py-1.5">
                              <Button
                                variant="ghost"
                                className="w-full justify-start text-sm font-normal"
                                onClick={() => setShowCreateDialog(true)}
                              >
                                Create new speaker
                              </Button>
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          {/* Filtered Results */}
                          <div className="mb-4">
                            <div className="space-y-1">
                              {filteredSpeakers?.map(speaker => {
                                return renderProjectSpeakerItem(speaker);
                              })}
                            </div>
                          </div>

                          {/* Create New Speaker Option */}
                          <div className="border-t">
                            <div className="px-2 py-1.5">
                              <Button
                                variant="ghost"
                                className="w-full justify-start text-sm font-normal"
                                onClick={handleCreateSpeaker}
                              >
                                Create speaker "{searchTerm}"
                              </Button>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
              <div className="text-sm">
                Hey everyone, this is Avery, your favorite YouTuber covering video tools for businesses and the ever changing landscape. Here doing my year in review and my pick for the best video tool for businesses for 2025 goes to Descript.
              </div>
              <div className="flex items-center gap-4">
                <Button variant="ghost" className="flex items-center gap-2 text-gray-400 px-0 hover:bg-transparent">
                  <Upload className="h-4 w-4" />
                  Add file
                </Button>
                <Button variant="ghost" className="flex items-center gap-2 text-gray-400 px-0 hover:bg-transparent">
                  <span className="h-2 w-2 rounded-full bg-gray-400" />
                  Record
                </Button>
                <Button 
                  variant="ghost" 
                  className="flex items-center gap-2 text-gray-400 px-0 hover:bg-transparent"
                  onClick={handleInsertAISpeaker}
                >
                  <Speech className="h-4 w-4" />
                  Insert AI speaker
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create Speaker Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create new speaker</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="speaker-name">Speaker name</Label>
              <Input
                id="speaker-name"
                placeholder="Enter speaker name"
                value={newSpeakerName}
                onChange={(e) => setNewSpeakerName(e.target.value)}
              />
            </div>
            <div className="flex items-start space-x-2">
              <Checkbox 
                id="ai-speaker" 
                checked={addAI} 
                onCheckedChange={(checked: boolean | 'indeterminate') => setAddAI(checked as boolean)}
              />
              <div className="grid gap-1.5 leading-none">
                <Label 
                  htmlFor="ai-speaker" 
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Add AI to speaker
                </Label>
                <p className="text-sm text-muted-foreground">
                  Enable AI voice and avatar generation for this speaker to create synthetic audio and video content
                </p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleCreateSpeakerFromDialog}
              disabled={!newSpeakerName.trim()}
            >
              {addAI ? "Continue" : "Create speaker"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Speaker Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit speaker</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Speaker name</Label>
              <Input
                id="edit-name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Enter speaker name"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Label color</Label>
              <Select value={editColor} onValueChange={setEditColor}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="purple">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-purple-600" />
                      <span>Purple</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="blue">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-blue-600" />
                      <span>Blue</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="green">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-green-600" />
                      <span>Green</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="red">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-red-600" />
                      <span>Red</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>AI Voice</Label>
                {editingSpeaker?.aiVoice ? (
                  <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-md">
                    <div className="flex-1">
                      {editingSpeaker.aiVoice.type === 'clone' ? (
                        <div className="space-y-1">
                          <div className="text-sm font-medium flex items-center gap-2">
                            <span>Verified Voice Clone</span>
                            <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                              Verified
                            </span>
                          </div>
                          {'verifiedAt' in editingSpeaker.aiVoice && editingSpeaker.aiVoice.verifiedAt && (
                            <div className="text-xs text-muted-foreground">
                              Recorded on {new Date(editingSpeaker.aiVoice.verifiedAt).toLocaleDateString()}
                            </div>
                          )}
                          {'description' in editingSpeaker.aiVoice && (
                            <div className="text-sm text-muted-foreground">
                              {editingSpeaker.aiVoice.description}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-sm font-medium">
                          Stock voice: {editingSpeaker.aiVoice.name}
                        </div>
                      )}
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Play className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={handleStandaloneVoiceSetup}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <Button 
                    variant="outline" 
                    className="w-full justify-start text-muted-foreground"
                    onClick={handleStandaloneVoiceSetup}
                  >
                    Set up AI voice
                  </Button>
                )}
              </div>

              <div className="space-y-2">
                <Label>AI Avatar</Label>
                {editingSpeaker?.aiAvatar ? (
                  <div className="space-y-3 p-3 bg-gray-50 rounded-md">
                    <div className="aspect-video w-full relative rounded-md overflow-hidden bg-gray-100">
                      <img 
                        src={editingSpeaker.aiAvatar.previewImage || editingSpeaker.aiAvatar.image} 
                        alt={editingSpeaker.name}
                        className="w-full h-full object-cover"
                      />
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 absolute top-2 right-2 bg-black/50 hover:bg-black/60"
                        onClick={handleStandaloneAvatarSetup}
                      >
                        <Edit className="h-4 w-4 text-white" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                        <img 
                          src={editingSpeaker.aiAvatar.image} 
                          alt={editingSpeaker.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium">
                          AI Avatar
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Generated from profile photo
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <Button 
                    variant="outline" 
                    className="w-full justify-start text-muted-foreground"
                    onClick={handleStandaloneAvatarSetup}
                  >
                    Set up AI avatar
                  </Button>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSaveEdit}
              disabled={!editName.trim()}
            >
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* AI Setup Dialog */}
      <Dialog 
        open={showAISetupDialog} 
        onOpenChange={(open) => {
          if (!open) {
            setSetupStep('avatar')
            setPendingSpeaker(null)
            setVoiceOption('none')
            setAvatarOption('upload')
          }
          setShowAISetupDialog(open)
        }}
      >
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {setupStep === 'avatar' ? 'Setup AI Speaker' : 'Set up AI Voice'}
            </DialogTitle>
          </DialogHeader>

          {/* Wizard Progress Steps */}
          <div className="flex items-center gap-4 px-2">
            <div className="flex items-center gap-2 flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                setupStep === 'avatar' ? 'bg-black text-white' : 'bg-gray-100 text-gray-500'
              }`}>
                1
              </div>
              <span className={setupStep === 'avatar' ? 'text-black font-medium' : 'text-gray-500'}>Avatar</span>
            </div>
            <div className="flex items-center gap-2 flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                setupStep === 'voice' ? 'bg-black text-white' : 'bg-gray-100 text-gray-500'
              }`}>
                2
              </div>
              <span className={setupStep === 'voice' ? 'text-black font-medium' : 'text-gray-500'}>Voice</span>
            </div>
          </div>
          
          {setupStep === 'avatar' ? (
            <div className="grid gap-6 py-4">
              <div className="space-y-6">
                <div 
                  className="border-2 border-dashed border-gray-200 rounded-lg p-12 text-center hover:border-gray-300 transition-colors cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                >
                  <input 
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        handleFileUpload(e.target.files[0])
                      }
                    }}
                  />
                  <div className="mx-auto w-full max-w-[400px] aspect-[4/3] bg-gray-50 rounded-md mb-4 flex flex-col items-center justify-center relative">
                    {uploadedImage ? (
                      <img 
                        src={uploadedImage} 
                        alt="Uploaded preview"
                        className="w-full h-full object-cover rounded-md"
                      />
                    ) : (
                      <>
                        <Upload className="h-8 w-8 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-600">Drop your photo here or click to upload</p>
                      </>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">
                    {uploadedImage 
                      ? "Add a style to this photo" 
                      : "Upload a clear photo of your face to create an AI avatar"
                    }
                  </p>
                </div>

                <div className="text-center space-y-2">
                  <p className="text-sm text-gray-500">Don't have a photo?</p>
                  <div className="space-x-2 text-sm">
                    <button 
                      className="text-purple-600 hover:underline"
                      onClick={() => setAvatarOption('gallery')}
                    >
                      Pick from our avatar gallery
                    </button>
                    <span className="text-gray-400">or</span>
                    <button 
                      className="text-purple-600 hover:underline"
                      onClick={() => setAvatarOption('generate')}
                    >
                      generate an avatar from a text prompt
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid gap-6 py-4">
              <div className="space-y-4">
                <RadioGroup value={voiceOption} onValueChange={(v: string) => setVoiceOption(v as 'none' | 'clone' | 'library')}>
                  <div className="grid grid-cols-3 gap-4">
                    <Card className="cursor-pointer relative">
                      <RadioGroupItem value="clone" id="voice-clone" className="sr-only" />
                      <Label htmlFor="voice-clone" className="cursor-pointer">
                        <CardContent className="pt-6 pb-4 flex flex-col items-center gap-2">
                          <AudioLines className="h-8 w-8 text-purple-600" />
                          <div className="text-sm font-medium">Clone your voice</div>
                          <div className="text-xs text-center text-muted-foreground">Record samples to create your voice clone</div>
                        </CardContent>
                      </Label>
                    </Card>
                    <Card className="cursor-pointer relative">
                      <RadioGroupItem value="library" id="voice-library" className="sr-only" />
                      <Label htmlFor="voice-library" className="cursor-pointer">
                        <CardContent className="pt-6 pb-4 flex flex-col items-center gap-2">
                          <AudioLines className="h-8 w-8 text-blue-600" />
                          <div className="text-sm font-medium">Voice library</div>
                          <div className="text-xs text-center text-muted-foreground">Choose from our collection of AI voices</div>
                        </CardContent>
                      </Label>
                    </Card>
                    <Card className="cursor-pointer relative">
                      <RadioGroupItem value="none" id="voice-none" className="sr-only" />
                      <Label htmlFor="voice-none" className="cursor-pointer">
                        <CardContent className="pt-6 pb-4 flex flex-col items-center gap-2">
                          <AudioLines className="h-8 w-8 text-gray-400" />
                          <div className="text-sm font-medium">No AI voice</div>
                          <div className="text-xs text-center text-muted-foreground">Skip AI voice setup for now</div>
                        </CardContent>
                      </Label>
                    </Card>
                  </div>
                </RadioGroup>
              </div>
            </div>
          )}

          <DialogFooter>
            {setupStep === 'avatar' ? (
              <>
                <Button variant="outline" onClick={() => {
                  // Create speaker without AI capabilities
                  if (pendingSpeaker) {
                    setProjectSpeakers(prev => [
                      { ...pendingSpeaker, aiVoice: null, aiAvatar: null },
                      ...prev
                    ])
                    setSelectedSpeaker({ ...pendingSpeaker, aiVoice: null, aiAvatar: null })
                  }
                  setNewSpeakerName("")
                  setAddAI(false)
                  setPendingSpeaker(null)
                  setShowAISetupDialog(false)
                }}>
                  Don't add an avatar for now
                </Button>
                <Button 
                  onClick={() => setSetupStep('voice')}
                  disabled={!pendingSpeaker}
                >
                  Continue
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={() => setSetupStep('avatar')}>
                  Back
                </Button>
                <Button 
                  onClick={() => finalizeSpeakerCreation(pendingSpeaker, voiceOption, avatarOption)}
                  disabled={!pendingSpeaker}
                >
                  Create speaker
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Standalone Voice Setup Dialog */}
      <Dialog 
        open={showStandaloneVoiceSetup} 
        onOpenChange={(open) => {
          if (!open) {
            setPendingSpeaker(null)
            setVoiceOption('none')
            setShowStandaloneVoiceSetup(false)
            setShowEditDialog(true)
          }
        }}
      >
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Set up AI Voice</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-6 py-4">
            <div className="space-y-4">
              <RadioGroup value={voiceOption} onValueChange={(v: string) => setVoiceOption(v as 'none' | 'clone' | 'library')}>
                <div className="grid grid-cols-3 gap-4">
                  <Card className="cursor-pointer relative">
                    <RadioGroupItem value="clone" id="voice-clone" className="sr-only" />
                    <Label htmlFor="voice-clone" className="cursor-pointer">
                      <CardContent className="pt-6 pb-4 flex flex-col items-center gap-2">
                        <AudioLines className="h-8 w-8 text-purple-600" />
                        <div className="text-sm font-medium">Clone your voice</div>
                        <div className="text-xs text-center text-muted-foreground">Record samples to create your voice clone</div>
                      </CardContent>
                    </Label>
                  </Card>
                  <Card className="cursor-pointer relative">
                    <RadioGroupItem value="library" id="voice-library" className="sr-only" />
                    <Label htmlFor="voice-library" className="cursor-pointer">
                      <CardContent className="pt-6 pb-4 flex flex-col items-center gap-2">
                        <AudioLines className="h-8 w-8 text-blue-600" />
                        <div className="text-sm font-medium">Voice library</div>
                        <div className="text-xs text-center text-muted-foreground">Choose from our collection of AI voices</div>
                      </CardContent>
                    </Label>
                  </Card>
                  <Card className="cursor-pointer relative">
                    <RadioGroupItem value="none" id="voice-none" className="sr-only" />
                    <Label htmlFor="voice-none" className="cursor-pointer">
                      <CardContent className="pt-6 pb-4 flex flex-col items-center gap-2">
                        <AudioLines className="h-8 w-8 text-gray-400" />
                        <div className="text-sm font-medium">No AI voice</div>
                        <div className="text-xs text-center text-muted-foreground">Remove AI voice</div>
                      </CardContent>
                    </Label>
                  </Card>
                </div>
              </RadioGroup>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowStandaloneVoiceSetup(false)
              setShowEditDialog(true)
            }}>
              Cancel
            </Button>
            <Button 
              onClick={() => finalizeStandaloneVoiceSetup(pendingSpeaker, voiceOption)}
              disabled={!pendingSpeaker}
            >
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Standalone Avatar Setup Dialog */}
      <Dialog 
        open={showStandaloneAvatarSetup} 
        onOpenChange={(open) => {
          if (!open) {
            setPendingSpeaker(null)
            setAvatarOption('upload')
            setUploadedImage(null)
            setShowStandaloneAvatarSetup(false)
            setShowEditDialog(true)
          }
        }}
      >
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Set up AI Avatar</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-6 py-4">
            <div className="space-y-6">
              <div 
                className="border-2 border-dashed border-gray-200 rounded-lg p-12 text-center hover:border-gray-300 transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
              >
                <input 
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      handleFileUpload(e.target.files[0])
                    }
                  }}
                />
                <div className="mx-auto w-full max-w-[400px] aspect-[4/3] bg-gray-50 rounded-md mb-4 flex flex-col items-center justify-center relative">
                  {uploadedImage ? (
                    <img 
                      src={uploadedImage} 
                      alt="Uploaded preview"
                      className="w-full h-full object-cover rounded-md"
                    />
                  ) : (
                    <>
                      <Upload className="h-8 w-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600">Drop your photo here or click to upload</p>
                    </>
                  )}
                </div>
                <p className="text-sm text-gray-500">
                  {uploadedImage 
                    ? "Add a style to this photo" 
                    : "Upload a clear photo of your face to create an AI avatar"
                  }
                </p>
              </div>

              <div className="text-center space-y-2">
                <p className="text-sm text-gray-500">Don't have a photo?</p>
                <div className="space-x-2 text-sm">
                  <button 
                    className="text-purple-600 hover:underline"
                    onClick={() => setAvatarOption('gallery')}
                  >
                    Pick from our avatar gallery
                  </button>
                  <span className="text-gray-400">or</span>
                  <button 
                    className="text-purple-600 hover:underline"
                    onClick={() => setAvatarOption('generate')}
                  >
                    generate an avatar from a text prompt
                  </button>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowStandaloneAvatarSetup(false)
              setShowEditDialog(true)
            }}>
              Cancel
            </Button>
            <Button 
              onClick={() => finalizeStandaloneAvatarSetup(pendingSpeaker, avatarOption)}
              disabled={!pendingSpeaker}
            >
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* AI Speaker Selection Dialog */}
      <Dialog open={showAISelectionDialog} onOpenChange={setShowAISelectionDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Select AI Speaker</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-4">
              {/* Show available AI speakers */}
              <div className="space-y-1">
                {allAvailableSpeakers
                  .filter(s => (s.aiVoice || s.aiAvatar) && !projectSpeakers.some(ps => ps.id === s.id))
                  .map(speaker => (
                    <div
                      key={speaker.id}
                      className="flex items-center gap-2 px-2 py-1.5 hover:bg-gray-100 rounded-md cursor-pointer"
                      onClick={() => {
                        handleSpeakerSelect(speaker)
                        setShowAISelectionDialog(false)
                      }}
                    >
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden">
                        {speaker.aiAvatar ? (
                          <img 
                            src={speaker.image} 
                            alt={speaker.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <User2 className="h-4 w-4 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 text-sm font-medium">{speaker.name}</div>
                      {(speaker.aiVoice || speaker.aiAvatar) && (
                        <div className="flex items-center">
                          {speaker.aiVoice && speaker.aiAvatar ? (
                            <Speech className="h-3.5 w-3.5 text-gray-400" />
                          ) : speaker.aiAvatar ? (
                            <User2 className="h-3.5 w-3.5 text-gray-400" />
                          ) : (
                            <AudioLines className="h-3.5 w-3.5 text-gray-400" />
                          )}
                        </div>
                      )}
                    </div>
                  ))}
              </div>

              {/* Create New AI Speaker Button */}
              <div className="border-t pt-4">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-sm font-normal"
                  onClick={() => {
                    // Create a temporary speaker
                    const tempSpeaker = {
                      id: `new-${Date.now()}`,
                      name: "New AI Speaker",
                      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face',
                    }
                    setPendingSpeaker(tempSpeaker)
                    setShowAISelectionDialog(false)
                    setShowAISetupDialog(true)
                    setSetupStep('avatar')
                  }}
                >
                  Create new AI speaker
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Layout Prompt Dialog */}
      <Dialog open={showLayoutPromptDialog} onOpenChange={setShowLayoutPromptDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add an avatar to your video?</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-gray-600">
              Would you like to add an AI-powered avatar to appear in your video? This will help create a more engaging visual experience for your viewers.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowLayoutPromptDialog(false)}>
              Not now
            </Button>
            <Button 
              onClick={() => {
                setShowLayoutPromptDialog(false)
                if (projectSpeakers.length === 0) {
                  setShowAISelectionDialog(true)
                } else {
                  setIsOpen(true)
                }
              }}
            >
              Add avatar
            </Button>
          </DialogFooter>
          <div className="flex items-center space-x-2 pt-4 border-t">
            <Checkbox 
              id="dont-ask-again" 
              checked={dontShowLayoutPrompt}
              onCheckedChange={(checked) => setDontShowLayoutPrompt(checked as boolean)}
            />
            <label
              htmlFor="dont-ask-again"
              className="text-sm text-muted-foreground"
            >
              Don't ask me again
            </label>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
} 