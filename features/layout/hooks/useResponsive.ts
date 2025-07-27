import { useState, useEffect, useCallback, useMemo } from 'react'
import type { UseResponsiveReturn, ResponsiveBreakpoints } from '../types'

const defaultBreakpoints: ResponsiveBreakpoints = {
  mobile: 768,
  tablet: 1024,
  desktop: 1440,
  wide: 1920
}

// Extended breakpoints for more granular control
const extendedBreakpoints = {
  xs: 480,      // Extra small devices (phones)
  sm: 640,      // Small devices (large phones)
  md: 768,      // Medium devices (tablets)
  lg: 1024,     // Large devices (laptops)
  xl: 1280,     // Extra large devices (desktops)
  '2xl': 1536,  // 2X Large devices (large desktops)
  '3xl': 1920   // 3X Large devices (ultra-wide)
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

  // Extended device detection
  const deviceInfo = useMemo(() => {
    const width = windowSize.width
    return {
      // Basic breakpoints
      isMobile: width < breakpoints.mobile,
      isTablet: width >= breakpoints.mobile && width < breakpoints.tablet,
      isDesktop: width >= breakpoints.desktop,
      isWide: width >= breakpoints.wide,
      
      // Extended breakpoints
      isXs: width < extendedBreakpoints.xs,
      isSm: width >= extendedBreakpoints.xs && width < extendedBreakpoints.sm,
      isMd: width >= extendedBreakpoints.sm && width < extendedBreakpoints.md,
      isLg: width >= extendedBreakpoints.md && width < extendedBreakpoints.lg,
      isXl: width >= extendedBreakpoints.lg && width < extendedBreakpoints.xl,
      is2xl: width >= extendedBreakpoints.xl && width < extendedBreakpoints['2xl'],
      is3xl: width >= extendedBreakpoints['2xl'],
      
      // Utility flags
      isSmallScreen: width < extendedBreakpoints.md,
      isMediumScreen: width >= extendedBreakpoints.md && width < extendedBreakpoints.xl,
      isLargeScreen: width >= extendedBreakpoints.xl,
      
      // Touch device detection (heuristic)
      isTouchDevice: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
      
      // Orientation
      isLandscape: width > windowSize.height,
      isPortrait: windowSize.height > width,
      
      // Aspect ratio categories
      isUltraWide: width / windowSize.height > 2.1,
      isWideScreen: width / windowSize.height > 1.6 && width / windowSize.height <= 2.1,
      isStandardRatio: width / windowSize.height > 1.2 && width / windowSize.height <= 1.6,
      isSquareish: width / windowSize.height > 0.8 && width / windowSize.height <= 1.2,
      isTallScreen: width / windowSize.height <= 0.8
    }
  }, [windowSize.width, windowSize.height])

  // Responsive utilities
  const utils = useMemo(() => ({
    // Breakpoint helpers
    above: (breakpoint: keyof typeof extendedBreakpoints) => 
      windowSize.width >= extendedBreakpoints[breakpoint],
    below: (breakpoint: keyof typeof extendedBreakpoints) => 
      windowSize.width < extendedBreakpoints[breakpoint],
    between: (min: keyof typeof extendedBreakpoints, max: keyof typeof extendedBreakpoints) => 
      windowSize.width >= extendedBreakpoints[min] && windowSize.width < extendedBreakpoints[max],
    
    // Grid helpers
    getGridCols: () => {
      if (deviceInfo.isXs) return 1
      if (deviceInfo.isSm) return 2
      if (deviceInfo.isMd) return 2
      if (deviceInfo.isLg) return 3
      if (deviceInfo.isXl) return 4
      return 5
    },
    
    // Container helpers
    getContainerClass: () => {
      if (deviceInfo.isXs) return 'px-4'
      if (deviceInfo.isSm) return 'px-6'
      if (deviceInfo.isMd) return 'px-6'
      if (deviceInfo.isLg) return 'px-8'
      return 'px-12'
    },
    
    // Text size helpers
    getTextSize: (scale: 'sm' | 'base' | 'lg' | 'xl') => {
      const sizes = {
        sm: deviceInfo.isSmallScreen ? 'text-sm' : 'text-base',
        base: deviceInfo.isSmallScreen ? 'text-base' : 'text-lg',
        lg: deviceInfo.isSmallScreen ? 'text-lg' : 'text-xl',
        xl: deviceInfo.isSmallScreen ? 'text-xl' : 'text-2xl'
      }
      return sizes[scale]
    },
    
    // Component size helpers
    getButtonSize: () => {
      if (deviceInfo.isSmallScreen) return 'sm'
      if (deviceInfo.isMediumScreen) return 'default'
      return 'lg'
    },
    
    // Navigation helpers
    shouldShowMobileNav: () => deviceInfo.isSmallScreen,
    shouldShowSidebar: () => deviceInfo.isLargeScreen,
    shouldCollapseNavigation: () => deviceInfo.isMediumScreen,
    
    // Layout helpers
    getLayoutDirection: () => deviceInfo.isSmallScreen ? 'column' : 'row',
    shouldStackElements: () => deviceInfo.isSmallScreen,
    
    // Performance helpers
    shouldReduceMotion: () => {
      if (typeof window !== 'undefined') {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches
      }
      return false
    },
    
    // Spacing helpers
    getSpacing: (scale: 'sm' | 'md' | 'lg') => {
      const spacing = {
        sm: deviceInfo.isSmallScreen ? '0.5rem' : '0.75rem',
        md: deviceInfo.isSmallScreen ? '0.75rem' : '1rem',
        lg: deviceInfo.isSmallScreen ? '1rem' : '1.5rem'
      }
      return spacing[scale]
    }
  }), [windowSize.width, windowSize.height, deviceInfo])

  return {
    // Legacy API (for backwards compatibility)
    breakpoint: currentBreakpoint,
    width: windowSize.width,
    height: windowSize.height,
    
    // Extended API
    ...deviceInfo,
    utils,
    breakpoints: extendedBreakpoints,
    
    // Window size
    windowSize,
    
    // Current breakpoint with extended info
    currentBreakpoint,
    
    // Aspect ratio
    aspectRatio: windowSize.width / windowSize.height
  }
} 