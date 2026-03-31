-- DGR Veículos — Supabase Schema
-- Execute este SQL no SQL Editor do seu projeto Supabase

-- Tabela de veículos
CREATE TABLE IF NOT EXISTS vehicles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  marca TEXT NOT NULL,
  modelo TEXT NOT NULL,
  versao TEXT,
  ano INTEGER NOT NULL,
  ano_modelo INTEGER NOT NULL,
  preco NUMERIC(12, 2) NOT NULL,
  km INTEGER NOT NULL DEFAULT 0,
  combustivel TEXT NOT NULL,
  cambio TEXT NOT NULL,
  cor TEXT NOT NULL DEFAULT '',
  portas INTEGER NOT NULL DEFAULT 4,
  status TEXT NOT NULL DEFAULT 'disponivel' CHECK (status IN ('disponivel', 'reservado', 'vendido')),
  destaque BOOLEAN NOT NULL DEFAULT false,
  descricao TEXT,
  opcionais TEXT[] DEFAULT '{}',
  fotos TEXT[] DEFAULT '{}',
  foto_principal TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Index para consultas comuns
CREATE INDEX IF NOT EXISTS vehicles_status_idx ON vehicles(status);
CREATE INDEX IF NOT EXISTS vehicles_destaque_idx ON vehicles(destaque);
CREATE INDEX IF NOT EXISTS vehicles_marca_idx ON vehicles(marca);
CREATE INDEX IF NOT EXISTS vehicles_preco_idx ON vehicles(preco);

-- Row Level Security
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;

-- Leitura pública (site público)
CREATE POLICY "Leitura pública de veículos"
  ON vehicles FOR SELECT
  USING (true);

-- Escrita apenas para usuários autenticados (admin)
CREATE POLICY "Admin pode inserir veículos"
  ON vehicles FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Admin pode atualizar veículos"
  ON vehicles FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admin pode excluir veículos"
  ON vehicles FOR DELETE
  TO authenticated
  USING (true);

-- Storage bucket para fotos dos veículos
INSERT INTO storage.buckets (id, name, public)
VALUES ('vehicles', 'vehicles', true)
ON CONFLICT (id) DO NOTHING;

-- Política de storage: leitura pública
CREATE POLICY "Fotos públicas de veículos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'vehicles');

-- Política de storage: upload apenas para autenticados
CREATE POLICY "Admin pode fazer upload de fotos"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'vehicles');

CREATE POLICY "Admin pode excluir fotos"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'vehicles');
