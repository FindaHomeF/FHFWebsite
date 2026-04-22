"use client"
import { useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { motionTransition } from '@/lib/motion'

const MouseFollowIcon = ({ children, icon: Icon, iconSize = 20, iconColor = "var(--secondary)" }) => {
    const [isHovered, setIsHovered] = useState(false);
    
    // Use motion values for smooth animation
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    
    // Add spring physics for delay effect
    const springConfig = { damping: 25, stiffness: 150, mass: 0.5 };
    const x = useSpring(mouseX, springConfig);
    const y = useSpring(mouseY, springConfig);

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        mouseX.set(e.clientX - rect.left);
        mouseY.set(e.clientY - rect.top);
    };

    return (
        <div
            className="relative inline-block cursor-pointer"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onMouseMove={handleMouseMove}
        >
            {children}
            
            {Icon && (
                <motion.div
                    className="absolute pointer-events-none z-50"
                    style={{
                        x,
                        y,
                        translateX: '-50%',
                        translateY: '-50%',
                    }}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ 
                        opacity: isHovered ? 1 : 0, 
                        scale: isHovered ? 1 : 0 
                    }}
                    transition={motionTransition.micro()}
                >
                    <div className="bg-white border-2 border-secondary p-2 rounded-full shadow-lg">
                        <Icon size={iconSize} color={iconColor} />
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default MouseFollowIcon;

