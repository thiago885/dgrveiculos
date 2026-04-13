export interface HeroBanner {
  id: string;
  imagem: string;
  titulo: string;
  subtitulo: string | null;
  ativo: boolean;
  ordem: number;
  created_at: string;
}

export interface TrustSection {
  id: string;
  imagem: string;
  titulo: string;
  descricao: string;
  anos_experiencia: number;
  itens: string[];
  updated_at: string;
}
