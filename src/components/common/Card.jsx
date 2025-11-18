import React from 'react';
import { motion } from 'framer-motion';

function Card({
  className = '',
  children,
  variant = 'default',
  hover = true,
  animated = true,
  gradient = false,
  border = true,
  interactive = false,
  delay = 0,
  ...props
}) {
  const baseClasses = 'rounded-2xl transition-all duration-300 backdrop-blur-xl';

  const variants = {
    // Default - Glass morphism
    default: 'bg-gradient-to-br from-white/10 to-white/5 border border-white/10 hover:border-white/20 hover:bg-gradient-to-br hover:from-white/15 hover:to-white/8',
    
    // Elevated - More prominent
    elevated: 'bg-gradient-to-br from-white/15 to-white/8 border border-white/20 hover:border-white/30 hover:from-white/20 hover:to-white/12 shadow-2xl hover:shadow-3xl',
    
    // Subtle - Less prominent
    subtle: 'bg-white/5 border border-white/5 hover:border-white/15 hover:bg-white/8',
    
    // Gradient - Colorful
    gradient: 'bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-red-500/5 border border-purple-500/20 hover:border-purple-500/40 hover:from-purple-500/15 hover:to-red-500/10',
    
    // Dark - Darker background
    dark: 'bg-slate-900/50 border border-slate-700/50 hover:border-slate-600/50 hover:bg-slate-900/70',
    
    // Accent - Purple accent
    accent: 'bg-white/8 border border-purple-500/20 hover:border-purple-500/40 hover:bg-white/12 hover:shadow-lg hover:shadow-purple-500/10',
  };

  const hoverClasses = hover
    ? interactive
      ? 'hover:scale-105 hover:shadow-2xl cursor-pointer'
      : 'hover:shadow-2xl hover:shadow-purple-500/20'
    : '';

  const classes = `${baseClasses} ${variants[variant]} ${hoverClasses} ${className}`;

  const containerVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        delay,
        ease: 'easeOut'
      }
    }
  };

  const CardContent = (
    <div className={classes} {...props}>
      {children}
    </div>
  );

  // Wrap with animation if animated is true
  if (animated) {
    return (
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={containerVariants}
      >
        {CardContent}
      </motion.div>
    );
  }

  return CardContent;
}

export default Card;
