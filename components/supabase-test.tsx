'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { testSupabaseConnection } from '@/utils/supabase/test-connection';

export const SupabaseTest = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
    logs: string[];
  } | null>(null);

  const runTest = async () => {
    setIsLoading(true);
    setTestResult(null);
    
    // Capturar logs del console
    const originalLog = console.log;
    const originalError = console.error;
    const logs: string[] = [];
    
    console.log = (...args) => {
      logs.push(args.join(' '));
      originalLog(...args);
    };
    
    console.error = (...args) => {
      logs.push(`ERROR: ${args.join(' ')}`);
      originalError(...args);
    };
    
    try {
      const success = await testSupabaseConnection();
      
      setTestResult({
        success,
        message: success 
          ? '¡Conexión exitosa! 🎉 Supabase está funcionando correctamente' 
          : '❌ Hubo problemas con la conexión',
        logs
      });
    } catch (error) {
      setTestResult({
        success: false,
        message: `💥 Error inesperado: ${error}`,
        logs
      });
    } finally {
      // Restaurar console
      console.log = originalLog;
      console.error = originalError;
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🔧 Test de Conexión Supabase
        </CardTitle>
        <CardDescription>
          Verifica que la conexión con tu instancia self-hosted de Supabase funcione correctamente
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            <strong>URL:</strong> {process.env.NEXT_PUBLIC_SUPABASE_URL}
          </p>
          <p className="text-sm text-muted-foreground">
            <strong>Backend:</strong> {process.env.NEXT_PUBLIC_BACKEND_URL}
          </p>
        </div>
        
        <Button 
          onClick={runTest} 
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? '🔄 Probando conexión...' : '🚀 Probar Conexión'}
        </Button>
        
        {testResult && (
          <Alert className={testResult.success ? 'border-green-500' : 'border-red-500'}>
            <AlertDescription>
              <div className="space-y-2">
                <p className="font-medium">{testResult.message}</p>
                
                {testResult.logs.length > 0 && (
                  <details className="mt-2">
                    <summary className="cursor-pointer text-sm font-medium">
                      Ver logs detallados
                    </summary>
                    <div className="mt-2 p-2 bg-muted rounded text-xs font-mono space-y-1">
                      {testResult.logs.map((log, index) => (
                        <div key={index}>{log}</div>
                      ))}
                    </div>
                  </details>
                )}
              </div>
            </AlertDescription>
          </Alert>
        )}
        
        <div className="text-xs text-muted-foreground bg-muted p-3 rounded">
          <p><strong>💡 Tip:</strong> También puedes abrir la consola del navegador y ejecutar:</p>
          <code className="block mt-1 font-mono">window.testSupabase()</code>
        </div>
      </CardContent>
    </Card>
  );
}; 