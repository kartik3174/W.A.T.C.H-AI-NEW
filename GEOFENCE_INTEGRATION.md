# Geofence Breach → Autonomous Drone Response Integration Guide

## Overview

The Geofence Breach → Autonomous Drone Response system is a non-invasive, modular feature that automatically deploys drones when tracked animals cross reserve boundaries. It integrates seamlessly with the existing tracking and drone response systems without modifying any existing code.

## Architecture

### Module Structure

```
app/
  ├── geofence-events/
  │   ├── eventTypes.ts          # Event definitions and listener registry
  │   └── geofenceListener.ts    # Breach detection algorithms
  │
  ├── drone-response/
  │   └── autoLaunchHandler.ts   # Auto-launch decision logic
  │
  └── geofence-demo/
      └── page.tsx               # Demo and testing interface

components/
  └── geofence/
      └── breach-simulator.tsx   # Test scenarios

hooks/
  └── useGeofenceMonitoring.ts   # React hook for monitoring
```

## Key Components

### 1. Event Types (`app/geofence-events/eventTypes.ts`)

Defines the geofence breach event structure and provides a passive listener registration system:

```typescript
interface GeofenceBreachEvent {
  type: "geofence_breach"
  animal: string
  animalId: string
  species: string
  location: { x: number; y: number }
  direction: "outbound" | "inbound"
  timestamp: number
  severity: "low" | "medium" | "high"
}
```

**Key Functions:**
- `onGeofenceBreach(listener)` - Register listener for breach events
- `emitGeofenceBreach(event)` - Emit breach event to all listeners
- `getActiveListeners()` - Get count of active listeners
- `clearAllListeners()` - Clear all listeners (for testing)

### 2. Geofence Listener (`app/geofence-events/geofenceListener.ts`)

Provides algorithms for detecting boundary violations:

- `isPointInPolygon()` - Ray-casting algorithm for point-in-polygon testing
- `isInWarningZone()` - Check if animal is in warning zone
- `detectBreach()` - Detect boundary violation between two positions
- `findNearestBase()` - Find closest drone base to breach location

### 3. Auto-Launch Handler (`app/drone-response/autoLaunchHandler.ts`)

Automatically triggers drone response when breach is detected:

**Configuration:**
```typescript
interface AutoLaunchConfig {
  enabled: boolean              // Enable/disable auto-launch
  minSeverity: "low" | "medium" | "high"  // Minimum breach severity
  autoDeployOnBreach: boolean   // Auto deploy drones
  notifyUser: boolean           // Send notifications
}
```

**Key Functions:**
- `handleGeofenceBreach(event)` - Process breach and trigger drone launch
- `convertBreachToThreat(event)` - Convert to threat event for drone system
- `setAutoLaunchConfig(config)` - Update configuration
- `isAutoLaunchEnabled()` - Check if auto-launch is active

### 4. Monitoring Hook (`hooks/useGeofenceMonitoring.ts`)

React hook for attaching geofence monitoring to components:

```typescript
const { checkBreaches, resetMonitoring } = useGeofenceMonitoring({
  enabled: true,
  onBreach: (event) => console.log("Breach detected:", event),
})

// Call this when animal positions update
checkBreaches(animalPositions)
```

## Integration Points

### Without Modifying Existing Code

The system integrates through:

1. **Event Listener Pattern** - Passive listeners for geofence breach events
2. **Shared Event Bus** - Uses existing `eventBus` to emit threat events
3. **React Context** - Can be attached to components via hooks
4. **Configuration API** - Enable/disable without code changes

### How It Works

```
Animal Position Update (in tracking component)
    ↓
[Optional] Call useGeofenceMonitoring.checkBreaches()
    ↓
Breach Detection Algorithm runs
    ↓
[If breach detected] emitGeofenceBreach() event
    ↓
Registered listeners receive event
    ↓
handleGeofenceBreach() converts to threat event
    ↓
Threat emitted to eventBus
    ↓
Drone Response System receives threat
    ↓
selectOptimalDrone() and deployDrone()
    ↓
Drone launches automatically
```

## Integration with Tracking System

### Option 1: Attach Hook to Tracking Component

In `components/tracking/tracking-map.tsx`:

```typescript
import { useGeofenceMonitoring } from "@/hooks/useGeofenceMonitoring"

export function TrackingMap() {
  const animals = useAnimals()
  const { checkBreaches } = useGeofenceMonitoring()

  useEffect(() => {
    // Check for breaches whenever animals update
    checkBreaches(animals)
  }, [animals, checkBreaches])

  // ... rest of component
}
```

### Option 2: Passive Monitoring

The system can run independently in background via event listener subscription without any changes to tracking component.

## Demo and Testing

### Access the Demo

