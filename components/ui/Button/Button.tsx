'use client';

import { cn } from '@/utils/cn';
import React, { forwardRef, useRef, ButtonHTMLAttributes } from 'react';
import { mergeRefs } from 'react-merge-refs';

import LoadingDots from '@/components/ui/LoadingDots';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'slim' | 'flat';
  active?: boolean;
  width?: number;
  loading?: boolean;
  Component?: React.ComponentType;
}

const Button = forwardRef<HTMLButtonElement, Props>((props, buttonRef) => {
  const {
    className,
    variant = 'flat',
    children,
    active,
    width,
    loading = false,
    disabled = false,
    style = {},
    Component = 'button',
    ...rest
  } = props;
  const ref = useRef(null);
  const rootClassName = cn(
    'bg-white data-[active]:bg-zinc-600 text-zinc-800 cursor-pointer inline-flex px-10 rounded-sm leading-6  transition ease-in-out duration-150 shadow-sm font-semibold text-center justify-center uppercase py-4 border border-transparent items-center hover:bg-zinc-800 hover:text-white hover:border hover:border-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50',
    {
      'py-2 transform-none normal-case': variant === 'slim',
      'bg-zinc-700 text-zinc-500 border-zinc-600 cursor-not-allowed': loading,
      'text-zinc-400 border-zinc-600 bg-zinc-700 cursor-not-allowed': disabled
    },
    className
  );
  return (
    <Component
      aria-pressed={active}
      data-variant={variant}
      ref={mergeRefs([ref, buttonRef])}
      className={rootClassName}
      disabled={disabled}
      style={{
        width,
        ...style
      }}
      {...rest}
    >
      {children}
      {loading && (
        <i className="flex pl-2 m-0">
          <LoadingDots />
        </i>
      )}
    </Component>
  );
});
Button.displayName = 'Button';

export default Button;
