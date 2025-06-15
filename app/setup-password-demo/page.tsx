import { SetupPasswordPage } from "@/features/auth"

export default function SetupPasswordDemo() {
  return (
    <SetupPasswordPage 
      token="demo-token-123" 
      email="usuario@ejemplo.com" 
    />
  )
}

export const metadata = {
  title: "Configurar Contraseña - Demo | RitterFinder",
  description: "Vista de demostración para configurar contraseña",
} 