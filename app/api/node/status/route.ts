const wol = require("wake_on_lan")

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const mac = searchParams.get("mac")

    wol.wake(mac)

    return Response.json({
        status: "success",
        message: "WOL magic packet sent"
    })
}
