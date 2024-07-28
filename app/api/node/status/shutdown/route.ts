import { auth } from "@/auth"
import dbConnect from "@/lib/mongoUtils"
import Node from "@/models/Node"
import { exec as execCP } from "child_process"
import util from "util"
const exec = util.promisify(execCP)


export async function GET(request: Request){
    await dbConnect()
    const session = await auth()
   
    if (!session || session?.user?.role !== "admin" ) return Response.json({
        message: "Not authenticated",
        session: session?.user
    }, {
        status: 401
    })

    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    let node = await Node.findById(id)

    let { stdout, stderr } = await exec(`ssh ${process.env.ADMIN}@${node.ip_add} -p ${node.port} 'sudo poweroff'`)

    if(!stderr) {
        return Response.json({
            message: "Success"
        }, {
            status: 200
        })
    } else {
        return Response.json({
            message: `Error: ${stderr}`
        }, {
            status: 500
        })
    }
}
