#!/usr/bin/env node

/**
 * Script de Prueba para Gestión de Usuarios
 * 
 * Este script prueba la creación y eliminación completa de usuarios
 * incluyendo todos los datos relacionados:
 * - Usuario de autenticación (auth.users)
 * - Perfil de usuario (user_profiles)
 * - Asignación de roles (role_permissions)
 * - Permisos específicos
 * 
 * @author RitterFinder Team
 * @version 1.0.0
 */

const { createClient } = require('@supabase/supabase-js')
const path = require('path')
const dotenv = require('dotenv')

// Cargar variables de entorno desde el directorio raíz
const envLocalPath = path.join(__dirname, '..', '.env.local')
const envPath = path.join(__dirname, '..', '.env')

if (require('fs').existsSync(envLocalPath)) {
    dotenv.config({ path: envLocalPath })
} else if (require('fs').existsSync(envPath)) {
    dotenv.config({ path: envPath })
} else {
    console.error('❌ No se encontró archivo .env.local o .env en el directorio raíz')
    process.exit(1)
}

// Configuración de Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Error: Variables de entorno faltantes')
  console.error('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✅' : '❌')
  console.error('SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '✅' : '❌')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Datos de prueba
const TEST_USER_DATA = {
  name: 'Usuario de Prueba',
  email: 'test.user@ritterfinder.com',
  phone: '+34 600 123 456',
  roleId: '39af56ac-919b-45ae-94b7-569a2d85681a', // supervisor
  password: 'TestPassword123!'
}

// Roles disponibles
const ROLES = {
  admin: 'f6798529-943b-483c-98be-bca8fdde370d',
  supervisor: '39af56ac-919b-45ae-94b7-569a2d85681a',
  comercial: '8f698c5f-2373-45f8-90c2-9f4427d2638c'
}

// Permisos por rol
const ROLE_PERMISSIONS = {
  admin: [
    '80419f5b-299b-4ec4-a047-72bce30e7daa', // admin:*
    '762ee1e0-f88f-488d-9c38-7895239cb879', // users:*
    '69d0391d-e3b4-4b04-a5b7-73cbb3206e0f', // roles:*
    '005c86aa-78c4-4528-801f-7e5ac8b83ee0', // leads:*
    '5e705eaf-1f5e-407e-b3d9-dd1867af11eb', // campaigns:*
    'e1467efd-050b-42fb-8060-e82781d2b7e7', // analytics:*
    'd52dddba-c2e2-4b33-baf7-50e4c5d98baf', // export:*
    '5bf4fd37-e285-43a3-8c96-94dd929b8d9c'  // settings:*
  ],
  supervisor: [
    '005c86aa-78c4-4528-801f-7e5ac8b83ee0', // leads:*
    '5e705eaf-1f5e-407e-b3d9-dd1867af11eb', // campaigns:*
    'b34f5562-2027-4fa6-9705-b667c80b55cc', // analytics:view
    '4fe14067-bcbb-44ad-8ed5-d1d5e5395a25', // export:limited
    'df46f619-23e4-4e13-b94c-4d4c87f667e1'  // users:read
  ],
  comercial: [
    '005c86aa-78c4-4528-801f-7e5ac8b83ee0', // leads:*
    '5e705eaf-1f5e-407e-b3d9-dd1867af11eb', // campaigns:*
    'b34f5562-2027-4fa6-9705-b667c80b55cc'  // analytics:view
  ]
}

// Utilidades de logging
const log = {
  info: (msg) => console.log(`ℹ️  ${msg}`),
  success: (msg) => console.log(`✅ ${msg}`),
  error: (msg) => console.log(`❌ ${msg}`),
  warning: (msg) => console.log(`⚠️  ${msg}`),
  step: (msg) => console.log(`\n🔹 ${msg}`)
}

// Función para generar UUID
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0
    const v = c == 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

// Función para verificar si el usuario existe
async function checkUserExists(email) {
  try {
    const { data: authUser, error: authError } = await supabase.auth.admin.listUsers()
    
    if (authError) {
      throw new Error(`Error al verificar usuario de auth: ${authError.message}`)
    }
    
    const user = authUser.users.find(u => u.email === email)
    return user || null
  } catch (error) {
    log.error(`Error verificando usuario: ${error.message}`)
    return null
  }
}

// Función para crear usuario de autenticación
async function createAuthUser(userData) {
  log.step('Creando usuario de autenticación...')
  
  try {
    // Verificar si el usuario ya existe
    const existingUser = await checkUserExists(userData.email)
    if (existingUser) {
      log.warning(`Usuario de auth ya existe: ${existingUser.id}`)
      return existingUser
    }
    
    const { data, error } = await supabase.auth.admin.createUser({
      email: userData.email,
      password: userData.password,
      email_confirm: true,
      user_metadata: {
        full_name: userData.name,
        phone: userData.phone
      }
    })
    
    if (error) {
      throw new Error(`Error al crear usuario de auth: ${error.message}`)
    }
    
    log.success(`Usuario de auth creado: ${data.user.id}`)
    return data.user
  } catch (error) {
    log.error(`Error creando usuario de auth: ${error.message}`)
    throw error
  }
}

// Función para crear perfil de usuario
async function createUserProfile(authUser, userData) {
  log.step('Creando perfil de usuario...')
  
  try {
    // Verificar si el perfil ya existe
    const { data: existingProfile, error: checkError } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('id', authUser.id)
      .single()
    
    if (existingProfile) {
      log.warning(`Perfil ya existe para el usuario ${authUser.id}`)
      return existingProfile
    }
    
    const { data, error } = await supabase
      .from('user_profiles')
      .insert({
        id: authUser.id,
        full_name: userData.name,
        role_id: userData.roleId,
        invited_by: null, // Por ahora null, podría ser el admin actual
        metadata: {
          phone: userData.phone,
          email: userData.email,
          status: 'active',
          loginCount: 0
        }
      })
      .select()
      .single()
    
    if (error) {
      throw new Error(`Error al crear perfil: ${error.message}`)
    }
    
    log.success(`Perfil de usuario creado: ${data.id}`)
    return data
  } catch (error) {
    log.error(`Error creando perfil: ${error.message}`)
    throw error
  }
}

// Función para crear usuario completo
async function createCompleteUser(userData) {
  log.info('🚀 Iniciando creación completa de usuario...')

  // 1. Crear usuario de autenticación
  const authUser = await createAuthUser(userData)

  // 2. Crear perfil de usuario
  const profile = await createUserProfile(authUser, userData)

  return { authUser, profile }
}

// Función para eliminar usuario completo
async function deleteCompleteUser(userId) {
  log.info('🗑️  Iniciando eliminación completa de usuario...')
  try {
    // 1. Eliminar perfil de usuario
    log.step('Eliminando perfil de usuario...')
    const { error: profileError } = await supabase
      .from('user_profiles')
      .delete()
      .eq('id', userId)
    if (profileError) {
      log.warning(`Error eliminando perfil: ${profileError.message}`)
    } else {
      log.success('Perfil eliminado')
    }
    // 2. Eliminar usuario de autenticación
    log.step('Eliminando usuario de autenticación...')
    const { error: authError } = await supabase.auth.admin.deleteUser(userId)
    if (authError) {
      throw new Error(`Error eliminando usuario de auth: ${authError.message}`)
    }
    log.success('🎉 Usuario eliminado exitosamente')
    return true
  } catch (error) {
    log.error(`Error en eliminación completa: ${error.message}`)
    throw error
  }
}

// Función para verificar datos del usuario
async function verifyUserData(userId) {
  log.step('Verificando datos del usuario...')
  try {
    // Verificar perfil
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single()
    if (profileError) {
      log.error(`Error obteniendo perfil: ${profileError.message}`)
      return false
    }
    log.success(`Perfil encontrado: ${profile.full_name}`)
    // Verificar rol
    const { data: role, error: roleError } = await supabase
      .from('roles')
      .select('name')
      .eq('id', profile.role_id)
      .single()
    if (roleError) {
      log.error(`Error obteniendo rol: ${roleError.message}`)
      return false
    }
    log.success(`Rol asignado: ${role.name}`)
    return { profile, role }
  } catch (error) {
    log.error(`Error verificando datos: ${error.message}`)
    return false
  }
}

// Función principal de prueba
async function runTest() {
  log.info('🧪 Iniciando prueba de gestión de usuarios...')
  
  try {
    // Crear usuario de prueba
    log.info('📝 Creando usuario de prueba...')
    const createdUser = await createCompleteUser(TEST_USER_DATA)
    
    if (!createdUser) {
      throw new Error('No se pudo crear el usuario')
    }
    
    const userId = createdUser.authUser.id
    
    // Verificar datos creados
    log.info('🔍 Verificando datos creados...')
    const userData = await verifyUserData(userId)
    
    if (!userData) {
      throw new Error('No se pudieron verificar los datos del usuario')
    }
    
    log.success('✅ Usuario creado y verificado correctamente')
    
    // Esperar un momento antes de eliminar
    log.info('⏳ Esperando 2 segundos antes de eliminar...')
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Eliminar usuario de prueba
    log.info('🗑️  Eliminando usuario de prueba...')
    await deleteCompleteUser(userId)
    
    log.success('🎉 ¡Prueba completada exitosamente!')
    
  } catch (error) {
    log.error(`❌ Error en la prueba: ${error.message}`)
    process.exit(1)
  }
}

// Función para limpiar usuarios de prueba
async function cleanupTestUsers() {
  log.info('🧹 Limpiando usuarios de prueba...')
  
  try {
    const { data: users, error } = await supabase.auth.admin.listUsers()
    
    if (error) {
      throw new Error(`Error listando usuarios: ${error.message}`)
    }
    
    const testUsers = users.users.filter(user => 
      user.email.includes('test') || 
      user.email.includes('prueba') ||
      user.email.includes('@example.com')
    )
    
    if (testUsers.length === 0) {
      log.info('No se encontraron usuarios de prueba para eliminar')
      return
    }
    
    log.info(`Encontrados ${testUsers.length} usuarios de prueba`)
    
    for (const user of testUsers) {
      try {
        await deleteCompleteUser(user.id)
        log.success(`Usuario eliminado: ${user.email}`)
      } catch (error) {
        log.warning(`Error eliminando ${user.email}: ${error.message}`)
      }
    }
    
    log.success('Limpieza completada')
  } catch (error) {
    log.error(`Error en limpieza: ${error.message}`)
  }
}

// Manejo de argumentos de línea de comandos
const args = process.argv.slice(2)
const command = args[0]

switch (command) {
  case 'test':
    runTest()
    break
  case 'cleanup':
    cleanupTestUsers()
    break
  case 'verify':
    const userId = args[1]
    if (!userId) {
      log.error('Debe proporcionar un ID de usuario para verificar')
      process.exit(1)
    }
    verifyUserData(userId)
    break
  case 'delete':
    const deleteUserId = args[1]
    if (!deleteUserId) {
      log.error('Debe proporcionar un ID de usuario para eliminar')
      process.exit(1)
    }
    deleteCompleteUser(deleteUserId)
      .then(() => {
        log.success('Usuario eliminado exitosamente')
      })
      .catch((error) => {
        log.error(`Error eliminando usuario: ${error.message}`)
        process.exit(1)
      })
    break
  default:
    log.info('Uso: node test-user-management.js [comando]')
    log.info('Comandos disponibles:')
    log.info('  test     - Ejecutar prueba completa de creación y eliminación')
    log.info('  cleanup  - Limpiar usuarios de prueba')
    log.info('  verify <userId> - Verificar datos de un usuario específico')
    log.info('  delete <userId> - Eliminar un usuario específico')
    process.exit(0)
} 