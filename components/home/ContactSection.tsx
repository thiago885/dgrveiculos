"use client";

import { MapPin, Phone, Clock, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ContactSection() {
  return (
    <section id="contato" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-sm font-semibold text-red-600 tracking-wider mb-2">
            Fale conosco
          </p>
          <h2 className="text-3xl lg:text-4xl font-black text-zinc-900">
            Estamos prontos para te atender
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            {
              icon: MapPin,
              title: "Localização",
              lines: ["Rua do Ósmio, 1459", "Santa Bárbara d'Oeste - SP"],
            },
            {
              icon: Phone,
              title: "Telefone & WhatsApp",
              lines: ["(19) 99825-6619", "Atendimento via WhatsApp"],
            },
            {
              icon: Clock,
              title: "Horário de Atendimento",
              lines: ["Seg – Sex: 8h às 18h", "Sábado: 8h às 13h"],
            },
          ].map(({ icon: Icon, title, lines }) => (
            <div
              key={title}
              className="bg-slate-50 rounded-2xl p-6 text-center border border-zinc-100"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mb-4">
                <Icon className="h-5 w-5 text-red-600" />
              </div>
              <h3 className="font-semibold text-zinc-900 mb-2">{title}</h3>
              {lines.map((l) => (
                <p key={l} className="text-sm text-zinc-500">{l}</p>
              ))}
            </div>
          ))}
        </div>

        <div className="text-center">
          <Button
            asChild
            size="lg"
            className="bg-[#25D366] hover:bg-[#22c55e] text-white font-semibold gap-2"
          >
            <a
              href="https://wa.me/5519998256619?text=Olá! Vim pelo site da DGR Veículos."
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle className="h-5 w-5" />
              Conversar pelo WhatsApp
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
