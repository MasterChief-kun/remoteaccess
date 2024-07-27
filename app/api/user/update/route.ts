import { auth } from "@/auth";
import User from "@/models/User";

export async function POST(request: Request) {
    const session = await auth()
    if (!session || session?.user?.role !== "admin" ) return Response.json({
        message: "Not authenticated",
        session: session?.user
    }, {
        status: 401
    })

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id")
    let update = await request.json()

    if(!id) {
        return Response.error()
    } else {
        let user = await User.updateOne({ '_id': id }, update)
        return Response.json(user)
    }
}
