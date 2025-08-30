import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Globe2, ArrowRight, MapPin, Leaf, Sparkles, ShieldCheck, Mail, Send, CheckCircle2, Building2 } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

// --- Helper components -------------------------------------------------------
const Container = ({ className = "", id, children }) => (
  <div
    id={id}
    className={`mx-auto w-full max-w-2xl sm:max-w-3xl md:max-w-4xl lg:max-w-5xl xl:max-w-6xl px-4 sm:px-6 lg:px-8 ${className}`}
  >
    {children}
  </div>
);

const Section = ({ title, subtitle, id, className = "", children }) => (
  <section id={id} className={`py-12 sm:py-16 md:py-20 ${className} gsap-reveal`}>
    <Container>
      <div className="mb-8 sm:mb-12">
        <h2 className="fluid-h2 font-semibold tracking-tight text-gray-900">{title}</h2>
        {subtitle && (
          <p className="mt-3 max-w-3xl text-gray-600 leading-relaxed">{subtitle}</p>
        )}
      </div>
      {children}
    </Container>
  </section>
);

const Pill = ({ children }) => (
  <span className="inline-flex items-center rounded-full border border-gray-300 px-2.5 py-1 text-[10px] sm:text-xs font-medium text-gray-700 bg-white/70 backdrop-blur pill-animate">
    {children}
  </span>
);

