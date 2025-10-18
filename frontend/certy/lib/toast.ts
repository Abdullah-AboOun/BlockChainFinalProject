// Simple toast notification utility
export const toast = {
  success: (message: string) => {
    console.log("✓", message)
  },
  error: (message: string) => {
    console.error("✗", message)
  },
}
