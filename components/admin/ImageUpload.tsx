"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { Upload, X, GripVertical } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  fotos: string[];
  onChange: (fotos: string[]) => void;
}

export default function ImageUpload({ fotos, onChange }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);

  async function uploadFiles(files: File[]) {
    const supabase = createClient();
    setUploading(true);
    const uploaded: string[] = [];

    for (const file of files) {
      if (!file.type.startsWith("image/")) continue;
      const ext = file.name.split(".").pop();
      const name = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { data, error } = await supabase.storage
        .from("vehicles")
        .upload(name, file, { cacheControl: "3600", upsert: false });

      if (error) {
        toast.error(`Erro ao enviar ${file.name}: ${error.message}`);
        console.error("Storage error:", error);
        continue;
      }

      const { data: url } = supabase.storage.from("vehicles").getPublicUrl(data.path);
      uploaded.push(url.publicUrl);
    }

    if (uploaded.length > 0) {
      onChange([...fotos, ...uploaded]);
      toast.success(`${uploaded.length} foto(s) enviada(s).`);
    }
    setUploading(false);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (files.length) uploadFiles(files);
    e.target.value = "";
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length) uploadFiles(files);
  }

  function removePhoto(url: string) {
    onChange(fotos.filter((f) => f !== url));
  }

  function setMain(url: string) {
    onChange([url, ...fotos.filter((f) => f !== url)]);
    toast.success("Foto principal definida.");
  }

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <label
        className={cn(
          "flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-xl p-10 cursor-pointer transition-colors",
          dragging
            ? "border-red-500 bg-red-50"
            : "border-zinc-200 hover:border-zinc-400 bg-slate-50/50"
        )}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
      >
        <Upload className={cn("h-8 w-8", dragging ? "text-red-500" : "text-zinc-400")} />
        <div className="text-center">
          <p className="text-sm font-medium text-zinc-700">
            {uploading ? "Enviando..." : "Arraste fotos ou clique para selecionar"}
          </p>
          <p className="text-xs text-zinc-400 mt-1">JPG, PNG, WEBP • Múltiplos arquivos</p>
        </div>
        <input
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleFileChange}
          disabled={uploading}
        />
      </label>

      {/* Grid */}
      {fotos.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {fotos.map((url, i) => (
            <div key={url} className="relative group aspect-[4/3] rounded-xl overflow-hidden bg-zinc-100">
              <Image src={url} alt={`Foto ${i + 1}`} fill className="object-cover" sizes="200px" />
              {i === 0 && (
                <div className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
                  Principal
                </div>
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                {i !== 0 && (
                  <button
                    type="button"
                    onClick={() => setMain(url)}
                    className="text-white text-[10px] font-semibold bg-black/50 px-2 py-1 rounded-full hover:bg-black/70"
                  >
                    Definir principal
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => removePhoto(url)}
                  className="w-7 h-7 bg-red-600 rounded-full flex items-center justify-center text-white hover:bg-red-700"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
