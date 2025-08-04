import { useEffect } from 'react';

export default function SmoothScroll({ children }) {
  useEffect(() => {
    // Variables
    let target = 0;
    let current = 0;
    let ease = 0.075;
    let rafId = null;
    let bodyHeight = 0;
    
    // DOM elements
    const scrollable = document.querySelector('.smooth-scroll');
    const body = document.body;
    
    // Initialize
    const init = () => {
      // Set body height to maintain scrollbar
      setBodyHeight();
      
      // Start the animation
      animate();
      
      // Add event listeners
      window.addEventListener('resize', setBodyHeight);
      window.addEventListener('resize', onResize);
    };
    
    // Set the body height
    const setBodyHeight = () => {
      if (!scrollable) return;
      
      bodyHeight = scrollable.clientHeight;
      body.style.height = `${bodyHeight}px`;
    };
    
    // Handle resize
    const onResize = () => {
      if (!scrollable) return;
      
      // Reset position on resize
      scrollable.style.transform = 'translateY(0)';
      current = 0;
    };
    
    // Animation loop
    const animate = () => {
      if (!scrollable) return;
      
      // Get scroll target
      target = window.scrollY;
      
      // Lerp scrolling
      current = parseFloat((current + (target - current) * ease).toFixed(2));
      
      // Apply transform
      scrollable.style.transform = `translateY(${-current}px)`;
      
      // Call next frame
      rafId = requestAnimationFrame(animate);
    };
    
    // Initialize
    init();
    
    // Cleanup
    return () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      
      window.removeEventListener('resize', setBodyHeight);
      window.removeEventListener('resize', onResize);
      
      // Reset body height
      body.style.height = '';
    };
  }, []);
  
  return (
    <div className="smooth-scroll fixed top-0 left-0 w-full">
      {children}
    </div>
  );
} 