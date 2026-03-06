// Simple audio alert utility using Web Audio API as a fallback
export class AudioAlert {
  private static audioContext: AudioContext | null = null
  private static oscillator: OscillatorNode | null = null
  private static gainNode: GainNode | null = null
  private static isPlaying = false

  // Initialize the audio context
  static init(): void {
    try {
      if (!this.audioContext) {
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      }
    } catch (e) {
      console.log("Web Audio API not supported:", e)
    }
  }

  // Play a simple alert sound
  static play(): void {
    if (!this.audioContext || this.isPlaying) return

    try {
      this.isPlaying = true

      // Create oscillator for the beep sound
      this.oscillator = this.audioContext.createOscillator()
      this.gainNode = this.audioContext.createGain()

      // Connect nodes
      this.oscillator.connect(this.gainNode)
      this.gainNode.connect(this.audioContext.destination)

      // Set properties
      this.oscillator.type = "sine"
      this.oscillator.frequency.value = 800 // Hz
      this.gainNode.gain.value = 0.5

      // Start sound
      this.oscillator.start()

      // Schedule stop after 1 second
      setTimeout(() => this.stop(), 1000)
    } catch (e) {
      console.log("Error playing Web Audio alert:", e)
      this.isPlaying = false
    }
  }

  // Stop the alert sound
  static stop(): void {
    if (!this.audioContext || !this.isPlaying) return

    try {
      if (this.oscillator) {
        this.oscillator.stop()
        this.oscillator.disconnect()
        this.oscillator = null
      }

      if (this.gainNode) {
        this.gainNode.disconnect()
        this.gainNode = null
      }

      this.isPlaying = false
    } catch (e) {
      console.log("Error stopping Web Audio alert:", e)
    }
  }

  // Play a repeating alert pattern
  static playAlertPattern(count = 3, interval = 500): void {
    if (count <= 0) return

    this.play()

    setTimeout(() => {
      this.playAlertPattern(count - 1, interval)
    }, interval + 1000) // 1000ms is the duration of each beep
  }
}
