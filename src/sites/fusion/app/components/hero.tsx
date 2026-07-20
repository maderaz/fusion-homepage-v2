import { useState, useEffect } from "react";
import { AnimatedGroup } from "@/sites/fusion/app/components/ui/animated-group";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/sites/fusion/app/components/ui/utils";
import { fetchTvm, type TvmData } from "@/sites/fusion/app/lib/fetch-tvm";

interface LogoEntry {
  src: string;
  alt: string;
  h: string;
}

const transitionVariants = {
  item: {
    hidden: { opacity: 0, filter: "blur(12px)", y: 12 },
    visible: {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      transition: { type: "spring" as const, bounce: 0.3, duration: 1.5 },
    },
  },
};

/* ── Hero ── */
interface HeroProps {
  initialTvmFormatted?: string;
  initialVaultCount?: number;
  logos: LogoEntry[];
}

export function Hero({
  initialTvmFormatted,
  initialVaultCount,
  logos,
}: HeroProps) {
  const [tvmData, setTvmData] = useState<TvmData | null>(
    initialTvmFormatted && initialVaultCount
      ? { tvmFormatted: initialTvmFormatted, vaultCount: initialVaultCount }
      : null,
  );

  useEffect(() => {
    fetchTvm()
      .then(setTvmData)
      .catch(() => {});
  }, []);
  return (
    <>
      <main className="overflow-hidden">
        <section id="hero">
          <div className="relative pt-16 pb-8 md:pt-24 md:pb-12">
            <div className="relative z-10 mx-auto max-w-[1200px] px-6">
              <div className="sm:mx-auto lg:mr-auto">
                <AnimatedGroup
                  variants={{
                    container: {
                      visible: {
                        transition: {
                          staggerChildren: 0.05,
                          delayChildren: 0.75,
                        },
                      },
                    },
                    ...transitionVariants,
                  }}
                >
                  {/* Headline */}
                  <h1
                    className="mt-8 md:mt-18 max-w-3xl text-center md:text-left font-medium text-foreground"
                    style={{
                      fontSize: "clamp(30px, 5vw, 60px)",
                      lineHeight: "clamp(45px, 6vw, 75px)",
                    }}
                  >
                    Vault infrastructure for{" "}
                    <span className="text-primary">institutional-grade</span>{" "}
                    yield.
                  </h1>

                  {/* Description */}
                  <p className="mt-6 max-w-2xl text-pretty text-base text-center sm:mt-8 sm:text-lg md:text-left text-muted-foreground">
                    Access, deploy and manage onchain vaults. Accessed by
                    Fortune 500 companies, ETP issuers and leading curators.
                  </p>

                  {/* CTAs + Stats Row */}
                  <div className="mt-12 flex flex-col items-center gap-6 md:items-start lg:flex-row lg:items-center lg:gap-8">
                    {/* CTA Buttons */}
                    <div className="flex items-center gap-4">
                      <a
                        href="https://app.ipor.io/fusion"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-3 rounded-full border px-7 py-3 text-sm font-semibold tracking-wide text-white border-primary brand-gradient transition-opacity duration-300 hover:opacity-70"
                        style={{
                          letterSpacing: "0.04em",
                        }}
                      >
                        <span className="text-nowrap">Launch App</span>
                        <ArrowUpRight className="size-4" />
                      </a>
                      <a
                        href="/contact"
                        className="inline-flex items-center gap-2 rounded-full border px-7 py-3 text-sm tracking-wide transition-colors duration-300 border-[#9BA3AF] text-black hover:bg-[#EFEFEF] dark:border-[#45484D] dark:text-muted-foreground dark:hover:bg-[#22272C] dark:hover:text-foreground"
                        style={{ letterSpacing: "0.04em" }}
                      >
                        <span className="text-nowrap">Contact Us</span>
                      </a>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-center gap-6 md:justify-start">
                      <div className="hidden h-10 w-px lg:block bg-black/10 dark:bg-white/10" />
                      <div className="flex flex-col items-center gap-0.5 md:items-start">
                        <div className="text-[10px] text-muted-foreground">
                          TVM
                        </div>
                        <div className="text-xl font-semibold font-data tracking-tight text-foreground">
                          {tvmData?.tvmFormatted ?? "—"}
                        </div>
                      </div>
                      <div className="h-8 w-px bg-black/10 dark:bg-white/10" />
                      <div className="flex flex-col items-center gap-0.5 md:items-start">
                        <div className="text-[10px] text-muted-foreground">
                          Vaults
                        </div>
                        <div className="text-xl font-semibold font-data tracking-tight text-foreground">
                          {tvmData?.vaultCount ?? "—"}
                        </div>
                      </div>
                      <div className="h-8 w-px bg-black/10 dark:bg-white/10" />
                      <div className="flex flex-col items-center gap-0.5 md:items-start">
                        <div className="text-[10px] text-muted-foreground">
                          Volume processed
                        </div>
                        <div className="text-xl font-semibold font-data tracking-tight text-foreground">
                          $10B+
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Trusted by logos */}
                  <div className="mt-10 flex flex-col items-center gap-4 md:items-start">
                    <span className="text-xs text-muted-foreground">
                      Trusted by
                    </span>

                    {/* Desktop: normal row */}
                    <div className="hidden sm:flex flex-wrap items-center justify-center gap-x-7 gap-y-3 md:justify-start">
                      {logos.map((logo) => (
                        <img
                          key={logo.alt}
                          src={logo.src}
                          alt={logo.alt}
                          loading="lazy"
                          className={cn(
                            logo.h,
                            "brightness-0 opacity-50 dark:invert dark:opacity-60",
                          )}
                        />
                      ))}
                    </div>

                    {/* Mobile: infinite scrolling marquee */}
                    <div
                      className="sm:hidden relative w-screen -ml-6 overflow-hidden"
                      style={{
                        maskImage:
                          "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
                        WebkitMaskImage:
                          "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
                      }}
                    >
                      <div className="flex w-max animate-[marquee_20s_linear_infinite] items-center gap-10">
                        {[...logos, ...logos].map((logo, i) => (
                          <img
                            key={i}
                            src={logo.src}
                            alt={i < logos.length ? logo.alt : ""}
                            loading="lazy"
                            className={cn(
                              "h-5 shrink-0",
                              logo.alt === "Reservoir" && "h-3",
                              "brightness-0 opacity-50 dark:invert dark:opacity-60",
                            )}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </AnimatedGroup>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
