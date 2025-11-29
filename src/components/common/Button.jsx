import React from 'react';
import { motion } from 'framer-motion';

function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  isLoading = false,
  icon = null,
  className = '',
  ...props
}) {
  const baseClasses = 'font-bold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 relative overflow-hidden group';

  const variants = {
    // Primary - Gradient
    primary: 'bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white hover:shadow-lg hover:shadow-purple-500/50 active:scale-95',

    // Secondary - Subtle
    secondary: 'bg-white/10 border border-white/20 text-white hover:bg-white/20 hover:border-white/30 hover:shadow-lg',

    // Outline - Border
    outline: 'border-2 border-purple-500 text-purple-400 hover:bg-purple-500/10 hover:text-purple-300 hover:shadow-lg hover:shadow-purple-500/30',

    // Danger - Red
    danger: 'bg-red-500/20 border border-red-500/30 text-red-300 hover:bg-red-500/30 hover:border-red-500/50 hover:shadow-lg hover:shadow-red-500/20',

    // Success - Green
    success: 'bg-green-500/20 border border-green-500/30 text-green-300 hover:bg-green-500/30 hover:border-green-500/50 hover:shadow-lg hover:shadow-green-500/20',

    // Ghost - Transparent
    ghost: 'text-slate-300 hover:text-white hover:bg-white/10 active:scale-95',
  };

  const sizes = {
    xs: 'px-3 py-1.5 text-xs',
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-2.5 text-base',
    lg: 'px-8 py-3 text-lg',
    xl: 'px-10 py-4 text-xl',
  };

  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`;

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={classes}
      disabled={disabled || isLoading}
      {...props}
    >
      {/* Shimmer effect on hover */}
      {!disabled && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          initial={{ x: '-100%' }}
          whileHover={{ x: '100%' }}
          transition={{ duration: 0.5 }}
          style={{ pointerEvents: 'none' }}
        />
      )}

      {/* Content */}
      <div className="relative flex items-center justify-center gap-2">
        {isLoading ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
          />
        ) : (
          icon && <span>{icon}</span>
        )}
        <span>{children}</span>
      </div>
    </motion.button>
  );
}

export default Button;
