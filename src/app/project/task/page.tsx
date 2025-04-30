/** @format */

"use client";

import React from "react";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// Dynamically import views to reduce initial bundle size
const MobileView = dynamic(() => import("./MobileView"), { ssr: false });
const LaptopView = dynamic(() => import("./Laptop"), { ssr: false });

export default function TaskPage() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Function to update view based on screen size
    const updateView = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768); // Mobile: < 768px
    };

    // Initial check
    updateView();

    // Add event listener for window resize
    window.addEventListener("resize", updateView);

    // Cleanup
    return () => window.removeEventListener("resize", updateView);
  }, []);

  // Render appropriate view based on screen size
  if (isMobile) {
    return <MobileView />;
  }

  // Use LaptopView for both tablet and desktop sizes
  return <LaptopView />;
}
