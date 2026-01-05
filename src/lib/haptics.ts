/**
 * Haptic Feedback Utility
 * Provides tactile feedback on supported mobile devices
 */

export const haptic = {
  /**
   * Light tap - for small interactions
   * Use: checkbox toggle, button press
   */
  light: () => {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate(10);
    }
  },

  /**
   * Medium tap - for confirmations
   * Use: form submit, action complete
   */
  medium: () => {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate(20);
    }
  },

  /**
   * Success pattern - double tap
   * Use: task completion, milestone achieved
   */
  success: () => {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate([10, 50, 10]);
    }
  },

  /**
   * Error pattern - longer single tap
   * Use: form error, action failed
   */
  error: () => {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate(40);
    }
  },
};
