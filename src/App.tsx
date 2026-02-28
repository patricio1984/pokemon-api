import React from "react";
import ErrorBoundary from "./shared/components/ErrorBoundary";
import Hero from "./features/pokemon/components/Hero";
import PageTransition from "./shared/components/PageTransition";
import { Cursor } from "./shared/components/Cursor";
import { motion, useScroll, useTransform } from "framer-motion";
import useInView from "./shared/hooks/useInView";
import { useGamepad } from "./shared/hooks/useGamepad";
import Modal from "./shared/components/Modal";
import SettingsPanel from "./features/settings/SettingsPanel";
import { useAudio } from "./shared/hooks/useAudio";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { AnimatePresence } from "framer-motion";

interface Stat {
  name: string;
  value: number;
}

interface Pokemon {
  id: number;
  name: string;
  types: string[];
  stats: Stat[];
}

interface PokemonDetail {
  id: number;
  name: string;
  types: Array<{ type: { name: string } }>;
  stats: Array<{ stat: { name: string }; base_stat: number }>;
}

const handleGlow = (e: React.MouseEvent<HTMLElement>) => {
  const currentTarget = e.currentTarget;
  if (window.matchMedia("(hover: none)").matches) return;
  
  // Throttle pasivo: Evita calcular en la fase inicial de render/pintado masivo
  // Solo aplicamos el resplandor activo cuando el mouse *realmente* se mueve e interactúa
  const clientX = e.clientX;
  const clientY = e.clientY;
  
  requestAnimationFrame(() => {
    // Verificamos de nuevo que estemos acoplados y que el target siga existiendo
    if (!currentTarget || !currentTarget.isConnected) return;
    const rect = currentTarget.getBoundingClientRect();
    currentTarget.style.setProperty("--mouse-x", `${clientX - rect.left}px`);
    currentTarget.style.setProperty("--mouse-y", `${clientY - rect.top}px`);
  });
};

const typeColors: Record<string, string> = {
  fire: "#FF6B35",
  water: "#4FC3F7",
  electric: "#FFD600",
  psychic: "#FF6B9D",
  grass: "#7BD389",
  dragon: "#7B61FF",
};

