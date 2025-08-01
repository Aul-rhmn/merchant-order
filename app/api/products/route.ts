import { NextResponse } from "next/server"
import dataStore from "@/lib/data-store"

export async function GET() {
  try {
    
    await new Promise((resolve) => setTimeout(resolve, 300))

    const products = dataStore.getProducts()

    return NextResponse.json({
      success: true,
      data: products,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch products" }, { status: 500 })
  }
}
