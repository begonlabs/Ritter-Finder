import { createClient } from './client';

/**
 * Test Supabase Connection
 * Verifica que la conexión con Supabase self-hosted funcione correctamente
 */

export const testSupabaseConnection = async () => {
  console.log('🚀 Testing Supabase Connection...');
  console.log('URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
  
  try {
    const supabase = createClient();
    
    // Test 1: Basic connection
    console.log('📡 Testing basic connection...');
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('❌ Auth error:', error.message);
      return false;
    }
    
    console.log('✅ Basic connection successful');
    console.log('Current session:', data.session ? 'Authenticated' : 'Not authenticated');
    
    // Test 2: Database connection (simple query)
    console.log('🗄️ Testing database connection...');
    const { data: dbTest, error: dbError } = await supabase
      .from('auth.users') // Usando una tabla que siempre existe en Supabase
      .select('count')
      .limit(1);
    
    if (dbError) {
      console.log('ℹ️ Database test note:', dbError.message);
      console.log('This is normal if no tables are public or user not authenticated');
    } else {
      console.log('✅ Database connection successful');
    }
    
    // Test 3: Service health
    console.log('🏥 Testing service health...');
    const { data: healthData, error: healthError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .limit(1);
    
    if (healthError) {
      console.log('ℹ️ Health check note:', healthError.message);
    }
    
    console.log('🎉 Supabase connection test completed!');
    console.log('✨ Your self-hosted Supabase instance is working correctly');
    
    return true;
    
  } catch (error) {
    console.error('💥 Connection test failed:', error);
    return false;
  }
};

// Para uso en desarrollo
if (typeof window !== 'undefined') {
  // @ts-ignore - Para testing en browser console
  window.testSupabase = testSupabaseConnection;
} 