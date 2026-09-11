import wol from "wake_on_lan"

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const mac = searchParams.get("mac")

    if (!mac) {
        return Response.json({
            status: "error",
            message: "MAC address is required"
        }, { status: 400 })
    }

    return new Promise<Response>((resolve) => {
        wol.wake(mac, (error: any) => {
            if (error) {
                resolve(Response.json({
                    status: "error",
                    message: `Failed to send WOL packet: ${error.message || error}`
                }, { status: 500 }))
            } else {
                resolve(Response.json({
                    status: "success",
                    message: `WOL magic packet sent to ${mac}`
                }))
            }
        })
    })
}
