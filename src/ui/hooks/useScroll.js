import { useState, useEffect } from 'react';
import { useInput } from 'ink';

/**
 * Hook to handle scrolling through a list of items
 *
 * Props:
 * - items: array of items to scroll through
 * - pageSize: number of items visible at once
 * - initialIndex: starting selected index
 *
 * Returns:
 * - selectedIndex: current selected item index
 * - startIndex: index of first visible item
 * - endIndex: index of last visible item (exclusive)
 * - visibleItems: array of currently visible items
 * - canScrollUp: boolean
 * - canScrollDown: boolean
 * - scrollUp: function to scroll up
 * - scrollDown: function to scroll down
 * - select: function to select an item by index
 */
export function useScroll(items = [], pageSize = 10, initialIndex = 0) {
  const [selectedIndex, setSelectedIndex] = useState(initialIndex);
  const [startIndex, setStartIndex] = useState(0);

  const totalItems = items.length;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const visibleItems = items.slice(startIndex, endIndex);

  const canScrollUp = startIndex > 0;
  const canScrollDown = endIndex < totalItems;

  // Ensure selected index is within visible range
  useEffect(() => {
    if (selectedIndex < startIndex) {
      setStartIndex(selectedIndex);
    } else if (selectedIndex >= endIndex) {
      setStartIndex(Math.max(0, selectedIndex - pageSize + 1));
    }
  }, [selectedIndex, startIndex, endIndex, pageSize]);

  const scrollUp = () => {
    if (selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1);
    }
  };

  const scrollDown = () => {
    if (selectedIndex < totalItems - 1) {
      setSelectedIndex(selectedIndex + 1);
    }
  };

  const scrollPageUp = () => {
    const newIndex = Math.max(0, selectedIndex - pageSize);
    setSelectedIndex(newIndex);
    setStartIndex(Math.max(0, newIndex));
  };

  const scrollPageDown = () => {
    const newIndex = Math.min(totalItems - 1, selectedIndex + pageSize);
    setSelectedIndex(newIndex);
  };

  const scrollToTop = () => {
    setSelectedIndex(0);
    setStartIndex(0);
  };

  const scrollToBottom = () => {
    setSelectedIndex(totalItems - 1);
    setStartIndex(Math.max(0, totalItems - pageSize));
  };

  const select = (index) => {
    if (index >= 0 && index < totalItems) {
      setSelectedIndex(index);
    }
  };

  return {
    selectedIndex,
    startIndex,
    endIndex,
    visibleItems,
    canScrollUp,
    canScrollDown,
    scrollUp,
    scrollDown,
    scrollPageUp,
    scrollPageDown,
    scrollToTop,
    scrollToBottom,
    select,
    totalItems
  };
}

/**
 * Hook to automatically handle keyboard input for scrolling
 *
 * Props: same as useScroll
 * Options:
 * - onSelect: callback when item is selected (Enter pressed)
 * - onEscape: callback when escape is pressed
 * - disabled: disable keyboard input
 */
export function useScrollWithKeyboard(items = [], pageSize = 10, options = {}) {
  const {
    onSelect,
    onEscape,
    disabled = false,
    initialIndex = 0
  } = options;

  const scroll = useScroll(items, pageSize, initialIndex);

  useInput((input, key) => {
    if (disabled) return;

    if (key.upArrow || input === 'k') {
      scroll.scrollUp();
    } else if (key.downArrow || input === 'j') {
      scroll.scrollDown();
    } else if (key.pageUp) {
      scroll.scrollPageUp();
    } else if (key.pageDown) {
      scroll.scrollPageDown();
    } else if (input === 'g') {
      scroll.scrollToTop();
    } else if (input === 'G') {
      scroll.scrollToBottom();
    } else if (key.return && onSelect) {
      onSelect(items[scroll.selectedIndex], scroll.selectedIndex);
    } else if (key.escape && onEscape) {
      onEscape();
    }
  }, [scroll, items, onSelect, onEscape, disabled]);

  return scroll;
}

export default useScroll;
