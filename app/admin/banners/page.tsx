"use client";

import { useEffect, useState, useRef } from "react";
import { toast } from "sonner";
import { ImageIcon, Plus, Trash2, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createClient } from "@/lib/supabase/client";
import type { HeroBanner, TrustSection } from "@/types/banners";
import Image from "next/image";

// ─── Image Upload Helper ──────────────────────────────────────────────────────

function BannerImagePicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (url: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    if (!file.type.startsWith("image/")) return;
    setUploading(true);
    const supabase = createClient();
    const ext = file.name.split(".").pop();
    const name = `banners/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { data, error } = await supabase.storage
      .from("vehicles")
      .upload(name, file, { cacheControl: "3600", upsert: false });
    if (error) {
      toast.error(`Erro ao enviar imagem: ${error.message}`);
    } else {
      const { data: url } = supabase.storage.from("vehicles").getPublicUrl(data.path);
      onChange(url.publicUrl);
    }
    setUploading(false);
  }

  return (
    <div className="space-y-2">
      <div
        className="relative border-2 border-dashed border-zinc-200 rounded-xl overflow-hidden cursor-pointer hover:border-zinc-400 transition-colors"
        style={{ aspectRatio: "16/7" }}
        onClick={() => inputRef.current?.click()}
      >
        {value ? (
          <Image src={value} alt="Banner" fill className="object-cover" sizes="600px" />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-zinc-400">
            <ImageIcon className="h-8 w-8" />
            <span className="text-sm">Clique para selecionar imagem</span>
          </div>
        )}
        {uploading && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <Loader2 className="h-8 w-8 text-white animate-spin" />
          </div>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />
      <p className="text-xs text-zinc-400">Ou cole uma URL diretamente:</p>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="https://..."
        className="text-xs"
      />
    </div>
  );
}

// ─── Hero Banners ─────────────────────────────────────────────────────────────

function HeroBannersTab() {
  const supabase = createClient();
  const [banners, setBanners] = useState<HeroBanner[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [imagem, setImagem] = useState("");
  const [titulo, setTitulo] = useState("");
  const [subtitulo, setSubtitulo] = useState("");

  async function fetchBanners() {
    setLoading(true);
    const { data } = await supabase
      .from("banners")
      .select("*")
      .order("ordem", { ascending: true });
    setBanners(data ?? []);
    setLoading(false);
  }

  useEffect(() => { fetchBanners(); }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!imagem) { toast.error("Selecione uma imagem."); return; }
    setSaving(true);
    const { error } = await supabase.from("banners").insert({
      imagem,
      titulo,
      subtitulo: subtitulo || null,
      ordem: banners.length,
    });
    if (error) {
      toast.error(`Erro: ${error.message}`);
    } else {
      toast.success("Banner adicionado!");
      setShowForm(false);
      setImagem(""); setTitulo(""); setSubtitulo("");
      fetchBanners();
    }
    setSaving(false);
  }

  async function handleToggle(banner: HeroBanner) {
    const { error } = await supabase
      .from("banners")
      .update({ ativo: !banner.ativo })
      .eq("id", banner.id);
    if (error) { toast.error(error.message); return; }
    setBanners((prev) => prev.map((b) => b.id === banner.id ? { ...b, ativo: !b.ativo } : b));
  }

  async function handleDelete(id: string) {
    if (!confirm("Excluir este banner?")) return;
    const { error } = await supabase.from("banners").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Banner excluído.");
    setBanners((prev) => prev.filter((b) => b.id !== id));
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-zinc-500">{banners.length} banner(s) cadastrado(s)</p>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="bg-red-600 hover:bg-red-700 text-white gap-2"
          size="sm"
        >
          <Plus className="h-4 w-4" />
          Novo banner
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="bg-white border border-zinc-100 rounded-2xl shadow-sm p-6 space-y-4">
          <h3 className="text-sm font-semibold text-zinc-900">Novo slide do Hero</h3>
          <div className="space-y-1.5">
            <Label>Imagem *</Label>
            <BannerImagePicker value={imagem} onChange={setImagem} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Título *</Label>
              <Input value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Seminovos de Alto Padrão" required />
            </div>
            <div className="space-y-1.5">
              <Label>Subtítulo</Label>
              <Input value={subtitulo} onChange={(e) => setSubtitulo(e.target.value)} placeholder="Descrição do slide" />
            </div>
          </div>
          <div className="flex gap-3 justify-end">
            <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancelar</Button>
            <Button type="submit" className="bg-red-600 hover:bg-red-700 text-white" disabled={saving}>
              {saving ? "Salvando..." : "Adicionar"}
            </Button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="text-center py-12 text-sm text-zinc-400">Carregando...</div>
      ) : banners.length === 0 ? (
        <div className="text-center py-12 text-sm text-zinc-400">Nenhum banner cadastrado. Os slides padrão serão exibidos.</div>
      ) : (
        <div className="space-y-3">
          {banners.map((banner) => (
            <div key={banner.id} className="bg-white border border-zinc-100 rounded-2xl shadow-sm overflow-hidden flex gap-4 p-4 items-center">
              <div className="relative w-32 h-20 rounded-xl overflow-hidden bg-zinc-100 shrink-0">
                <Image src={banner.imagem} alt={banner.titulo} fill className="object-cover" sizes="128px" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-zinc-900 truncate">{banner.titulo}</p>
                {banner.subtitulo && (
                  <p className="text-sm text-zinc-500 truncate">{banner.subtitulo}</p>
                )}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleToggle(banner)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                    banner.ativo
                      ? "bg-green-100 text-green-700 hover:bg-green-200"
                      : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200"
                  }`}
                >
                  {banner.ativo ? "Ativo" : "Inativo"}
                </button>
                <button
                  onClick={() => handleDelete(banner.id)}
                  className="text-zinc-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Trust Section ────────────────────────────────────────────────────────────

