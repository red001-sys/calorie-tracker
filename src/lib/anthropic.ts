export async function callAnthropic(
  systemPrompt: string,
  messages: { role: string; content: string }[]
) {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": import.meta.env.VITE_ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system: systemPrompt,
      messages,
    }),
  });
  const data = await response.json();
  return data.content[0].text;
}

export async function detectProfessional(question: string): Promise<string> {
  const result = await callAnthropic(
    `Você é um roteador de perguntas de saúde. Analise a pergunta e responda APENAS com um destes nomes exatos, nada mais:
    nutricionista, farmaceutico, cardio, ortopedista, sono, personal, coach, fisio, preparador, metabolismo, psicologo, terapeuta, dentista, medico, habitos`,
    [{ role: "user", content: question }]
  );
  return result.trim();
}

export async function logFoodByText(description: string): Promise<any> {
  const result = await callAnthropic(
    `Você é um especialista em nutrição. O usuário vai descrever um alimento ou refeição.
    Responda APENAS com um JSON válido sem markdown, no formato:
    {"name":"nome do alimento","emoji":"emoji relevante","calories":number,"protein":number,"fat":number,"carbs":number,"sugar":number,"sodium":number}`,
    [{ role: "user", content: description }]
  );
  return JSON.parse(result);
}
