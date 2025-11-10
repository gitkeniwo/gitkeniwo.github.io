/**
 * Theme Switcher
 * Handles manual theme switching and respects system preferences
 */

(function() {
  'use strict';

  const THEME_KEY = 'cactus-theme';
  const THEME_AUTO = 'auto';
  const THEME_LIGHT = 'light';
  const THEME_DARK = 'dark';

  /**
   * Get the preferred theme based on system settings
   */
  function getSystemTheme() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return THEME_DARK;
    }
    return THEME_LIGHT;
  }

  /**
   * Get the current theme setting
   */
  function getCurrentTheme() {
    try {
      const stored = localStorage.getItem(THEME_KEY);
      if (stored && [THEME_AUTO, THEME_LIGHT, THEME_DARK].includes(stored)) {
        return stored;
      }
    } catch (e) {
      console.warn('Could not access localStorage:', e);
    }
    return THEME_AUTO;
  }

  /**
   * Apply theme to the document
   */
  function applyTheme(theme) {
    const root = document.documentElement;

    if (theme === THEME_AUTO) {
      // Remove data-theme attribute to let prefers-color-scheme take over
      root.removeAttribute('data-theme');

      // Update meta theme-color based on system preference
      const systemTheme = getSystemTheme();
      updateMetaThemeColor(systemTheme);
    } else {
      // Set explicit theme
      root.setAttribute('data-theme', theme);
      updateMetaThemeColor(theme);
    }
  }

  /**
   * Update meta theme-color tag
   */
  function updateMetaThemeColor(theme) {
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      const color = theme === THEME_DARK ? '#1d1f21' : '#e2e0de';
      metaThemeColor.setAttribute('content', color);
    }
  }

  /**
   * Set and save theme
   */
  function setTheme(theme) {
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch (e) {
      console.warn('Could not save theme to localStorage:', e);
    }
    applyTheme(theme);

    // Dispatch custom event for other scripts to listen to
    window.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));
  }

  /**
   * Toggle between themes
   */
  function toggleTheme() {
    const currentTheme = getCurrentTheme();
    const systemTheme = getSystemTheme();

    // Cycle: auto -> light -> dark -> auto
    if (currentTheme === THEME_AUTO) {
      // If in auto mode, switch to the opposite of system theme
      setTheme(systemTheme === THEME_DARK ? THEME_LIGHT : THEME_DARK);
    } else if (currentTheme === THEME_LIGHT) {
      setTheme(THEME_DARK);
    } else {
      setTheme(THEME_AUTO);
    }
  }

  /**
   * Initialize theme on page load
   */
  function initTheme() {
    const theme = getCurrentTheme();
    applyTheme(theme);

    // Listen for system theme changes
    if (window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

      // Modern browsers
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', function(e) {
          const currentTheme = getCurrentTheme();
          if (currentTheme === THEME_AUTO) {
            applyTheme(THEME_AUTO);
          }
        });
      }
      // Older browsers
      else if (mediaQuery.addListener) {
        mediaQuery.addListener(function(e) {
          const currentTheme = getCurrentTheme();
          if (currentTheme === THEME_AUTO) {
            applyTheme(THEME_AUTO);
          }
        });
      }
    }
  }

  // Initialize immediately
  initTheme();

  // Expose functions globally
  window.cactusTheme = {
    toggle: toggleTheme,
    set: setTheme,
    get: getCurrentTheme,
    getSystem: getSystemTheme
  };

  // Add keyboard shortcut (Ctrl/Cmd + Shift + D for Dark mode toggle)
  document.addEventListener('keydown', function(e) {
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'D') {
      e.preventDefault();
      toggleTheme();
    }
  });

})();