Navigate to `/geofence-demo` to:

- View system overview and architecture
- Test breach scenarios with the simulator
- Configure auto-launch settings
- Monitor active listeners
- Check system status

### Test Scenarios

Pre-built breach scenarios:
- Elephant crossing north boundary
- Lion escaping east sector
- Rhino heading south
- Tiger approaching western boundary

### Browser Console Testing

```javascript
// Import modules in console
import { emitGeofenceBreach } from "@/app/geofence-events/eventTypes"
import { handleGeofenceBreach } from "@/app/drone-response/autoLaunchHandler"

// Create test event
const testEvent = {
  type: "geofence_breach",
  animal: "Tembo",
  animalId: "EL-001",
  species: "Elephant",
  location: { x: 35, y: 2 },
  direction: "outbound",
  timestamp: Date.now(),
  severity: "high",
}

// Emit and trigger response
emitGeofenceBreach(testEvent)
handleGeofenceBreach(testEvent)
```

## Configuration

### Enable/Disable Auto-Launch

```typescript
import { setAutoLaunchEnabled } from "@/app/drone-response/autoLaunchHandler"

// Enable
setAutoLaunchEnabled(true)

// Disable
setAutoLaunchEnabled(false)
```

### Update Configuration

```typescript
import { setAutoLaunchConfig } from "@/app/drone-response/autoLaunchHandler"

setAutoLaunchConfig({
  minSeverity: "medium",
  autoDeployOnBreach: true,
  notifyUser: true,
})
```

## Event Flow

### Complete Pipeline

```
1. DETECTION PHASE
   - Animal tracking system updates position
   - Geofence monitor checks against boundary polygon
   - Point-in-polygon algorithm detects boundary cross

2. EVENT EMISSION PHASE
   - GeofenceBreachEvent created with:
     - Animal ID, name, species
     - Current position (x, y)
     - Direction (inbound/outbound)
     - Severity level (high for boundary breach)
     - Timestamp

3. AUTO-LAUNCH PHASE
   - handleGeofenceBreach() receives event
   - Validates severity against threshold
   - Finds nearest drone base
   - Converts to ThreatEvent
   - Emits via eventBus

4. DRONE RESPONSE PHASE
   - DroneResponsePage subscribes to eventBus
   - selectOptimalDrone() picks best drone
   - deployDrone() creates mission
   - Drone launches automatically
```

## Non-Invasiveness Guarantees

✓ **No tracking system modifications** - Tracking component unchanged
✓ **No drone system modifications** - Drone deployment code unchanged
✓ **No database changes** - Only events in memory
✓ **No API changes** - Uses existing shared event bus
✓ **No UI changes** - Existing pages unmodified
✓ **Fully optional** - Can be enabled/disabled via config
✓ **Fully testable** - Demo page and simulator included
✓ **Modular design** - Each module independent

## Debugging

### Enable Console Logging

All modules use `console.log("[Module]")` prefixes:

- `[Geofence]` - Event emission
- `[Geofence Monitor]` - Breach detection
- `[AutoLaunch]` - Auto-launch decisions
- `[Breach Simulator]` - Test scenarios

### Check Active Listeners

```typescript
import { getActiveListeners } from "@/app/geofence-events/eventTypes"

console.log("Active listeners:", getActiveListeners())
```

### Monitor Event Flow

Open browser console and watch for:
- `[Geofence Monitor] Breach detected:` - Breach detected
- `[AutoLaunch] Processing geofence breach:` - Processing started
- `[AutoLaunch] Emitting threat event to drone system:` - Threat emitted
- `[DEPLOYMENT]` in Drone Response Page - Drone deployed

## Performance Considerations

- **Breach Detection**: O(n) per animal check (n = boundary vertices)
- **Debouncing**: 5-second minimum between breach events per animal
- **Memory**: Tracks only current animal positions (minimal overhead)
- **Event Bus**: Async, non-blocking event emissions

## Future Enhancements

1. **Historical Breach Tracking** - Store breach events in database
2. **Breach Notifications** - Email/SMS alerts on boundary violation
3. **Custom Boundaries** - Allow dynamic boundary definition
4. **Multi-level Response** - Different drone types based on animal
5. **Analytics Dashboard** - Track breach patterns and hotspots

## Support & Troubleshooting

**Drones not deploying?**
- Check if auto-launch is enabled: `isAutoLaunchEnabled()`
- Verify severity meets threshold
- Check drone fleet availability

**No breach events detected?**
- Verify boundary polygon coordinates
- Check animal position updates are being called
- Monitor listener count: `getActiveListeners()`

**False positives?**
- Adjust debounce timing (5 seconds default)
- Check boundary polygon accuracy
- Review severity thresholds
