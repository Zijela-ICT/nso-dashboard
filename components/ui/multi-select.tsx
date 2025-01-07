'use client';
import React, { useMemo, useRef } from 'react';
import dynamic from 'next/dynamic';
import { Props } from 'react-select';
import { cn } from '@/lib/utils';

const ReactSelect = dynamic(() => import('react-select'), { ssr: false });

export type SelectProps = Omit<Props, 'onChange'> & {
  error?: boolean;
  onChange?: (v: string | string[] | null) => void;
  usePortal?: boolean;
};

export const MultiSelect = (props: SelectProps) => {
  const prevPointerEvents = useRef<string>('');

  const value = useMemo(() => {
    const v = props.value as any;

    if (props.isMulti) {
      return (
        props.options?.filter((item: any) => v?.includes(item.value)) ?? []
      );
    }

    return (
      props.options?.find((item: any) => item.value === props.value) ?? null
    );
  }, [props.value, props.options, props.isMulti]);

  const onChange = (v: any) => {
    if (v) {
      if (props.isMulti) {
        const val = v as { label: string; value: string }[];
        props.onChange?.(val?.map((x) => x.value) || []);
      } else {
        const val = v as { label: string; value: string };
        props?.onChange?.(val.value);
      }
    } else {
      props?.onChange?.(v as null);
    }
  };

  return (
    <ReactSelect
      className="w-full"
      classNamePrefix="select"
      instanceId={props.id}
      {...props}
      classNames={{
        control: (state) =>
          cn({
            'border h-10 !border-input bg-transparent text-sm shadow-sm !outline-none !ring-1 !ring-ring':
              state.isFocused,
            'border h-10 !border-input bg-transparent text-sm shadow-sm':
              !state.isFocused,
            '!border-error-500 !focus-visible:ring-error-500': props.error,
          }),

        indicatorSeparator: () => 'hidden',
        menuList: () => '!py-0',
        option: (state) =>
          state.isDisabled
            ? '!text-sm !text-foreground opacity-40 !bg-white !cursor-not-allowed'
            : state.isSelected
              ? '!text-sm !text-white !bg-primary !cursor-pointer'
              : state.isFocused
                ? '!text-sm !bg-[#1A1818]/10 !cursor-pointer'
                : '!text-sm !cursor-pointer',
        ...props.classNames,
      }}
      value={value}
      onChange={onChange}
      {...(props.usePortal
        ? {
            menuPortalTarget: document.getElementById('portal'),
            onMenuOpen: () => {
              prevPointerEvents.current = document.body.style.pointerEvents;
              document.body.style.pointerEvents = '';
            },
            onMenuClose: () => {
              document.body.style.pointerEvents = prevPointerEvents.current;
            },
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            styles: { menuPortal: (base) => ({ ...base, zIndex: 9999 }) },
          }
        : {})}
    />
  );
};

