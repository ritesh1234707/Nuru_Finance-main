import { cn } from "../../lib/utils"

interface LoadingSkeletonProps {
  className?: string
  lines?: number
  showAvatar?: boolean
}

export function LoadingSkeleton({ className, lines = 3, showAvatar = false }: LoadingSkeletonProps) {
  return (
    <div className={cn("animate-pulse space-y-4", className)}>
      {showAvatar && (
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gray-700 rounded-full skeleton"></div>
          <div className="space-y-2 flex-1">
            <div className="h-4 bg-gray-700 rounded skeleton w-1/4"></div>
            <div className="h-3 bg-gray-700 rounded skeleton w-1/2"></div>
          </div>
        </div>
      )}

      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="h-4 bg-gray-700 rounded skeleton"></div>
          <div className="h-4 bg-gray-700 rounded skeleton w-5/6"></div>
        </div>
      ))}
    </div>
  )
}

export function CardSkeleton() {
  return (
    <div className="bg-gray-900/50 border-gray-800 rounded-lg p-6 animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="w-16 h-16 bg-gray-700 rounded-full skeleton"></div>
        <div className="w-20 h-6 bg-gray-700 rounded skeleton"></div>
      </div>
      <div className="space-y-3">
        <div className="h-6 bg-gray-700 rounded skeleton w-3/4"></div>
        <div className="h-4 bg-gray-700 rounded skeleton"></div>
        <div className="h-4 bg-gray-700 rounded skeleton w-5/6"></div>
      </div>
      <div className="mt-6">
        <div className="h-10 bg-gray-700 rounded skeleton"></div>
      </div>
    </div>
  )
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center space-x-4 p-4 border-b border-gray-800">
          <div className="w-10 h-10 bg-gray-700 rounded-full skeleton"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-700 rounded skeleton w-1/3"></div>
            <div className="h-3 bg-gray-700 rounded skeleton w-1/2"></div>
          </div>
          <div className="w-20 h-6 bg-gray-700 rounded skeleton"></div>
          <div className="w-16 h-8 bg-gray-700 rounded skeleton"></div>
        </div>
      ))}
    </div>
  )
}
