import React from 'react';
import { Link } from 'react-router-dom';
import { COLORS, TRANSITIONS } from '../../constants/theme';

interface ButtonProps {
  to?: string;
  variant?: 'primary' | 'secondary' | 'accent';
  children: React.ReactNode;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({ 
  to, 
  variant = 'primary', 
  children, 
  className = '' 
}) => {
  const baseStyles = 'inline-block px-8 py-4 rounded-lg text-lg font-medium shadow-lg';
  const variants = {
    primary: `bg-[#4CC9F0] text-[#2E2A5E] hover:bg-[#3DB8DF] ${TRANSITIONS.hover}`,
    secondary: `bg-[#2E2A5E] text-white hover:bg-[#373175] ${TRANSITIONS.default}`,
    accent: `bg-[#9FD33D] text-[#2E2A5E] hover:bg-[#8FBD35] ${TRANSITIONS.hover}`
  };

  const buttonClasses = `${baseStyles} ${variants[variant]} ${className}`;

  if (to) {
    return <Link to={to} className={buttonClasses}>{children}</Link>;
  }

  return <button className={buttonClasses}>{children}</button>;
};