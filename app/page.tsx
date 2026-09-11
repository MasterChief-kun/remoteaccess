import { auth } from "@/auth"
import { columns } from "./columns"
import { DataTable } from "./data-table"
import { z } from "zod"
import { nodeSchema } from "@/lib/zod"
import dbConnect from "@/lib/mongoUtils"
import Node from "@/models/Node"
import { AddNodeDialog } from "@/components/AddNodeDialog"

export const dynamic = 'force-dynamic';

async function getData(): Promise<z.infer<typeof nodeSchema>[]> {
  try {
    await dbConnect();
    const nodes = await Node.find({}).lean();
    return JSON.parse(JSON.stringify(nodes));
  } catch (error) {
    console.error("Failed to fetch nodes from database:", error);
    return [];
  }
}

export default async function Home() {
  const session = await auth()
  let data = await getData();

  return (
    <div className="container mx-auto py-10 space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Devices & Nodes</h1>
          <p className="text-sm text-muted-foreground">
            Manage remote nodes, monitor reachability, send Wake-on-LAN packets, and request shutdown.
          </p>
        </div>
        <AddNodeDialog />
      </div>
      <DataTable columns={columns} data={data}/>
    </div>
  )
}
