'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState, Suspense, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from 'next/navigation'
import { 
  PaperclipIcon, 
  SendHorizontal, 
  Upload, 
  Users, 
  Mic, 
  Video,
  ArrowLeft,
  FileAudio,
  Calendar,
  Play,
  Clock,
  CheckCircle2,
  Wand2,
  X,
  Bot,
  Loader2,
  ChevronDown,
  FileIcon,
  Layers
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Add TypedText component for animated text
function TypedText({ content, className }: { content: string, className?: string }) {
  const [displayedContent, setDisplayedContent] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  
  useEffect(() => {
    setDisplayedContent('');
    setIsComplete(false);
    
    let index = 0;
    // Speed of typing animation (lower = faster)
    const typingSpeed = 15;
    
    const timer = setInterval(() => {
      if (index < content.length) {
        setDisplayedContent(prev => prev + content.charAt(index));
        index++;
      } else {
        clearInterval(timer);
        setIsComplete(true);
      }
    }, typingSpeed);
    
    return () => clearInterval(timer);
  }, [content]);
  
  return (
    <div className={className}>
      {displayedContent}
      {!isComplete && <span className="inline-block w-1 h-4 ml-0.5 bg-blue-500 animate-pulse"></span>}
    </div>
  );
}

function ChatContent() {
  const searchParams = useSearchParams()
  const intent = searchParams.get('intent')
  const hasFile = searchParams.get('hasFile') === 'true'
  const router = useRouter()
  
  const [messages, setMessages] = useState<Array<{role: 'user' | 'assistant', content: string}>>([])
  const [inputValue, setInputValue] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [transcriptionProgress, setTranscriptionProgress] = useState(0)
  const [isTranscribing, setIsTranscribing] = useState(false)
  const [isFadingOut, setIsFadingOut] = useState(false)
  const [hasUploadedFile, setHasUploadedFile] = useState(false)

  useEffect(() => {
    console.log('Current intent:', intent) // Debug log
    
    // Set initial message based on intent and file status
    if (intent === 'translate') {
      if (hasFile) {
        setMessages([
          {
            role: 'assistant',
            content: "I'm analyzing your video for translation. This should take a few moments..."
          }
        ])
        setIsProcessing(true)
        // Simulate processing time
        setTimeout(() => {
          setMessages(prev => [...prev, {
            role: 'assistant',
            content: "I've analyzed your video. What language would you like me to translate it to?"
          }])
          setIsProcessing(false)
        }, 3000)
      } else {
        setMessages([
          {
            role: 'assistant',
            content: "To get started with translation, please upload a video file. You can drag and drop it here or click the attachment icon to browse your files."
          }
        ])
      }
    } else if (intent === 'podcast') {
      setMessages([
        {
          role: 'user',
          content: "Make a podcast"
        },
        {
          role: 'assistant',
          content: "I'd love to help you create a podcast! You can upload your existing audio files, start a group or solo recording session, or import from Zoom. What would you like to do?"
        }
      ])
    } else if (intent === 'video-maker') {
      console.log('Setting video maker message') // Debug log
      setMessages([
        {
          role: 'assistant',
          content: "Hi! I'll help you create a video. Would you like to upload a script you've already written, or would you prefer to start with a prompt and I'll help write the script?"
        }
      ])
    } else {
      // Add a default message if no intent is specified
      console.log('No intent specified, setting default message') // Debug log
      setMessages([
        {
          role: 'assistant',
          content: "Hi! How can I help you today?"
        }
      ])
    }
  }, [intent, hasFile])

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    // Add user message
    setMessages(prev => [...prev, {
      role: 'user',
      content: inputValue
    }])
    
    // Clear input
    setInputValue('')

    // Handle responses based on context
    if (intent === 'podcast') {
      const userMessage = inputValue.toLowerCase()
      setTimeout(() => {
        if (userMessage.includes('upload') || userMessage.includes('file') || userMessage.includes('1')) {
          setMessages(prev => [...prev, {
            role: 'assistant',
            content: "Great! You can drag and drop your podcast audio files directly into this chat. Once uploaded, I'll start transcribing and arranging them for you. You can upload multiple files if needed."
          }])
        } else if (userMessage.includes('group') || userMessage.includes('multiple') || userMessage.includes('2')) {
          setMessages(prev => [...prev, {
            role: 'assistant',
            content: "Let's set up a group recording session. This will allow you to record with multiple participants remotely. Would you like to schedule this session for later or start it now?"
          }])
        } else if (userMessage.includes('solo') || userMessage.includes('just') || userMessage.includes('3')) {
          setMessages(prev => [...prev, {
            role: 'assistant',
            content: "Let's start a solo recording session. I'll help you set up your microphone and prepare for recording. Would you like me to provide some prompts or questions to help structure your podcast?"
          }])
        } else if (userMessage.includes('zoom') || userMessage.includes('import') || userMessage.includes('4')) {
          setMessages(prev => [...prev, {
            role: 'assistant',
            content: "I can help you import recordings from Zoom. Please upload your Zoom recording file, and I'll process it for your podcast. The file should be in MP4 or M4A format."
          }])
        } else {
          setMessages(prev => [...prev, {
            role: 'assistant',
            content: "I'm here to help with your podcast. You can:\n\n" +
              "1. Upload your podcast files directly into this chat\n" +
              "2. Start a group recording session\n" +
              "3. Start a solo recording session\n" +
              "4. Import from Zoom\n\n" +
              "Which option would you prefer?"
          }])
        }
      }, 1000)
    } else if (intent === 'video-maker') {
      const userMessage = inputValue.toLowerCase()
      setTimeout(() => {
        if (userMessage.includes('script') && userMessage.includes('upload')) {
          setMessages(prev => [...prev, {
            role: 'assistant',
            content: "Great! Please upload your script file or paste your script here, and I'll help you turn it into a compelling video."
          }])
        } else if (userMessage.includes('prompt') || userMessage.includes('generate')) {
          setMessages(prev => [...prev, {
            role: 'assistant',
            content: "Perfect! Please provide a brief description of the video you want to create. Include details like the topic, style, tone, and target audience."
          }])
        } else {
          setMessages(prev => [...prev, {
            role: 'assistant',
            content: "I'll help you create your video. Would you like to start by uploading a script, or should I help you write one based on your ideas?"
          }])
        }
      }, 1000)
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const newFiles = Array.from(files)
    setUploadedFiles(prev => [...prev, ...newFiles])
    setHasUploadedFile(true)

    // Add a message about the uploaded files
    const fileNames = newFiles.map(file => file.name).join(', ')
    setMessages(prev => [...prev, 
      {
        role: 'user',
        content: `Uploaded: ${fileNames}`
      }
    ])

    // Handle based on intent
    if (intent === 'podcast') {
      setIsProcessing(true)
      setTimeout(() => {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: `I've received your audio files and I'm processing them now. Would you like me to automatically arrange them in chronological order, or would you prefer to organize them yourself?`
        }])
        setIsProcessing(false)
      }, 2000)
    } else {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `I've received your files. What would you like to do with them?`
      }])
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    
    const files = e.dataTransfer.files
    if (!files || files.length === 0) return

    const newFiles = Array.from(files)
    setUploadedFiles(prev => [...prev, ...newFiles])
    setHasUploadedFile(true)

    // Add a message about the uploaded files
    const fileNames = newFiles.map(file => file.name).join(', ')
    setMessages(prev => [...prev, 
      {
        role: 'user',
        content: `Dropped files: ${fileNames}`
      }
    ])

    // Handle based on intent
    if (intent === 'podcast') {
      setIsProcessing(true)
      setTimeout(() => {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: `I've received your audio files and I'm processing them now. Would you like me to automatically arrange them in chronological order, or would you prefer to organize them yourself?`
        }])
        setIsProcessing(false)
      }, 2000)
    } else {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `I've received your files. What would you like to do with them?`
      }])
    }
  }

  // Simulate single file upload and transcription process
  const simulateSingleFileUpload = () => {
    // Add fake user message with file upload and start transcription immediately
    setMessages(prev => [...prev, {
      role: 'user',
      content: 'Use this audio file for the podcast.'
    }])
    
    // Start transcription progress simulation immediately
    setIsTranscribing(true)
    setTranscriptionProgress(0)
    setHasUploadedFile(true)
    
    // Add AI response
    setTimeout(() => {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "I've received your audio file. I'm transcribing and processing it now. When that's done, I'll have your project ready. Feel free to add more files while I'm working on this one."
      }])
      
      const interval = setInterval(() => {
        setTranscriptionProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval)
            
            // When complete, add completion message
            setTimeout(() => {
              setIsTranscribing(false)
              setMessages(prev => {
                // Check if the last message is already a completion message to avoid duplicates
                const lastMessage = prev[prev.length - 1];
                if (lastMessage && lastMessage.role === 'assistant' && 
                    lastMessage.content.includes("Transcription complete!")) {
                  return prev; // Don't add another completion message
                }
                return [...prev, {
                  role: 'assistant',
                  content: "Transcription complete! Your podcast project is ready to go."
                }];
              })
            }, 500)
            
            return 100
          }
          return prev + Math.floor(Math.random() * 10) + 1
        })
      }, 800)
    }, 1000)
  }

  // Simulate multiple files upload and transcription process
  const simulateMultipleFilesUpload = () => {
    // Add fake user message with multiple file uploads and start transcription immediately
    setMessages(prev => [...prev, {
      role: 'user',
      content: 'Here are the host and guest tracks for the podcast.'
    }])
    
    // Start transcription progress simulation immediately
    setIsTranscribing(true)
    setTranscriptionProgress(0)
    setHasUploadedFile(true)

    // Add AI response about multiple tracks
    setTimeout(() => {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "I've received your audio files. I notice these appear to be multiple tracks from the same podcast recording. Descript has a feature called 'sequences' that combines files like these into a single project. I'll create a sequence to combine these files for you and start transcribing them."
      }])
      
      const interval = setInterval(() => {
        setTranscriptionProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval)
            
            // When complete, add completion message
            setTimeout(() => {
              setIsTranscribing(false)
              setMessages(prev => {
                // Check if the last message is already a completion message to avoid duplicates
                const lastMessage = prev[prev.length - 1];
                if (lastMessage && lastMessage.role === 'assistant' && 
                    lastMessage.content.includes("Transcription complete!")) {
                  return prev; // Don't add another completion message
                }
                return [...prev, {
                  role: 'assistant',
                  content: "Transcription complete! I've created a sequence with both audio tracks aligned. Your podcast project is ready to go. You'll be able to edit each track separately or together in the editor."
                }];
              })
            }, 500)
            
            return 100
          }
          return prev + Math.floor(Math.random() * 10) + 1
        })
      }, 800)
    }, 1000)
  }

  // Replace the simulateFileUpload function with the dropdown menu options
  const simulateFileUpload = () => {
    // This function is no longer used directly, but kept for reference
    simulateSingleFileUpload()
  }

  // Handle transition to editor with fade animation
  const handleOpenProject = () => {
    setIsFadingOut(true)
    
    // Wait for animation to complete before navigating
    setTimeout(() => {
      router.push('/editor')
    }, 500) // Match this with the CSS transition duration
  }

  return (
    <div className={cn(
      "flex flex-col h-screen",
      isFadingOut && "opacity-0 transition-opacity duration-500"
    )}>
      {/* Header */}
      <header className="border-b">
        <div className="container flex h-14 items-center">
          <Button variant="ghost" className="gap-2 text-sm flex items-center" onClick={() => window.history.back()}>
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div className="ml-auto">
            <Button 
              variant="ghost" 
              className="gap-2 text-sm flex items-center" 
              onClick={() => router.push('/')}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="h-4 w-4"
              >
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
              Home
            </Button>
          </div>
        </div>
      </header>

      {/* Chat Messages */}
      <div 
        className={cn(
          "flex-1 overflow-y-auto p-4 relative flex items-center bg-gray-50",
          isDragging && "bg-blue-50"
        )} 
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {isDragging && (
          <div className="absolute inset-0 flex items-center justify-center bg-blue-50/70 backdrop-blur-[2px] z-10 pointer-events-none">
            <div className="bg-white p-4 rounded-lg shadow-md text-center border border-blue-100">
              <Upload className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-700">Drop to upload</p>
            </div>
          </div>
        )}
        <div className="max-w-3xl mx-auto space-y-4 w-full">
          {messages.map((message, i) => (
            <div
              key={i}
              className="flex gap-3 justify-start"
            >
              <div className={cn(
                "h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden",
                message.role === 'assistant' ? "bg-gray-200" : "bg-blue-100"
              )}>
                {message.role === 'assistant' ? (
                  <Bot className="h-4 w-4 text-gray-700" />
                ) : (
                  <img src="/avatar.png" alt="User" className="h-8 w-8 object-cover" onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="%23007BFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/></svg>';
                  }} />
                )}
              </div>
              <div className={cn(
                "rounded-2xl px-4 py-2 w-[calc(100%-44px)]",
                message.role === 'user' 
                  ? "bg-blue-100 text-gray-800 border border-blue-200" 
                  : "bg-white border border-gray-200 shadow-sm"
              )}>
                <div className="flex flex-col">
                  {message.role === 'assistant' ? (
                    <TypedText content={message.content} className="text-sm" />
                  ) : (
                    <p className="text-sm">{message.content}</p>
                  )}
                  
                  {/* Display file attachment with transcription progress for single file */}
                  {message.role === 'user' && message.content === 'Use this audio file for the podcast.' && (
                    <div className="mt-2 bg-white rounded-md border border-gray-200 p-2">
                      <div className="flex items-center gap-2">
                        <div className="bg-orange-100 rounded-md p-1.5">
                          <FileAudio className="h-5 w-5 text-orange-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">podcast_episode_interview.mp3</p>
                          <div className="flex items-center gap-1.5">
                            <p className="text-xs text-gray-500">Attachment</p>
                            {isTranscribing && (
                              <div className="flex items-center gap-1.5 ml-2">
                                {transcriptionProgress < 100 ? (
                                  <>
                                    <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
                                    <span className="text-xs font-medium text-gray-700">{transcriptionProgress}%</span>
                                  </>
                                ) : (
                                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Display file attachments with transcription progress for multiple files */}
                  {message.role === 'user' && message.content === 'Here are the host and guest tracks for the podcast.' && (
                    <div className="mt-2 space-y-2">
                      <div className="bg-white rounded-md border border-gray-200 p-2">
                        <div className="flex items-center gap-2">
                          <div className="bg-orange-100 rounded-md p-1.5">
                            <FileAudio className="h-5 w-5 text-orange-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">podcast_interview_host.mp3</p>
                            <div className="flex items-center gap-1.5">
                              <p className="text-xs text-gray-500">Attachment</p>
                              {isTranscribing && (
                                <div className="flex items-center gap-1.5 ml-2">
                                  {transcriptionProgress < 100 ? (
                                    <>
                                      <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
                                      <span className="text-xs font-medium text-gray-700">{transcriptionProgress}%</span>
                                    </>
                                  ) : (
                                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-white rounded-md border border-gray-200 p-2">
                        <div className="flex items-center gap-2">
                          <div className="bg-orange-100 rounded-md p-1.5">
                            <FileAudio className="h-5 w-5 text-orange-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">podcast_interview_guest.mp3</p>
                            <div className="flex items-center gap-1.5">
                              <p className="text-xs text-gray-500">Attachment</p>
                              {isTranscribing && (
                                <div className="flex items-center gap-1.5 ml-2">
                                  {transcriptionProgress < 100 ? (
                                    <>
                                      <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
                                      <span className="text-xs font-medium text-gray-700">{transcriptionProgress}%</span>
                                    </>
                                  ) : (
                                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {message.role === 'assistant' && intent === 'video-maker' && i === 0 && (
                    <div className="mt-4 space-y-3">
                      <p className="text-xs text-gray-500">Choose an option:</p>
                      <div className="flex flex-wrap gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setInputValue("I'd like to upload my script")}
                          className="text-xs flex items-center gap-1.5 bg-white"
                        >
                          <Upload className="h-3.5 w-3.5 text-blue-600" />
                          Upload script
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setInputValue("I'd like to start with a prompt")}
                          className="text-xs flex items-center gap-1.5 bg-white"
                        >
                          <Wand2 className="h-3.5 w-3.5 text-purple-600" />
                          Start with prompt
                        </Button>
                      </div>
                    </div>
                  )}
                  {message.role === 'assistant' && intent === 'podcast' && i === 1 && !hasUploadedFile && (
                    <div className="mt-4 space-y-3">
                      <p className="text-xs text-gray-500">Choose an option:</p>
                      <div className="flex flex-wrap gap-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="text-xs flex items-center gap-1.5 bg-white"
                            >
                              <Upload className="h-3.5 w-3.5 text-blue-600" />
                              Upload files
                              <ChevronDown className="h-3 w-3 ml-0.5 text-gray-500" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="start">
                            <DropdownMenuItem onClick={simulateSingleFileUpload} className="text-xs flex items-center gap-2">
                              <FileIcon className="h-3.5 w-3.5 text-blue-600" />
                              One file
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={simulateMultipleFilesUpload} className="text-xs flex items-center gap-2">
                              <Layers className="h-3.5 w-3.5 text-purple-600" />
                              Multiple files
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setInputValue("I want to start a group recording")}
                          className="text-xs flex items-center gap-1.5 bg-white"
                        >
                          <Users className="h-3.5 w-3.5 text-purple-600" />
                          Group recording
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setInputValue("I want to do a solo recording")}
                          className="text-xs flex items-center gap-1.5 bg-white"
                        >
                          <Mic className="h-3.5 w-3.5 text-green-600" />
                          Solo recording
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setInputValue("I want to import from Zoom")}
                          className="text-xs flex items-center gap-1.5 bg-white"
                        >
                          <Video className="h-3.5 w-3.5 text-cyan-600" />
                          Import from Zoom
                        </Button>
                      </div>
                      <p className="text-xs text-gray-500 italic">Tip: You can also drag and drop your podcast files directly into this chat.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          {isProcessing && (
            <div className="flex items-center justify-start py-3 px-4">
              <div className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-black" />
                <span className="text-sm text-gray-600">Processing...</span>
              </div>
            </div>
          )}
          {/* Remove the separate transcription card */}
          {transcriptionProgress === 100 && !isTranscribing && (
            <div className="flex justify-center mt-4">
              <Button 
                className="bg-black hover:bg-gray-800 text-white flex items-center gap-2"
                onClick={handleOpenProject}
              >
                <Play className="h-4 w-4" />
                Open Project
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function AIChatPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-gray-600" />
      </div>
    }>
      <ChatContent />
    </Suspense>
  )
} 