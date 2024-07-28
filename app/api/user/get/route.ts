import dbConnect from "@/lib/mongoUtils";
import User from "@/models/User"

export async function POST(request: Request) {
    await dbConnect();

    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    let email = (await request.json()).email

    let user = null;

    if(id) {
        user = await User.findOne({ _id: id })
    } else {
        user = await User.findOne({ email: email })
    }

    return Response.json( user )
}
