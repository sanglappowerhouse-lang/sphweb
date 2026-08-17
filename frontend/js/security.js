/**
 * ==========================================================================
 * SANGLAP POWER HOUSE GYM - CLIENT-SIDE SECURITY CORE
 * Optimized and manually authored layout protection, clickjacking defense,
 * and DevTools deterring engine.
 * ==========================================================================
 */

(function () {
    'use strict';

    // 1. Clickjacking Protection (Frame Busting)
    if (window.self !== window.top) {
        try {
            window.top.location = window.self.location;
        } catch (e) {
            window.location = 'about:blank';
        }
    }

    // 2. Disable Context Menu (Right Click)
    document.addEventListener('contextmenu', function (e) {
        e.preventDefault();
        return false;
    });

    // 3. Disable DevTools and Source-Viewing Keyboard Shortcuts
    document.addEventListener('keydown', function (e) {
        // F12 key
        if (e.keyCode === 123) {
            e.preventDefault();
            return false;
        }

        // Ctrl+Shift+I or Cmd+Opt+I (Chrome/Firefox/Safari DevTools)
        if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.keyCode === 73)) {
            e.preventDefault();
            return false;
        }

        // Ctrl+Shift+J or Cmd+Opt+J (Console panel)
        if (e.ctrlKey && e.shiftKey && (e.key === 'J' || e.key === 'j' || e.keyCode === 74)) {
            e.preventDefault();
            return false;
        }

        // Ctrl+Shift+C or Cmd+Opt+C (Inspect Element)
        if (e.ctrlKey && e.shiftKey && (e.key === 'C' || e.key === 'c' || e.keyCode === 67)) {
            e.preventDefault();
            return false;
        }

        // Ctrl+U or Cmd+Opt+U (View Source code)
        if (e.ctrlKey && (e.key === 'U' || e.key === 'u' || e.keyCode === 85)) {
            e.preventDefault();
            return false;
        }

        // Ctrl+S or Cmd+S (Save Page)
        if (e.ctrlKey && (e.key === 'S' || e.key === 's' || e.keyCode === 83)) {
            e.preventDefault();
            return false;
        }
        
        // Ctrl+Shift+K (Firefox Web Console shortcut)
        if (e.ctrlKey && e.shiftKey && (e.key === 'K' || e.key === 'k' || e.keyCode === 75)) {
            e.preventDefault();
            return false;
        }
    });

    // 4. Overwrite Console APIs to prevent inspection / console profiling
    (function disableConsole() {
        const noop = function () {};
        try {
            if (window.console) {
                window.console.log = noop;
                window.console.warn = noop;
                window.console.error = noop;
                window.console.info = noop;
                window.console.debug = noop;
                window.console.clear = noop;
            }
        } catch (e) {}
    })();

    // 5. Anti-Debugging Breakpoint Loop (Halts DevTools inspection)
    (function debuggerLoop() {
        function triggerDebugger() {
            try {
                // Dynamically construct a debugger call to thwart simple static filters
                (function () {
                    return false;
                }["constructor"]("debugger")["call"]());
            } catch (err) {
                // Ignore errors
            }
        }
        
        // Trigger debugger on short random intervals to break debugger flow in DevTools
        setInterval(triggerDebugger, 100);
    })();

    // 6. DOM Guard: Prevent unauthorized manipulation of critical HTML components
    document.addEventListener('DOMContentLoaded', function () {
        const criticalElements = [
            '.navbar',
            '.pricing-grid',
            '.exclusive-training-container',
            '.trust-badge',
            '#dronacharya-booking-form',
            'script[src*="security.js"]'
        ];

        // Only monitor direct attribute changes on elements that are never modified by original scripts
        // (Excludes .navbar due to scroll styling, and .trust-badge due to mouse tilt styling)
        const attributeMonitoredElements = [
            '.pricing-grid',
            '.exclusive-training-container',
            '#dronacharya-booking-form',
            'script[src*="security.js"]'
        ];

        const checkAndRevert = function (mutationsList) {
            let tamperingDetected = false;

            for (const mutation of mutationsList) {
                // A. Check if a critical element was removed from the DOM
                if (mutation.type === 'childList' && mutation.removedNodes.length > 0) {
                    for (const node of mutation.removedNodes) {
                        if (node.nodeType === 1) { // Element Node
                            for (const selector of criticalElements) {
                                if (node.matches(selector) || node.querySelector(selector)) {
                                    tamperingDetected = true;
                                    break;
                                }
                            }
                        }
                    }
                }

                // B. Check if attributes on critical elements were directly modified
                if (mutation.type === 'attributes') {
                    const target = mutation.target;
                    for (const selector of attributeMonitoredElements) {
                        if (target.matches(selector)) {
                            tamperingDetected = true;
                            break;
                        }
                    }
                }

                if (tamperingDetected) break;
            }

            if (tamperingDetected) {
                // If unauthorized DOM modifications are detected, alert and reload state
                alert('Security alert: Unauthorized layout modification detected.');
                window.location.reload();
            }
        };

        const observer = new MutationObserver(checkAndRevert);
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true
        });
        
        // Also observe head to prevent removing scripts
        const headObserver = new MutationObserver(checkAndRevert);
        headObserver.observe(document.head, {
            childList: true,
            subtree: true,
            attributes: true
        });
    });
})();
