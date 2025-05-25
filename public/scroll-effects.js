/**
 * scroll-effects.js
 * Adds interactive scrolling effects to enhance UX
 */

document.addEventListener('DOMContentLoaded', () => {
	// Variables to track scrolling state
	let scrollTimeout;
	const body = document.body;
	const html = document.documentElement;

	// Add is-scrolling class when scrolling occurs
	function handleScroll() {
		// Add class immediately when scrolling starts
		body.classList.add('is-scrolling');

		// Remove class after scrolling stops (with delay for animation)
		clearTimeout(scrollTimeout);
		scrollTimeout = setTimeout(() => {
			body.classList.remove('is-scrolling');
		}, 1000); // 1 second delay to match animation duration
	}

	// The "scroll" event fires rapidly during scrolling
	window.addEventListener('scroll', handleScroll, { passive: true });

	// Create scroll progress indicator
	function createScrollProgress() {
		const progressBar = document.createElement('div');

		// Apply styles
		Object.assign(progressBar.style, {
			position: 'fixed',
			top: '0',
			left: '0',
			height: '3px',
			width: '0%',
			background: 'linear-gradient(to right, rgba(99, 102, 241, 0.5), rgba(79, 70, 229, 0.8))',
			zIndex: '9999',
			transition: 'width 0.1s, opacity 0.4s',
			opacity: '0'
		});

		// Add to DOM
		document.body.appendChild(progressBar);

		// Update on scroll
		window.addEventListener('scroll', () => {
			// Calculate scroll percentage
			const scrollTop = html.scrollTop || body.scrollTop;
			const height = html.scrollHeight - html.clientHeight;
			const scrolled = (scrollTop / height) * 100;

			// Update progress bar width and visibility
			progressBar.style.width = scrolled + '%';
			progressBar.style.opacity = scrollTop > 50 ? '1' : '0';

			// Add glow effect at higher scroll percentages
			if (scrolled > 75) {
				progressBar.style.boxShadow = '0 0 10px 1px rgba(99, 102, 241, 0.5)';
			} else {
				progressBar.style.boxShadow = 'none';
			}
		}, { passive: true });
	}

	// Initialize scroll progress indicator
	createScrollProgress();
});
