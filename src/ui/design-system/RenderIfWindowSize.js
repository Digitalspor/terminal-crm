import React from 'react';
import { useWindowSize } from '../hooks/useWindowSize.js';

/**
 * RenderIfWindowSize - Conditional rendering based on terminal width
 *
 * Props:
 * - minWidth: minimum width to render (optional)
 * - maxWidth: maximum width to render (optional)
 * - mobile: render only on mobile (< 60 cols)
 * - small: render only on small (60-80 cols)
 * - medium: render only on medium (80-120 cols)
 * - large: render only on large (> 120 cols)
 * - children: content to render
 * - fallback: content to render when condition not met
 */
export function RenderIfWindowSize({
  minWidth,
  maxWidth,
  mobile = false,
  small = false,
  medium = false,
  large = false,
  children,
  fallback = null
}) {
  const { width, isMobile, isSmall, isMedium, isLarge } = useWindowSize();

  let shouldRender = true;

  // Check breakpoint flags
  if (mobile || small || medium || large) {
    shouldRender = (
      (mobile && isMobile) ||
      (small && isSmall) ||
      (medium && isMedium) ||
      (large && isLarge)
    );
  }

  // Check min/max width
  if (minWidth !== undefined && width < minWidth) {
    shouldRender = false;
  }

  if (maxWidth !== undefined && width > maxWidth) {
    shouldRender = false;
  }

  return shouldRender ? children : fallback;
}

/**
 * Responsive - Render different content based on screen size
 *
 * Props:
 * - mobile: component for mobile size
 * - small: component for small size
 * - medium: component for medium size
 * - large: component for large size
 * - default: fallback component
 */
export function Responsive({
  mobile,
  small,
  medium,
  large,
  default: defaultComponent = null
}) {
  const { isMobile, isSmall, isMedium, isLarge } = useWindowSize();

  if (isMobile && mobile) return mobile;
  if (isSmall && small) return small;
  if (isMedium && medium) return medium;
  if (isLarge && large) return large;

  return defaultComponent;
}

/**
 * HideOnSmallScreen - Hide content on small screens
 */
export function HideOnSmallScreen({ children, threshold = 80 }) {
  return (
    <RenderIfWindowSize minWidth={threshold}>
      {children}
    </RenderIfWindowSize>
  );
}

/**
 * ShowOnlyOnSmallScreen - Show content only on small screens
 */
export function ShowOnlyOnSmallScreen({ children, threshold = 80 }) {
  return (
    <RenderIfWindowSize maxWidth={threshold - 1}>
      {children}
    </RenderIfWindowSize>
  );
}

export default RenderIfWindowSize;
