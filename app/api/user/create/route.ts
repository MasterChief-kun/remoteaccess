import dbConnect from "@/lib/mongoUtils"
import User from "@/models/User"
import { saltAndHashPwd } from "@/lib/cryptoUtils"

export async function POST(request: Request) {
    await dbConnect()
    let data = await request.json()

    if (data.password) {
        data.password = await saltAndHashPwd(data.password)
    }

    let user = await User.create(data)
    return Response.json({
        _id: user._id,
        email: user.email,
        role: user.role,
        image_url: user.image_url
    })
}
