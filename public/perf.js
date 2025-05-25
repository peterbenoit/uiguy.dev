/**
 * Performance optimizations for uiguy.dev
 */

// Execute when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
	// Optimize icon loading - defer loading of icons that are not in viewport
	const observeElements = (elements, threshold = 0.1) => {
		if (!('IntersectionObserver' in window)) return;

		const observer = new IntersectionObserver((entries) => {
			entries.forEach(entry => {
				if (entry.isIntersecting) {
					// Add visible class to improve rendering performance
					entry.target.classList.add('visible');
					observer.unobserve(entry.target);
				}
			});
		}, { threshold });

		elements.forEach(el => observer.observe(el));
	};

	// Observe all link cards below the fold
	const linkCards = Array.from(document.querySelectorAll('.links-container .link-card')).slice(5);
	observeElements(linkCards);

	// Reduce paint complexity
	const reduceAnimationIfReduceMotion = () => {
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
			document.documentElement.classList.add('reduce-motion');
		}
	};
	reduceAnimationIfReduceMotion();

	// Optimize event handling for interactions
	const socialIcons = document.querySelectorAll('.social-icon');
	socialIcons.forEach(icon => {
		// Use passive event listeners to improve scrolling performance
		icon.addEventListener('mouseenter', () => { }, { passive: true });
		icon.addEventListener('mouseleave', () => { }, { passive: true });
	});

	// Add lazy loading to images that aren't in the initial viewport
	const lazyImages = document.querySelectorAll('img[loading="lazy"]');

	if ('IntersectionObserver' in window) {
		const imageObserver = new IntersectionObserver((entries) => {
			entries.forEach(entry => {
				if (entry.isIntersecting) {
					const img = entry.target;
					img.src = img.dataset.src;
					imageObserver.unobserve(img);
				}
			});
		});

		lazyImages.forEach(img => imageObserver.observe(img));
	}

	// Preload important resources when the browser is idle
	if ('requestIdleCallback' in window) {
		requestIdleCallback(() => {
			// Preload hover state images or other resources
			const preloadLink = document.createElement('link');
			preloadLink.rel = 'preload';
			preloadLink.as = 'image';
			preloadLink.href = '/img/crucial-image.webp'; // FIXME: Update with actual critical resource path
			document.head.appendChild(preloadLink);
		});
	}
});

// Use passive event listeners for touch events to improve scrolling performance
document.addEventListener('touchstart', () => { }, { passive: true });

// Add Resource Hints dynamically
const addResourceHint = (type, url) => {
	const link = document.createElement('link');
	link.rel = type;
	link.href = url;
	document.head.appendChild(link);
};

// Prefetch external resources when browser is idle
if ('requestIdleCallback' in window) {
	requestIdleCallback(() => {
		// Prefetch important resources
		const resources = [
			'https://github.com/peterbenoit',
			'https://peterbenoit.com'
		];

		resources.forEach(url => {
			addResourceHint('prefetch', url);
		});
	}, { timeout: 5000 });
}

// Defer non-critical CSS
const loadDeferredStyles = () => {
	const addStylesNode = document.getElementById('deferred-styles');
	if (!addStylesNode) return;

	const replacement = document.createElement('div');
	replacement.innerHTML = addStylesNode.textContent;
	document.body.appendChild(replacement);
	addStylesNode.parentElement.removeChild(addStylesNode);
};

// Use requestAnimationFrame for visual changes
const rafCallback = () => {
	// Handle any animations or visual updates here
	// Example: Smoothly animate an element's opacity
	const animatedElement = document.getElementById('animated-element');
	if (animatedElement) {
		let opacity = parseFloat(animatedElement.style.opacity || 0);
		if (opacity < 1) {
			opacity += 0.05;
			animatedElement.style.opacity = opacity;
			requestAnimationFrame(rafCallback);
		}
	}
};

// Call rafCallback to initiate animation if an element with id 'animated-element' exists
if (document.getElementById('animated-element')) {
	requestAnimationFrame(rafCallback);
}

// Run performance-sensitive operations during idle periods
if ('requestIdleCallback' in window) {
	requestIdleCallback(() => {
		// Heavy calculations or non-critical operations
		// Example: Send analytics data or perform non-critical logging
		console.log('Browser is idle, performing non-critical tasks.');
		// if (typeof sendAnalytics === 'function') {
		// sendAnalytics({ event: 'idle_task_executed' });
		// }
	});
}

// Initialize Web Vitals monitoring
if ('PerformanceObserver' in window) {
	try {
		const observer = new PerformanceObserver((list) => {
			list.getEntries().forEach((entry) => {
				// Log core web vitals to console
				console.log(`[Web Vitals] ${entry.name}: ${entry.startTime.toFixed(0)}ms`);
			});
		});
		observer.observe({ type: 'largest-contentful-paint', buffered: true });
		observer.observe({ type: 'layout-shift', buffered: true });
		observer.observe({ type: 'first-input', buffered: true });
	} catch (e) {
		console.error('[Web Vitals]', e);
	}
}

// Monitor performance
if ('PerformanceObserver' in window) {
	const perfObserver = new PerformanceObserver((list) => {
		const entries = list.getEntries();
		entries.forEach((entry) => {
			// Log or send to analytics
			if (entry.entryType === 'largest-contentful-paint') {
				console.log(`LCP: ${entry.startTime}`);
			}
		});
	});

	// Observe different performance metrics
	perfObserver.observe({ entryTypes: ['largest-contentful-paint', 'layout-shift'] });
}
