import { ShieldCheck, Sparkles, Users, Clock } from "lucide-react";

const features = [
  {
    icon: ShieldCheck,
    title: "Trusted & Secure",
    desc: "We follow industry-best practices to keep your data safe and secure at all times.",
  },
  {
    icon: Sparkles,
    title: "Creative Solutions",
    desc: "Our team delivers innovative and unique designs tailored to your brand’s vision.",
  },
  {
    icon: Users,
    title: "Customer First",
    desc: "We value long-term relationships by prioritizing your success and satisfaction.",
  },
  {
    icon: Clock,
    title: "On-Time Delivery",
    desc: "Projects are always delivered on schedule without compromising quality.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className=" py-16 px-6 md:px-12">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Why Choose Us?
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-12">
          We combine creativity, expertise, and customer-centric strategies to
          help your business stand out and grow.
        </p>

        {/* Features Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <div
              key={i}
              className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition"
            >
              <f.icon className="w-10 h-10 text-blue-600 mb-4 mx-auto" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {f.title}
              </h3>
              <p className="text-gray-600 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
