'use client'

import { Button } from "@/components/ui/button"
import {
  ChevronDown,
  Home,
  Menu,
  Search,
  Bell,
  Play,
  Plus,
  Settings,
  PenTool,
  Layers,
  Split,
  Maximize2,
  User,
  FileText,
  Sliders,
  Grid,
  Type,
  Image as ImageIcon,
  Circle,
  Scissors,
  Video,
  MonitorSmartphone,
  Mic,
  Users,
  MicOff,
  Camera,
  CameraOff,
  Monitor,
  MonitorOff,
  Volume2,
  VolumeX,
  X,
  Layers3,
  MoveRight,
  ChevronRight,
  Square,
  MousePointer,
  Zap,
  Bookmark,
  Minus
} from "lucide-react"
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { cn } from "@/lib/utils"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { useState } from "react"
import Lottie from "lottie-react"
import newSceneAnimation from "../../public/animations/new-scene.json"
import newLayerAnimation from "../../public/animations/new-layer.json"
import overwriteAnimation from "../../public/animations/overwrite.json"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import * as DialogPrimitive from "@radix-ui/react-dialog"

export default function EditorPage() {
  const router = useRouter()
  const [selectedRecordingType, setSelectedRecordingType] = useState<string | null>(null)
  const [insertionMode, setInsertionMode] = useState<'new-scene' | 'new-layer' | 'overwrite' | null>(null)
  const [isRecordingMode, setIsRecordingMode] = useState(false)
  const [showScreenOptions, setShowScreenOptions] = useState(false)
  const [selectedSpeakers, setSelectedSpeakers] = useState<string[]>([])
  const [recordingConfig, setRecordingConfig] = useState({
    microphone: true,
    camera: true,
    screen: false,
    computerAudio: true
  })
  const [recordingMode, setRecordingMode] = useState<'new-layer' | 'insert-script'>('new-layer')
  
  // Recording state
  const [isRecording, setIsRecording] = useState(false)
  
  // Speaker detection dialog state
  const [showSpeakerDialog, setShowSpeakerDialog] = useState(false)
  const [speakerDialogStep, setSpeakerDialogStep] = useState<'detection' | 'naming' | 'skip-options'>('detection')
  const [detectedSpeakers, setDetectedSpeakers] = useState([
    { id: 1, name: 'Speaker 1', color: '#4F46E5', samples: 12 },
    { id: 2, name: 'Speaker 2', color: '#10B981', samples: 8 },
    { id: 3, name: 'Speaker 3', color: '#F59E0B', samples: 5 }
  ])
  const [currentSpeakerIndex, setCurrentSpeakerIndex] = useState(0)
  const [speakerLabelsOption, setSpeakerLabelsOption] = useState<'keep-unlabeled' | 'remove'>('keep-unlabeled')
  
  // Layout state
  const [selectedLayout, setSelectedLayout] = useState<string | null>(null)
  
  // Layout creation dialog state
  const [showLayoutCreation, setShowLayoutCreation] = useState(false)
  const [layoutCreationStep, setLayoutCreationStep] = useState<'name' | 'templates' | 'customize'>('name')
  const [newLayoutName, setNewLayoutName] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  
  // Layout gallery dialog state
  const [showLayoutGallery, setShowLayoutGallery] = useState(false)
  const [galleryTab, setGalleryTab] = useState<'my-layouts' | 'gallery'>('gallery')
  const [selectedGalleryLayout, setSelectedGalleryLayout] = useState<string | null>(null)

  // Add state for created layout packs
  const [myLayoutPacks, setMyLayoutPacks] = useState<Array<{id: string, name: string, template: string}>>([])
  // Add state for success message
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)

  // Add new state for desktop app promotion dialog
  const [showDesktopAppDialog, setShowDesktopAppDialog] = useState(false)

  // Add new state for the "don't show again" preference
  const [dontShowAgain, setDontShowAgain] = useState(false)

  // Add new state for the redirect dialog mode
  const [isRedirectMode, setIsRedirectMode] = useState(false)

  const handleRecordingChoice = (type: string) => {
    console.log(`Recording choice: ${type}`)
    
    // For collaborative recording, redirect to Descript Rooms
    if (type === 'collaborative') {
      window.location.href = 'https://staging-web.descript.com/room/3d5ea7e1-11db-4f42-beb6-bde73464a536';
      return;
    }
    
    setSelectedRecordingType(type)
    
    if (type === 'camera' || type === 'voice') {
      // For camera or voice recording, proceed directly to recording
      proceedWithRecording(type, null)
    }
    
    // Reset screen options view in case it was open
    setShowScreenOptions(false)
  }

  const handleScreenOptionChoice = (insertMode: 'new-scene' | 'new-layer') => {
    if (selectedRecordingType) {
      setInsertionMode(insertMode)
      proceedWithRecording(selectedRecordingType, insertMode)
    } else {
      // Direct entry into recording mode from screen options
      setIsRecordingMode(true)
      
      // Configure recording settings based on the selected option
      if (insertMode === 'new-layer') {
        // New Layer: Enable screen, disable mic and camera, set mode to new-layer
        setRecordingConfig({
          microphone: false,
          camera: false,
          screen: true,
          computerAudio: true
        })
        setRecordingMode('new-layer')
      } else if (insertMode === 'new-scene') {
        // Insert into Script: Enable screen, mic, and camera, set mode to insert-script
        setRecordingConfig({
          microphone: true,
          camera: true,
          screen: true,
          computerAudio: true
        })
        setRecordingMode('insert-script')
      }
      
      // Set default recording type for the split button
      setSelectedRecordingType('screen-overlay')
    }
    
    // Reset the screen options view
    setShowScreenOptions(false)
  }

  const proceedWithRecording = (type: string, insertMode: 'new-scene' | 'new-layer' | 'overwrite' | null) => {
    console.log(`Proceeding with recording: ${type}, insertMode: ${insertMode}`)
    setIsRecordingMode(true)
    
    // Configure recording settings based on the type and insertion mode
    if (type === 'screen-overlay') {
      if (insertMode === 'new-layer') {
        // New Layer: Enable screen, disable mic and camera
        setRecordingConfig({
          microphone: false,
          camera: false,
          screen: true,
          computerAudio: true
        })
        setRecordingMode('new-layer')
      } else if (insertMode === 'new-scene') {
        // Insert into Script: Enable screen, mic, and camera
        setRecordingConfig({
          microphone: true,
          camera: true,
          screen: true,
          computerAudio: true
        })
        setRecordingMode('insert-script')
      }
    } else {
      // Configure recording settings for other recording types
      setRecordingConfig(prev => ({
        ...prev,
        camera: type === 'camera',
        screen: type === 'screen-overlay',
        microphone: type === 'camera' || type === 'voice' || type === 'collaborative',
        computerAudio: type === 'screen-overlay'
      }))
      
      // Set recording mode based on type
      if (type === 'camera' || type === 'voice' || type === 'collaborative') {
        setRecordingMode('insert-script')
      }
    }
    
    // Reset dialog state
    setSelectedRecordingType(null)
    setInsertionMode(null)
    setShowScreenOptions(false)
  }

  // Handle start recording action
  const handleStartRecording = () => {
    setIsRecording(prev => !prev)
    console.log(isRecording ? 'Recording stopped' : 'Recording started')
    // Additional recording logic would go here
  }

  // Modify the handleScreenClick function
  const handleScreenClick = () => {
    // Show the desktop app promotion dialog instead of proceeding to recording
    setShowDesktopAppDialog(true);
  }

  // Add a function to go back from screen options to main recording options
  const handleBackFromScreenOptions = () => {
    setShowScreenOptions(false);
  }

  // Add function to handle layout pack creation
  const handleCreateLayoutPack = () => {
    if (selectedTemplate && newLayoutName.trim()) {
      // Create a new layout pack
      const newPack = {
        id: `custom-${Date.now()}`,
        name: newLayoutName.trim(),
        template: selectedTemplate
      };
      
      // Add to my layout packs
      setMyLayoutPacks(prev => [...prev, newPack]);
      
      // Close the creation dialog
      setShowLayoutCreation(false);
      
      // Show success message
      setShowSuccessMessage(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);
      
      // Open the gallery dialog and switch to My Layout Packs tab
      setShowLayoutGallery(true);
      setGalleryTab('my-layouts');
    }
  };

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
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Circle className="h-4 w-4" />
            </Button>
          </div>
          <div className="h-4 w-px bg-gray-200" />
          <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" className="gap-2">
                  <span>Editor</span>
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
      <div className="flex-1 flex flex-col">
        <div className="flex-1 flex">
          {/* Left Sidebar - Script */}
          <div className="w-1/2 border-r flex flex-col bg-white">
            <div className="border-b px-4 py-3">
              <h2 className="font-medium text-[13px]">Script</h2>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              <div className="flex items-start gap-2">
                <div>
                  <div 
                    className="text-[15px] font-medium text-green-600 mb-1 cursor-pointer hover:underline"
                    onClick={() => {
                      setShowSpeakerDialog(true)
                      setSpeakerDialogStep('detection')
                    }}
                  >
                    Andrew
                  </div>
                  <div className="text-[15px] text-gray-800 mb-1">CEO</div>
                  <div className="space-y-4 text-[15px] text-gray-800">
                    <p>Hey there, so I have a little job for you. I would like you to edit this video for me. I'm going to walk you through exactly what I want you to do and where.</p>
                    <p>Okay, part one. What I want you to do here in this part of the video right now is add one of those, uh, like lower thirds titles that shows my name. My name is Andrew Mason. My name should be showing still and I want you to, uh, also have my title, but make it so my title only shows up now. So that should have just animated in next to my name. And now you should have the whole thing go away.</p>
                    <p>Now I want you to add an intro card called Descript Demo. I just want a title thing that says Descript Demo for like three seconds before the camera stuff comes in.</p>
                    <p>Part three. Now I want you to add music. So I want you to find some stock music, put it in during the title card and have it like slowly fade out. As the title card ends and it goes into the actual speech.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Editor Area */}
          <div className="flex-1 flex flex-col">
            {/* Toolbar */}
            <div className="border-b flex items-center h-10 px-3">
              <Button variant="ghost" size="sm" className="h-7 gap-1.5 text-[13px] font-normal">
                <PenTool className="h-4 w-4" />
                Write
              </Button>
            </div>

            {/* Video Preview */}
            <div className="flex-1 bg-white p-8 flex flex-col justify-center">
              <div className="relative aspect-video w-full max-w-4xl mx-auto">
                <Image
                  src="/images/canvas-frame.png"
                  alt="Video frame"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              {/* Canvas Toolbar */}
              <div className="flex justify-center mt-2">
                <div className="flex items-center gap-1 bg-white border rounded-lg shadow-sm">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button 
                        variant="ghost" 
                        className="text-[13px] px-4 py-1.5 h-8 rounded-l-lg hover:bg-gray-50"
                      >
                        Layout
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[300px] p-4" align="center" side="left" alignOffset={0} sideOffset={16}>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-medium">Descript</h3>
                        <div className="flex items-center gap-2">
                          <Search className="h-4 w-4 text-gray-500" />
                          <Bell className="h-4 w-4 text-gray-500" />
                          <Menu className="h-4 w-4 text-gray-500" />
                        </div>
                      </div>

                      {/* Camera filter bar */}
                      <div className="flex items-center gap-2 mb-4 px-1">
                        <span className="text-xs text-gray-500">Camera:</span>
                        <div className="flex gap-1">
                          <button
                            onClick={() => setSelectedSpeakers(['all'])}
                            className={cn(
                              "px-2 py-0.5 rounded-full text-xs border transition-colors",
                              selectedSpeakers[0] === 'all'
                                ? "bg-blue-50 border-blue-200 text-blue-700" 
                                : "border-gray-200 text-gray-600 hover:border-gray-300"
                            )}
                          >
                            All
                          </button>
                          <button
                            onClick={() => setSelectedSpeakers(['andrew'])}
                            className={cn(
                              "px-2 py-0.5 rounded-full text-xs border transition-colors",
                              selectedSpeakers[0] === 'andrew'
                                ? "bg-blue-50 border-blue-200 text-blue-700" 
                                : "border-gray-200 text-gray-600 hover:border-gray-300"
                            )}
                          >
                            Andrew
                          </button>
                          <button
                            onClick={() => setSelectedSpeakers(['tyler'])}
                            className={cn(
                              "px-2 py-0.5 rounded-full text-xs border transition-colors",
                              selectedSpeakers[0] === 'tyler'
                                ? "bg-blue-50 border-blue-200 text-blue-700" 
                                : "border-gray-200 text-gray-600 hover:border-gray-300"
                            )}
                          >
                            Tyler
                          </button>
                        </div>
                      </div>
                      
                      <div className="h-[320px] overflow-y-auto pr-2">
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            { id: "camera-multi", name: "Camera (multi)", speakers: ['all'] },
                            { id: "media-multi", name: "Media (Multi)", speakers: ['all'] },
                            { id: "camera", name: "Camera", speakers: ['tyler', 'andrew'] },
                            { id: "overlay", name: "Overlay", speakers: ['tyler', 'andrew'] },
                            { id: "list", name: "List", speakers: ['tyler', 'andrew'] },
                            { id: "split", name: "Split", speakers: ['tyler', 'andrew'] },
                            { id: "minimal", name: "Minimal", speakers: ['tyler', 'andrew'] },
                            { id: "spotlight", name: "Spotlight", speakers: ['tyler', 'andrew'] },
                            { id: "sidekick", name: "Sidekick", speakers: ['tyler', 'andrew'] },
                            { id: "cascade", name: "Cascade", speakers: ['tyler', 'andrew'] }
                          ].filter(layout => {
                            if (selectedSpeakers[0] === 'all') return layout.speakers.includes('all');
                            if (selectedSpeakers.length === 0) return true;
                            return layout.speakers.includes(selectedSpeakers[0]);
                          }).map((layout) => (
                            <div 
                              key={layout.id}
                              className={cn(
                                "border rounded-lg p-2 cursor-pointer hover:border-blue-500 transition-colors",
                                selectedLayout === layout.id ? "border-blue-500 bg-blue-50" : ""
                              )}
                              onClick={() => {
                                setSelectedLayout(layout.id);
                                console.log(`Applying layout: ${layout.id}`);
                              }}
                            >
                              <div className="aspect-video bg-gray-100 rounded-md mb-1 overflow-hidden relative">
                                <img 
                                  src={
                                    layout.id === "camera-multi" ? "/images/layout-previews/camera-multi.png" :
                                    layout.id === "media-multi" ? "/images/layout-previews/media-multi.png" :
                                    layout.id === "camera" ? "/images/layout-previews/camera.png" :
                                    layout.id === "overlay" ? "/images/layout-previews/intro.png" :
                                    layout.id === "list" ? "/images/layout-previews/screen.png" :
                                    layout.id === "split" ? "/images/layout-previews/zoom.png" :
                                    `/images/canvas-frame.png`
                                  }
                                  alt={`${layout.name} layout`}
                                  className="w-full h-full object-cover"
                                />
                                {selectedSpeakers[0] === 'andrew' && layout.speakers.includes('andrew') && (
                                  <div className="absolute bottom-1 right-1 w-6 h-6 rounded-full border-2 border-white overflow-hidden shadow-sm">
                                    <img 
                                      src="/images/canvas-frame.png"
                                      alt="Andrew"
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                )}
                                {selectedSpeakers[0] === 'tyler' && layout.speakers.includes('tyler') && (
                                  <div className="absolute bottom-1 right-1 w-6 h-6 rounded-full border-2 border-white overflow-hidden shadow-sm">
                                    <img 
                                      src="/images/tyler-layout.png"
                                      alt="Tyler"
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                )}
                              </div>
                              <div className="font-medium text-xs text-center">{layout.name}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex justify-center mt-4">
                        <Button 
                          variant="outline" 
                          className="text-xs w-full"
                          onClick={() => {
                            setShowLayoutGallery(true);
                            setGalleryTab('gallery');
                            setSelectedGalleryLayout(null);
                          }}
                        >
                          Change layout pack
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>
                  <div className="w-px h-4 bg-gray-200" />
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button 
                        variant="ghost" 
                        className="text-[13px] px-4 py-1.5 h-8 hover:bg-gray-50 flex items-center gap-1.5"
                      >
                        <Camera className="h-4 w-4" />
                        Camera
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[240px] p-2" align="center">
                      <div className="flex flex-col">
                        <Button
                          variant="ghost"
                          className="justify-start font-normal h-9 px-3"
                          onClick={() => {
                            // Set canvas frame back to original
                            const previewImage = document.querySelector('.aspect-video.w-full img') as HTMLImageElement;
                            if (previewImage) {
                              previewImage.src = '/images/canvas-frame.png';
                            }
                          }}
                        >
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-blue-500" />
                            Andrew
                          </div>
                        </Button>
                        <Button
                          variant="ghost"
                          className="justify-start font-normal h-9"
                          onClick={() => {
                            // Update canvas frame to Tyler layout
                            const previewImage = document.querySelector('.aspect-video.w-full img') as HTMLImageElement;
                            if (previewImage) {
                              previewImage.src = '/images/tyler-layout.png';
                            }
                          }}
                        >
                          Tyler
                        </Button>
                        <div className="h-px bg-gray-200 my-1" />
                        <Button
                          variant="ghost"
                          className="justify-start font-normal h-9"
                          onClick={() => {
                            // Pre-select "All" filter in layout picker
                            setSelectedSpeakers(['all']);
                            // Close the camera popover and open layout popover
                            const cameraPopover = document.activeElement as HTMLButtonElement;
                            if (cameraPopover) {
                              cameraPopover.blur(); // This will close the camera popover
                            }
                            // Set a timeout to open the layout popover
                            setTimeout(() => {
                              setShowLayoutGallery(false); // Ensure layout gallery is closed
                              const layoutButton = document.querySelector('button.rounded-l-lg') as HTMLButtonElement;
                              if (layoutButton) {
                                layoutButton.click();
                              }
                            }, 150);
                          }}
                        >
                          Change to multicam layout...
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>
                  <div className="w-px h-4 bg-gray-200" />
                  <div className="flex items-center gap-2 px-4 py-1.5">
                    <span className="text-[13px]">Background</span>
                    <div className="w-4 h-4 rounded-full bg-black border border-gray-200" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="w-[52px] border-l flex flex-col">
            <div className="flex flex-col">
              {[
                { name: 'Underdord', icon: User },
                { name: 'Project', icon: FileText },
                { name: 'Properties', icon: Sliders },
                { name: 'Elements', icon: Grid },
                { name: 'Captions', icon: Type },
                { name: 'Stock', icon: ImageIcon }
              ].map((item, i) => {
                const Icon = item.icon
                return (
                  <Button
                    key={i}
                    variant="ghost"
                    className="h-12 w-12 flex items-center justify-center rounded-none hover:bg-gray-50"
                  >
                    <Icon className="h-4 w-4" />
                  </Button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Timeline - Now outside the flex container to be full width */}
        <div className="h-48 border-t bg-white flex flex-col">
          {/* Timeline Toolbar */}
          <div className="border-b h-10 px-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Bookmark className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Play className="h-4 w-4" />
              </Button>
              <div className="text-sm text-gray-600">
                00s / 40s
              </div>
              <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
                1x
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-7 gap-1.5">
                    <div className="relative flex items-center justify-center">
                      <div className="w-[14px] h-[14px] rounded-full bg-red-500" />
                      <div className="absolute inset-0 rounded-full border-2 border-red-500 opacity-30" />
                    </div>
                    <span className="text-xs text-black">Record</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[350px] p-0" align="start">
                  {!showScreenOptions ? (
                    // Main recording options screen
                    <>
                      <h3 className="text-lg font-medium mb-2 p-3">What would you like to record?</h3>
                      <div className="flex flex-col gap-1">
                        <button 
                          onClick={() => handleRecordingChoice('camera')}
                          className="flex items-center gap-3 p-1.5 rounded-lg hover:bg-gray-50 transition-colors text-left"
                        >
                          <div className="h-14 w-14 rounded-lg overflow-hidden flex-shrink-0">
                            <img src="/images/record-camera.png" alt="Camera" className="w-full h-full object-contain" />
                          </div>
                          <span className="text-sm font-medium">Camera</span>
                        </button>

                        <button 
                          onClick={() => setShowDesktopAppDialog(true)}
                          className="flex items-center gap-3 p-1.5 rounded-lg hover:bg-gray-50 transition-colors text-left"
                        >
                          <div className="h-14 w-14 rounded-lg overflow-hidden flex-shrink-0">
                            <img src="/images/record-screen.png" alt="Screen" className="w-full h-full object-contain" />
                          </div>
                          <span className="text-sm font-medium">Screen</span>
                        </button>

                        <button 
                          onClick={() => handleRecordingChoice('voice')}
                          className="flex items-center gap-3 p-1.5 rounded-lg hover:bg-gray-50 transition-colors text-left"
                        >
                          <div className="h-14 w-14 rounded-lg overflow-hidden flex-shrink-0">
                            <img src="/images/record-audio.png" alt="Audio only" className="w-full h-full object-contain" />
                          </div>
                          <span className="text-sm font-medium">Audio only</span>
                        </button>

                        <hr className="my-1 border-gray-200" />

                        <button 
                          onClick={() => handleRecordingChoice('collaborative')}
                          className="flex items-center gap-3 p-1.5 rounded-lg hover:bg-gray-50 transition-colors text-left"
                        >
                          <div className="h-14 w-14 rounded-lg overflow-hidden flex-shrink-0">
                            <img src="/images/record-rooms.png" alt="Record with others" className="w-full h-full object-contain" />
                          </div>
                          <span className="text-sm font-medium">Record with others</span>
                        </button>
                      </div>
                    </>
                  ) : (
                    // Screen options screen
                    <>
                      <div className="flex items-center mb-4">
                        <button 
                          onClick={handleBackFromScreenOptions}
                          className="flex items-center text-sm text-gray-600 hover:text-gray-900"
                        >
                          <ChevronDown className="h-4 w-4 transform rotate-90 mr-1" />
                          Back
                        </button>
                        <h3 className="text-lg font-medium flex-1 text-center pr-5">Screen Recording Options</h3>
                      </div>
                      
                      <div className="flex flex-col gap-3">
                        <button 
                          onClick={() => handleScreenOptionChoice('new-layer')}
                          className="flex items-center gap-4 p-3 w-full hover:bg-gray-50 transition-colors text-left border rounded-lg"
                        >
                          <div className="relative h-12 w-12 flex items-center justify-center flex-shrink-0">
                            <Monitor className="h-8 w-8 text-blue-500" />
                            <MicOff className="h-5 w-5 text-red-500 absolute -bottom-1 -right-1" />
                          </div>
                          <div>
                            <span className="text-sm font-medium">New Layer</span>
                            <p className="text-xs text-gray-500">Without audio</p>
                          </div>
                        </button>
                        
                        <button 
                          onClick={() => handleScreenOptionChoice('new-scene')}
                          className="flex items-center gap-4 p-3 w-full hover:bg-gray-50 transition-colors text-left border rounded-lg"
                        >
                          <div className="relative h-12 w-12 flex items-center justify-center flex-shrink-0">
                            <Monitor className="h-8 w-8 text-green-500" />
                            <Mic className="h-5 w-5 text-green-500 absolute -bottom-1 -right-1" />
                          </div>
                          <div>
                            <span className="text-sm font-medium">Insert into Script</span>
                            <p className="text-xs text-gray-500">With audio narration</p>
                          </div>
                        </button>
                      </div>
                    </>
                  )}
                </PopoverContent>
              </Popover>
              <Button variant="ghost" size="sm" className="h-7 gap-1.5 text-xs">
                <Split className="h-3.5 w-3.5" />
                Split
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Expand timeline</span>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Layers className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="text-sm">100%</span>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Timeline Content */}
          <div className="flex-1 p-2">
            <div className="flex items-center gap-2 h-full">
              <div className="flex-1 bg-white rounded border relative">
                {/* Time Ruler */}
                <div className="absolute top-0 left-0 right-0 h-6 flex items-center px-4">
                  <div className="flex-1 relative">
                    {Array.from({ length: 9 }).map((_, i) => (
                      <div key={i} className="absolute text-xs text-gray-500" style={{ left: `${i * 12.5}%` }}>
                        {i * 5}s
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Timeline content */}
                <div className="absolute top-6 left-0 right-0 bottom-0">
                  {/* Timeline content will go here */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Speaker Detection Dialog */}
      <Dialog open={showSpeakerDialog} onOpenChange={(open) => {
        if (!open) {
          // Reset dialog state when closing
          setSpeakerDialogStep('detection')
          setCurrentSpeakerIndex(0)
        }
        setShowSpeakerDialog(open)
      }}>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
          <DialogPrimitive.Content
            className={cn(
              "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] rounded-lg sm:max-w-[500px]"
            )}
          >
            <DialogHeader>
              <DialogTitle className="text-xl text-center">
                {speakerDialogStep === 'detection' && 'Multiple speakers detected!'}
                {speakerDialogStep === 'naming' && 'Name Your Speakers'}
                {speakerDialogStep === 'skip-options' && 'Speaker Label Options'}
              </DialogTitle>
            </DialogHeader>

            {speakerDialogStep === 'detection' && (
              <div className="space-y-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-700">
                    We've detected 3 different speakers in stalman-podcast.mp4. Would you like to name them now?
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {detectedSpeakers.map((speaker) => (
                    <div key={speaker.id} className="border rounded-lg p-3 text-center">
                      <div 
                        className="h-8 w-8 mx-auto rounded-full mb-2 flex items-center justify-center text-white text-sm font-medium"
                        style={{ backgroundColor: speaker.color }}
                      >
                        {speaker.id}
                      </div>
                      <p className="text-sm font-medium">{speaker.name}</p>
                      <p className="text-xs text-gray-500">{speaker.samples} samples</p>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between pt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setSpeakerDialogStep('skip-options')}
                  >
                    Skip
                  </Button>
                  <Button 
                    onClick={() => {
                      setSpeakerDialogStep('naming')
                      setCurrentSpeakerIndex(0)
                    }}
                  >
                    Name Speakers
                  </Button>
                </div>
              </div>
            )}

            {speakerDialogStep === 'naming' && (
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div 
                    className="h-12 w-12 rounded-full flex items-center justify-center text-white text-lg font-medium flex-shrink-0"
                    style={{ backgroundColor: detectedSpeakers[currentSpeakerIndex].color }}
                  >
                    {detectedSpeakers[currentSpeakerIndex].id}
                  </div>
                  <div className="flex-1">
                    <label className="text-sm font-medium mb-1 block">
                      Speaker {currentSpeakerIndex + 1} of {detectedSpeakers.length}
                    </label>
                    <input 
                      type="text"
                      className="w-full px-3 py-2 border rounded-md"
                      placeholder="Enter speaker name"
                      value={detectedSpeakers[currentSpeakerIndex].name}
                      onChange={(e) => {
                        const updatedSpeakers = [...detectedSpeakers];
                        updatedSpeakers[currentSpeakerIndex].name = e.target.value;
                        setDetectedSpeakers(updatedSpeakers);
                      }}
                    />
                  </div>
                </div>

                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">
                    Sample: <span className="italic">"I think we should focus on the user experience first."</span>
                  </p>
                </div>

                <div className="flex justify-between pt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      if (currentSpeakerIndex > 0) {
                        setCurrentSpeakerIndex(currentSpeakerIndex - 1);
                      } else {
                        setSpeakerDialogStep('detection');
                      }
                    }}
                  >
                    {currentSpeakerIndex > 0 ? 'Previous' : 'Back'}
                  </Button>
                  <Button 
                    onClick={() => {
                      if (currentSpeakerIndex < detectedSpeakers.length - 1) {
                        setCurrentSpeakerIndex(currentSpeakerIndex + 1);
                      } else {
                        setShowSpeakerDialog(false);
                      }
                    }}
                  >
                    {currentSpeakerIndex < detectedSpeakers.length - 1 ? 'Next' : 'Finish'}
                  </Button>
                </div>
              </div>
            )}

            {speakerDialogStep === 'skip-options' && (
              <div className="space-y-6">
                <p className="text-sm text-gray-600">
                  How would you like to handle the speaker labels in your script?
                </p>

                <div className="space-y-3">
                  <div 
                    className={`border rounded-lg p-4 cursor-pointer ${speakerLabelsOption === 'keep-unlabeled' ? 'border-blue-500 bg-blue-50' : ''}`}
                    onClick={() => setSpeakerLabelsOption('keep-unlabeled')}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`h-5 w-5 rounded-full border flex items-center justify-center ${speakerLabelsOption === 'keep-unlabeled' ? 'border-blue-500' : 'border-gray-300'}`}>
                        {speakerLabelsOption === 'keep-unlabeled' && (
                          <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                        )}
                      </div>
                      <div className="font-medium">Keep unlabeled speakers</div>
                    </div>
                    <p className="text-sm text-gray-600 mt-1 ml-8">
                      Keep generic labels like "Speaker 1", "Speaker 2", etc.
                    </p>
                  </div>

                  <div 
                    className={`border rounded-lg p-4 cursor-pointer ${speakerLabelsOption === 'remove' ? 'border-blue-500 bg-blue-50' : ''}`}
                    onClick={() => setSpeakerLabelsOption('remove')}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`h-5 w-5 rounded-full border flex items-center justify-center ${speakerLabelsOption === 'remove' ? 'border-blue-500' : 'border-gray-300'}`}>
                        {speakerLabelsOption === 'remove' && (
                          <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                        )}
                      </div>
                      <div className="font-medium">Remove speaker labels</div>
                    </div>
                    <p className="text-sm text-gray-600 mt-1 ml-8">
                      Remove all speaker labels from the transcript.
                    </p>
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setSpeakerDialogStep('detection')}
                  >
                    Back
                  </Button>
                  <Button 
                    onClick={() => setShowSpeakerDialog(false)}
                  >
                    Apply
                  </Button>
                </div>
              </div>
            )}
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </Dialog>

      {/* Layout Gallery Dialog */}
      <Dialog 
        open={showLayoutGallery} 
        onOpenChange={(open) => {
          if (!open) {
            // Reset dialog state when closing
            setGalleryTab('gallery')
            setSelectedGalleryLayout(null)
          }
          setShowLayoutGallery(open)
        }}
      >
        <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="w-[400px]">
              <Tabs value={galleryTab} onValueChange={(value) => setGalleryTab(value as 'my-layouts' | 'gallery')}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="my-layouts">My Layout Packs</TabsTrigger>
                  <TabsTrigger value="gallery">Gallery</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            
            <Button 
              onClick={() => {
                setShowLayoutGallery(false);
                setShowLayoutCreation(true);
                // Start with the templates step directly
                setLayoutCreationStep('templates');
                // Reset any previously selected template
                setSelectedTemplate(null);
                // Reset the layout name
                setNewLayoutName('');
              }}
              className="ml-4"
            >
              Create Your Own
            </Button>
          </div>
          
          {galleryTab === 'my-layouts' && (
            <div className="text-center py-8">
              {myLayoutPacks.length === 0 ? (
                <>
                  <p className="text-gray-500 mb-4">You haven't created any layout packs yet.</p>
                  <Button 
                    onClick={() => {
                      setShowLayoutGallery(false);
                      setShowLayoutCreation(true);
                      // Start with the templates step directly
                      setLayoutCreationStep('templates');
                      // Reset any previously selected template
                      setSelectedTemplate(null);
                      // Reset the layout name
                      setNewLayoutName('');
                    }}
                  >
                    Create Your First Layout Pack
                  </Button>
                </>
              ) : (
                <div className="grid grid-cols-3 gap-4">
                  {myLayoutPacks.map(pack => (
                    <div 
                      key={pack.id}
                      className={cn(
                        "border rounded-lg p-3 cursor-pointer hover:border-blue-500 transition-colors",
                        selectedGalleryLayout === pack.id ? "border-blue-500 bg-blue-50" : ""
                      )}
                      onClick={() => setSelectedGalleryLayout(pack.id)}
                    >
                      <div className="aspect-video bg-gray-100 rounded-md mb-2 overflow-hidden">
                        <img 
                          src={pack.template === "blank" 
                            ? "/images/record-audio.png" 
                            : `/images/layout-packs/${pack.template}.png`}
                          alt={`${pack.name} layout`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="font-medium text-sm">{pack.name}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          
          {galleryTab === 'gallery' && (
            <div className="grid grid-cols-3 gap-4">
              {[
                { id: 'default', name: 'Default' },
                { id: 'berlin-carrot', name: 'Berlin Carrot' },
                { id: 'helsinki-blue', name: 'Helsinki Blue' },
                { id: 'luxembourg-celery', name: 'Luxembourg Celery' },
                { id: 'libson-tofu', name: 'Libson Tofu' },
                { id: 'casablanca-clementine', name: 'Casablanca Clementine' }
              ].map((layout) => (
                <div 
                  key={layout.id}
                  className={cn(
                    "border rounded-lg p-3 cursor-pointer hover:border-blue-500 transition-colors",
                    selectedGalleryLayout === layout.id ? "border-blue-500 bg-blue-50" : ""
                  )}
                  onClick={() => setSelectedGalleryLayout(layout.id)}
                >
                  <div className="aspect-video bg-gray-100 rounded-md mb-2 overflow-hidden">
                    <img 
                      src={`/images/layout-packs/${layout.id}.png`}
                      alt={`${layout.name} layout`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="font-medium text-sm">{layout.name}</div>
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}