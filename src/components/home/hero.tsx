"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  return (
    <section className="relative min-h-[100svh] w-full overflow-hidden bg-ink text-ivory">
      <motion.div
        initial={{ scale: 1.08 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.4, ease }}
        className="absolute inset-0"
      >
        <Image
          src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=2000&q=80"
          alt="Close-up of layered gold imitation jewellery on dark fabric"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/55 to-ink/25"
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-ink/30"
          aria-hidden
        />
      </motion.div>

      <div className="relative z-10 flex min-h-[100svh] flex-col justify-end px-6 pb-16 pt-28 md:justify-center md:px-12 md:pb-24 md:pt-20">
        <div className="mx-auto w-full max-w-6xl">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease }}
            className="font-heading text-5xl tracking-[0.08em] text-ivory sm:text-6xl md:text-7xl lg:text-8xl"
          >
            AURELIA
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.32, ease }}
            className="mt-5 max-w-lg font-heading text-2xl leading-tight text-ivory/95 md:mt-7 md:text-3xl"
          >
            Jewellery that gleams without the gold price.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45, ease }}
            className="mt-4 max-w-md text-sm leading-relaxed text-ivory/75 md:text-base"
          >
            Plated finishes and stone-set pieces designed for everyday radiance
            and occasion sparkle.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.58, ease }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <Button
              asChild
              size="lg"
              className="rounded-none bg-gold px-7 text-ink hover:bg-gold-soft"
            >
              <Link href="#featured">Shop featured</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-none border-ivory/40 bg-transparent px-7 text-ivory hover:bg-ivory/10 hover:text-ivory"
            >
              <Link href="/shop">Browse shop</Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
