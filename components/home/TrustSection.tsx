"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";
import Image from "next/image";
import { CheckCircle2 } from "lucide-react";
import type { TrustSection as TrustData } from "@/types/banners";

const FALLBACK: TrustData = {
  id: "",
  imagem: "https://images.unsplash.com/photo-1562016600-ece13e8ba570?w=800&q=80",
  titulo: "Transparência e qualidade em cada negócio",
  descricao:
    "Na DGR Veículos, cada seminovo passa por uma rigorosa inspeção técnica antes de entrar no nosso estoque. Você compra com a segurança de quem conhece o histórico completo do veículo.",
  anos_experiencia: 12,
  itens: [
    "Revisão técnica completa",
    "Documentação regularizada",
    "Histórico Veicular verificado",
    "Garantia pós-venda",
    "Financiamento em até 60x",
    "Aceita seu veículo na troca",
  ],
  updated_at: "",
};

interface TrustSectionProps {
  data?: TrustData | null;
}

export default function TrustSection({ data: dataProp }: TrustSectionProps) {
  const data = dataProp ?? FALLBACK;
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} id="sobre" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-zinc-100">
              <Image
                src={data.imagem}
                alt="DGR Veículos"
                fill
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-red-600 text-white rounded-2xl px-6 py-4 shadow-xl">
              <div className="text-3xl font-black">{data.anos_experiencia}+</div>
              <div className="text-sm font-medium opacity-90">Anos de experiência</div>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <p className="text-sm font-semibold text-red-600 tracking-wider mb-3">
              Por que escolher a DGR
            </p>
            <h2 className="text-3xl lg:text-4xl font-black text-zinc-900 mb-6 leading-tight">
              {data.titulo}
            </h2>
            <p className="text-zinc-500 leading-relaxed mb-8">{data.descricao}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {data.itens.map((item, i) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, x: 20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.2 + i * 0.07 }}
                  className="flex items-center gap-2.5"
                >
                  <CheckCircle2 className="h-5 w-5 text-red-600 shrink-0" />
                  <span className="text-sm font-medium text-zinc-700">{item}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
