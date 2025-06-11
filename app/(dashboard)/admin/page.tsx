import { AdminDashboard } from "@/features/admin"

export default function AdminPage() {
  return (
    <div className="container mx-auto py-6 px-4">
      <AdminDashboard />
    </div>
  )
}

export const metadata = {
  title: "Dashboard de Administración | RitterFinder",
  description: "Gestiona usuarios, roles, permisos y configuración del sistema",
} 