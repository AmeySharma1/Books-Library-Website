import { useEffect, useRef } from 'react';

export default function CircularProgress({ 
  percentage = 70, 
  size = 150, 
  strokeWidth = 10,
  color = '#673AB7',
  label = 'Progress',
  innerLabel = true
}) {
  const circleRef = useRef(null);
  
  useEffect(() => {
    if (!circleRef.current) return;
    
    const circle = circleRef.current;
    const radius = circle.r.baseVal.value;
    const circumference = radius * 2 * Math.PI;
    
    circle.style.strokeDasharray = `${circumference} ${circumference}`;
    circle.style.strokeDashoffset = circumference;
    
    // Animate progress
    const offset = circumference - (percentage / 100) * circumference;
    const duration = 1500; // ms
    const startTime = performance.now();
    const startOffset = parseFloat(circle.style.strokeDashoffset);
    
    const animate = (currentTime) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      const currentOffset = startOffset - (startOffset - offset) * progress;
      
      circle.style.strokeDashoffset = currentOffset;
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [percentage]);
  
  const radius = (size - strokeWidth) / 2;
  const viewBox = `0 0 ${size} ${size}`;
  const dashArray = radius * Math.PI * 2;
  
  return (
    <div className="relative">
      <svg
        width={size}
        height={size}
        viewBox={viewBox}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth={strokeWidth}
        />
        
        {/* Progress circle */}
        <circle
          ref={circleRef}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          style={{
            strokeDasharray: dashArray,
            strokeDashoffset: dashArray
          }}
        />
      </svg>
      
      {innerLabel && (
        <div 
          className="absolute inset-0 flex flex-col items-center justify-center text-white"
        >
          <span className="text-3xl font-bold">{percentage}%</span>
          <span className="text-sm opacity-70">{label}</span>
        </div>
      )}
    </div>
  );
} 