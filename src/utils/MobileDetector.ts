/**
 * Mobile device detection utility
 *
 * Detects mobile devices using multiple heuristics:
 * - Touch capability
 * - User agent string patterns
 * - Screen size
 */

/**
 * Check if the current device is a mobile device
 * Uses a combination of touch detection, user agent, and screen size
 */
export function isMobileDevice(): boolean {
    // Check for touch capability
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    // Check user agent for mobile patterns
    const isMobileUA = /Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
    );

    // Check screen size (mobile devices typically < 1024px wide)
    const isSmallScreen = window.innerWidth < 1024;

    // Consider it mobile if: (has touch AND mobile UA) OR (has touch AND small screen)
    return (hasTouch && isMobileUA) || (hasTouch && isSmallScreen);
}
