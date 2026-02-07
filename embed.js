/**
 * Nuera Widget Embed Script
 * 
 * This script initializes the Nuera widget on the host page.
 * It creates an iframe container and handles communication between the host and the widget
 * for resizing and toggling state.
 */

(function () {
	// Configuration
	// For local development, we point to index.html. 
	// In production, this would be the full URL to where the widget is hosted.
	var WIDGET_URL = 'https://nuera-widget.pages.dev';
	var CONTAINER_ID = 'nuera-widget-container';

	// Dimensions map
	var DIMS = {
		CLOSED: { w: '120px', h: '120px' }, // Fits launcher (60px) + margins (24px)
		OPEN_DESKTOP: { w: '420px', h: '800px' }, // Fits widget (380px) + margins (~400px total width)
		OPEN_MOBILE: { w: '100%', h: '100%' }
	};

	// Prevent duplicate initialization
	if (document.getElementById(CONTAINER_ID)) {
		return;
	}

	// 1. Create the Container Div
	var container = document.createElement('div');
	container.id = CONTAINER_ID;

	// Apply base styles
	// We use max-height/width to ensure it doesn't overflow viewport on small screens even in desktop mode
	Object.assign(container.style, {
		position: 'fixed',
		bottom: '0',
		right: '0',
		width: DIMS.CLOSED.w,
		height: DIMS.CLOSED.h,
		border: 'none',
		zIndex: '2147483647', // Max safe integer to sit on top of everything
		background: 'transparent',
		transition: 'none', // We let the internal iframe content handle animations usually, or we can animate dimensions here
		maxHeight: '100vh',
		maxWidth: '100vw',
		pointerEvents: 'none' // Start with pointer-events none so the transparent box doesn't block clicks around the launcher
	});

	// 2. Resolve Script Params (API Key, etc.)
	// We look for the script tag that included this file to pass query params along
	var scripts = document.getElementsByTagName('script');
	var queryParams = '';
	for (var i = 0; i < scripts.length; i++) {
		var src = scripts[i].src;
		if (src && (src.indexOf('embed.js') > -1 || src.indexOf('nuera-widget') > -1) && src.indexOf('?') > -1) {
			queryParams = src.slice(src.indexOf('?'));
			break;
		}
	}

	// 3. Create the Iframe
	var iframe = document.createElement('iframe');
	iframe.src = WIDGET_URL + queryParams;

	Object.assign(iframe.style, {
		width: '100%',
		height: '100%',
		border: 'none',
		colorScheme: 'normal',
		pointerEvents: 'auto',
		background: 'transparent' // Explicitly transparent
	});

	iframe.allow = "microphone; camera; autoplay; clipboard-write";

	container.appendChild(iframe);
	document.body.appendChild(container);

	// 4. Message Handling (Cross-Origin Communication)
	window.addEventListener('message', function (event) {
		// In production, you should verify event.origin here
		if (event.origin !== 'https://nuera-widget.pages.dev') return;

		var action = event.data;

		// Handle specific actions
		if (action === 'show' || (action && action.action === 'show')) {
			// Determine if mobile
			var isMobile = window.innerWidth <= 480;

			container.style.width = isMobile ? DIMS.OPEN_MOBILE.w : DIMS.OPEN_DESKTOP.w;
			container.style.height = isMobile ? DIMS.OPEN_MOBILE.h : DIMS.OPEN_DESKTOP.h;

			// On mobile, we might want to adjust positioning or margins
			if (isMobile) {
				container.style.bottom = '0';
				container.style.right = '0';
				container.style.borderRadius = '0';
			} else {
				container.style.bottom = '0';
				container.style.right = '0'; // Keep consistent with closed state
			}

		} else if (action === 'hide' || (action && action.action === 'hide')) {
			// Reset to launcher size
			container.style.width = DIMS.CLOSED.w;
			container.style.height = DIMS.CLOSED.h;
			container.style.bottom = '0';
			container.style.right = '0';
		}
	});

	// 5. Handle Window Resize
	// If the widget is open and the window resizes (e.g. orientation change), adjust dimensions
	window.addEventListener('resize', function () {
		// Check if open by comparing current width to closed width
		if (container.style.width !== DIMS.CLOSED.w) {
			var isMobile = window.innerWidth <= 480;
			container.style.width = isMobile ? DIMS.OPEN_MOBILE.w : DIMS.OPEN_DESKTOP.w;
			container.style.height = isMobile ? DIMS.OPEN_MOBILE.h : DIMS.OPEN_DESKTOP.h;
		}
	});

})();
