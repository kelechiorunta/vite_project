import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';

type SpinnerProps = React.ComponentPropsWithoutRef<'div'> & {
  asChild?: boolean;
};

export const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  ({ asChild, ...props }, ref) => {
    const Comp = asChild ? Slot : 'div';
    return (
      <Comp
        ref={ref}
        {...props}
        style={{
          width: '32px',
          height: '32px',
          border: '3px solid #e0e0e0',
          borderTop: '3px solid #4f46e5',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: 'auto',
          ...props.style
        }}
      />
    );
  }
);

Spinner.displayName = 'Spinner';
