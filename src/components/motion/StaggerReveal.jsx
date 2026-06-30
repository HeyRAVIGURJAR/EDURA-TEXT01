import React from 'react';
import { motion } from 'framer-motion';

/**
 * StaggerContainer + StaggerItem — Orchestrated wave-reveal system.
 * 
 * Usage:
 *   <StaggerContainer>
 *     <StaggerItem><Card1 /></StaggerItem>
 *     <StaggerItem><Card2 /></StaggerItem>
 *   </StaggerContainer>
 * 
 * Each child fades-in + slides-up with staggered delay, creating a wave effect.
 */

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

export const StaggerContainer = ({ children, className = '', delay = 0.1, stagger = 0.1, ...props }) => (
  <motion.div
    className={className}
    variants={{
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: stagger,
          delayChildren: delay,
        },
      },
    }}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.15 }}
    {...props}
  >
    {children}
  </motion.div>
);

export const StaggerItem = ({ children, className = '', ...props }) => (
  <motion.div
    className={className}
    variants={itemVariants}
    {...props}
  >
    {children}
  </motion.div>
);

export default StaggerContainer;
