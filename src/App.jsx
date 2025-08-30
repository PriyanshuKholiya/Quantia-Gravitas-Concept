import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  Globe2,
  ArrowRight,
  MapPin,
  Leaf,
  Sparkles,
  ShieldCheck,
  Mail,
  Send,
  CheckCircle2,
  Building2,
  Sun,
  Moon,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

// --- Helper components -------------------------------------------------------
const Container = ({ className = "", id, children }) => (
  <div
    id={id}
    className={`mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 ${className}`}
  >
    {children}
  </div>
);

const Section = ({ title, subtitle, id, index, className = "", children }) => (
  <section id={id} className={`py-16 md:py-24 ${className} gsap-reveal`}>
    <Container>
      <div className="mb-10 sm:mb-12">
        <div className="border-t border-white/10 pt-6">
          {typeof index !== "undefined" && (
            <p className="mb-3 text-[11px] tracking-[0.3em] uppercase text-neutral-400/80">
              ( {String(index).padStart(2, "0")} ) {title}
            </p>
          )}
          <h2 className="fluid-h2 font-editorial tracking-tight text-neutral-100">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-3 max-w-3xl text-neutral-400 leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {children}
    </Container>
  </section>
);

const Pill = ({ children }) => (
  <span className="inline-flex items-center rounded-full border border-white/15 px-2.5 py-1 text-[10px] sm:text-xs font-medium text-neutral-300 bg-white/[0.03] backdrop-blur pill-animate">
    {children}
  </span>
);