// --- Main page ---------------------------------------------------------------
export default function QuantiaGravitasLanding() {
  const [subscribed, setSubscribed] = useState(false);
  const [sent, setSent] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

    const ctx = gsap.context(() => {
      // Reveal sections
      const reveals = gsap.utils.toArray(".gsap-reveal");
      reveals.forEach((el) => {
        gsap.fromTo(
          el,
          { autoAlpha: 0, y: 20 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: { trigger: el, start: "top 80%", toggleActions: "play none none reverse" },
          }
        );
      });

      // Header color remains constant; removed scroll-based tween per request

      // Hero background parallax
      gsap.to(".hero-bg", {
        yPercent: 15,
        ease: "none",
        scrollTrigger: { trigger: ".hero-section", start: "top top", end: "bottom top", scrub: true },
      });

      // Cards lift on enter
      const cards = gsap.utils.toArray(".card-lift");
      cards.forEach((el) => {
        gsap.fromTo(
          el,
          { y: 12, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.6, ease: "power2.out", scrollTrigger: { trigger: el, start: "top 85%" } }
        );
      });

      // Smooth anchor scrolling for internal links
      const headerOffset = 64; // approximate header height
      const anchors = Array.from(document.querySelectorAll('a[href^="#"]'));
      anchors.forEach((a) => {
        a.addEventListener("click", (e) => {
          const href = a.getAttribute("href");
          if (!href || href === "#") return;
          const target = document.querySelector(href);
          if (!target) return;
          e.preventDefault();
          const y = target.getBoundingClientRect().top + window.pageYOffset - headerOffset;
          gsap.to(window, { duration: 0.6, ease: "power2.out", scrollTo: y });
        });
      });

      // Stagger groups
      const groups = gsap.utils.toArray(".gsap-stagger");
      groups.forEach((parent) => {
        gsap.from(parent.children, {
          y: 12,
          autoAlpha: 0,
          duration: 0.5,
          stagger: 0.08,
          ease: "power2.out",
          scrollTrigger: { trigger: parent, start: "top 85%" },
        });
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <main ref={rootRef} className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-white text-gray-900 overflow-x-clip">
      {/* Nav */}
      <header className="sticky top-0 z-40 w-full border-b border-gray-200/70 bg-white/70 backdrop-blur animate-fade-in">
        <Container className="flex items-center justify-between h-12 sm:h-14">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-xl bg-gray-900 text-white grid place-items-center shadow-sm"><Globe2 className="size-4" /></div>
            <span className="text-sm font-semibold tracking-wide">Quantia Gravitas FZC LLC</span>
          </div>
          <nav className="hidden sm:flex items-center gap-5 text-sm">
            <a href="#about" className="hover:opacity-75">About</a>
            <a href="#vision" className="hover:opacity-75">Vision</a>
            <a href="#philosophy" className="hover:opacity-75">Philosophy</a>
            <a href="#anchors" className="hover:opacity-75">Anchors</a>
            <a href="#sustainability" className="hover:opacity-75">Sustainability</a>
            <a href="#contact" className="hover:opacity-75">Contact</a>
          </nav>
          <a href="#contact" className="inline-flex items-center gap-2 rounded-xl bg-gray-900 text-white px-3 py-2 text-xs font-semibold shadow-sm hover:shadow transition-transform hover:-translate-y-0.5">
            Connect <ArrowRight className="size-4"/>
          </a>
        </Container>
      </header>

      {/* Hero */}
      <section className="hero-section relative overflow-hidden">
        <div className="hero-bg pointer-events-none absolute inset-0 bg-[radial-gradient(60%40%_at_50%-10%,rgba(59,130,246,0.15),transparent_60%),radial-gradient(40%_30%_at_10%_10%,rgba(34,197,94,0.12),transparent_50%),radial-gradient(30%_30%_at_90%_0%,rgba(234,179,8,0.12),transparent_50%)]" />
        <Container className="py-14 sm:py-20 md:py-24">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-3xl">
            <div className="mb-4 flex flex-wrap gap-2 gsap-stagger">
              <Pill>Born in the UAE</Pill>
              <Pill>Global by Design</Pill>
              <Pill>Purpose. Precision. Possibility.</Pill>
            </div>
            <h1 className="fluid-h1 font-semibold tracking-tight text-gray-900 text-balance max-w-[22ch]">
              Shaping the Future with <span className="bg-gradient-to-r from-blue-600 via-emerald-600 to-amber-600 bg-clip-text text-transparent">Purpose, Precision & Possibility</span>
            </h1>
            <p className="mt-5 fluid-p text-gray-600 max-w-2xl">
              Born in the UAE. Inspired by the world. Built for humanity’s future.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href="#about" className="rounded-xl bg-gray-900 text-white px-4 py-2 text-sm md:text-base font-semibold shadow hover:shadow-md transition-transform hover:-translate-y-0.5 inline-flex items-center gap-2">
                Explore Quantia Gravitas <ArrowRight className="size-4" />
              </a>
              <a href="#contact" className="rounded-xl border border-gray-300/70 px-4 py-2 text-sm md:text-base font-semibold transition-transform hover:-translate-y-0.5">
                Get in touch
              </a>
            </div>
          </motion.div>
        </Container>
      </section>

      {/* About */}
      <Section id="about" title="About Us" subtitle="Quantia Gravitas FZC LLC is a UAE-born venture designed for the future. Positioned at the crossroads of innovation, sustainability, and human potential, we are building an ecosystem that empowers ideas, businesses, and communities to thrive globally.">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          <div className="space-y-5 text-gray-700 leading-relaxed">
            <p>
              We believe that the businesses of tomorrow must be built on more than just profit — they must be built on purpose, resilience, and innovation.
            </p>
            <p>
              Headquartered at the prestigious NuVentures Centre Free Zone, Ajman, we stand at the intersection of global trade, culture, and ideas.
            </p>
          </div>
          <div className="card-lift rounded-2xl border border-gray-200 p-6 bg-white/70 transition-transform hover:-translate-y-1">
            <div className="flex items-center gap-3">
              <Building2 className="size-5" />
              <h3 className="font-semibold">Global Perspective</h3>
            </div>
            <p className="mt-3 text-sm text-gray-600">
              From Dubai to London, from Singapore to Silicon Valley, from Africa to India — our spirit is global, and our ambition timeless. We bridge cultures, industries, and ideas, turning opportunities into meaningful impact.
            </p>
          </div>
        </div>
      </Section>

      {/* Vision & Mission */}
      <Section id="vision" title="Vision & Mission">
        <div className="grid md:grid-cols-2 gap-8 gsap-stagger">
          <div className="card-lift rounded-2xl p-6 border border-gray-200 bg-white/70 transition-transform hover:-translate-y-1">
            <h3 className="fluid-h3 font-semibold">Vision</h3>
            <p className="mt-2 text-gray-700">To become a catalyst for sustainable innovation, human progress, and transformative impact worldwide.</p>
          </div>
          <div className="card-lift rounded-2xl p-6 border border-gray-200 bg-white/70 transition-transform hover:-translate-y-1">
            <h3 className="fluid-h3 font-semibold">Mission</h3>
            <p className="mt-2 text-gray-700">To pioneer ideas, foster growth, and create lasting value through collaboration, technology, and purpose‑driven ventures.</p>
          </div>
        </div>
      </Section>

      {/* Philosophy & Edge */}
      <Section id="philosophy" title="Our Philosophy" subtitle="Principles that guide our decisions and define our impact.">
        <div className="grid md:grid-cols-2 gap-10">
          <ul className="space-y-4 text-gray-700 gsap-stagger">
            <li className="flex gap-3"><Globe2 className="mt-1 size-5"/> <div><span className="font-medium">Global Perspective</span> – Thinking beyond borders with worldwide relevance.</div></li>
            <li className="flex gap-3"><Sparkles className="mt-1 size-5"/> <div><span className="font-medium">Innovation at Core</span> – Embracing emerging technologies, bold ideas, and transformative models.</div></li>
            <li className="flex gap-3"><Leaf className="mt-1 size-5"/> <div><span className="font-medium">Sustainability</span> – Driving growth that respects people, planet, and purpose.</div></li>
            <li className="flex gap-3"><ShieldCheck className="mt-1 size-5"/> <div><span className="font-medium">Gravitas in Action</span> – Built on trust, depth, and measurable impact.</div></li>
          </ul>
          <div>
            <h3 className="fluid-h3 font-semibold mb-3">Our Edge</h3>
            <ul className="space-y-3 text-gray-700">
              <li>• A UAE-based enterprise with a global vision</li>
              <li>• Rooted in credibility and innovation</li>
              <li>• Built for adaptability in an evolving world</li>
              <li>• Focused on transformative collaborations</li>
            </ul>
          </div>
        </div>
      </Section>

      {/* Global Gravitas */}
      <Section title="Global Gravitas (Signature)" subtitle="From the UAE to the world, we stand for ideas that transcend borders, industries, and cultures.">
        <div className="grid md:grid-cols-3 gap-6 gsap-stagger">
          {[
            { title: "Inclusivity without Boundaries", desc: "Bringing together minds from every continent." },
            { title: "Innovation with Purpose", desc: "Technology must serve humanity, not the other way around." },
            { title: "Impact with Integrity", desc: "Every initiative must leave the world better than we found it." },
          ].map((card) => (
            <div key={card.title} className="card-lift rounded-2xl border border-gray-200 p-6 bg-white/70 transition-transform hover:-translate-y-1">
              <h4 className="font-semibold">{card.title}</h4>
              <p className="mt-2 text-sm text-gray-600">{card.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* World Map Anchors */}
      <Section id="anchors" title="Anchors of Innovation & Impact" subtitle="Key nodes in our global network.">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 gsap-stagger">
          {[
            { city: "Dubai", tag: "Innovation Hub" },
            { city: "London", tag: "Strategic Collaborations" },
            { city: "Singapore", tag: "Sustainability & Smart Living" },
            { city: "Silicon Valley", tag: "Tech & AI Inspiration" },
            { city: "Africa", tag: "Inclusive Growth" },
            { city: "India", tag: "Talent & Ideas" },
            { city: "Mauritius", tag: "Financial Connectivity" },
            { city: "Maldives", tag: "Blue Economy & Sustainability" },
            { city: "UK", tag: "Global Influence & Thought Leadership" },
          ].map((n) => (
            <div key={n.city} className="group card-lift rounded-2xl border border-gray-200 p-6 bg-white/70 hover:shadow-sm transition-transform hover:-translate-y-1">
              <div className="flex items-center gap-2">
                <MapPin className="size-4 opacity-70" />
                <h4 className="font-semibold">{n.city}</h4>
              </div>
              <p className="mt-1 text-sm text-gray-600">{n.tag}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Manifesto */}
      <Section title="Manifesto">
        <div className="prose-sm sm:prose prose-slate max-w-none">
          <p>
            We are not just a company. We are a movement — born in the UAE, inspired by the world, and built for humanity’s future. Our identity is not confined to industries or activities; it is rooted in the pursuit of progress, collaboration, and sustainable impact.
          </p>
          <p>
            Quantia Gravitas is the courage to dream globally and the determination to deliver responsibly.
          </p>
        </div>
      </Section>

      {/* Ecosystem & Council */}
      <Section title="Ecosystem" subtitle="We are curating a powerful network of innovators, entrepreneurs, institutions, and visionaries. Together, we will create the future.">
        <div className="card-lift rounded-2xl border border-gray-200 p-6 bg-white/70 transition-transform hover:-translate-y-1">
          <h3 className="fluid-h3 font-semibold">Council of the Future</h3>
          <p className="mt-2 text-gray-700">
            Soon, Quantia Gravitas will launch the Council of the Future — a global collective of visionaries, thinkers, entrepreneurs, and leaders dedicated to shaping the next century of innovation and sustainability.
          </p>
        </div>
      </Section>

      {/* Sustainability */}
      <Section id="sustainability" title="Sustainability Commitment" subtitle="We align every venture with responsibility, inclusivity, and long‑term positive impact.">
        <div className="grid md:grid-cols-2 gap-8 gsap-stagger">
          <div className="card-lift rounded-2xl border border-gray-200 p-6 bg-white/70 transition-transform hover:-translate-y-1">
            <h4 className="font-semibold">Guided by the UN SDGs</h4>
            <p className="mt-2 text-sm text-gray-700">From fostering inclusive growth to advancing climate‑conscious innovation, our philosophy embraces globally recognized goals for people and planet.</p>
          </div>
          <div className="card-lift rounded-2xl border border-gray-200 p-6 bg-white/70 transition-transform hover:-translate-y-1">
            <h4 className="font-semibold">Impact You Can Trust</h4>
            <p className="mt-2 text-sm text-gray-700">We prioritize measurable outcomes, transparent reporting, and responsible growth.
            </p>
          </div>
        </div>
      </Section>

      {/* Founder message */}
      <Section title="Message from the Founder">
        <blockquote className="card-lift rounded-2xl border border-gray-200 p-6 bg-white/70">
          <p className="text-lg sm:text-xl leading-relaxed">“At Quantia Gravitas, we believe in thinking beyond boundaries and acting with purpose. Our journey has just begun, and we are committed to creating a legacy of innovation, impact, and progress.”</p>
        </blockquote>
      </Section>

      {/* Stay Connected */}
      <Section id="contact" title="Stay Connected" subtitle="We are shaping our next chapter. Stay connected to witness the future unfold.">
        <div className="grid md:grid-cols-2 gap-8 gsap-stagger">
          {/* Email subscription */}
          <div className="card-lift rounded-2xl border border-gray-200 p-6 bg-white/70 transition-transform hover:-translate-y-1">
            <h4 className="font-semibold flex items-center gap-2"><Mail className="size-4"/> Email Subscription</h4>
            {!subscribed ? (
              <form
                className="mt-4 flex flex-col sm:flex-row gap-3"
                onSubmit={(e) => { e.preventDefault(); setSubscribed(true); }}
              >
                <input
                  type="email"
                  required
                  placeholder="your@email.com"
                  className="flex-1 rounded-xl border border-gray-300 bg-white/80 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
                <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-xl bg-gray-900 text-white px-5 py-3 text-sm font-semibold shadow hover:shadow-md">
                  Subscribe <Send className="size-4"/>
                </button>
              </form>
            ) : (
              <div className="mt-4 flex items-center gap-2 text-emerald-600">
                <CheckCircle2 className="size-5"/> <span className="text-sm">Subscribed — we’ll keep you posted.</span>
              </div>
            )}
          </div>

          {/* Contact form */}
          <div className="card-lift rounded-2xl border border-gray-200 p-6 bg-white/70 transition-transform hover:-translate-y-1">
            <h4 className="font-semibold flex items-center gap-2"><Mail className="size-4"/> Contact Form</h4>
            {!sent ? (
              <form className="mt-4 space-y-3" onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
                <input required name="name" placeholder="Your name" className="w-full rounded-xl border border-gray-300 bg-white/80 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50" />
                <input required type="email" name="email" placeholder="Email address" className="w-full rounded-xl border border-gray-300 bg-white/80 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50" />
                <textarea required name="message" placeholder="How can we collaborate?" rows={4} className="w-full rounded-xl border border-gray-300 bg-white/80 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50" />
                <button type="submit" className="inline-flex items-center gap-2 rounded-xl bg-gray-900 text-white px-5 py-3 text-sm font-semibold shadow hover:shadow-md">
                  Send message <ArrowRight className="size-4"/>
                </button>
                <p className="text-xs text-gray-500">This is a demo form. Hook it to your backend/API (e.g., Formspree, Resend) to receive submissions.</p>
              </form>
            ) : (
              <div className="mt-4 flex items-center gap-2 text-emerald-600">
                <CheckCircle2 className="size-5"/> <span className="text-sm">Message sent — we’ll reach out shortly.</span>
              </div>
            )}
          </div>
        </div>
      </Section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-10 bg-white/60">
        <Container>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="font-semibold">Quantia Gravitas FZC LLC</p>
              <p className="text-sm text-gray-600">Ajman NuVentures Centre Free Zone, UAE</p>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Globe2 className="size-4"/> <span>© {new Date().getFullYear()} Quantia Gravitas. All rights reserved.</span>
            </div>
          </div>
        </Container>
      </footer>
    </main>
  );
}