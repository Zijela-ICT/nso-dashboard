'use client';
import React, {
  SVGProps,
  forwardRef,
  useEffect,
  useRef,
  useState,
  ComponentType,
} from 'react';
import { useForceUpdate } from '@/hooks';

interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'ref' | 'onError'> {
  name: string;
  fill?: string;
  stroke?: string;
  onCompleted?: (name: string, icon: any) => void;
  onError?: (error: Error) => void;
}

interface IHookResult {
  error: Error | null;
  loading: boolean;
  SvgIcon?: ComponentType<SVGProps<SVGSVGElement>>;
}

const useDynamicSVGImport = (
  name: string,
  options: {
    onCompleted?: (name: string, icon: any) => void;
    onError?: (error: Error) => void;
  } = {},
): IHookResult => {
  const ImportedIconRef = useRef<ComponentType<SVGProps<SVGSVGElement>>>(null);
  const forceUpdate = useForceUpdate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);


  useEffect(() => {
    setLoading(true);
    const importIcon = async () => {
      try {
        const icon = (await import(`@/assets/icons/${name}.svg`)).default;
        ImportedIconRef.current = icon;
        forceUpdate();
        options.onCompleted?.(name, icon);
      } catch (err) {
        if (err instanceof Error) {
          options.onError?.(err);
          setError(err);
        }
      } finally {
        setLoading(false);
      }
    };

    importIcon();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, options.onCompleted, options.onError]);

  return { error, loading, SvgIcon: ImportedIconRef.current };
};

const ForwardedIcon = forwardRef<SVGSVGElement, IconProps>(
  ({ name, fill, stroke, onCompleted, onError, style, ...rest }, ref) => {
    const { error, loading, SvgIcon } = useDynamicSVGImport(name, {
      onCompleted,
      onError,
    });
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
      setIsClient(true);
    }, []);

    useEffect(() => {
      if (isClient && ref && 'current' in ref && ref.current) {
        const applyAttributeIfNeeded = (el: SVGElement, attr: 'fill' | 'stroke', value: string | undefined) => {
          const currentValue = el.getAttribute(attr);
          if (value && (!currentValue || currentValue === 'none' || currentValue === 'currentColor')) {
            el.setAttribute(attr, value);
          }
        };

        const svgElement = ref.current;
        const elements = svgElement.querySelectorAll('path, circle, rect, line, polyline, polygon');

        elements.forEach((el) => {
          applyAttributeIfNeeded(el as SVGElement, 'fill', fill);
          applyAttributeIfNeeded(el as SVGElement, 'stroke', stroke);
        });
      }
    }, [fill, stroke, ref, isClient]);

    if (error) {
      return error?.message;
    }

    if (loading) {
      return null;
    }

    if (SvgIcon) {
      const WrappedIcon = forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>((props, iconRef) => (
        <SvgIcon
          {...props}
          ref={iconRef}
        />
      ));
      WrappedIcon.displayName = `WrappedIcon(${name})`;

      return (
        <WrappedIcon
          ref={ref}
          style={{
            ...style,
            fill: fill || 'none',
            stroke: stroke || 'none',
          }}
          {...rest}
        />
      );
    }

    return null;
  }
);

ForwardedIcon.displayName = 'Icon';

export const Icon = ForwardedIcon;