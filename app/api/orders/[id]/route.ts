import { type NextRequest, NextResponse } from "next/server"
import dataStore from "@/lib/data-store"

// Mock Data
const orders = [
  {
    id: "1",
    items: [
      {
        id: "1",
        productId: "1",
        productName: "Product Title - Product Description",
        quantity: 2,
        unitPrice: 150000,
        totalPrice: 300000,
      },
    ],
    totalAmount: 300000,
    createdAt: "2024-01-15",
    status: "pending",
  },
]

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const orderId = params.id

   
    const success = dataStore.deleteOrder(orderId)

    if (!success) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 })
    }

    
    await new Promise((resolve) => setTimeout(resolve, 300))

    return NextResponse.json({
      success: true,
      message: "Order deleted successfully",
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to delete order" }, { status: 500 })
  }
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const orderId = params.id
    const order = dataStore.getOrder(orderId)

    if (!order) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: order,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch order" }, { status: 500 })
  }
}
