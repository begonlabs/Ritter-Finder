import { SupabaseDebugger } from "@/components/SupabaseDebugger"

export default function DebugSupabasePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <SupabaseDebugger />
      </div>
    </div>
  )
} 