const PokemonRow: React.FC<{
  pokemon: Pokemon;
  idx: number;
}> = React.memo(({ pokemon, idx }) => {
  const primaryType = pokemon.types[0]?.toLowerCase() ?? "neutral";
  const highlight = typeColors[primaryType] ?? "#0FF";

  return (
    <div data-idx={idx} className="group outline-none fade-in-up" style={{ animationDelay: `${Math.min(idx * 0.05, 0.6)}s` }}>
      <button
        onMouseEnter={(e) => {
          // Diferimos en cola macro task para no bloquear render
          setTimeout(() => handleGlow(e), 0);
        }}
        onMouseMove={handleGlow}
        aria-label={`Open ${pokemon.name}`}
        className="poke-card cursor-glow relative w-full text-left flex items-center gap-3 py-3 px-3 md:gap-4 md:py-4 md:px-4 rounded-lg transition-colors duration-300"
        style={{ cursor: "pointer" }}
      >
        <div className="shrink-0 w-14 h-14 md:w-20 md:h-20 rounded-lg overflow-hidden bg-surface flex items-center justify-center poke-card-img-container" style={{ contain: "paint" }}>
          <img
            src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`}
            alt={pokemon.name}
            className="w-full h-full object-contain poke-card-img"
            loading="lazy"
            style={{ filter: "drop-shadow(0 6px 14px rgba(0,0,0,0.6))" }}
          />
        </div>

        <div className="flex-1 flex items-center justify-between gap-2 min-w-0">
          <div className="flex flex-col min-w-0">
            <span className="font-mono text-[10px] text-white/40">
              NO. {String(pokemon.id).padStart(3, "0")}
            </span>
            <span className="font-display text-base md:text-2xl font-light tracking-tight mt-0.5 truncate">
              {pokemon.name}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="flex gap-1 md:gap-2">
              {pokemon.types.map((t) => (
                <span
                  key={t}
                  className="text-[9px] md:text-[11px] px-2 md:px-3 py-0.5 md:py-1 rounded-full font-mono uppercase"
                  style={{
                    background: "var(--modal-badge-bg)",
                    letterSpacing: "0.1em",
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* subtle colored highlight tied to primary type */}
        <span
          aria-hidden
          className="absolute inset-0 rounded-lg pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            boxShadow: `inset 0 0 40px ${highlight}10`,
            background: `linear-gradient(90deg, ${highlight}10 0%, transparent 40%)`,
          }}
        />
      </button>
    </div>
  );
});

const PokemonGridCard: React.FC<{
  pokemon: Pokemon;
  idx: number;
}> = React.memo(({ pokemon, idx }) => {
  const primaryType = pokemon.types[0]?.toLowerCase() ?? "neutral";
  const highlight = typeColors[primaryType] ?? "#0FF";

  return (
    <div className="fade-in-up" style={{ animationDelay: `${Math.min(idx * 0.03, 0.4)}s` }}>
      <button
        onMouseEnter={(e) => {
          setTimeout(() => handleGlow(e), 0);
        }}
        onMouseMove={handleGlow}
        data-pokemon-id={pokemon.id}
        className="poke-grid-card cursor-glow relative flex flex-col items-center p-3 md:p-6 rounded-xl bg-white/2 border border-white/4 hover:bg-white/4 hover:border-white/10 transition-colors group aspect-square justify-center gap-2 md:gap-4 overflow-hidden w-full h-full"
      >
        <div className="absolute top-3 left-3 font-mono text-[10px] text-white/30 group-hover:text-white/50 transition-colors">
          #{String(pokemon.id).padStart(3, "0")}
        </div>

        <div className="w-14 h-14 md:w-24 md:h-24 relative z-10 poke-card-img-container" style={{ contain: "paint" }}>
          <img
            src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`}
            alt={pokemon.name}
            className="w-full h-full object-contain filter drop-shadow-[0_8px_16px_var(--card-shadow)] poke-card-img"
            loading="lazy"
          />
        </div>

        <div className="text-center relative z-10">
          <span className="font-display text-sm md:text-lg font-light tracking-tight uppercase block leading-none mb-1 md:mb-2">
            {pokemon.name}
          </span>
          <div className="flex gap-1 justify-center">
            {pokemon.types.map((t) => (
              <span
                key={t}
                className="text-[9px] md:text-[11px] px-2 md:px-3 py-0.5 rounded-full font-mono uppercase"
                style={{
                  background: "var(--modal-badge-bg)",
                  letterSpacing: "0.1em",
                }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* subtle ambient light from bottom */}
        <div
          className="absolute bottom-0 left-0 right-0 h-1/2 rounded-b-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at bottom, ${highlight}20, transparent 70%)`,
          }}
        />
      </button>
    </div>
  );
});

