import { FC } from 'react';

interface ChevronDownIconProps {
  className?: string; // We'll use this for rotation
}

const ChevronDownIcon: FC<ChevronDownIconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className={className} style={{ width: '1rem', height: '1rem', marginLeft: '0.375rem', transition: 'transform 0.3s' }}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
  </svg>
);

export default ChevronDownIcon;
