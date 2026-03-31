import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

export async function POST(req: NextRequest) {
  try {
    const { marca, modelo, versao, ano, km, combustivel, cambio, opcionais } = await req.json();

    const optionaisText = opcionais?.length > 0
      ? `Opcionais: ${opcionais.join(", ")}.`
      : "";

    const message = await client.messages.create({
      model: "claude-opus-4-6",
      max_tokens: 400,
      messages: [
        {
          role: "user",
          content: `Você é um especialista em marketing automotivo. Escreva uma descrição de venda persuasiva e sofisticada em português para o seguinte veículo seminovo:

Marca: ${marca}
Modelo: ${modelo}
Versão: ${versao || "não informada"}
Ano: ${ano}
Quilometragem: ${km} km
Combustível: ${combustivel}
Câmbio: ${cambio}
${optionaisText}

Escreva em 3-4 parágrafos curtos. Não use clichês baratos. Tom profissional e elegante. Não use caixa alta nem itálico. Destaque os pontos fortes do veículo. Inclua um call-to-action sutil no final.`,
        },
      ],
    });

    const description = message.content[0].type === "text" ? message.content[0].text : "";
    return NextResponse.json({ description });
  } catch (error) {
    console.error("AI error:", error);
    return NextResponse.json({ error: "Falha ao gerar descrição" }, { status: 500 });
  }
}
