"use client"

import { ColumnDef } from "@tanstack/react-table"
import { z } from "zod"
import { nodeSchema } from "@/lib/zod"
import { CircleArrowOutUpRight, Edit, Loader2, MoreHorizontal, Power, RefreshCcw, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import NodeForm from "@/components/ui/nodeForm"
import { useRouter } from "next/navigation"

function StatusCell({ status }: { status?: string }) {
  const s = status || "off";
  let badgeColor = "bg-zinc-500/20 text-zinc-600 dark:text-zinc-400";
  if (s === "on") {
    badgeColor = "bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border-emerald-500/30";
  } else if (s === "loading") {
    badgeColor = "bg-amber-500/20 text-amber-700 dark:text-amber-400 border-amber-500/30";
  }
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${badgeColor}`}>
      {s}
    </span>
  );
}

function WolButton({ mac }: { mac: string }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleWol() {
    setLoading(true)
    try {
      await fetch(`/api/node/status?mac=${mac}`, { method: "GET" })
      router.refresh()
    } catch (err) {
      console.error("WOL error:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      variant="outline"
      size="icon"
      className="h-8 w-8"
      onClick={handleWol}
      disabled={loading}
      title="Send Wake-on-LAN Packet"
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <CircleArrowOutUpRight className="h-4 w-4" />
      )}
    </Button>
  )
}

function ActionMenu({ node }: { node: z.infer<typeof nodeSchema> }) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)
  const router = useRouter()

  async function handleRefresh() {
    if (!node.ip_add) return
    setActionLoading(true)
    try {
      await fetch("/api/node/status/refresh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ips: [node.ip_add] })
      })
      router.refresh()
    } catch (err) {
      console.error("Refresh error:", err)
    } finally {
      setActionLoading(false)
    }
  }

  async function handleShutdown() {
    if (!node._id) return
    setActionLoading(true)
    try {
      await fetch(`/api/node/status/shutdown?id=${node._id}`, { method: "GET" })
      router.refresh()
    } catch (err) {
      console.error("Shutdown error:", err)
    } finally {
      setActionLoading(false)
    }
  }

  async function handleDelete() {
    if (!node._id) return
    setActionLoading(true)
    try {
      await fetch(`/api/node/delete?id=${node._id}`, { method: "DELETE" })
      router.refresh()
    } catch (err) {
      console.error("Delete error:", err)
    } finally {
      setActionLoading(false)
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0" disabled={actionLoading}>
            {actionLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <MoreHorizontal className="h-4 w-4" />
            )}
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={handleRefresh}>
            <RefreshCcw className="mr-2 h-4 w-4" />
            Refresh Status
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setIsEditDialogOpen(true)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Node
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleShutdown}>
            <Power className="mr-2 h-4 w-4" />
            Request Shutdown
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleDelete} className="text-red-600 dark:text-red-400">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Node</DialogTitle>
            <DialogDescription>Update node details below.</DialogDescription>
          </DialogHeader>
          <NodeForm
            edit={true}
            editObj={node}
            onSuccess={() => setIsEditDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  )
}

export const columns: ColumnDef<z.infer<typeof nodeSchema>>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "mac",
    header: "MAC Address",
  },
  {
    accessorKey: "ip_add",
    header: "IP Address",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusCell status={row.original.status} />,
  },
  {
    accessorKey: "port",
    header: "Port",
  },
  {
    id: "send_wol",
    header: "Wake",
    cell: ({ row }) => <WolButton mac={row.original.mac} />,
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <ActionMenu node={row.original} />,
  },
]
