import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center px-4">
        <h1 className="text-8xl font-black text-zinc-900 mb-2">404</h1>
        <p className="text-xl font-semibold text-zinc-700 mb-2">Página não encontrada</p>
        <p className="text-zinc-500 mb-8">
          O veículo ou página que você procura não existe ou foi removido.
        </p>
        <Button asChild className="bg-red-600 hover:bg-red-700 text-white">
          <Link href="/">Voltar para o início</Link>
        </Button>
      </div>
    </div>
  );
}
