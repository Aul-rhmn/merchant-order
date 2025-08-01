const API_BASE_URL = "https://recruitment-spe.vercel.app/api/v1"
const API_TOKEN = process.env.NEXT_PUBLIC_API_TOKEN || ""

interface ApiProduct {
  id: number
  name: string
  description: string
  price: number
  stock: number
  category_id: number
  created_at: string
  updated_at: string
}

interface Product {
  id: string
  name: string
  description: string
  price: number
  stock: number
}

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

// Mock data
const MOCK_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Premium Laptop",
    description: "High-performance laptop",
    price: 15000000,
    stock: 25,
  },
  {
    id: "2",
    name: "Wireless Mouse",
    description: "Ergonomic wireless mouse",
    price: 250000,
    stock: 100,
  },
  {
    id: "3",
    name: "Mechanical Keyboard",
    description: "RGB mechanical keyboard",
    price: 1200000,
    stock: 50,
  },
  {
    id: "4",
    name: "4K Monitor",
    description: "27-inch 4K UHD",
    price: 4500000,
    stock: 15,
  },
  {
    id: "5",
    name: "USB-C Hub",
    description: "Multi-port USB-C",
    price: 800000,
    stock: 75,
  },
]

async function checkApiAvailability(): Promise<boolean> {
  if (!API_TOKEN) {
    console.log("No API token found, using mock data")
    return false
  }

  try {
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: "HEAD", 
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
        Accept: "application/json",
      },
    })

    const isAvailable = response.ok
    console.log(isAvailable ? "API is available, using real data" : "API unavailable, using mock data")
    return isAvailable
  } catch (error) {
    console.log("API connection failed, using mock data:", error)
    return false
  }
}

async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`

  const config: RequestInit = {
    ...options,
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
      Accept: "application/json",
      "Content-Type": "application/json",
      ...options.headers,
    },
  }

  const response = await fetch(url, config)

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`)
  }

  return response.json()
}


function transformProduct(apiProduct: ApiProduct): Product {
  return {
    id: apiProduct.id.toString(),
    name: apiProduct.name,
    description: apiProduct.description,
    price: apiProduct.price,
    stock: apiProduct.stock,
  }
}


export async function fetchProducts(): Promise<Product[]> {
  try {
    
    const apiAvailable = await checkApiAvailability()

    if (!apiAvailable) {
     
      await new Promise((resolve) => setTimeout(resolve, 500))
      return MOCK_PRODUCTS
    }
    const data = await apiRequest("/products")
    const products = Array.isArray(data) ? data : data.data || data.products || []

    if (products.length === 0) {
      console.log("API returned empty data, using mock data")
      return MOCK_PRODUCTS
    }

    return products.map(transformProduct)
  } catch (error) {
    console.error("Failed to fetch from API, falling back to mock data:", error)
    return MOCK_PRODUCTS
  }
}

export async function getApiStatus(): Promise<{ isConnected: boolean; source: string }> {
  const isConnected = await checkApiAvailability()
  return {
    isConnected,
    source: isConnected ? "Real API" : "Mock Data",
  }
}

export function getStoredOrders(): Order[] {
  if (typeof window === "undefined") return []

  try {
    const stored = localStorage.getItem("merchant_orders")
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

export function saveOrder(order: Order): void {
  if (typeof window === "undefined") return

  const orders = getStoredOrders()
  orders.push(order)
  localStorage.setItem("merchant_orders", JSON.stringify(orders))
}

export function deleteStoredOrder(orderId: string): void {
  if (typeof window === "undefined") return

  const orders = getStoredOrders()
  const filteredOrders = orders.filter((order) => order.id !== orderId)
  localStorage.setItem("merchant_orders", JSON.stringify(filteredOrders))
}

export function generateOrderId(): string {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9)
}
