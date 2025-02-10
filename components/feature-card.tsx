import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"

interface FeatureCardProps {
  title: string
  description: string
  imageSrc: string
  isNew?: boolean
  onClick?: () => void
}

export function FeatureCard({ title, description, imageSrc, isNew, onClick }: FeatureCardProps) {
  return (
    <Card 
      className="overflow-hidden group hover:shadow-lg transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <CardContent className="flex items-center gap-4 p-4">
        <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
          <Image
            src={imageSrc}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform"
            sizes="80px"
          />
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="font-medium">{title}</h3>
            {isNew && <span className="rounded bg-orange-500 px-2 py-0.5 text-xs font-medium text-white">NEW</span>}
          </div>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </CardContent>
    </Card>
  )
}

