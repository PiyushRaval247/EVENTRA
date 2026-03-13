"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";

export default function CustomCursor() {
  const cursorRef = useRef(null);
  const followerRef = useRef(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const follower = followerRef.current;

    const onMouseMove = (e) => {
      const { clientX, clientY } = e;
      
      gsap.to(cursor, {
        x: clientX,
        y: clientY,
        duration: 0.1,
        ease: "power2.out"
      });

      gsap.to(follower, {
        x: clientX,
        y: clientY,
        duration: 0.4,
        ease: "power2.out"
      });
    };

    const onMouseDown = () => {
      gsap.to([cursor, follower], { scale: 0.8, duration: 0.2 });
    };

    const onMouseUp = () => {
      gsap.to([cursor, follower], { scale: 1, duration: 0.2 });
    };

    const onLinkHover = () => {
      gsap.to(follower, {
        scale: 4,
        backgroundColor: "rgba(168, 85, 247, 0.15)",
        borderColor: "rgba(168, 85, 247, 0.5)",
        duration: 0.3
      });
      gsap.to(cursor, { scale: 0, duration: 0.2 });
    };

    const onLinkLeave = () => {
      gsap.to(follower, {
        scale: 1,
        backgroundColor: "transparent",
        borderColor: "rgba(255, 255, 255, 0.5)",
        duration: 0.3
      });
      gsap.to(cursor, { scale: 1, duration: 0.2 });
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);

    const links = document.querySelectorAll("a, button, .magnetic-wrap, .spotlight");
    links.forEach(link => {
      link.addEventListener("mouseenter", onLinkHover);
      link.addEventListener("mouseleave", onLinkLeave);
    });

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      links.forEach(link => {
        link.removeEventListener("mouseenter", onLinkHover);
        link.removeEventListener("mouseleave", onLinkLeave);
      });
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[99999] mix-blend-difference hidden lg:block">
      <div 
        ref={cursorRef}
        className="fixed w-2 h-2 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 z-[99999]"
      />
      <div 
        ref={followerRef}
        className="fixed w-10 h-10 border border-white/50 rounded-full -translate-x-1/2 -translate-y-1/2 z-[99998]"
      />
    </div>
  );
}
