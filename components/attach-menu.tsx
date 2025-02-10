import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { PaperclipIcon, Upload, Youtube, Video } from "lucide-react"

export function AttachMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-6 w-6">
          <PaperclipIcon className="h-6 w-6 text-[#999999] opacity-60 hover:opacity-100" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuItem className="gap-2">
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
  )
} 