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
  Mic
} from "lucide-react"
import { useRouter } from 'next/navigation'
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export default function EditorBlankPage() {
  const router = useRouter()

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
              <Button className="h-10 px-4 gap-2">
                <Mic className="h-4 w-4" />
                AI Speaker
              </Button>
            </div>
            <p className="text-sm text-gray-500">paste from clipboard or press Enter to continue with an empty script</p>
          </div>
        </div>
      </div>
    </div>
  )
} 