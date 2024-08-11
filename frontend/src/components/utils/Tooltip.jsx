import React, { useRef, useState, useEffect } from 'react';
import ReactDom from 'react-dom';

// Portal Component
const Portal = ({ children }) => {
  return ReactDom.createPortal(children, document.body);
}

// DebugLog Component for displaying values in the UI
const DebugLog = ({ value }) => {
  return (
    <div style={{ position: 'fixed', top: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.7)', color: 'white', padding: '10px', zIndex: 1000 }}>
      <pre>{JSON.stringify(value, null, 2)}</pre>
    </div>
  );
}

// Tooltip Component
const Tooltip = ({ children, text, position = "bottom", space = 5 }) => {
  // Ensure `children` is a single React element
  const singleChild = React.Children.only(children);

  const [open, setOpen] = useState(false);
  const tooltipRef = useRef(null);
  const elementRef = useRef(null);

  useEffect(() => {
    if (open && tooltipRef.current && elementRef.current) {
      const { x, y } = getPoint(elementRef.current, tooltipRef.current, position, space);
      console.log(`Tooltip coordinates: x=${x}, y=${y}`); // Alternative logging
      tooltipRef.current.style.left = `${x}px`;
      tooltipRef.current.style.top = `${y}px`;
    }
  }, [open, position, space]);

  const handleMouseEnter = () => {
    setOpen(true);
  }

  const handleMouseLeave = () => {
    setOpen(false);
  }

  const getPoint = (element, tooltip, position, space) => {
    if (!element || !tooltip) {
      console.error("Element or tooltip is not available");
      return { x: 0, y: 0 };
    }
    const eleRect = element.getBoundingClientRect();
    const pt = { x: 0, y: 0 };
    switch (position) {
      case "bottom":
        pt.x = eleRect.left + (element.offsetWidth - tooltip.offsetWidth) / 2;
        pt.y = eleRect.bottom + space;
        break;
      case "left":
        pt.x = eleRect.left - (tooltip.offsetWidth + space);
        pt.y = eleRect.top + (element.offsetHeight - tooltip.offsetHeight) / 2;
        break;
      case "right":
        pt.x = eleRect.right + space;
        pt.y = eleRect.top + (element.offsetHeight - tooltip.offsetHeight) / 2;
        break;
      case "top":
        pt.x = eleRect.left + (element.offsetWidth - tooltip.offsetWidth) / 2;
        pt.y = eleRect.top - (tooltip.offsetHeight + space);
        break;
      default:
        console.error("Invalid position value");
        break;
    }
    return pt;
  }

  const tooltipClasses =
    `fixed transition-opacity ${open ? "opacity-100" : "opacity-0"} pointer-events-none z-50 rounded-md bg-black text-white px-4 py-2 text-center w-max max-w-[150px]
      ${position === "top" && " after:absolute after:content-[''] after:left-1/2 after:top-full after:-translate-x-1/2 after:border-[10px] after:border-transparent after:border-t-black"}
      ${position === "bottom" && " after:absolute after:content-[''] after:left-1/2 after:bottom-full after:-translate-x-1/2 after:border-[10px] after:border-transparent after:border-b-black"}
      ${position === "left" && " after:absolute after:content-[''] after:top-1/2 after:left-full after:-translate-y-1/2 after:border-[10px] after:border-transparent after:border-l-black"}
      ${position === "right" && " after:absolute after:content-[''] after:top-1/2 after:right-full after:-translate-y-1/2 after:border-[10px] after:border-transparent after:border-r-black"}
    `;

  return (
    <>
      {React.cloneElement(singleChild, {
        onMouseEnter: handleMouseEnter,
        onMouseLeave: handleMouseLeave,
        ref: elementRef
      })}

      <Portal>
        <div ref={tooltipRef} className={tooltipClasses}>
          {text}
        </div>
      </Portal>

      {/* Debug Log */}
      {open && <DebugLog value={{ x: tooltipRef.current?.style.left, y: tooltipRef.current?.style.top }} />}
    </>
  );
}

export default Tooltip;
