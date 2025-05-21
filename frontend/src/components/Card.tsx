import React from 'react';
import clsx from 'clsx';

interface CardProps {
  children?: React.ReactNode;
  className?: string;
  header?: React.ReactNode;
  content?: React.ReactNode;
}

export function Card({ children, className, header, content }: CardProps) {
  return (
    <div className={clsx('bg-white rounded-lg shadow p-4', className)}>
      {header && <div className="font-bold text-lg mb-2">{header}</div>}
      {content ? <div>{content}</div> : children}
    </div>
  );
}

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function CardHeader({ children, className }: CardHeaderProps) {
  return <div className={clsx('font-bold text-lg mb-2', className)}>{children}</div>;
}

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export function CardContent({ children, className }: CardContentProps) {
  return <div className={className}>{children}</div>;
} 