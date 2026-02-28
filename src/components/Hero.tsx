import React from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { useCountUp } from "../hooks/useCountUp";
import type { FC } from "react";

const Hero: FC = () => {
  const prefersReduced = useReducedMotion();
  const heroRef = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const statsY = useTransform(scrollYProgress, [0, 1], ["0%", "-20%"]);
  const opacityOut = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  // always call the hook to preserve hook order, and switch to a static value when reduced motion is preferred
  const _pikachuTransform = useTransform(scrollYProgress, [0, 1], ["0%", "-10%"]);
  const pikachuY = prefersReduced ? "0%" : _pikachuTransform;

  const species = useCountUp(1025, 1500, true);
  const endpoints = useCountUp(40, 1500, true);
  const uptime = useCountUp(99.9, 1500, true);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 },
    },
  };

  const childVariants = {
    hidden: prefersReduced
      ? { opacity: 0 }
      : { opacity: 0, y: 30, filter: "blur(10px)" },
    visible: prefersReduced
      ? { opacity: 1 }
      : {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] },
        },
  };

  return (
    <section
      ref={heroRef}
      className="relative min-h-[95vh] flex flex-col items-center justify-center pt-32 pb-24 overflow-hidden px-4 md:px-12"
    >
      {/* Cinematic Ambient Lighting - Animated Radial Gradient behind headline */}
      <motion.div
        animate={
          prefersReduced
            ? {}
            : {
                scale: [1, 1.05, 1],
                opacity: [0.4, 0.6, 0.4],
              }
        }
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[30%] left-1/2 -translate-x-1/2 w-[80vw] h-[50vh] max-w-4xl bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.08)_0%,rgba(0,255,255,0.03)_30%,transparent_70%)] pointer-events-none blend-glow"
      />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-screen h-[60vh] bg-white/1 blur-[150px] rounded-[100%] pointer-events-none blend-glow" />

      {/* Pikachu silhouette — cinematic background element */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 z-0 pointer-events-none flex items-end justify-end overflow-hidden"
        initial={{ opacity: 0, scale: 1.05 }}
        animate={prefersReduced ? { opacity: 0.09 } : { opacity: 0.09, scale: 1 }}
        transition={{ duration: 2.5, ease: [0.16, 1, 0.3, 1] }}
        style={{ y: pikachuY }}
      >
        <img
          src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png"
          alt=""
          draggable={false}
          className="w-[55vw] max-w-2xl translate-x-[15%] translate-y-[-8%] select-none"
          style={{
            filter: 'brightness(0.8) sepia(0.3) hue-rotate(15deg)',
            mixBlendMode: 'luminosity',
          }}
        />
      </motion.div>

      <motion.div
        style={{ y: textY, opacity: opacityOut }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-5xl text-center z-10 flex flex-col items-center gap-6"
      >
        <motion.p
          variants={childVariants}
          className="font-mono text-xs tracking-[0.4em] text-white/40 uppercase mb-2"
        >
          PokéAPI Interface 2.0
        </motion.p>

        <motion.h1
          variants={childVariants}
          className="relative font-display text-[clamp(3.5rem,8vw,7rem)] font-light leading-[0.95] tracking-tight text-white mb-2 z-10"
        >
          An <i className="font-serif text-white/70 italic">index.</i>
          <br />
          <span className="font-black normal-case tracking-tighter">
            Not a game.
          </span>
        </motion.h1>

        <motion.div
          variants={childVariants}
          className="max-w-xl mt-4 mb-4 mx-auto text-center flex flex-col gap-4"
        >
          <p
            className="font-mono text-sm md:text-base font-light leading-relaxed"
            style={{ color: 'var(--text-muted)' }}
          >
            A systematic record of Pokémon data, rebuilt for modern application
            development. Access stats, typings, and abilities via a structured
            REST interface.
          </p>
        </motion.div>

        {/* Clean Mono Code Preview (Typographic Contrast) */}
        <motion.div
          variants={childVariants}
          className="w-full max-w-md mx-auto bg-panel/80 border border-white/5 rounded block p-5 text-left font-mono text-xs md:text-sm shadow-2xl shadow-shadow mt-2 backdrop-blur-sm relative group"
        >
          <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />
          <div className="flex gap-1.5 mb-4 opacity-30">
            <div className="w-2 h-2 rounded-full bg-white" />
            <div className="w-2 h-2 rounded-full bg-white" />
            <div className="w-2 h-2 rounded-full bg-white" />
          </div>
          <p className="text-white/60 mb-2">
            <span className="text-[#0ff]/60 font-semibold">GET</span>{" "}
            /api/v2/pokemon/25
          </p>
          <div className="text-white/30 border-l border-white/10 pl-3 ml-1 flex flex-col gap-1">
            <p>{`{`}</p>
            <p className="pl-4">
              "id": <span className="text-[#facc15]/80">25</span>,
            </p>
            <p className="pl-4">
              "name": <span className="text-white/70">"pikachu"</span>,
            </p>
            <p className="pl-4">
              "base_experience": <span className="text-[#facc15]/80">112</span>
            </p>
            <p>{`}`}</p>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        style={{ y: statsY, opacity: opacityOut }}
        initial={prefersReduced ? {} : { y: 40, opacity: 0 }}
        animate={prefersReduced ? {} : { y: 0, opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="z-10 mt-12 max-w-4xl w-full"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/10 p-px rounded-xl overflow-hidden backdrop-blur-md shadow-2xl shadow-shadow/50">
          {[
            { label: "Total Species Logged", ...species },
            { label: "Available Endpoints", ...endpoints },
            { label: "Measured Uptime (%)", ...uptime },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-panel/95 p-8 flex flex-col items-center justify-center relative overflow-hidden group hover:bg-surface/95 transition-colors duration-500"
            >
              <div className="absolute inset-0 bg-linear-to-b from-white/4 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
              <p
                className="font-display font-medium text-4xl text-white mb-2"
                ref={stat.ref as React.RefObject<HTMLParagraphElement>}
              >
                {stat.count}
              </p>
              <p className="font-mono text-[9px] tracking-[0.2em] text-white/30 uppercase text-center">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.a
        href="#data"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-10 group"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
      >
        <span className="font-mono text-[9px] tracking-widest text-white/40 uppercase link-underline">
          Scroll to API Index
        </span>
        <div className="w-px h-10 bg-white/10 relative overflow-hidden rounded-full mt-2">
          <motion.div
            className="absolute top-0 left-0 w-full h-1/3 bg-white/50 rounded-full"
            animate={prefersReduced ? {} : { y: ["-100%", "300%"] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
          />
        </div>
      </motion.a>
    </section>
  );
};

export default Hero;
