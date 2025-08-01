"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Plus, Trash2, ArrowLeft, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { DeleteOrderDialog } from "@/components/delete-order-dialog"
import { getStoredOrders, deleteStoredOrder } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

interface OrderItem {
  id: string
  productId: string
  productName: string
  quantity: number
  unitPrice: number
  totalPrice: number
}

interface Order {
  id: string
  items: OrderItem[]
  totalAmount: number
  createdAt: string
  status: "pending" | "completed" | "cancelled"
}

export default function OrderListPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteOrderId, setDeleteOrderId] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const storedOrders = getStoredOrders()
      setOrders(storedOrders)
    } catch (error) {
      console.error("Failed to fetch orders:", error)
      toast({
        title: "Error",
        description: "Failed to load orders",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteOrder = async (orderId: string) => {
    try {
      deleteStoredOrder(orderId)
      await fetchOrders()
      setDeleteOrderId(null)
      toast({
        title: "Success",
        description: "Order deleted successfully",
      })
    } catch (error) {
      console.error("Failed to delete order:", error)
      toast({
        title: "Error",
        description: "Failed to delete order",
        variant: "destructive",
      })
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "completed":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-sm sm:text-base">Loading orders...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-4 sm:py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Order List</h1>
              <p className="text-gray-600 text-sm sm:text-base">Manage your orders</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={fetchOrders} size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Link href="/orders/add">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Add Order</span>
                <span className="sm:hidden">Add</span>
              </Button>
            </Link>
          </div>
        </div>

        {orders.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8 sm:py-12">
              <p className="text-gray-500 mb-4 text-sm sm:text-base">No orders found</p>
              <Link href="/orders/add">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Order
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            {orders.map((order) => (
              <Card key={order.id}>
                <CardHeader className="pb-3 sm:pb-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0">
                    <div>
                      <CardTitle className="text-base sm:text-lg">Order #{order.id}</CardTitle>
                      <p className="text-xs sm:text-sm text-gray-500">Created: {order.createdAt}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDeleteOrderId(order.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Mobile view */}
                  <div className="sm:hidden space-y-3">
                    {order.items.map((item) => (
                      <div key={item.id} className="border-b pb-3 last:border-b-0">
                        <div className="font-medium text-sm mb-1">{item.productName}</div>
                        <div className="grid grid-cols-3 gap-2 text-xs text-gray-600">
                          <div>Qty: {item.quantity}</div>
                          <div>Unit: {formatCurrency(item.unitPrice)}</div>
                          <div className="text-right font-medium">{formatCurrency(item.totalPrice)}</div>
                        </div>
                      </div>
                    ))}
                    <div className="border-t-2 pt-3 flex justify-between items-center">
                      <span className="font-bold">Total</span>
                      <span className="font-bold text-lg">{formatCurrency(order.totalAmount)}</span>
                    </div>
                  </div>

                  {/* Desktop view */}
                  <div className="hidden sm:block">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Product</TableHead>
                          <TableHead className="text-center">Quantity</TableHead>
                          <TableHead className="text-right">Unit Price</TableHead>
                          <TableHead className="text-right">Total Price</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {order.items.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell className="font-medium">{item.productName}</TableCell>
                            <TableCell className="text-center">{item.quantity}</TableCell>
                            <TableCell className="text-right">{formatCurrency(item.unitPrice)}</TableCell>
                            <TableCell className="text-right">{formatCurrency(item.totalPrice)}</TableCell>
                          </TableRow>
                        ))}
                        <TableRow className="border-t-2">
                          <TableCell colSpan={3} className="font-bold">
                            Total
                          </TableCell>
                          <TableCell className="text-right font-bold text-lg">
                            {formatCurrency(order.totalAmount)}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <DeleteOrderDialog
          isOpen={deleteOrderId !== null}
          onClose={() => setDeleteOrderId(null)}
          onConfirm={() => deleteOrderId && handleDeleteOrder(deleteOrderId)}
        />
      </div>
    </div>
  )
}
