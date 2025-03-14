import React from 'react';
import { motion } from 'framer-motion';
import { COLORS } from '../../constants/theme';

interface FeatureCardProps {
  title: string;
  description: string;
  delay?: number;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-gray-50 p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow"
    >
      <h3 className={`text-xl font-semibold text-[${COLORS.primary}] mb-4`}>{title}</h3>
      <p className="text-gray-600">{description}</p>
    </motion.div>
  );
};