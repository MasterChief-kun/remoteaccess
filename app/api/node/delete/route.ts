import { auth } from "@/auth"
import Node from "@/models/Node"

export async function DELETE(request: Request) {
    const session = await auth()
    // return Response.json(session)
    if (!session || session?.user?.role !== "admin" ) return Response.json({
        message: "Not authenticated",
        session: session?.user
    }, {
        status: 401
    })

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    let del = await Node.deleteOne({ '_id': id })
    return Response.json(del)
}
