import { cn } from "@/lib/utils";
import {
  IconAdjustmentsBolt,
  IconCloud,
  IconCurrencyDollar,
  IconEaseInOut,
  IconHeart,
  IconHelp,
  IconRouteAltLeft,
  IconTerminal2,
} from "@tabler/icons-react";

export function FeaturesSectionWithHoverEffects() {
  const features = [
    {
      title: "Built for developers",
      description:
        "Built for engineers, developers, dreamers, thinkers and doers.",
      icon: <IconTerminal2 />,
    },
    {
      title: "Ease of use",
      description:
        "It's as easy as using an Apple, and as expensive as buying one.",
      icon: <IconEaseInOut />,
    },
    {
      title: "Pricing like no other",
      description:
        "Our prices are best in the market. No cap, no lock, no credit card required.",
      icon: <IconCurrencyDollar />,
    },
    {
      title: "100% Uptime guarantee",
      description: "We just cannot be taken down by anyone.",
      icon: <IconCloud />,
    },
    {
      title: "Multi-tenant Architecture",
      description: "You can simply share passwords instead of buying new seats",
      icon: <IconRouteAltLeft />,
    },
    {
      title: "24/7 Customer Support",
      description:
        "We are available a 100% of the time. Atleast our AI Agents are.",
      icon: <IconHelp />,
    },
    {
      title: "Money back guarantee",
      description:
        "If you donot like EveryAI, we will convince you to like us.",
      icon: <IconAdjustmentsBolt />,
    },
    {
      title: "And everything else",
      description: "I just ran out of copy ideas. Accept my sincere apologies",
      icon: <IconHeart />,
    },
  ];
  return (
    <section className="w-full  py-16 pt-0 px-2 md:px-0">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-xl  sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold  text-center text-white dark:text-white mb-10 tracking-tight">Why Choose Pixora</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 relative z-10">
          {features.map((feature, index) => (
            <Feature key={feature.title} {...feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

const Feature = ({
  title,
  description,
  icon,
  index,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  index: number;
}) => {
  return (
    <div
      className={cn(
        "flex flex-col py-10 relative group/feature border-r border-b border-l border-t",
        (index === 0 || index === 4) && "lg:border-l",
        index < 4 && "lg:border-b",
        "border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.06)] backdrop-blur-md transition-all duration-300 hover:bg-[rgba(255,255,255,0.1)] hover:bg-gradient-to-br hover:from-[#2b2b52] hover:to-[#24243e]"
      )}
    >
      <div className="mb-4 relative z-10 px-10 flex items-center justify-center">
        <span className="text-3xl" style={{color: '#a78bfa'}}>{icon}</span>
      </div>
      <div className="text-lg font-bold mb-2 relative z-10 px-10 text-white">
        <span className="group-hover/feature:translate-x-2 transition duration-200 inline-block">
          {title}
        </span>
      </div>
      <p
        className="text-sm max-w-xs relative z-10 px-10"
        style={{ color: '#c3c3c3' }}
      >
        {description}
      </p>
    </div>
  );
};
