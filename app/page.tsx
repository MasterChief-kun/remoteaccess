import { auth } from "@/auth"
import { columns } from "./columns"
import { DataTable } from "./data-table"
import { z } from "zod"
import { nodeSchema } from "@/lib/zod"
import dbConnect from "@/lib/mongoUtils"
import Node from "@/models/Node"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import NodeForm from "@/components/ui/nodeForm"
import { Plus } from "lucide-react"

async function getData(): Promise<z.infer<typeof nodeSchema>[]> {
  // await dbConnect();
  // let nodes = await Node.find({})
  let req = await fetch(`${process.env.URL}/api/node/get`, {
    method: "GET",
    cache: 'force-cache'
  })

  let nodes = await req.json()
  return nodes;
}

export default async function Home() {
  const session = await auth()
  let data = await getData();

  return (
    <div className="container mx-auto py-10">
      <Dialog>
        <DialogTrigger asChild>
          <Button className="my-2">
            <Plus />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Node</DialogTitle>
            <DialogDescription>Create new node. Click create when done.</DialogDescription>
          </DialogHeader>
          <NodeForm/>
        </DialogContent>
      </Dialog>
      <DataTable columns={columns} data={data}/>
    </div>
  )
}
