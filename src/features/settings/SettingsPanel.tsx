import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSettings } from "./useSettings";

const panel = {
  hidden: { x: "100%", opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 300, damping: 30 },
  },
  exit: {
    x: "100%",
    opacity: 0,
    transition: { ease: "easeInOut", duration: 0.3 },
  },
};

const overlay = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.3 } },
};

const ToggleSwitch: React.FC<{
  checked: boolean;
  onChange: () => void;
  label: string;
}> = ({ checked, onChange, label }) => (
  <label
    role="switch"
    aria-checked={checked}
    onClick={onChange}
    className="flex items-center justify-between group cursor-pointer w-full py-2 outline-none"
  >
    <span className="font-mono text-[11px] tracking-widest uppercase text-white/40 group-hover:text-white/70 transition-colors">
      {label}
    </span>
    <div
      className="relative w-8 h-4.5 rounded-full transition-colors duration-300"
      style={{
        backgroundColor: checked
          ? 'var(--toggle-track-on)'
          : 'var(--toggle-track-off)',
      }}
    >
      <motion.div
        className="absolute top-0.5 w-3.5 h-3.5 rounded-full shadow-sm pointer-events-none"
        style={{ backgroundColor: 'var(--toggle-thumb)' }}
        initial={false}
        animate={{
          left: checked ? "calc(100% - 16px)" : "2px",
        }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
    </div>
  </label>
);

const SettingsPanel: React.FC<{ open: boolean; onClose: () => void }> = ({
  open,
  onClose,
}) => {
  const { settings, toggle, toggleColorScheme } = useSettings();

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop overlay */}
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-90"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={overlay}
            onClick={onClose}
          />

          <motion.div
            className="fixed top-0 right-0 h-full w-full sm:w-80 bg-panel/70 backdrop-blur-3xl border-l border-white/10 z-100 p-8 shadow-2xl flex flex-col"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={panel}
          >
            <div className="flex justify-between items-center mb-10 border-b border-white/5 pb-6">
              <h2 className="font-display text-2xl font-light tracking-tight text-white">
                Preferences
              </h2>
              <button
                onClick={onClose}
                className="text-white/40 hover:text-white transition-colors"
                aria-label="Close settings"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4 flex-1">
              <ToggleSwitch
                checked={settings.noise}
                onChange={() => toggle("noise")}
                label="Cinematic Noise"
              />
              <ToggleSwitch
                checked={settings.scanlines}
                onChange={() => toggle("scanlines")}
                label="CRT Scanlines"
              />
              <ToggleSwitch
                checked={settings.audio}
                onChange={() => toggle("audio")}
                label="Haptic Audio"
              />

              <div className="flex flex-col gap-4 py-2 pt-6 mt-6 border-t border-white/5">
                <span className="font-mono text-[10px] tracking-widest uppercase text-white/30">
                  Interface Theme
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleColorScheme("dark")}
                    className={`flex-1 py-2 font-mono text-[10px] tracking-widest uppercase rounded border transition-colors ${settings.colorScheme === "dark" ? "bg-white text-black border-white" : "border-white/10 text-white/40 hover:border-white/30"}`}
                  >
                    Dark
                  </button>
                  <button
                    onClick={() => toggleColorScheme("light")}
                    className={`flex-1 py-2 font-mono text-[10px] tracking-widest uppercase rounded border transition-colors ${settings.colorScheme === "light" ? "bg-white text-black border-white" : "border-white/10 text-white/40 hover:border-white/30"}`}
                  >
                    Light
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-auto pt-8 border-t border-white/5">
              <p className="font-mono text-[9px] text-white/20 tracking-widest uppercase text-center">
                Settings persist locally
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SettingsPanel;
