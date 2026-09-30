import React from 'react';

const SeverityBadge = ({ severity, className = '' }) => {
  if (!severity) return null;

  const classMap = {
    'Svår': 'badge badge-severe',
    'Måttlig': 'badge badge-moderate',
    'Lindrig': 'badge badge-mild',
  };

  return (
    <span className={`${classMap[severity] || 'badge badge-none'} ${className}`.trim()}>
      {severity}
    </span>
  );
};

export default SeverityBadge;
