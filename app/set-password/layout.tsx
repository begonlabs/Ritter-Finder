import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Establecer Contraseña - RitterFinder",
  description: "Configura tu contraseña para acceder a RitterFinder, la plataforma de leads de energías renovables.",
  robots: "noindex, nofollow", // Demo page shouldn't be indexed
  openGraph: {
    title: "Establecer Contraseña - RitterFinder",
    description: "Configura tu contraseña para acceder a RitterFinder",
    type: "website",
  },
}

export default function SetPasswordLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="set-password-layout">
      {children}
    </div>
  )
} 