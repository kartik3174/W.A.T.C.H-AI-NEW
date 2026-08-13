'use client'

import { useState, useEffect } from 'react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertTriangle, Bell, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { geofenceEventBus } from '@/app/shared-events/geofenceEventBus'

export interface BreachAlertProps {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
  autoHideDuration?: number
}

export function BreachAlert({ position = 'top-right', autoHideDuration = 8000 }: BreachAlertProps) {
  const [breaches, setBreaches] = useState<Array<any>>([])

  useEffect(() => {
    // Subscribe to breach events
    const unsubscribe = geofenceEventBus.onBreachDetected(event => {
      setBreaches(prev => [...prev, event])

      // Auto-remove alert after duration
      if (autoHideDuration > 0) {
        setTimeout(() => {
          setBreaches(prev => prev.filter(b => b.id !== event.id))
        }, autoHideDuration)
      }
    })

    return () => unsubscribe()
  }, [autoHideDuration])

  if (breaches.length === 0) return null

  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
  }

  return (
    <div className={`fixed ${positionClasses[position]} space-y-2 z-50 max-w-md`}>
      {breaches.map(breach => (
        <Alert
          key={breach.id}
          className="border-red-500 bg-red-50 dark:bg-red-950 dark:border-red-800 animate-pulse"
        >
          <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
          <AlertTitle className="text-red-800 dark:text-red-300">⚠️ Boundary Breach Alert</AlertTitle>
          <AlertDescription className="text-red-700 dark:text-red-200">
            <div className="space-y-1">
              <p className="font-semibold">{breach.animalName} left the reserve boundary</p>
              <p className="text-sm">Species: {breach.species}</p>
              <p className="text-sm">Direction: {breach.direction}</p>
              <p className="text-xs opacity-75">
                {breach.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </AlertDescription>
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2 h-6 w-6 p-0"
            onClick={() => setBreaches(prev => prev.filter(b => b.id !== breach.id))}
          >
            <X className="h-4 w-4" />
          </Button>
        </Alert>
      ))}
    </div>
  )
}
