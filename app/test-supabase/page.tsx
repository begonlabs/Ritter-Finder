import { SupabaseTest } from '@/components/SupabaseTest';

export default function TestSupabasePage() {
  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">🔧 Test de Conexión Supabase</h1>
          <p className="text-muted-foreground">
            Verifica que tu instancia self-hosted de Supabase esté funcionando correctamente
          </p>
        </div>
        
        <SupabaseTest />
        
        <div className="bg-muted p-6 rounded-lg space-y-4">
          <h2 className="text-lg font-semibold">📚 Información de Configuración</h2>
          
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <h3 className="font-medium mb-2">🌐 URLs Configuradas:</h3>
              <ul className="space-y-1 text-muted-foreground">
                <li><strong>Supabase:</strong> {process.env.NEXT_PUBLIC_SUPABASE_URL}</li>
                <li><strong>Backend API:</strong> {process.env.NEXT_PUBLIC_BACKEND_URL}</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">✅ Lo que verifica este test:</h3>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Conexión básica con Supabase Auth</li>
                <li>• Acceso a la base de datos</li>
                <li>• Estado del servicio</li>
                <li>• Configuración de variables de entorno</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t pt-4">
            <h3 className="font-medium mb-2">🛠️ Pasos adicionales si hay errores:</h3>
            <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
              <li>Verifica que Supabase esté ejecutándose en: <code className="bg-background px-1 rounded">{process.env.NEXT_PUBLIC_SUPABASE_URL}</code></li>
              <li>Revisa las variables de entorno en <code className="bg-background px-1 rounded">.env.local</code></li>
              <li>Confirma que las dependencias estén instaladas: <code className="bg-background px-1 rounded">pnpm add @supabase/ssr @supabase/supabase-js</code></li>
              <li>Verifica que el backend FastAPI esté corriendo</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
} 