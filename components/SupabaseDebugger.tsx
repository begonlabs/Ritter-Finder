"use client"

import { useSupabaseTest } from "@/features/dashboard/hooks/useSupabaseTest"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function SupabaseDebugger() {
  const { isLoading, results, testConnection, testSimpleQuery } = useSupabaseTest()

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>🧪 Supabase Debugger - RitterFinder</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-4">
          <Button onClick={testSimpleQuery} disabled={isLoading}>
            {isLoading ? "Probando..." : "Test Simple"}
          </Button>
          <Button onClick={testConnection} disabled={isLoading}>
            {isLoading ? "Probando..." : "Test Completo"}
          </Button>
        </div>

        {results && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4">📊 Resultados:</h3>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto max-h-96">
              {JSON.stringify(results, null, 2)}
            </pre>
          </div>
        )}

        <div className="mt-6 p-4 bg-blue-50 rounded">
          <h4 className="font-semibold text-blue-800">🔍 Instrucciones:</h4>
          <ol className="list-decimal list-inside text-sm text-blue-700 mt-2 space-y-1">
            <li><strong>Test Simple:</strong> Verifica conexión básica a la tabla leads</li>
            <li><strong>Test Completo:</strong> Prueba todas las vistas y funcionalidades</li>
            <li>Abre la consola del navegador (F12) para ver logs detallados</li>
            <li>Revisa si las vistas <code>leads_by_category</code> y <code>leads_by_state</code> existen</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  )
} 