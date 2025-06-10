"use client"

import type { MobileHeaderProps } from "../types"

export function MobileHeader({ className = "" }: MobileHeaderProps) {
  return (
    <div className={`md:hidden bg-ritter-dark text-white p-6 text-center ${className}`}>
      <h2 className="text-xl font-bold text-ritter-gold mb-2">RitterMor Energy</h2>
      <p className="text-sm text-gray-300">Encuentra leads de energías renovables</p>
    </div>
  )
} 