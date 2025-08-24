import { useRef } from "react";
import { motion, useAnimationFrame } from "framer-motion";

const logos = [
	{ src: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg", alt: "Microsoft" },
	{ src: "https://upload.wikimedia.org/wikipedia/commons/a/ab/Apple-logo.png", alt: "Apple" },
	{ src: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg", alt: "Google" },
	{ src: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg", alt: "Netflix" },
	{ src: "https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg", alt: "Facebook" },
	{ src: "https://upload.wikimedia.org/wikipedia/commons/6/6a/JavaScript-logo.png", alt: "JavaScript" },
	{ src: "https://upload.wikimedia.org/wikipedia/commons/1/18/ISO_C%2B%2B_Logo.svg", alt: "C++" },
];

// Helper to duplicate logos for seamless loop
const getLoopedLogos = () => [...logos, ...logos];

export default function LogoCarousel() {
	const containerRef = useRef<HTMLDivElement>(null);
	const x = useRef(0);
	const speed = typeof window !== 'undefined' && window.innerWidth < 640 ? 0.5 : 1.2; // slower on mobile

	useAnimationFrame((_, delta) => {
		if (containerRef.current) {
			x.current -= speed * (delta / 16.67); // 60fps base
			const width = containerRef.current.scrollWidth / 2;
			if (-x.current >= width) x.current = 0;
			containerRef.current.style.transform = `translateX(${x.current}px)`;
		}
	});

	return (
		<section className="relative py-12 bg-gradient-to-r from-[#18162C] via-[#0B0A1F] to-[#18162C] overflow-hidden">
			{/* Fade mask overlays */}
			<div className="pointer-events-none absolute left-0 top-0 h-full w-24 z-10" style={{background: "linear-gradient(90deg, #18162C 80%, transparent)"}} />
			<div className="pointer-events-none absolute right-0 top-0 h-full w-24 z-10" style={{background: "linear-gradient(270deg, #18162C 80%, transparent)"}} />
			<div className="relative w-full max-w-7xl mx-auto overflow-hidden">
				<div
					ref={containerRef}
					className="flex gap-10 md:gap-16 items-center select-none"
					style={{ willChange: "transform" }}
				>
					{getLoopedLogos().map((logo, i) => (
						<motion.div
							key={i}
							whileHover={{ scale: 1.13, filter: "grayscale(0) drop-shadow(0 0 16px #a18aff88)" }}
							className="flex items-center justify-center h-20 w-36 md:w-40 transition-all duration-200"
						>
							<img
								src={logo.src}
								alt={logo.alt}
								className="h-12 w-28 object-contain grayscale opacity-80 hover:opacity-100 transition-all duration-200 mx-auto drop-shadow-md"
								style={{ filter: "grayscale(1)", transition: "filter 0.2s" }}
								draggable={false}
							/>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
}
