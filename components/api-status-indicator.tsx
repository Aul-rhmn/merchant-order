"use client"

import { useState, useEffect } from "react"
import { Wifi, WifiOff, RefreshCw } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getApiStatus } from "@/lib/api"

export function ApiStatusIndicator() {
  const [status, setStatus] = useState<{ isConnected: boolean; source: string } | null>(null)
  const [loading, setLoading] = useState(false)

  const checkStatus = async () => {
    setLoading(true)
    try {
      const apiStatus = await getApiStatus()
      setStatus(apiStatus)
    } catch (error) {
      console.error("Failed to check API status:", error)
      setStatus({ isConnected: false, source: "Mock Data" })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkStatus()
  }, [])

  if (!status) {
    return (
      <div className="inline-flex items-center gap-2 text-gray-500">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400"></div>
        <span className="text-sm">Checking API status...</span>
      </div>
    )
  }

  return (
    <div className="inline-flex items-center gap-2">
      <Badge
        variant={status.isConnected ? "default" : "secondary"}
        className={`flex items-center gap-1 ${
          status.isConnected
            ? "bg-green-100 text-green-800 hover:bg-green-200"
            : "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
        }`}
      >
        {status.isConnected ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
        <span className="text-xs">{status.source}</span>
      </Badge>

      <Button variant="ghost" size="sm" onClick={checkStatus} disabled={loading} className="h-6 w-6 p-0">
        <RefreshCw className={`h-3 w-3 ${loading ? "animate-spin" : ""}`} />
      </Button>
    </div>
  )
}
