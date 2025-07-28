import { AdminDashboard } from "@/features/admin"

export default function AdminPage() {
  return (
    <div className="container mx-auto py-8 px-4 min-h-screen">
      <AdminDashboard />
    </div>
  )
}

export const metadata = {
  title: "Dashboard de Administración | RitterFinder",
  description: "Gestiona usuarios, roles, permisos y configuración del sistema",
} 