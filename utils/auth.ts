import { createCookie, redirect } from "@remix-run/node"

let secret = process.env.COOKIE_SECRET || "default"
if (secret === 'default') {
    console.warn(" no COOKIE_SECRET setup")
    secret = "default-secret"
}


export let authCookie = createCookie("auth", {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secrets: [secret],
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30, // 30 days
})


export async function requireAuthCookie(request: Request) {
    let userId = await authCookie.parse(
        request.headers.get("Cookie")
    )

    if (!userId) {
        throw redirect("/login", {
            headers: {
                "Set-Cookie": await authCookie.serialize("", {
                    maxAge: 0
                })
            }
        })
    }

    return userId
}