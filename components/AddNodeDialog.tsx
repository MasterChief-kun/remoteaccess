'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import NodeForm from "@/components/ui/nodeForm"
import { Plus } from "lucide-react"

export function AddNodeDialog() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="my-2">
          <Plus className="mr-2 h-4 w-4" /> Add Node
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Node</DialogTitle>
          <DialogDescription>Create a new node to monitor and wake via LAN.</DialogDescription>
        </DialogHeader>
        <NodeForm onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}
