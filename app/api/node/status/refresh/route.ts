import dbConnect from "@/lib/mongoUtils"
import Node from "@/models/Node"
import { revalidatePath } from "next/cache"
import { execFile } from "child_process"
import util from "util"
import net from "net"

const execFilePromise = util.promisify(execFile)

function checkTcpPort(ip: string, port: number = 22, timeoutMs: number = 1000): Promise<boolean> {
  return new Promise((resolve) => {
    const socket = new net.Socket()
    socket.setTimeout(timeoutMs)
    socket.on("connect", () => {
      socket.destroy()
      resolve(true)
    })
    socket.on("timeout", () => {
      socket.destroy()
      resolve(false)
    })
    socket.on("error", () => {
      socket.destroy()
      resolve(false)
    })

    try {
      socket.connect(port, ip)
    } catch {
      resolve(false)
    }
  })
}

async function checkPing(ip: string): Promise<boolean> {
  try {
    await execFilePromise("ping", ["-c", "1", "-W", "1", ip])
    return true
  } catch {
    return false
  }
}

async function isNodeOnline(ip: string, port?: number): Promise<boolean> {
  const pingOk = await checkPing(ip)
  if (pingOk) return true
  if (port) {
    return await checkTcpPort(ip, port)
  }
  return false
}

export async function POST(request: Request) {
  await dbConnect()
  let data: { ips?: string[] } = {}
  try {
    data = await request.json()
  } catch {
    // empty body
  }

  const ips = Array.isArray(data?.ips) ? data.ips : []
  const out = []

  for (const ip of ips) {
    if (!ip) continue
    const node = await Node.findOne({ ip_add: ip })
    const isOnline = await isNodeOnline(ip, node?.port || 22)
    const status = isOnline ? "on" : "off"

    await Node.findOneAndUpdate({ ip_add: ip }, { status })
    out.push({ ip, status })
  }

  revalidatePath("/")
  return Response.json(out)
}
