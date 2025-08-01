import { type NextRequest, NextResponse } from "next/server"
import dataStore from "@/lib/data-store"

export async function GET() {
  try {
   
    await new Promise((resolve) => setTimeout(resolve, 300))

    const orders = dataStore.getOrders()

    return NextResponse.json({
      success: true,
      data: orders,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch orders" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    
    if (!body.items || !Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json({ success: false, error: "Invalid order data" }, { status: 400 })
    }

    
    const newOrder = dataStore.addOrder({
      items: body.items,
      totalAmount: body.totalAmount,
    })

 
    await new Promise((resolve) => setTimeout(resolve, 500))

    return NextResponse.json({
      success: true,
      data: newOrder,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to create order" }, { status: 500 })
  }
}
