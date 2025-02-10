import type React from "react"
import { cn } from "@/lib/utils"

interface ActionButtonProps {
  icon: React.ReactNode
  label: string
  variant?: "default" | "record"
  className?: string
  onClick?: () => void
}

export function ActionButton({ icon, label, variant = "default", className, onClick }: ActionButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors",
        variant === "record" && "text-red-500",
        className,
      )}
    >
      {icon}
      <span>{label}</span>
    </button>
  )
}