function TrustSectionTab() {
  const supabase = createClient();
  const [id, setId] = useState("");
  const [imagem, setImagem] = useState("");
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [anos, setAnos] = useState("12");
  const [itens, setItens] = useState<string[]>([]);
  const [novoItem, setNovoItem] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("trust_section").select("*").limit(1).single();
      if (data) {
        setId(data.id);
        setImagem(data.imagem);
        setTitulo(data.titulo);
        setDescricao(data.descricao);
        setAnos(String(data.anos_experiencia));
        setItens(data.itens ?? []);
      }
      setLoading(false);
    })();
  }, []);

  async function handleSave() {
    setSaving(true);
    const payload = {
      imagem,
      titulo,
      descricao,
      anos_experiencia: Number(anos),
      itens,
      updated_at: new Date().toISOString(),
    };
    const { error } = id
      ? await supabase.from("trust_section").update(payload).eq("id", id)
      : await supabase.from("trust_section").insert(payload);

    if (error) {
      toast.error(`Erro: ${error.message}`);
    } else {
      toast.success("Seção atualizada!");
    }
    setSaving(false);
  }

  function addItem() {
    const trimmed = novoItem.trim();
    if (!trimmed || itens.includes(trimmed)) return;
    setItens((prev) => [...prev, trimmed]);
    setNovoItem("");
  }

  function removeItem(item: string) {
    setItens((prev) => prev.filter((i) => i !== item));
  }

  if (loading) return <div className="text-center py-12 text-sm text-zinc-400">Carregando...</div>;

  return (
    <div className="space-y-6">
      <div className="bg-white border border-zinc-100 rounded-2xl shadow-sm p-6 space-y-5">
        <h3 className="text-sm font-semibold text-zinc-900">Imagem da seção</h3>
        <BannerImagePicker value={imagem} onChange={setImagem} />
      </div>

      <div className="bg-white border border-zinc-100 rounded-2xl shadow-sm p-6 space-y-4">
        <h3 className="text-sm font-semibold text-zinc-900">Textos</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Título</Label>
            <Input value={titulo} onChange={(e) => setTitulo(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Anos de experiência</Label>
            <Input type="number" value={anos} onChange={(e) => setAnos(e.target.value)} />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label>Descrição</Label>
          <Textarea value={descricao} onChange={(e) => setDescricao(e.target.value)} rows={3} />
        </div>
      </div>

      <div className="bg-white border border-zinc-100 rounded-2xl shadow-sm p-6 space-y-4">
        <h3 className="text-sm font-semibold text-zinc-900">Itens de confiança</h3>
        <div className="flex gap-2">
          <Input
            value={novoItem}
            onChange={(e) => setNovoItem(e.target.value)}
            placeholder="Ex: Revisão técnica completa"
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addItem())}
          />
          <Button type="button" variant="outline" onClick={addItem} className="shrink-0">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="space-y-2">
          {itens.map((item) => (
            <div key={item} className="flex items-center justify-between bg-slate-50 rounded-xl px-4 py-2.5">
              <span className="text-sm text-zinc-700">{item}</span>
              <button onClick={() => removeItem(item)} className="text-zinc-400 hover:text-red-600 transition-colors">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
          {itens.length === 0 && (
            <p className="text-xs text-zinc-400 text-center py-2">Nenhum item adicionado.</p>
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave} className="bg-red-600 hover:bg-red-700 text-white gap-2" disabled={saving}>
          <Save className="h-4 w-4" />
          {saving ? "Salvando..." : "Salvar alterações"}
        </Button>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function BannersPage() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
          <ImageIcon className="h-5 w-5 text-red-600" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-zinc-900">Banners</h1>
          <p className="text-sm text-zinc-500">Gerencie os banners do site</p>
        </div>
      </div>

      <Tabs defaultValue="hero">
        <TabsList className="mb-6">
          <TabsTrigger value="hero">Hero (Carousel)</TabsTrigger>
          <TabsTrigger value="trust">Por que escolher a DGR</TabsTrigger>
        </TabsList>
        <TabsContent value="hero">
          <HeroBannersTab />
        </TabsContent>
        <TabsContent value="trust">
          <TrustSectionTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
