import { type NextRequest, NextResponse } from "next/server"

const BACKEND_URL = process.env.BACKEND_API_URL || "http://localhost:3001"

export async function GET(request: NextRequest, { params }: { params: { userId: string } }) {
  try {
    const response = await fetch(`${BACKEND_URL}/csrf-token/${params.userId}`)

    if (!response.ok) {
      const error = await response.json()
      return NextResponse.json(error, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: "Failed to generate CSRF token" }, { status: 500 })
  }
}
