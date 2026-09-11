import dbConnect from "@/lib/mongoUtils";
import User from "@/models/User"

export async function POST(request: Request) {
    await dbConnect();

    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    let email = null;
    try {
        const body = await request.json();
        email = body?.email;
    } catch {
        // body may be empty
    }

    let user = null;

    if(id) {
        user = await User.findOne({ _id: id }).select("-password")
    } else if (email) {
        user = await User.findOne({ email: email }).select("-password")
    }

    return Response.json( user )
}
