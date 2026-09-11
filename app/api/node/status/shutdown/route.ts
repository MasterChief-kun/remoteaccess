import { auth } from "@/auth"
import dbConnect from "@/lib/mongoUtils"
import Node from "@/models/Node"
import { execFile } from "child_process"
import util from "util"
const execFilePromise = util.promisify(execFile)

export async function GET(request: Request){
    await dbConnect()
    const session = await auth()
   
    if (!session || session?.user?.role !== "admin" ) return Response.json({
        message: "Not authenticated as admin",
        session: session?.user
    }, {
        status: 401
    })

    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    if (!id) {
        return Response.json({ message: "Node ID is required" }, { status: 400 })
    }

    let node = await Node.findById(id)
    if (!node) {
        return Response.json({ message: "Node not found" }, { status: 404 })
    }

    if (!node.ip_add) {
        return Response.json({ message: "Node IP address is not configured" }, { status: 400 })
    }

    const adminUser = process.env.ADMIN || "admin"
    const port = String(node.port || 22)
    const sshTarget = `${adminUser}@${node.ip_add}`

    try {
        await execFilePromise("ssh", [
            "-o", "BatchMode=yes",
            "-o", "StrictHostKeyChecking=accept-new",
            "-o", "ConnectTimeout=5",
            "-p", port,
            sshTarget,
            "sudo poweroff"
        ])

        return Response.json({
            message: "Shutdown command transmitted successfully"
        }, {
            status: 200
        })
    } catch (err: any) {
        return Response.json({
            message: `SSH shutdown failed: ${err.message || err}`
        }, {
            status: 500
        })
    }
}
