import * as React from "react";
import { cn } from "@/lib/utils";

interface MarqueeProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  pauseOnHover?: boolean;
  direction?: "left" | "right";
  speed?: number; // seconds for one full loop
  className?: string;
}

export const Marquee: React.FC<MarqueeProps> = ({
  children,
  pauseOnHover = false,
  direction = "left",
  speed = 30,
  className = "",
  ...props
}) => {
  // Keyframes for marquee animation
  // These will be injected only once
  React.useEffect(() => {
    if (document.getElementById("marquee-keyframes")) return;
    const style = document.createElement("style");
    style.id = "marquee-keyframes";
    style.innerHTML = `
      @keyframes marquee {
        0% { transform: translateX(0); }
        100% { transform: translateX(-50%); }
      }
      @keyframes marquee-reverse {
        0% { transform: translateX(0); }
        100% { transform: translateX(50%); }
      }
      .animate-marquee {
        animation: marquee var(--duration,30s) linear infinite;
        will-change: transform;
      }
      .animate-marquee-reverse {
        animation: marquee-reverse var(--duration,30s) linear infinite;
        will-change: transform;
      }
    `;
    document.head.appendChild(style);
  }, []);

  return (
    <div
      className={cn(
        "w-full overflow-hidden z-10",
        className
      )}
      {...props}
    >
      <div className="relative flex w-full overflow-hidden py-5">
        <div
          className={cn(
            "flex w-max",
            direction === "right" ? "animate-marquee-reverse" : "animate-marquee",
            pauseOnHover && "hover:[animation-play-state:paused]"
          )}
          style={{
            // @ts-ignore
            '--duration': `${speed}s`
          } as React.CSSProperties}
        >
          {children}
          {children}
        </div>
      </div>
    </div>
  );
};