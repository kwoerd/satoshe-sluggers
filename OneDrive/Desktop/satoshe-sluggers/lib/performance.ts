// lib/performance.ts
"use client"

interface PerformanceMetrics {
  lcp?: number
  fid?: number
  cls?: number
  fcp?: number
  ttfb?: number
}

export class PerformanceMonitor {
  private static instance: PerformanceMonitor
  private metrics: PerformanceMetrics = {}

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor()
    }
    return PerformanceMonitor.instance
  }

  init() {
    if (typeof window === 'undefined') return

    // Monitor Core Web Vitals
    this.observeLCP()
    this.observeFID()
    this.observeCLS()
    this.observeFCP()
    this.observeTTFB()
  }

  private observeLCP() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1]
        this.metrics.lcp = lastEntry.startTime
        this.logMetric('LCP', lastEntry.startTime)
      })
      observer.observe({ entryTypes: ['largest-contentful-paint'] })
    }
  }

  private observeFID() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry) => {
          const fidEntry = entry as PerformanceEntry & { processingStart: number };
          this.metrics.fid = fidEntry.processingStart - fidEntry.startTime
          this.logMetric('FID', this.metrics.fid)
        })
      })
      observer.observe({ entryTypes: ['first-input'] })
    }
  }

  private observeCLS() {
    if ('PerformanceObserver' in window) {
      let clsValue = 0
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry) => {
          const clsEntry = entry as PerformanceEntry & { hadRecentInput: boolean; value: number };
          if (!clsEntry.hadRecentInput) {
            clsValue += clsEntry.value
            this.metrics.cls = clsValue
            this.logMetric('CLS', clsValue)
          }
        })
      })
      observer.observe({ entryTypes: ['layout-shift'] })
    }
  }

  private observeFCP() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const fcpEntry = entries.find(entry => entry.name === 'first-contentful-paint')
        if (fcpEntry) {
          this.metrics.fcp = fcpEntry.startTime
          this.logMetric('FCP', fcpEntry.startTime)
        }
      })
      observer.observe({ entryTypes: ['paint'] })
    }
  }

  private observeTTFB() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const navigationEntry = entries.find(entry => entry.entryType === 'navigation') as PerformanceEntry & { responseStart: number; requestStart: number } | undefined
        if (navigationEntry) {
          this.metrics.ttfb = navigationEntry.responseStart - navigationEntry.requestStart
          this.logMetric('TTFB', this.metrics.ttfb)
        }
      })
      observer.observe({ entryTypes: ['navigation'] })
    }
  }

  private logMetric(name: string, value: number) {
    console.log(`[Performance] ${name}: ${value.toFixed(2)}ms`)
    
    // Send to analytics if available
    if (typeof window !== 'undefined' && (window as unknown as { gtag: (event: string, name: string, data: Record<string, unknown>) => void }).gtag) {
      (window as unknown as { gtag: (event: string, name: string, data: Record<string, unknown>) => void }).gtag('event', 'web_vitals', {
        metric_name: name,
        metric_value: Math.round(value),
        metric_delta: Math.round(value)
      })
    }
  }

  getMetrics(): PerformanceMetrics {
    return { ...this.metrics }
  }

  // Custom metrics
  measurePageLoad(pageName: string) {
    if (typeof window === 'undefined') return

    const startTime = performance.now()
    
    return {
      end: () => {
        const endTime = performance.now()
        const loadTime = endTime - startTime
        this.logMetric(`Page Load (${pageName})`, loadTime)
        return loadTime
      }
    }
  }

  measureComponentRender(componentName: string) {
    if (typeof window === 'undefined') return

    const startTime = performance.now()
    
    return {
      end: () => {
        const endTime = performance.now()
        const renderTime = endTime - startTime
        this.logMetric(`Component Render (${componentName})`, renderTime)
        return renderTime
      }
    }
  }
}

// Initialize performance monitoring
export const performanceMonitor = PerformanceMonitor.getInstance()

// Hook for React components
export function usePerformanceMonitor() {
  const monitor = performanceMonitor

  const measureRender = (componentName: string) => {
    return monitor.measureComponentRender(componentName)
  }

  const measurePageLoad = (pageName: string) => {
    return monitor.measurePageLoad(pageName)
  }

  return {
    measureRender,
    measurePageLoad,
    getMetrics: () => monitor.getMetrics()
  }
}
