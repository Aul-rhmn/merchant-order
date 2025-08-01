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

class DataStore {
  private products: Product[] = [
    {
      id: "1",
      name: "Product Title",
      description: "Product Description",
      price: 150000,
      stock: 50,
    },
    {
      id: "2",
      name: "Product Title",
      description: "Product Description",
      price: 200000,
      stock: 30,
    },
    {
      id: "3",
      name: "Product Title",
      description: "Product Description",
      price: 100000,
      stock: 25,
    },
  ]

  private orders: Order[] = [
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
        {
          id: "2",
          productId: "2",
          productName: "Product Title - Product Description",
          quantity: 1,
          unitPrice: 200000,
          totalPrice: 200000,
        },
      ],
      totalAmount: 500000,
      createdAt: "2024-01-15",
      status: "pending",
    },
    {
      id: "2",
      items: [
        {
          id: "3",
          productId: "3",
          productName: "Product Title - Product Description",
          quantity: 3,
          unitPrice: 100000,
          totalPrice: 300000,
        },
      ],
      totalAmount: 300000,
      createdAt: "2024-01-14",
      status: "completed",
    },
  ]

  private nextOrderId = 3

  getProducts(): Product[] {
    return [...this.products]
  }

  getOrders(): Order[] {
    return [...this.orders]
  }

  addOrder(orderData: { items: OrderItem[]; totalAmount: number }): Order {
    const newOrder: Order = {
      id: this.nextOrderId.toString(),
      items: orderData.items.map((item, index) => ({
        ...item,
        id: `${this.nextOrderId}_${index}`,
      })),
      totalAmount: orderData.totalAmount,
      createdAt: new Date().toISOString().split("T")[0],
      status: "pending",
    }

    this.orders.push(newOrder)
    this.nextOrderId++

    newOrder.items.forEach((item) => {
      const product = this.products.find((p) => p.id === item.productId)
      if (product) {
        product.stock -= item.quantity
      }
    })

    return newOrder
  }

  deleteOrder(orderId: string): boolean {
    const orderIndex = this.orders.findIndex((order) => order.id === orderId)

    if (orderIndex === -1) {
      return false
    }

    const order = this.orders[orderIndex]
    order.items.forEach((item) => {
      const product = this.products.find((p) => p.id === item.productId)
      if (product) {
        product.stock += item.quantity
      }
    })

    this.orders.splice(orderIndex, 1)
    return true
  }

  getOrder(orderId: string): Order | undefined {
    return this.orders.find((order) => order.id === orderId)
  }
}

const dataStore = new DataStore()
export default dataStore
