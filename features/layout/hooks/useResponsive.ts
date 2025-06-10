import { useState, useEffect, useCallback } from 'react'
import type { UseResponsiveReturn, ResponsiveBreakpoints } from '../types'

const defaultBreakpoints: ResponsiveBreakpoints = {
  mobile: 768,
  tablet: 1024,
  desktop: 1440,
  wide: 1920
}

export const useResponsive = (
  customBreakpoints?: Partial<ResponsiveBreakpoints>
): UseResponsiveReturn => {
  const breakpoints = { ...defaultBreakpoints, ...customBreakpoints }
  
  const [windowSize, setWindowSize] = useState({
    width: 0,
    height: 0
  })

  const updateSize = useCallback(() => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight
    })
  }, [])

  useEffect(() => {
    // Initialize size on client
    updateSize()
    
    // Add event listener
    window.addEventListener('resize', updateSize)
    
    // Cleanup
    return () => window.removeEventListener('resize', updateSize)
  }, [updateSize])

  const getBreakpoint = (width: number): keyof ResponsiveBreakpoints => {
    if (width >= breakpoints.wide) return 'wide'
    if (width >= breakpoints.desktop) return 'desktop'
    if (width >= breakpoints.tablet) return 'tablet'
    return 'mobile'
  }

  const currentBreakpoint = getBreakpoint(windowSize.width)

  return {
    isMobile: windowSize.width < breakpoints.mobile,
    isTablet: windowSize.width >= breakpoints.mobile && windowSize.width < breakpoints.tablet,
    isDesktop: windowSize.width >= breakpoints.desktop,
    breakpoint: currentBreakpoint,
    width: windowSize.width,
    height: windowSize.height
  }
} 