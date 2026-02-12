'use client';

import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

export const ThreeDCard = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => {
    const ref = useRef<HTMLDivElement>(null);

    // State for hover
    const [isHovered, setIsHovered] = useState(false);

    // Motion values for tilt
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    // Spring physics for smooth animation
    const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [15, -15]), {
        stiffness: 150,
        damping: 20,
    });
    const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-15, 15]), {
        stiffness: 150,
        damping: 20,
    });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return;

        const rect = ref.current.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;

        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const xPct = (mouseX / width) - 0.5;
        const yPct = (mouseY / height) - 0.5;

        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
        setIsHovered(false);
    };

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={handleMouseLeave}
            style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
            }}
            className={`relative transition-all duration-200 ease-linear ${className}`}
        >
            <div
                style={{ transform: "translateZ(75px)", transformStyle: "preserve-3d" }}
                className="absolute inset-4 rounded-xl bg-orange-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            />
            {children}
        </motion.div>
    );
};

export const ThreeDItem = ({ children, translateZ = 50, className = "" }: { children: React.ReactNode, translateZ?: number, className?: string }) => {
    return (
        <div
            style={{ transform: `translateZ(${translateZ}px)` }}
            className={`transition-transform duration-200 ease-linear ${className}`}
        >
            {children}
        </div>
    )
}