function App() {
  "use no memo";
  const [focused, setFocused] = React.useState<number>(0);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [settingsOpen, setSettingsOpen] = React.useState(false);
  const [viewMode, setViewMode] = React.useState<"list" | "grid">("list");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [filterType, setFilterType] = React.useState("all");
  const clickSound = useAudio("/sounds/click.wav");

  const fetchPage = async ({ pageParam = 0 }) => {
    const res = await fetch(
      `https://pokeapi.co/api/v2/pokemon?offset=${pageParam}&limit=20`,
    );
    const json = await res.json();
    const validResults = json.results.filter((item: { url: string }) => {
      // PokeAPI tiene muchas formas "extrañas" por encima de id 10000 (megas, gmax, etc)
      // Evitamos romper la UI con sprites inexistentes
      const id = parseInt(item.url.split("/").filter(Boolean).pop() || "0", 10);
      return id < 10000;
    });

    const details = await Promise.all(
      validResults.map(async (item: { url: string }) => {
        const dRes = await fetch(item.url);
        return dRes.json() as Promise<PokemonDetail>;
      }),
    );
    return {
      nextOffset: pageParam + 20,
      results: details.map((d: PokemonDetail) => ({
        id: d.id,
        name: d.name,
        types: d.types.map((t) => t.type.name),
        stats: d.stats.map((s) => ({ name: s.stat.name, value: s.base_stat })),
      })),
    };
  };

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["pokemon"],
      queryFn: fetchPage,
      initialPageParam: 0,
      getNextPageParam: (lastPage) =>
        lastPage.results.length === 0 ? undefined : lastPage.nextOffset,
    });

  // === GLOBAL INDEX FOR SEARCH ===
  // Descargamos ~1000 registros ligeros (sólo name+url) una vez para potenciar la búsqueda real.
  const { data: globalIndex } = useQuery({
    queryKey: ["pokemon-index"],
    queryFn: async () => {
      const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=1025"); // Hasta gen 9
      const json = await res.json();
      return json.results as { name: string; url: string }[];
    },
    staleTime: Infinity,
  });

  // Buscamos resultados que matcheen la query globalmente, pero que AUN NO estén en pantalla
  const searchResultsFromAPI = React.useMemo(() => {
    if (!searchQuery.trim() || !globalIndex) return [];
    const lowerQuery = searchQuery.toLowerCase();

    // Identificamos IDs que ya tenemos cargados por el InfiniteQuery (para no duplicarlos)
    const loadedIds = new Set(
      data?.pages.flatMap((p) => p.results).map((p) => p.id),
    );

    return (
      globalIndex
        .filter((p) => p.name.includes(lowerQuery))
        .map((p) => {
          const id = parseInt(
            p.url.split("/").filter(Boolean).pop() || "0",
            10,
          );
          return { name: p.name, url: p.url, id };
        })
        .filter((p) => !loadedIds.has(p.id) && p.id < 10000)
        // Limitamos a los primeros 20 resultados de búsqueda externa para no atascar requests
        .slice(0, 20)
    );
  }, [searchQuery, globalIndex, data]);

  // Fetcheamos el detalle de los matches encontrados en el índice
  const { data: searchDetails = [] } = useQuery({
    queryKey: [
      "pokemon-search",
      searchResultsFromAPI.map((p) => p.id).join(","),
    ],
    queryFn: async () => {
      if (searchResultsFromAPI.length === 0) return [];
      const details = await Promise.all(
        searchResultsFromAPI.map(async (item) => {
          const dRes = await fetch(item.url);
          return dRes.json() as Promise<PokemonDetail>;
        }),
      );
      return details.map((d: PokemonDetail) => ({
        id: d.id,
        name: d.name,
        types: d.types.map((t) => t.type.name),
        stats: d.stats.map((s) => ({ name: s.stat.name, value: s.base_stat })),
      }));
    },
    enabled: searchResultsFromAPI.length > 0,
  });

  const fullList = React.useMemo(() => {
    const base = data?.pages.flatMap((page) => page.results) ?? [];
    return [...base, ...searchDetails].sort((a, b) => a.id - b.id);
  }, [data, searchDetails]);

  // Deferred: React puede mostrar la lista anterior mientras calcula la nueva
  // sin bloquear el hilo principal en un solo frame síncrono
  const deferredFullList = React.useDeferredValue(fullList);
  const deferredSearchQuery = React.useDeferredValue(searchQuery);
  const deferredFilterType = React.useDeferredValue(filterType);

  // filtering/search state for "Explore the Data"
  // (State hoisted to top of component)

  const availableTypes = React.useMemo(() => {
    const types = new Set<string>();
    fullList.forEach((p) => p.types.forEach((t: string) => types.add(t)));
    return Array.from(types).sort();
  }, [fullList]);

  const filteredList = React.useMemo(() => {
    // Si la búsqueda/filtro NO ha cambiado aún, pero estamos en medio
    // de una transición de vista, mostramos lo previo de inmediato.
    const arr = deferredFullList
      .filter((p) => p.name.toLowerCase().includes(deferredSearchQuery.toLowerCase()))
      .filter((p) =>
        deferredFilterType === "all" ? true : p.types.includes(deferredFilterType),
      );
      
    return arr;
  }, [deferredFullList, deferredSearchQuery, deferredFilterType]);

  const handleSetFilter = React.useCallback((type: string) => {
    React.startTransition(() => {
      setFilterType(type);
    });
  }, []);

  const handleSetViewMode = React.useCallback((mode: "list" | "grid") => {
    React.startTransition(() => {
      setViewMode(mode);
    });
  }, []);

  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
        (e.target as HTMLElement)?.isContentEditable
      )
        return;
      if (fullList.length > 0) {
        if (e.key === "ArrowDown" || e.key === "s") {
          setFocused((f) => Math.min(f + 1, fullList.length - 1));
          e.preventDefault();
        } else if (e.key === "ArrowUp" || e.key === "w") {
          setFocused((f) => Math.max(f - 1, 0));
          e.preventDefault();
        } else if (e.key === "Enter") {
          setModalOpen(true);
        }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [fullList]);

  useGamepad((dir) => {
    if (fullList.length === 0) return;
    if (dir === "down") setFocused((f) => Math.min(f + 1, fullList.length - 1));
    if (dir === "up") setFocused((f) => Math.max(f - 1, 0));
    if (dir === "a") setModalOpen(true);
  });

  // We only pause the infinite scroll when actively searching by name,
  // because name searches pull from the complete global index directly.
  // When filtering by type, we STILL allow fetching subsequent pages.
  const isFiltering = searchQuery.trim().length > 0;

  const { ref: loadMoreRef, inView: loadMoreInView } =
    useInView<HTMLDivElement>({ margin: "200px" });
  React.useEffect(() => {
    if (loadMoreInView && hasNextPage && !isFetchingNextPage && !isFiltering) {
      React.startTransition(() => {
        fetchNextPage();
      });
    }
  }, [
    loadMoreInView,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    isFiltering,
  ]);

  const handleRowClick = React.useCallback((e: React.MouseEvent) => {
    const li = (e.target as HTMLElement).closest<HTMLElement>('[data-idx]');
    if (!li) return;
    const idx = Number(li.dataset.idx);
    clickSound();
    setFocused(idx);
    setModalOpen(true);
  }, [clickSound]);

  const handleGridClick = React.useCallback((e: React.MouseEvent) => {
    const btn = (e.target as HTMLElement).closest<HTMLElement>('[data-pokemon-id]');
    if (!btn) return;
    const pokemonId = Number(btn.dataset.pokemonId);
    clickSound();
    setFocused(fullList.findIndex((p) => p.id === pokemonId));
    setModalOpen(true);
  }, [clickSound, fullList]);

  const appRef = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: appRef,
    offset: ["start start", "end end"],
  });
  const progressHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <div
      ref={appRef}
      className="relative min-h-screen text-white bg-bg-primary overflow-x-hidden selection:bg-white/20"
      style={{ position: "relative" }}
    >
      {/* Cinematic Progress Bar */}
      <motion.div
        style={{ height: progressHeight }}
        className="fixed top-0 left-0 w-0.5 bg-white/20 z-50 origin-top"
      />

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{
          scale: 0.9,
          transition: { type: "spring", stiffness: 400, damping: 17 },
        }}
        className="fixed top-8 right-8 bg-panel/50 backdrop-blur-md border border-white/10 text-white/60 hover:text-white hover:bg-surface-hover transition-colors z-50 rounded-full p-2"
        onClick={() => {
          clickSound();
          setSettingsOpen(true);
        }}
        aria-label="Settings"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="3"></circle>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
        </svg>
      </motion.button>

      <SettingsPanel
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
      <Cursor />

      <ErrorBoundary>
        <PageTransition>
          <Hero />

          <main id="data" className="relative max-w-5xl mx-auto px-6 py-32">
            <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
              {fullList[focused] && (
                <div className="space-y-8 p-4">
                  <div className="flex flex-col items-center gap-4">
                    <p
                      className="font-mono tracking-widest text-sm"
                      style={{ color: "var(--modal-text-dim)" }}
                    >
                      NO. {String(fullList[focused].id).padStart(3, "0")}
                    </p>
                    <h2 className="text-4xl md:text-6xl font-display font-light tracking-tight uppercase">
                      {fullList[focused].name}
                    </h2>
                    <div className="flex gap-2 mt-2">
                      {fullList[focused].types.map((t) => (
                        <span
                          key={t}
                          className="px-3 py-1 rounded-full text-[10px] uppercase font-mono tracking-wider"
                          style={{
                            border: "1px solid var(--modal-badge-border)",
                            background: "var(--modal-badge-bg)",
                          }}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="relative aspect-square w-full max-w-60 mx-auto overflow-hidden rounded-2xl bg-linear-to-tr from-white/5 to-transparent p-8 shadow-inner shadow-white/5">
                    <img
                      src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${fullList[focused].id}.png`}
                      alt={fullList[focused].name}
                      className="w-full h-full object-contain filter drop-shadow-[0_0_15px_var(--glow-shadow)]"
                      loading="lazy"
                    />
                  </div>

                  <div
                    className="grid grid-cols-2 gap-px p-px rounded-lg overflow-hidden"
                    style={{ background: "var(--modal-badge-border)" }}
                  >
                    {fullList[focused].stats.map((s) => (
                      <div
                        key={s.name}
                        className="flex justify-between items-center p-4"
                        style={{ background: "var(--modal-stat-bg)" }}
                      >
                        <span
                          className="font-mono text-xs uppercase tracking-wider"
                          style={{ color: "var(--modal-text-muted)" }}
                        >
                          {s.name.replace("-", " ")}
                        </span>
                        <span className="font-display text-xl">{s.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Modal>

            {/* ── SECTION HEADER + TABS ── */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mb-10 flex flex-col border-b border-white/10 pb-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <h2 className="font-display text-3xl font-light tracking-tight">
                    Pokémon Dataset
                  </h2>
                  <p className="font-mono text-sm text-white/40 tracking-wide mt-1">
                    Select an entry to view structured base statistics.
                  </p>
                </div>

                {/* View mode tabs */}
                <div
                  className="flex items-center gap-px p-1 rounded-full border border-white/10 bg-white/3 self-start sm:self-auto shrink-0"
                  style={{
                    borderColor: "var(--modal-badge-border)",
                    background: "var(--modal-badge-bg)",
                  }}
                >
                  {(["list", "grid"] as const).map((mode) => (
                    <motion.button
                      key={mode}
                      onClick={() => handleSetViewMode(mode)}
                      whileTap={{ scale: 0.94 }}
                      className="relative px-5 py-1.5 rounded-full font-mono text-xs uppercase tracking-widest transition-colors duration-200"
                      style={{
                        color:
                          viewMode === mode
                            ? "var(--tw-color-base)"
                            : "var(--text-muted)",
                      }}
                    >
                      {viewMode === mode && (
                        <motion.span
                          layoutId="tab-pill"
                          className="absolute inset-0 rounded-full"
                          style={{ background: "var(--tw-color-white)" }}
                          transition={{
                            type: "spring",
                            stiffness: 380,
                            damping: 32,
                          }}
                        />
                      )}
                      <span className="relative z-10">{mode}</span>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Search + type filters — only in grid mode */}
              <AnimatePresence>
                {viewMode === "grid" && (
                  <motion.div
                    key="grid-filters"
                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                    animate={{ opacity: 1, height: "auto", marginTop: 24 }}
                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="flex flex-col md:flex-row gap-6 items-end pt-2">
                      <div className="relative w-full md:max-w-md group">
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Search by species name..."
                          className="w-full bg-transparent border-0 border-b border-white/20 pb-2 px-0 text-lg font-display focus:border-white focus:ring-0 outline-none transition-colors peer placeholder:text-white/20 rounded-none blend-glow"
                          spellCheck={false}
                        />
                        <motion.div
                          className="absolute bottom-0 left-0 h-px bg-acid origin-left pointer-events-none"
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: searchQuery ? 1 : 0 }}
                          style={{ width: "100%" }}
                          layout
                        />
                        <label className="absolute -top-5 left-0 font-mono text-[10px] tracking-widest text-white/40 uppercase opacity-0 peer-focus:opacity-100 transition-opacity">
                          Query executing...
                        </label>
                      </div>

                      <div className="flex flex-wrap gap-2 flex-1 justify-end">
                        <button
                          onClick={() => handleSetFilter("all")}
                          className={`font-mono text-xs px-4 py-2 rounded-full border transition-all duration-200 active:scale-95 ${
                            filterType === "all"
                              ? "bg-white text-black border-white"
                              : "border-white/10 hover:border-white/30 text-white/60"
                          }`}
                        >
                          All Elements
                        </button>
                        {availableTypes.map((type) => (
                          <button
                            key={type}
                            onClick={() => handleSetFilter(type)}
                            className={`font-mono text-xs px-4 py-2 rounded-full border transition-all duration-200 active:scale-95 ${
                              filterType === type
                                ? "bg-white text-black border-white"
                                : "border-white/10 hover:border-white/30 text-white/60"
                            }`}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* ── LIST VIEW ── */}
            {viewMode === "list" ? (
              <div
                className="flex flex-col contain-content"
                onClick={handleRowClick}
              >
                {!data
                  ? Array.from({ length: 8 }).map((_, i) => (
                      <div key={i} className="h-24 bg-white/2 mb-2 skeleton rounded-lg" />
                    ))
                  : deferredFullList.map((p, idx) => (
                      <div key={p?.id ?? idx} className="content-visibility-auto pb-2">
                        <PokemonRow pokemon={p} idx={idx} />
                      </div>
                    ))}
              </div>
            ) : (
              /* ── GRID VIEW ── */
              <div
                className="contain-content"
              >
                <div
                  className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                  onClick={handleGridClick}
                >
                  {filteredList.length === 0 ? (
                    <div className="col-span-full py-20 text-center flex flex-col items-center justify-center border border-white/5 rounded-2xl bg-white/1">
                      <p className="font-display font-light text-2xl text-white/30 mb-2">
                        No matching records found.
                      </p>
                      <p className="font-mono text-xs tracking-widest text-white/20 uppercase">
                        Adjust query parameters
                      </p>
                    </div>
                  ) : (
                    filteredList.map((pokemon, idx) => (
                      <div key={pokemon.id} className="content-visibility-auto min-h-40">
                        <PokemonGridCard
                          pokemon={pokemon}
                          idx={idx}
                        />
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            <div
              ref={loadMoreRef}
              className="h-24 flex items-center justify-center mt-6 w-full"
            >
              <span className="font-mono text-xs tracking-widest text-white/30 uppercase">
                {isFetchingNextPage ? (
                  "Fetching subsequent records..."
                ) : hasNextPage ? (
                  <span className="link-underline">
                    Scroll to load additional data
                  </span>
                ) : (
                  "End of dataset."
                )}
              </span>
            </div>
          </main>
        </PageTransition>
      </ErrorBoundary>
    </div>
  );
}

export default App;
