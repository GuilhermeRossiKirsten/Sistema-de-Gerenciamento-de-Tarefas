import { type NextRequest, NextResponse } from "next/server"

const BACKEND_URL = process.env.BACKEND_API_URL || "http://localhost:3001"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const headers: HeadersInit = {
      "Content-Type": "application/json",
    }
    const csrfToken = request.headers.get("X-CSRF-Token")
    const userId = request.headers.get("X-User-Id")

    if (csrfToken) headers["X-CSRF-Token"] = csrfToken
    if (userId) headers["X-User-Id"] = userId

    const response = await fetch(`${BACKEND_URL}/task`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const error = await response.json()
      return NextResponse.json(error, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: "Failed to create task" }, { status: 500 })
  }
}
