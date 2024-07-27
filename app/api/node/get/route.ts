import dbConnect from "@/lib/mongoUtils";
import Node from "@/models/Node"

export async function GET(request: Request) {
    await dbConnect();

    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    let node = null;

    if(id) {
        node = await Node.find({ _id: id })
    } else {
        node = await Node.find({})
    }

    return Response.json( node )
}
