import React from 'react';
import { motion } from 'framer-motion';

const Skeleton = ({ width, height, borderRadius = '8px', style = {} }) => {
    return (
        <div
            style={{
                width: width,
                height: height,
                borderRadius: borderRadius,
                backgroundColor: 'var(--surface-strong)',
                position: 'relative',
                overflow: 'hidden',
                ...style
            }}
        >
            <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{
                    repeat: Infinity,
                    duration: 1.5,
                    ease: 'linear'
                }}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent)',
                }}
            />
        </div>
    );
};

export default Skeleton;
