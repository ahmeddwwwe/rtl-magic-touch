import { useRef, type ReactNode, type CSSProperties } from "react";
import { useTilt } from "@/hooks/useTilt";

type Props = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  max?: number;
  as?: "div" | "article" | "a";
  href?: string;
  target?: string;
  rel?: string;
};

export const TiltCard = ({ children, className, style, max = 8, as = "div", href, target, rel }: Props) => {
  const ref = useRef<HTMLElement>(null);
  useTilt(ref as React.RefObject<HTMLElement>, max);

  const Tag = as as React.ElementType;
  return (
    <Tag
      ref={ref as never}
      href={href}
      target={target}
      rel={rel}
      className={className}
      style={style}
    >
      <div style={{ transform: "translateZ(40px)", transformStyle: "preserve-3d" }}>
        {children}
      </div>
    </Tag>
  );
};
