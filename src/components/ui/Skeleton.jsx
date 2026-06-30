import React from 'react';
import { motion } from 'framer-motion';

const Skeleton = ({ className = '', style = {} }) => {
  return (
    <motion.div
      className={`bg-white/5 rounded-md ${className}`}
      style={style}
      animate={{ opacity: [0.3, 0.7, 0.3] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
    />
  );
};

export const SkeletonCard = () => (
  <div className="bg-[#121212] p-6 rounded-xl border border-white/5 flex flex-col gap-4">
    <Skeleton className="h-40 w-full rounded-lg" />
    <Skeleton className="h-6 w-3/4 mt-2" />
    <Skeleton className="h-4 w-1/2" />
    <div className="flex justify-between items-center mt-4 pt-4 border-t border-white/5">
      <Skeleton className="h-4 w-1/4" />
      <Skeleton className="h-8 w-1/3 rounded-full" />
    </div>
  </div>
);

export default Skeleton;
