"use client"

import { ColumnDef } from "@tanstack/react-table"
import { z } from "zod"
import { nodeSchema } from "@/lib/zod"
import { CircleArrowOutUpRight, Delete, Edit, Loader2, MoreHorizontal, Power, RefreshCcw, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useSession } from "next-auth/react"
import { useState } from "react"
import { table } from "console"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import NodeForm from "@/components/ui/nodeForm"

export const columns: ColumnDef<z.infer<typeof nodeSchema>>[] = [
  {
    "accessorKey": "name",
    "header": "Name"
  },
  {
    "accessorKey": "mac",
    "header": "Mac Address"
  },
  {
    "accessorKey": "status",
    "header": "Status"
  },
  {
    "accessorKey": "port",
    "header": "Port"
  },
  {
    id: "send_wol",
    cell: ({ table, row }) => {
      const node = row.original


      async function sendWOL() {
        row.original.status = "loading"
        table?.options?.meta?.onLoading()

        let req = await fetch(`/api/node/status?mac=${node.mac}`, { method: "GET" })
        let res = await req.json()

        table?.options?.meta?.onLoading()
        return res
      }

      return (
        (!table?.options?.meta?.loading) ?
          <Button variant="outline" className="h-8 w-8 p-0" onClick={sendWOL}>
            <CircleArrowOutUpRight className="h-4 w-4"/>
          </Button>
        :
        <Button className="h-8 w-8 p-0" disabled>
          <Loader2 className="h-4 w-4 animate-spin"/>
        </Button>
      )
    }
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const node = row.original
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <Dialog>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
        {/*     <DropdownMenuItem */}
        {/* onClick={() => navigator.clipboard.writeText(`ssh ${session.data?.user?.username}@${process.env.PUBLIC_IP} -p ${node.port}`)} */}
        {/*     > */}
        {/*       Copy SSH command */}
        {/*     </DropdownMenuItem> */}
            <DropdownMenuItem onClick={async () => {
              await fetch("/api/node/status/refresh", {
                method: "POST",
                body: JSON.stringify({
                  ips: [node.ip_add]
                })
              })
            }}>
              <RefreshCcw className="p-1"/>
              Refresh
            </DropdownMenuItem>

              <DialogTrigger asChild>
                <DropdownMenuItem>
                  <Edit className='p-1'/>
                  Edit
                </DropdownMenuItem>
              </DialogTrigger>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={async () => {
              let req = await fetch(`/api/node/status/shutdown?id=${node?._id}`, {
                method: "GET"
              })
            }}>
              <Power className="p-1"/>
              Request Shutdown
            </DropdownMenuItem>
            <DropdownMenuItem onClick={async () => {
              let req = await fetch(`/api/node/delete?id=${node?._id}`, {
                method: "DELETE"
              })
            }}>
              <Trash2 className="p-1"/>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
          <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Edit Node</DialogTitle>
                <DialogDescription>Edit node. Click save when done.</DialogDescription>
              </DialogHeader>
              <NodeForm edit={true} editObj={node}/>
            </DialogContent>
          </Dialog>
        </DropdownMenu>
        )
    }
  }
]
