import Link from "next/link"
import { Package, Plus, List } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ApiStatusIndicator } from "@/components/api-status-indicator"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-4 sm:py-8">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">Merchant Order Management</h1>
          <p className="text-sm sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
            Welcome to your order management system. Manage your orders efficiently with our intuitive interface.
          </p>

          <div className="mt-4">
            <ApiStatusIndicator />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-4xl mx-auto">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <List className="h-4 w-4 sm:h-5 sm:w-5" />
                Order List
              </CardTitle>
              <CardDescription className="text-sm">View and manage all your existing orders</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/orders">
                <Button className="w-full">View Orders</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
                Add New Order
              </CardTitle>
              <CardDescription className="text-sm">Create a new order with product selection</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/orders/add">
                <Button className="w-full">Add Order</Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 sm:mt-12 text-center">
          <div className="inline-flex items-center gap-2 text-gray-500">
            <Package className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="text-xs sm:text-sm">Powered by SPE</span>
          </div>
        </div>
      </div>
    </div>
  )
}
