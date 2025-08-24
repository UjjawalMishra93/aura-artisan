import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { FaGoogle, FaMicrosoft, FaApple } from "react-icons/fa";
import { SiOpenai, SiHuggingface } from "react-icons/si";

const aiLogos = [
  { icon: <SiOpenai size={44} color="#10a37f" />, name: "OpenAI" },
  { icon: <FaGoogle size={44} color="#4285F4" />, name: "Google" },
  { icon: <SiHuggingface size={44} color="#FFB000" />, name: "Hugging Face" },
  { icon: <FaMicrosoft size={44} color="#00A4EF" />, name: "Microsoft" },
  { icon: <FaApple size={44} color="#A2AAAD" />, name: "Apple" },
];

const getLoopedLogos = () => [...aiLogos, ...aiLogos];

export default function TrustedByAICarousel() {
  const containerRef = useRef<HTMLDivElement>(null);
  const x = useRef(0);
  const speed = typeof window !== "undefined" && window.innerWidth < 640 ? 0.5 : 1.2;

  useEffect(() => {
    let frame: number;
    const animate = () => {
      if (containerRef.current) {
        x.current -= speed;
        const width = containerRef.current.scrollWidth / 2;
        if (-x.current >= width) x.current = 0;
        containerRef.current.style.transform = `translateX(${x.current}px)`;
      }
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [speed]);

  return (
    <section className="relative py-10 overflow-hidden border-t border-border/20">
      <div className="text-center mb-6">
        <span className="uppercase tracking-widest text-xs text-muted-foreground font-semibold">
          Trusted by leading AI companies
        </span>
      </div>
      <div className="relative w-full max-w-6xl mx-auto overflow-hidden">
        <div
          ref={containerRef}
          className="flex gap-12 md:gap-20 items-center select-none"
          style={{ willChange: "transform" }}
        >
          {getLoopedLogos().map((logo, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.1 }}
              className="flex flex-col items-center justify-center h-16 w-32 md:w-40 transition-all duration-200 bg-transparent"
            >
              {React.createElement(logo.icon, { size: 44, color: logo.color })}
              <span className="mt-2 text-xs text-muted-foreground font-medium">
                {logo.name}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
