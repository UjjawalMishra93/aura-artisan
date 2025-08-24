import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Zap, Shield, Infinity, ArrowRight, ImageIcon, Users, Star, Palette, Clock, Download, Globe, Wand2, Layers, Rocket, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/components/AuthProvider';
import { CTASection } from "@/components/cta_with_rectangle"

export function CTADemo() {
  return (
    <CTASection
      badge={{
        text: "Get started"
      }}
      title="Start building with Launch UI"
      description="Get started with Launch UI and build your landing page in no time"
      action={{
        text: "Get Started",
        href: "/docs",
        variant: "default"
      }}
    />
  )
}





import { useState, useEffect } from 'react';

import {  FeaturesSectionWithHoverEffects } from '@/components/Feature';

import { MarqueeDemo } from '@/components/logomoving';
import TestimonialsMaster from '@/components/testimonial_content';

import { BentoGridGalleryDemo } from '@/components/Gallery';



const Index = () => {
  const { user } = useAuth();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  // Track active nav link by hash
  const [activeSection, setActiveSection] = useState(() => window.location.hash || '#explore');

  useEffect(() => {
    const onHashChange = () => setActiveSection(window.location.hash || '#explore');
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  // Theme switch removed. Dark theme is default via CSS.

  // ...existing code for features, stats, testimonials, etc...

  return (

    <div
      className="min-h-screen bg-background relative"
      
    >

      

     <div 
     style={{
        backgroundImage: 'url(/bg.svg)',
        backgroundSize: 'cover',
        backgroundPosition: 'top',
        backgroundRepeat: 'no-repeat',
      }}>
      {/* Navigation - Redesigned to match reference */}
       <nav className="z-50 fixed top-6 left-1/2 transform -translate-x-1/2 w-[95vw] max-w-5xl flex items-center justify-between px-8 py-3 rounded-full  shadow-xl border border-border/30 backdrop-blur-xl">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="bg-primary rounded-lg p-2 flex items-center justify-center">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-foreground tracking-tight">Pixora</span>
        </div>
        {/* Nav links pill group */}
        <div className="hidden md:flex items-center gap-1 bg-[#18181b] px-2 py-1 rounded-full border border-border/40">
          {[
            { href: '#explore', label: 'Explore' },
            { href: '#prices', label: 'Prices' },
            { href: '#why', label: 'Why Pixora' },
            { href: '#earn', label: 'Earn' },
            { href: '#support', label: 'Support' },
          ].map(link => {
            const isActive = activeSection === link.href;
            return (
              <a
                key={link.href}
                href={link.href}
                className={`px-5 py-2 rounded-full font-medium text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30 ${isActive ? 'bg-[#232329] shadow-inner' : ''} hover:bg-[#232329]`}
                aria-current={isActive ? 'page' : undefined}
              >
                {link.label}
              </a>
            );
          })}
        </div>
        {/* Auth buttons */}
        <div className="flex items-center gap-2">
          <Link to={user ? "/dashboard" : "/auth"}>
            <Button variant="outline" className="rounded-full px-6 py-2 font-semibold border-border/50 bg-[#18181b] text-foreground hover:bg-[#232329]">Login</Button>
          </Link>
          <Link to={user ? "/dashboard" : "/auth"}>
            <Button className="rounded-full px-6 py-2 font-semibold bg-primary text-white hover:bg-primary/90 transition-colors">Sign up</Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-40 overflow-hidden">
        <div className="container-electric">
          <div className="text-center space-y-16 max-w-5xl mx-auto">
            <div className="space-y-8">
              <Badge className="px-6 py-3 text-sm bg-primary/10 text-primary border-primary/20 font-medium animate-fade-in-up">
                ✨ Powered by Advanced Nebius AI Technology
              </Badge>
              <h1 className="text-6xl sm:text-7xl lg:text-8xl font-heading font-bold leading-tight text-foreground animate-fade-in-up">
                Create Stunning<br />
                <span className="text-gradient animate-text-glow">AI Images</span>
              </h1>
              <p className="text-xl sm:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed animate-fade-in-up">
                Transform your wildest imagination into breathtaking visuals with our cutting-edge AI image generation platform. <span className="text-primary font-semibold"> Professional quality, lightning fast results.</span>
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-fade-in-up">
              {user ? (
                <Link to="/dashboard">
                  <Button size="lg" className="text-xl px-10 py-8 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white shadow-electric transition-all duration-300 transform hover:scale-105">
                    <Palette className="h-6 w-6 mr-3" />
                    Go to Dashboard
                    <ArrowRight className="h-6 w-6 ml-3" />
                  </Button>
                </Link>
              ) : (
                <Link to="/auth">
                  <Button size="lg" className="text-xl px-10 py-8 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white shadow-electric transition-all duration-300 transform hover:scale-105">
                    <Sparkles className="h-6 w-6 mr-3" />
                    Start Creating
                    <ArrowRight className="h-6 w-6 ml-3" />
                  </Button>
                </Link>
              )}
              <Button size="lg" variant="outline" className="text-xl px-10 py-8 border-2 border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300">
                <Users className="h-6 w-6 mr-3" />
                View Gallery
              </Button>
            </div>
          </div>
        </div>
        
       <MarqueeDemo/>
        
         {/* <Testimonials/> */}
      </section>

       <FeaturesSectionWithHoverEffects/>
     </div>
     
     
      
      <div className="relative  z-10">
          
     
        <TestimonialsMaster/>
        <BentoGridGalleryDemo/>
        <CTASection
      badge={{
        text: "Get started"
      }}
      title="Start building with Launch UI"
      description="Get started with Launch UI and build your landing page in no time"
      action={{
        text: "Get Started",
        href: "/docs",
        variant: "default"
      }}
    />

      {/* Footer Section */}
    <footer className="py-16 bg-background sm:pt-20 lg:pt-24  border-border">
      <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
        <div className="grid grid-cols-2 md:col-span-3 lg:grid-cols-6 gap-y-16 gap-x-12">
          <div className="col-span-2 md:col-span-3 lg:col-span-2 lg:pr-8">
            <h2>Pixora</h2>

            <p className="text-base leading-relaxed text-muted-foreground mt-7">
              Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit.
            </p>

            <ul className="flex items-center space-x-3 mt-9">
              <li>
                <a
                  href="#"
                  title="Twitter"
                  className="flex items-center justify-center text-foreground transition-all duration-200 bg-[#18181b] rounded-full w-8 h-8 hover:bg-primary focus:bg-primary"
                >
                  <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.633 7.997c.013.175.013.349.013.523 0 5.325-4.053 11.461-11.46 11.461-2.282 0-4.402-.661-6.186-1.809.324.037.636.05.973.05a8.07 8.07 0 0 0 5.001-1.721 4.036 4.036 0 0 1-3.767-2.793c.249.037.499.062.761.062.361 0 .724-.05 1.061-.137a4.027 4.027 0 0 1-3.23-3.953v-.05c.537.299 1.16.486 1.82.511a4.022 4.022 0 0 1-1.796-3.354c0-.748.199-1.434.548-2.032a11.457 11.457 0 0 0 8.306 4.215c-.062-.3-.1-.611-.1-.923a4.026 4.026 0 0 1 4.028-4.028c1.16 0 2.207.486 2.943 1.272a7.957 7.957 0 0 0 2.556-.973 4.02 4.02 0 0 1-1.771 2.22 8.073 8.073 0 0 0 2.319-.624 8.645 8.645 0 0 1-2.019 2.083z" />
                  </svg>
                </a>
              </li>
              <li>
                <a
                  href="#"
                  title="Facebook"
                  className="flex items-center justify-center text-foreground transition-all duration-200 bg-[#18181b] rounded-full w-8 h-8 hover:bg-primary focus:bg-primary"
                >
                  <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M13.397 20.997v-8.196h2.765l.411-3.209h-3.176V7.548c0-.926.258-1.56 1.587-1.56h1.684V3.127A22.336 22.336 0 0 0 14.201 3c-2.444 0-4.122 1.492-4.122 4.231v2.355H7.332v3.209h2.753v8.202h3.312z" />
                  </svg>
                </a>
              </li>
              <li>
                <a
                  href="#"
                  title="Instagram"
                  className="flex items-center justify-center text-foreground transition-all duration-200 bg-[#18181b] rounded-full w-8 h-8 hover:bg-primary focus:bg-primary"
                >
                  <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11.999 7.377a4.623 4.623 0 1 0 0 9.248 4.623 4.623 0 0 0 0-9.248zm0 7.627a3.004 3.004 0 1 1 0-6.008 3.004 3.004 0 0 1 0 6.008z" />
                    <circle cx="16.806" cy="7.207" r="1.078"></circle>
                    <path d="M20.533 6.111A4.605 4.605 0 0 0 17.9 3.479a6.606 6.606 0 0 0-2.186-.42c-.963-.042-1.268-.054-3.71-.054s-2.755 0-3.71.054a6.554 6.554 0 0 0-2.184.42 4.6 4.6 0 0 0-2.633 2.632 6.585 6.585 0 0 0-.419 2.186c-.043.962-.056 1.267-.056 3.71 0 2.442 0 2.753.056 3.71.015.748.156 1.486.419 2.187a4.61 4.61 0 0 0 2.634 2.632 6.584 6.584 0 0 0 2.185.45c.963.042 1.268.055 3.71.055s2.755 0 3.71-.055a6.615 6.615 0 0 0 2.186-.419 4.613 4.613 0 0 0 2.633-2.633c.263-.7.404-1.438.419-2.186.043-.962.056-1.267.056-3.71s0-2.753-.056-3.71a6.581 6.581 0 0 0-.421-2.217z" />
                  </svg>
                </a>
              </li>
              <li>
                <a
                  href="#"
                  title="GitHub"
                  className="flex items-center justify-center text-foreground transition-all duration-200 bg-[#18181b] rounded-full w-8 h-8 hover:bg-primary focus:bg-primary"
                >
                  <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12.026 2c-5.509 0-9.974 4.465-9.974 9.974 0 4.406 2.857 8.145 6.821 9.465.499.09.679-.217.679-.481 0-.237-.008-.865-.011-1.696-2.775.602-3.361-1.338-3.361-1.338-.452-1.152-1.107-1.459-1.107-1.459-.905-.619.069-.605.069-.605 1.002.07 1.527 1.028 1.527 1.028.89 1.524 2.336 1.084 2.902.829.091-.645.351-1.085.635-1.334-2.214-.251-4.542-1.107-4.542-4.93 0-1.087.389-1.979 1.024-2.675-.101-.253-.446-1.268.099-2.64 0 0 .837-.269 2.742 1.021a9.582 9.582 0 0 1 2.496-.336 9.554 9.554 0 0 1 2.496.336c1.906-1.291 2.742-1.021 2.742-1.021.545 1.372.203 2.387.099 2.64.64.696 1.024 1.587 1.024 2.675 0 3.833-2.33 4.675-4.552 4.922.355.308.675.916.675 1.846 0 1.334-.012 2.41-.012 2.737 0 .267.178.577.687.479C19.146 20.115 22 16.379 22 11.974 22 6.465 17.535 2 12.026 2z" />
                  </svg>
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">Company</p>

            <ul className="mt-6 space-y-4">
              <li>
                <a href="#" className="flex text-base text-foreground/80 transition-all duration-200 hover:text-primary">About</a>
              </li>
              <li>
                <a href="#" className="flex text-base text-foreground/80 transition-all duration-200 hover:text-primary">Features</a>
              </li>
              <li>
                <a href="#" className="flex text-base text-foreground/80 transition-all duration-200 hover:text-primary">Works</a>
              </li>
              <li>
                <a href="#" className="flex text-base text-foreground/80 transition-all duration-200 hover:text-primary">Career</a>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">Help</p>

            <ul className="mt-6 space-y-4">
              <li>
                <a href="#" className="flex text-base text-foreground/80 transition-all duration-200 hover:text-primary">Customer Support</a>
              </li>
              <li>
                <a href="#" className="flex text-base text-foreground/80 transition-all duration-200 hover:text-primary">Delivery Details</a>
              </li>
              <li>
                <a href="#" className="flex text-base text-foreground/80 transition-all duration-200 hover:text-primary">Terms & Conditions</a>
              </li>
              <li>
                <a href="#" className="flex text-base text-foreground/80 transition-all duration-200 hover:text-primary">Privacy Policy</a>
              </li>
            </ul>
          </div>

          <div className="col-span-2 md:col-span-1 lg:col-span-2 lg:pl-8">
            <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">Subscribe to newsletter</p>

            <form action="#" method="POST" className="mt-6">
              <div>
                <label htmlFor="email" className="sr-only">Email</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Enter your email"
                  className="block w-full p-4 text-foreground placeholder-muted-foreground transition-all duration-200 bg-muted/10 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 caret-primary"
                />
              </div>

              <button
                type="submit"
                className="inline-flex items-center justify-center px-6 py-4 mt-3 font-semibold text-white transition-all duration-200 bg-primary rounded-md hover:bg-primary/90 focus:bg-primary/90"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <hr className="mt-16 mb-10 border-border" />

        <p className="text-sm text-center text-muted-foreground">© {new Date().getFullYear()} Pixora. All rights reserved.</p>
      </div>
    </footer>

      </div>
    
    
    </div>
  );
}

export default Index;
