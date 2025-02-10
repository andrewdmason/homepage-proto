import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { PaperclipIcon, Upload, Youtube, Video, X } from "lucide-react"
import { useRef, useState, useEffect } from "react"
import { cn } from "@/lib/utils"

interface AttachMenuProps {
  onFileSelect?: (file: File | null) => void;
  onWidthChange?: (width: number) => void;
}

export function AttachMenu({ onFileSelect, onWidthChange }: AttachMenuProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const filePillRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (filePillRef.current) {
      const width = filePillRef.current.offsetWidth
      onWidthChange?.(width + 32) // Add extra padding for spacing
    } else {
      onWidthChange?.(56) // Default padding when no file is selected
    }
  }, [selectedFile, onWidthChange])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      onFileSelect?.(file)
    }
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const clearFile = (e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedFile(null)
    onFileSelect?.(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="relative flex items-center">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        className="hidden"
        accept="video/*,audio/*"
      />
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className={cn(
              "h-6 w-6 hover:bg-transparent",
              selectedFile && "text-blue-500"
            )}
          >
            <PaperclipIcon className="h-6 w-6 text-[#999999] opacity-60 hover:opacity-100" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          <DropdownMenuItem className="gap-2" onClick={handleUploadClick}>
            <Upload className="h-4 w-4" />
            <span>Upload from computer</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="gap-2">
            <Youtube className="h-4 w-4" />
            <span>Import from YouTube</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="gap-2">
            <Video className="h-4 w-4" />
            <span>Import from Zoom</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {selectedFile && (
        <div 
          ref={filePillRef}
          className="absolute left-8 top-1/2 -translate-y-1/2 flex items-center gap-1 pl-2"
        >
          <div className="flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-500 rounded-full text-xs whitespace-nowrap">
            <span className="max-w-[200px] truncate">{selectedFile.name}</span>
            <X 
              className="h-3 w-3 cursor-pointer opacity-60 hover:opacity-100" 
              onClick={clearFile}
            />
          </div>
        </div>
      )}
    </div>
  )
} 