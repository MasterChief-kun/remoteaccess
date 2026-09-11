import dbConnect from "@/lib/mongoUtils";
import Node from "@/models/Node";

export type reportType = {
    mac: string;
    ip_add: string;
    status: "on" | "off";
}

export async function POST(request: Request) {
    await dbConnect()
    let data : reportType = await request.json()

    let update = await Node.findOneAndUpdate({ "mac": data.mac, "ip_add": data.ip_add }, { status: data.status }, { new: true })

    return Response.json(update)
}
