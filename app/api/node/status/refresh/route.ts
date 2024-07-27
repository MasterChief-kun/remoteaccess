import Node from "@/models/Node"
import { exec as execCP } from "child_process"
import util from "util"
const exec = util.promisify(execCP)


async function checkStatus(ips: string[]) {
    let { stdout, stderr } = await exec('nmap -sP 192.168.1.255/24')
    let out = []

    for (let ip of ips) {
        if (stdout.includes(ip)) {
            out.push({
                ip: ip,
                status: "on"
            })
            await Node.findOneAndUpdate({"ip_add": ip}, {"status": "on"})
        } else {
            out.push({
                ip: ip,
                status: "off"
            })
            await Node.findOneAndUpdate({"ip_add": ip}, {"status": "off"})}
    }

    return out
}

export async function POST(request: Request) {
    let data = await request.json()
    let out =  await checkStatus(data.ips)

    return Response.json(out)

}