// --- Main page ---------------------------------------------------------------
export default function QuantiaGravitasLanding() {
  const [subscribed, setSubscribed] = useState(false);
  const [sent, setSent] = useState(false);
  const rootRef = useRef(null);

  // Theme state
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") return "dark";
    const stored = window.localStorage.getItem("theme");
    if (stored === "light" || stored === "dark") return stored;
    const prefersLight =
      window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches;
    return prefersLight ? "light" : "dark";
  });
  const isLight = theme === "light";

  useEffect(() => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    // toggle class for CSS overrides
    if (isLight) root.classList.add("theme-light");
    else root.classList.remove("theme-light");
    // update meta color-scheme for UA styling
    const meta = document.querySelector('meta[name="color-scheme"]');
    if (meta) meta.setAttribute("content", isLight ? "light" : "dark");
    // persist
    try {
      window.localStorage.setItem("theme", isLight ? "light" : "dark");
    } catch {}
  }, [isLight]);

  const toggleTheme = () => setTheme((t) => (t === "light" ? "dark" : "light"));

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;

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
            scrollTrigger: {
              trigger: el,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });

      // Hero background parallax
      gsap.to(".hero-bg", {
        yPercent: 15,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero-section",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      // Scroll-driven staged hero reveal (pinned on taller viewports; plays on enter on smaller)
      const shouldPinHero = !window.location.hash && window.innerHeight >= 700;

      let heroTl;
      if (shouldPinHero) {
        heroTl = gsap.timeline({
          scrollTrigger: {
            trigger: ".hero-section",
            start: "top top",
            end: "+=80%",
            scrub: true,
            pin: true,
            anticipatePin: 1,
          },
        });
      } else {
        // Play once when hero enters viewport (no scrub) to avoid blank hero on load
        heroTl = gsap.timeline({
          scrollTrigger: {
            trigger: ".hero-section",
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        });
      }

      heroTl
        .from(".hero-kicker > *", {
          y: 20,
          autoAlpha: 0,
          stagger: 0.12,
          duration: 0.6,
          ease: "power2.out",
        })
        .from(
          ".hero-brand",
          { y: 22, autoAlpha: 0, duration: 0.7, ease: "power2.out" },
          "-=0.2"
        )
        .from(
          ".hero-title",
          { y: 24, autoAlpha: 0, duration: 0.8, ease: "power2.out" },
          "-=0.2"
        )
        .from(
          ".hero-subtitle",
          { y: 18, autoAlpha: 0, duration: 0.6, ease: "power2.out" },
          "-=0.2"
        )
        .from(
          [".hero-cta-1", ".hero-cta-2"],
          {
            y: 16,
            autoAlpha: 0,
            stagger: 0.1,
            duration: 0.6,
            ease: "power2.out",
          },
          "-=0.1"
        );

      // Cards lift on enter
      const cards = gsap.utils.toArray(".card-lift");
      cards.forEach((el) => {
        gsap.fromTo(
          el,
          { y: 12, filter: "blur(2px)" },
          {
            y: 0,
            filter: "blur(0px)",
            duration: 0.6,
            ease: "power2.out",
            scrollTrigger: { trigger: el, start: "top 90%" },
          }
        );
      });

      // Smooth anchor scrolling for internal links
      const headerEl = document.querySelector("header");
      const headerOffset = (headerEl?.offsetHeight || 64) + 8; // actual header height + small gap
      const anchors = Array.from(document.querySelectorAll('a[href^="#"]'));
      anchors.forEach((a) => {
        a.addEventListener("click", (e) => {
          const href = a.getAttribute("href");
          if (!href || href === "#") return;
          const target = document.querySelector(href);
          if (!target) return;
          e.preventDefault();
          const y =
            target.getBoundingClientRect().top +
            window.pageYOffset -
            headerOffset;
          gsap.to(window, { duration: 0.6, ease: "power2.out", scrollTo: y });
        });
      });

      // If page loads with a hash, align scroll position accounting for header height
      if (window.location.hash) {
        const target = document.querySelector(window.location.hash);
        if (target) {
          const y =
            target.getBoundingClientRect().top +
            window.pageYOffset -
            headerOffset;
          gsap.to(window, { duration: 0.01, scrollTo: y });
        }
      }

      // Stagger groups
      const groups = gsap.utils.toArray(".gsap-stagger");
      groups.forEach((parent) => {
        gsap.from(parent.children, {
          y: 12,
          duration: 0.5,
          stagger: 0.08,
          ease: "power2.out",
          scrollTrigger: { trigger: parent, start: "top 90%" },
        });
      });

      // Ensure ScrollTrigger recalculates after fonts/layout settle (prevents hidden cards on some Windows setups)
      requestAnimationFrame(() => ScrollTrigger.refresh());
    }, rootRef);

    return () => ctx.revert();
  }, []);

  const navLinkClass = isLight
    ? "text-neutral-600 hover:text-black"
    : "text-neutral-400 hover:text-white";

  return (
    <main
      ref={rootRef}
      className={`min-h-screen overflow-x-hidden ${isLight ? "bg-white text-neutral-900" : "bg-neutral-950 text-neutral-200"}`}
    >
      {/* Nav */}
      <header className={isLight ? "sticky top-0 z-40 w-full border-b border-neutral-900/10 bg-white/70 backdrop-blur animate-fade-in" : "sticky top-0 z-40 w-full border-b border-white/10 bg-neutral-950/60 backdrop-blur animate-fade-in"}>
        <Container className="flex items-center justify-between h-14 md:h-16">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-xl bg-white/10 text-white grid place-items-center shadow-sm">
              <Globe2 className="size-4" />
            </div>
            <span className="text-xs sm:text-sm tracking-[0.2em] uppercase text-neutral-300">
              Quantia Gravitas FZC LLC
            </span>
          </div>
          <nav className="hidden sm:flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] md:text-xs uppercase tracking-wide">
            <a href="#about" className={navLinkClass}>
              About
            </a>
            <a href="#vision" className={navLinkClass}>
              Vision
            </a>
            <a href="#philosophy" className={navLinkClass}>
              Philosophy
            </a>
            <a href="#anchors" className={navLinkClass}>
              Anchors
            </a>
            <a href="#sustainability" className={navLinkClass}>
              Sustainability
            </a>
            <a href="#contact" className={navLinkClass}>
              Contact
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Toggle theme"
              onClick={toggleTheme}
              className={isLight ? "inline-flex items-center gap-2 rounded-full border border-neutral-900/15 bg-neutral-900/[0.04] text-neutral-900 px-3 py-2 text-[11px] font-semibold hover:bg-neutral-900/[0.08] transition-transform hover:-translate-y-0.5" : "inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 text-white px-3 py-2 text-[11px] font-semibold hover:bg-white/10 transition-transform hover:-translate-y-0.5"}
            >
              {isLight ? <Moon className="size-4" /> : <Sun className="size-4" />}
              <span className="hidden sm:inline">{isLight ? "Dark" : "Light"}</span>
            </button>
            <a href="#contact" className="btn-pill btn-outline btn-sm">
              Connect <ArrowRight className="size-4" />
            </a>
          </div>
        </Container>
      </header>

      {/* Hero */}
      <section className="hero-section relative overflow-hidden">
        <div className="hero-bg pointer-events-none absolute inset-0 will-change-transform bg-[radial-gradient(60%_60%_at_50%_0%,rgba(255,255,255,0.06),transparent_60%)]" />
        <Container className="min-h-[88svh] py-16 md:py-24 grid place-items-center">
          <motion.div className="max-w-3xl text-center">
            
            <h1 className="hero-brand font-editorial text-[clamp(2.5rem,7.5vw,6.5rem)] leading-[1.04] tracking-tight text-neutral-100">
              QUANTIA GRAVITAS
            </h1>
            <div className="hero-kicker mt-2 flex items-center justify-center">
              <p className="text-[10px] sm:text-xs tracking-[0.35em] uppercase text-neutral-400">
                FZC LLC
              </p>
            </div>
            <h2 className="hero-title font-editorial text-[clamp(1.35rem,2.4vw+0.6rem,2.75rem)] leading-[1.18] text-neutral-100 text-balance max-w-[30ch] mx-auto">
              Purpose, Precision and Possibility — for a future that respects
              people, planet, and progress.
            </h2>
            <p className="hero-subtitle mt-5 fluid-p text-neutral-400 max-w-2xl mx-auto">
              Born in the UAE. Inspired by the world. Built for humanity’s
              future.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <a href="#about" className="btn-pill btn-outline hero-cta-1">
                Explore Quantia Gravitas <ArrowRight className="size-4" />
              </a>
              <a href="#contact" className="btn-pill btn-solid hero-cta-2">
                Get in touch
              </a>
            </div>
          </motion.div>
        </Container>
      </section>

      {/* About */}
      <Section
        index={1}
        id="about"
        title="The Roots"
        subtitle="Quantia Gravitas FZC LLC is a UAE-born venture designed for the future — at the crossroads of innovation, sustainability, and human potential."
      >
        <div className="creative-grid">
          {/* Left: oversized uppercase statement with warm accent highlights */}
          <div className="mega-text text-neutral-100">
            WE BELIEVE TOMORROW’S BUSINESSES MUST BE BUILT ON{" "}
            <span className="accent">PURPOSE</span>,{" "}
            <span className="accent">RESILIENCE</span>, AND{" "}
            <span className="accent">INNOVATION</span>.
          </div>

          {/* Right: vertical divider column with lead copy and a supporting card */}
          <div className="v-divider">
            <p className="lead-lg text-neutral-300/90">
              Headquartered at the NuVentures Centre Free Zone, Ajman, we stand
              at the intersection of global trade, culture, and ideas.
            </p>

            <div className="mt-5 card-lift rounded-2xl border border-white/12 p-6 bg-white/[0.03] transition-transform hover:-translate-y-1">
              <div className="flex items-center gap-3">
                <Building2 className="size-5 text-neutral-300" />
                <h3 className="font-semibold text-neutral-100">Global Perspective</h3>
              </div>
              <p className="mt-3 text-sm text-neutral-400">
                From Dubai to London, Singapore to Silicon Valley, Africa to
                India — we bridge cultures, industries, and ideas to turn
                opportunity into meaningful impact.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* Vision & Mission */}
      <Section index={2} id="vision" title="Vision & Mission">
        <div className="max-w-3xl mx-auto text-center">
          <p className="display-quote text-neutral-100">
            Catalyzing <span className="accent">innovation</span>, advancing human{" "}
            <span className="accent">progress</span>, and driving <span className="accent">impact</span>.
          </p>
        </div>
        <div className="mt-8 grid md:grid-cols-2 gap-8 gsap-stagger">
          <div className="card-lift rounded-2xl p-6 border border-white/12 bg-white/[0.03] transition-transform hover:-translate-y-1">
            <h3 className="fluid-h3 font-semibold text-neutral-100">Vision</h3>
            <p className="mt-2 text-neutral-300/90">
              To become a catalyst for sustainable innovation, human progress,
              and transformative impact worldwide.
            </p>
          </div>
          <div className="card-lift rounded-2xl p-6 border border-white/12 bg-white/[0.03] transition-transform hover:-translate-y-1">
            <h3 className="fluid-h3 font-semibold text-neutral-100">Mission</h3>
            <p className="mt-2 text-neutral-300/90">
              To pioneer ideas, foster growth, and create lasting value through
              collaboration, technology, and purpose‑driven ventures.
            </p>
          </div>
        </div>
      </Section>

      {/* Philosophy & Edge */}
      <Section
        index={3}
        id="philosophy"
        title="Our Philosophy"
        subtitle="Principles that guide decisions and define impact."
      >
        <div className="max-w-4xl mx-auto text-center">
          <p className="display-quote text-neutral-100">
            Principles that guide our work: <span className="font-semibold">Global</span> perspective, <span className="font-semibold">innovation</span>, <span className="font-semibold">sustainability</span>, and <span className="font-semibold">gravitas</span>.
          </p>
        </div>

        <div className="mt-8 grid md:grid-cols-2 gap-6 items-stretch gsap-stagger">
          <div className="rounded-2xl border border-white/12 p-6 bg-white/[0.03]">
            <div className="flex items-start gap-3">
              <Globe2 className="mt-1 size-5 text-neutral-300" />
              <div>
                <h4 className="font-semibold text-neutral-100">Global Perspective</h4>
                <p className="mt-1 text-neutral-300/90">Thinking beyond borders with worldwide relevance.</p>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-white/12 p-6 bg-white/[0.03]">
            <div className="flex items-start gap-3">
              <Sparkles className="mt-1 size-5 text-neutral-300" />
              <div>
                <h4 className="font-semibold text-neutral-100">Innovation at Core</h4>
                <p className="mt-1 text-neutral-300/90">Embracing bold ideas and transformative models.</p>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-white/12 p-6 bg-white/[0.03]">
            <div className="flex items-start gap-3">
              <Leaf className="mt-1 size-5 text-neutral-300" />
              <div>
                <h4 className="font-semibold text-neutral-100">Sustainability</h4>
                <p className="mt-1 text-neutral-300/90">Growth that respects people, planet, and purpose.</p>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-white/12 p-6 bg-white/[0.03]">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-1 size-5 text-neutral-300" />
              <div>
                <h4 className="font-semibold text-neutral-100">Gravitas in Action</h4>
                <p className="mt-1 text-neutral-300/90">Built on trust, depth, and measurable impact.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 card-lift rounded-2xl border border-white/12 p-6 bg-white/[0.03]">
          <h3 className="fluid-h3 font-semibold text-neutral-100 mb-2">Our Edge</h3>
          <ul className="grid sm:grid-cols-2 gap-2 text-neutral-300/90">
            <li>• A UAE-based enterprise with a global vision</li>
            <li>• Rooted in credibility and innovation</li>
            <li>• Built for adaptability in an evolving world</li>
            <li>• Focused on transformative collaborations</li>
          </ul>
        </div>
      </Section>

      {/* Global Gravitas */}
      <Section
        index={4}
        title="Global Gravitas (Signature)"
        subtitle="From the UAE to the world — ideas that transcend borders, industries, and cultures."
      >
        <div className="max-w-4xl mx-auto text-center">
          <p className="display-quote text-neutral-100">
            From the <span className="accent">UAE</span> to the world — ideas that transcend borders,
            industries, and cultures.
          </p>
        </div>
        <div className="mt-8 grid md:grid-cols-3 gap-6 items-stretch auto-rows-fr gsap-stagger">
          {[
            {
              title: "Inclusivity without Boundaries",
              desc: "Bringing together minds from every continent.",
            },
            {
              title: "Innovation with Purpose",
              desc: "Technology must serve humanity, not the other way around.",
            },
            {
              title: "Impact with Integrity",
              desc: "Every initiative must leave the world better than we found it.",
            },
          ].map((card) => (
            <div
              key={card.title}
              className="card-lift h-full min-h-[168px] flex flex-col rounded-2xl border border-white/12 p-6 bg-white/[0.03] transition-transform hover:-translate-y-1"
            >
              <div className="min-h-[48px] md:min-h-[56px]">
                <h4 className="font-semibold text-neutral-100 leading-snug">
                  {card.title}
                </h4>
              </div>
              <p className="mt-2 text-sm text-neutral-400">{card.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* World Map Anchors */}
      <Section
        index={5}
        id="anchors"
        title="Anchors of Innovation & Impact"
        subtitle="Key nodes in our global network."
      >
        <div className="max-w-3xl mx-auto text-center">
          <p className="lead-lg text-neutral-300/90">Key nodes in our global network</p>
        </div>
        <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch gsap-stagger">
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
            <div
              key={n.city}
              className="group card-lift rounded-2xl border border-white/12 p-6 bg-white/[0.03] hover:shadow-sm transition-transform hover:-translate-y-1"
            >
              <div className="flex items-center gap-2">
                <MapPin className="size-4 text-neutral-400" />
                <h4 className="font-semibold text-neutral-100">{n.city}</h4>
              </div>
              <p className="mt-1 text-sm text-neutral-400">{n.tag}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Manifesto */}
      <Section index={6} title="Manifesto">
        <div className="max-w-3xl mx-auto text-center space-y-5">
          <p className="display-quote text-neutral-100">
            We are a <span className="accent">movement</span> — born in the UAE, inspired by the world,
            built for humanity’s <span className="accent">future</span>.
          </p>
          <p className="lead-lg text-neutral-300/90">
            Our identity is not confined to industries or activities; it is rooted in the
            pursuit of progress, collaboration, and sustainable impact. Quantia Gravitas is
            the courage to dream globally and the determination to deliver responsibly.
          </p>
        </div>
      </Section>

      {/* Ecosystem & Council */}
      <Section
        index={7}
        title="Ecosystem"
        subtitle="We are curating a network of innovators, entrepreneurs, institutions, and visionaries."
      >
        <div className="max-w-3xl mx-auto text-center">
          <p className="display-quote text-neutral-100">
            A living <span className="accent">ecosystem</span> of thinkers, doers, and builders.
          </p>
        </div>
        <div className="mt-8 card-lift rounded-2xl border border-white/12 p-6 bg-white/[0.03] transition-transform hover:-translate-y-1">
          <h3 className="fluid-h3 font-semibold text-neutral-100">
            Council of the Future
          </h3>
          <p className="mt-2 text-neutral-300/90">
            Soon, Quantia Gravitas will launch the Council of the Future — a
            global collective of visionaries, thinkers, entrepreneurs, and
            leaders dedicated to shaping the next century of innovation and
            sustainability.
          </p>
        </div>
      </Section>

      {/* Sustainability */}
      <Section
        index={8}
        id="sustainability"
        title="Sustainability Commitment"
        subtitle="We align every venture with responsibility, inclusivity, and long‑term positive impact."
      >
        <div className="max-w-3xl mx-auto text-center">
          <p className="display-quote text-neutral-100">
            Committing to sustainability with measurable impact.
          </p>
        </div>
        <div className="mt-8 grid md:grid-cols-2 gap-8 gsap-stagger">
          <div className="card-lift rounded-2xl border border-white/12 p-6 bg-white/[0.03] transition-transform hover:-translate-y-1">
            <h4 className="font-semibold text-neutral-100">
              Guided by the UN SDGs
            </h4>
            <p className="mt-2 text-sm text-neutral-300/90">
              From fostering inclusive growth to advancing climate‑conscious
              innovation, our philosophy embraces globally recognized goals for
              people and planet.
            </p>
          </div>
          <div className="card-lift rounded-2xl border border-white/12 p-6 bg-white/[0.03] transition-transform hover:-translate-y-1">
            <h4 className="font-semibold text-neutral-100">
              Impact You Can Trust
            </h4>
            <p className="mt-2 text-sm text-neutral-300/90">
              We prioritize measurable outcomes, transparent reporting, and
              responsible growth.
            </p>
          </div>
        </div>
      </Section>

      {/* Founder message */}
      <Section index={9} title="Message from the Founder">
        <blockquote className="card-lift rounded-2xl border border-white/12 p-6 bg-white/[0.03]">
          <p className="display-quote text-neutral-100">
            “At Quantia Gravitas, we think beyond boundaries and act with{" "}
            <span className="accent">purpose</span>. Our journey has just begun — we are
            building a legacy of <span className="accent">innovation</span>, impact and progress.”
          </p>
        </blockquote>
      </Section>

      {/* Stay Connected */}
      <Section
        index={10}
        id="contact"
        title="Stay Connected"
        subtitle="We are shaping our next chapter. Stay connected to witness the future unfold."
      >
        <div className="grid md:grid-cols-2 gap-8 gsap-stagger">
          {/* Email subscription */}
          <div className="card-lift rounded-2xl border border-white/12 p-6 bg-white/[0.03] transition-transform hover:-translate-y-1">
            <h4 className="font-semibold flex items-center gap-2 text-neutral-100">
              <Mail className="size-4 text-neutral-300" /> Email Subscription
            </h4>
            {!subscribed ? (
              <form
                className="mt-4 flex flex-col sm:flex-row gap-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  setSubscribed(true);
                }}
              >
                <input
                  type="email"
                  required
                  placeholder="your@email.com"
                  className="flex-1 rounded-xl border border-white/15 bg-white/[0.06] placeholder:text-neutral-500 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-white/20"
                />
                <button type="submit" className="btn-pill btn-solid">
                  Subscribe <Send className="size-4" />
                </button>
              </form>
            ) : (
              <div className="mt-4 flex items-center gap-2 text-emerald-400">
                <CheckCircle2 className="size-5" />{" "}
                <span className="text-sm">
                  Subscribed — we’ll keep you posted.
                </span>
              </div>
            )}
          </div>

          {/* Contact form */}
          <div className="card-lift rounded-2xl border border-white/12 p-6 bg-white/[0.03] transition-transform hover:-translate-y-1">
            <h4 className="font-semibold flex items-center gap-2 text-neutral-100">
              <Mail className="size-4 text-neutral-300" /> Contact Form
            </h4>
            {!sent ? (
              <form
                className="mt-4 space-y-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  setSent(true);
                }}
              >
                <input
                  required
                  name="name"
                  placeholder="Your name"
                  className="w-full rounded-xl border border-white/15 bg-white/[0.06] placeholder:text-neutral-500 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-white/20"
                />
                <input
                  required
                  type="email"
                  name="email"
                  placeholder="Email address"
                  className="w-full rounded-xl border border-white/15 bg-white/[0.06] placeholder:text-neutral-500 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-white/20"
                />
                <textarea
                  required
                  name="message"
                  placeholder="How can we collaborate?"
                  rows={4}
                  className="w-full rounded-xl border border-white/15 bg-white/[0.06] placeholder:text-neutral-500 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-white/20"
                />
                <button type="submit" className="btn-pill btn-solid">
                  Send message <ArrowRight className="size-4" />
                </button>
                
              </form>
            ) : (
              <div className="mt-4 flex items-center gap-2 text-emerald-400">
                <CheckCircle2 className="size-5" />{" "}
                <span className="text-sm">
                  Message sent — we’ll reach out shortly.
                </span>
              </div>
            )}
          </div>
        </div>
      </Section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-10 bg-neutral-950/80">
        <Container>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="font-semibold text-neutral-100">
                Quantia Gravitas FZC LLC
              </p>
              <p className="text-sm text-neutral-400">
                Ajman NuVentures Centre Free Zone, UAE
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-neutral-500">
              <Globe2 className="size-4" />{" "}
              <span>
                © {new Date().getFullYear()} Quantia Gravitas. All rights
                reserved.
              </span>
            </div>
          </div>
        </Container>
      </footer>
    </main>
  );
}