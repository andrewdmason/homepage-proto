'use client'

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChevronDown, SendHorizontal, Bot, User, FileText, Wand2, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

type Message = {
  role: 'bot' | 'user'
  content: string
  action?: 'script-upload' | 'prompt-input' | 'generating'
}

export default function AIVideoMaker() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'bot',
      content: "Hi! I'll help you create a video. Would you like to upload a script you've already written, or would you prefer to start with a prompt and I'll help write the script?",
      action: 'script-upload'
    }
  ])
  const [inputValue, setInputValue] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = () => {
    if (!inputValue.trim()) return

    const newUserMessage: Message = { role: 'user', content: inputValue }
    const newMessages = [...messages, newUserMessage]
    setMessages(newMessages)
    setInputValue("")

    // Simulate bot response
    setTimeout(() => {
      let botResponse: Message
      const lastUserMessage = inputValue.toLowerCase()

      if (lastUserMessage.includes('script') || messages.length === 1) {
        if (lastUserMessage.includes('prompt')) {
          botResponse = {
            role: 'bot',
            content: "Great! Please provide a brief description of the video you want to create. Include details like the topic, style, tone, and target audience.",
            action: 'prompt-input'
          }
        } else {
          botResponse = {
            role: 'bot',
            content: "I'll help you refine your script. Please paste your script here or describe what kind of video you'd like to create.",
            action: 'script-upload'
          }
        }
      } else if (messages.length >= 3) {
        setIsGenerating(true)
        botResponse = {
          role: 'bot',
          content: "I'm generating your video based on our conversation. This usually takes about 2-3 minutes...",
          action: 'generating'
        }
        
        // Simulate video generation completion
        setTimeout(() => {
          setMessages(prev => [...prev, {
            role: 'bot' as const,
            content: "Your video is ready! You can now preview it, make edits, or download it."
          }])
          setIsGenerating(false)
        }, 5000)
      } else {
        botResponse = {
          role: 'bot',
          content: "That sounds great! I'll help you turn that into a compelling video. Would you like me to generate a draft script first, or should we move straight to video generation?"
        }
      }
      
      setMessages(prev => [...prev, botResponse])
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container flex h-14 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-sm font-medium">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          <Button variant="ghost" className="gap-2">
            <span>asmith@descript.com</span>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* Chat Interface */}
      <main className="container mx-auto max-w-3xl px-4 py-8">
        <div className="space-y-8">
          {/* Messages */}
          <div className="space-y-6">
            {messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  "flex gap-4",
                  message.role === 'user' && "justify-end"
                )}
              >
                {message.role === 'bot' && (
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <Bot className="h-5 w-5 text-blue-500" />
                  </div>
                )}
                <div className={cn(
                  "rounded-2xl px-4 py-3 max-w-[80%] space-y-4",
                  message.role === 'bot' 
                    ? "bg-gray-50" 
                    : "bg-black text-white"
                )}>
                  <p className="text-sm">{message.content}</p>
                  
                  {message.action === 'script-upload' && (
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setInputValue("I'd like to start with a prompt")}
                        className="text-xs"
                      >
                        <Wand2 className="h-3 w-3 mr-1" />
                        Start with prompt
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setInputValue("I have a script ready")}
                        className="text-xs"
                      >
                        <FileText className="h-3 w-3 mr-1" />
                        Upload script
                      </Button>
                    </div>
                  )}

                  {message.action === 'generating' && (
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400" />
                      Generating video...
                    </div>
                  )}
                </div>
                {message.role === 'user' && (
                  <div className="h-8 w-8 rounded-full bg-black flex items-center justify-center flex-shrink-0">
                    <User className="h-5 w-5 text-white" />
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          {!isGenerating && (
            <div className="flex gap-2">
              <Input
                placeholder="Type your message..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                className="h-12"
              />
              <Button 
                onClick={handleSend}
                disabled={!inputValue}
                className={cn(
                  "w-12 h-12 p-0",
                  inputValue && "bg-black hover:bg-gray-800"
                )}
              >
                <SendHorizontal className="h-5 w-5" />
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
} 