"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Plus, Minus, Save, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import { fetchProducts, saveOrder, generateOrderId } from "@/lib/api"
import { ApiStatusIndicator } from "@/components/api-status-indicator"

interface Product {
  id: string
  name: string
  description: string
  price: number
  stock: number
}

interface OrderItem {
  productId: string
  productName: string
  quantity: number
  unitPrice: number
  totalPrice: number
}

export default function AddOrderPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [products, setProducts] = useState<Product[]>([])
  const [orderItems, setOrderItems] = useState<OrderItem[]>([])
  const [selectedProductId, setSelectedProductId] = useState<string>("")
  const [quantity, setQuantity] = useState<number>(1)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      setLoading(true)
      const productsData = await fetchProducts()
      setProducts(productsData)
    } catch (error) {
      console.error("Failed to fetch products:", error)
      toast({
        title: "Error",
        description: "Failed to load products. Please check your internet connection.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const addProductToOrder = () => {
    if (!selectedProductId || quantity <= 0) {
      toast({
        title: "Invalid Input",
        description: "Please select a product and enter a valid quantity",
        variant: "destructive",
      })
      return
    }

    const product = products.find((p) => p.id === selectedProductId)
    if (!product) return

    if (quantity > product.stock) {
      toast({
        title: "Insufficient Stock",
        description: `Only ${product.stock} items available`,
        variant: "destructive",
      })
      return
    }

    const existingItemIndex = orderItems.findIndex((item) => item.productId === selectedProductId)

    if (existingItemIndex >= 0) {
      const updatedItems = [...orderItems]
      const newQuantity = updatedItems[existingItemIndex].quantity + quantity

      if (newQuantity > product.stock) {
        toast({
          title: "Insufficient Stock",
          description: `Only ${product.stock} items available`,
          variant: "destructive",
        })
        return
      }

      updatedItems[existingItemIndex].quantity = newQuantity
      updatedItems[existingItemIndex].totalPrice = newQuantity * product.price
      setOrderItems(updatedItems)
    } else {
      const newItem: OrderItem = {
        productId: selectedProductId,
        productName: `${product.name} - ${product.description}`,
        quantity,
        unitPrice: product.price,
        totalPrice: quantity * product.price,
      }
      setOrderItems([...orderItems, newItem])
    }

    setSelectedProductId("")
    setQuantity(1)

    toast({
      title: "Product Added",
      description: "Product added to order successfully",
    })
  }

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(productId)
      return
    }

    const product = products.find((p) => p.id === productId)
    if (!product) return

    if (newQuantity > product.stock) {
      toast({
        title: "Insufficient Stock",
        description: `Only ${product.stock} items available`,
        variant: "destructive",
      })
      return
    }

    const updatedItems = orderItems.map((item) => {
      if (item.productId === productId) {
        return {
          ...item,
          quantity: newQuantity,
          totalPrice: newQuantity * item.unitPrice,
        }
      }
      return item
    })

    setOrderItems(updatedItems)
  }

  const removeItem = (productId: string) => {
    setOrderItems(orderItems.filter((item) => item.productId !== productId))
  }

  const getTotalAmount = () => {
    return orderItems.reduce((total, item) => total + item.totalPrice, 0)
  }

  const saveOrderData = async () => {
    if (orderItems.length === 0) {
      toast({
        title: "Empty Order",
        description: "Please add at least one product to the order",
        variant: "destructive",
      })
      return
    }

    try {
      setSaving(true)

      const newOrder = {
        id: generateOrderId(),
        items: orderItems.map((item, index) => ({
          ...item,
          id: `${Date.now()}_${index}`,
        })),
        totalAmount: getTotalAmount(),
        createdAt: new Date().toISOString().split("T")[0],
        status: "pending" as const,
      }

      saveOrder(newOrder)

      toast({
        title: "Order Created",
        description: "Order has been created successfully",
      })

      router.push("/orders")
    } catch (error) {
      console.error("Failed to save order:", error)
      toast({
        title: "Error",
        description: "Failed to create order",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-sm sm:text-base">Loading products...</p>
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
            <Link href="/orders">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Add New Order</h1>
              <p className="text-gray-600 text-sm sm:text-base">Create a new order by selecting products</p>
              <div className="mt-2">
                <ApiStatusIndicator />
              </div>
            </div>
          </div>
          <Button variant="outline" onClick={loadProducts} size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Products
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Product Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Select Products</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="product">Product</Label>
                <Select value={selectedProductId} onValueChange={setSelectedProductId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a product" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map((product) => (
                      <SelectItem key={product.id} value={product.id}>
                        <div className="flex flex-col">
                          <span className="font-medium">{product.name}</span>
                          <span className="text-xs text-gray-500">
                            {product.description} - {formatCurrency(product.price)} (Stock: {product.stock})
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Input
                    id="quantity"
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Number.parseInt(e.target.value) || 1))}
                    className="w-16 sm:w-20 text-center"
                    min="1"
                  />
                  <Button type="button" variant="outline" size="sm" onClick={() => setQuantity(quantity + 1)}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {selectedProductId && (
                <div className="p-3 sm:p-4 bg-gray-50 rounded-lg">
                  <div className="text-xs sm:text-sm text-gray-600 space-y-1">
                    <p>
                      <strong>Selected:</strong> {products.find((p) => p.id === selectedProductId)?.name}
                    </p>
                    <p>
                      <strong>Unit Price:</strong>{" "}
                      {formatCurrency(products.find((p) => p.id === selectedProductId)?.price || 0)}
                    </p>
                    <p>
                      <strong>Total Price:</strong>{" "}
                      {formatCurrency((products.find((p) => p.id === selectedProductId)?.price || 0) * quantity)}
                    </p>
                  </div>
                </div>
              )}

              <Button onClick={addProductToOrder} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add to Order
              </Button>
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              {orderItems.length === 0 ? (
                <p className="text-gray-500 text-center py-6 sm:py-8 text-sm sm:text-base">No items added yet</p>
              ) : (
                <>
                  {/* Mobile view */}
                  <div className="sm:hidden space-y-3 mb-6">
                    {orderItems.map((item) => (
                      <div key={item.productId} className="border rounded-lg p-3">
                        <div className="font-medium text-sm mb-2">{item.productName}</div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-1">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                              className="h-6 w-6 p-0"
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center text-sm">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                              className="h-6 w-6 p-0"
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeItem(item.productId)}
                            className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                          >
                            ×
                          </Button>
                        </div>
                        <div className="flex justify-between text-xs text-gray-600">
                          <span>Unit: {formatCurrency(item.unitPrice)}</span>
                          <span className="font-medium">{formatCurrency(item.totalPrice)}</span>
                        </div>
                      </div>
                    ))}
                    <div className="border-t-2 pt-3 flex justify-between items-center">
                      <span className="font-bold">Total</span>
                      <span className="font-bold text-lg">{formatCurrency(getTotalAmount())}</span>
                    </div>
                  </div>

                  {/* Desktop view */}
                  <div className="hidden sm:block">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Product</TableHead>
                          <TableHead className="text-center">Qty</TableHead>
                          <TableHead className="text-right">Unit Price</TableHead>
                          <TableHead className="text-right">Total</TableHead>
                          <TableHead></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {orderItems.map((item) => (
                          <TableRow key={item.productId}>
                            <TableCell className="font-medium text-sm">{item.productName}</TableCell>
                            <TableCell className="text-center">
                              <div className="flex items-center justify-center gap-1">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                                  className="h-6 w-6 p-0"
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <span className="w-8 text-center text-sm">{item.quantity}</span>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                  className="h-6 w-6 p-0"
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>
                            </TableCell>
                            <TableCell className="text-right text-sm">{formatCurrency(item.unitPrice)}</TableCell>
                            <TableCell className="text-right text-sm">{formatCurrency(item.totalPrice)}</TableCell>
                            <TableCell>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => removeItem(item.productId)}
                                className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                              >
                                ×
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                        <TableRow className="border-t-2">
                          <TableCell colSpan={3} className="font-bold">
                            Total
                          </TableCell>
                          <TableCell className="text-right font-bold text-lg">
                            {formatCurrency(getTotalAmount())}
                          </TableCell>
                          <TableCell></TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>

                  <div className="mt-4 sm:mt-6">
                    <Button onClick={saveOrderData} disabled={saving} className="w-full">
                      {saving ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Save Order
                        </>
                      )}
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
