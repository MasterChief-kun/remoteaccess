import { auth } from "@/auth"
import User from "@/models/User"

export async function POST(request: Request) {
    // const session = await auth()

    // if (!session || session?.user?.role !== "admin" ) return Response.json({
    //     message: "Not authenticated",
    //     session: session?.user
    // }, {
    //     status: 401
    // })
   
    let data = await request.json()

    let user = await User.create(data)
    return Response.json(user)
}
