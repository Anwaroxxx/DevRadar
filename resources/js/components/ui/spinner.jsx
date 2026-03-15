import { Loader2Icon } from "lucide-react"

import { cn } from "@/lib/utils"

function Spinner({ className, ...props }) {
  return (
    <Loader2Icon
      className={cn("h-4 w-4 animate-spin text-muted-foreground", className)}
      {...props}
    />
  )
}

export { Spinner }
