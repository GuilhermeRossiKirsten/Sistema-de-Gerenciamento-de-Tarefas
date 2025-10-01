import { type NextRequest, NextResponse } from "next/server"

const BACKEND_URL = process.env.BACKEND_API_URL || "http://localhost:3001"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("user_id")

    const url = new URL(`${BACKEND_URL}/tasks`)
    if (userId) {
      url.searchParams.append("user_id", userId)
    }

    const headers: HeadersInit = {}
    const csrfToken = request.headers.get("X-CSRF-Token")
    const userIdHeader = request.headers.get("X-User-Id")

    if (csrfToken) headers["X-CSRF-Token"] = csrfToken
    if (userIdHeader) headers["X-User-Id"] = userIdHeader

    const response = await fetch(url.toString(), { headers })

    if (!response.ok) {
      const error = await response.json()
      return NextResponse.json(error, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 })
  }
}
