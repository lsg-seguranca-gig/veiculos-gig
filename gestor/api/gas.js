// Proxy Vercel -> Google Apps Script
// Defina GAS_URL nas variáveis de ambiente da Vercel (opcional: há um valor padrão abaixo).
const DEFAULT_GAS_URL = 'https://script.google.com/macros/s/AKfycbz9mkraqbunOd0wao6vVv3ICoS-yIXioAzi6cfT2gLIlTZm5V4ad7uleO4EekcUnDhRSA/exec';
const TIMEOUT_MS = 25000;
const GET_PARAMS = ['acao', 'dataInicio', 'dataFim'];
const ACOES_GET = ['operacao', 'obterTodos', 'obterOpcoes', 'relatorio'];
const ACOES_POST = ['registrarSaida', 'registrarRetorno'];

async function chamarGas(url, options) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const resp = await fetch(url, { ...options, signal: ctrl.signal });
    const texto = await resp.text();
    try {
      return JSON.parse(texto);
    } catch {
      throw new Error('O Google Apps Script não retornou JSON válido.');
    }
  } finally {
    clearTimeout(timer);
  }
}

export default async function handler(req, res) {
  const gasUrl = process.env.GAS_URL || DEFAULT_GAS_URL;
  res.setHeader('Cache-Control', 'no-store');

  try {
    if (req.method === 'GET') {
      const params = new URLSearchParams();
      for (const k of GET_PARAMS) {
        if (req.query[k]) params.set(k, String(req.query[k]));
      }
      if (!params.has('acao')) params.set('acao', 'operacao');
      if (!ACOES_GET.includes(params.get('acao'))) {
        return res.status(400).json({ status: 'erro', mensagem: 'Ação inválida.' });
      }
      const url = `${gasUrl}?${params.toString()}`;

      let data;
      try {
        data = await chamarGas(url, { method: 'GET' });
      } catch {
        data = await chamarGas(url, { method: 'GET' }); // 1 nova tentativa (falha momentânea do GAS)
      }
      return res.status(200).json(data);
    }

    if (req.method === 'POST') {
      let corpo = req.body;
      if (typeof corpo === 'string') corpo = JSON.parse(corpo);
      if (!corpo || !ACOES_POST.includes(corpo.acao)) {
        return res.status(400).json({ status: 'erro', mensagem: 'Ação inválida.' });
      }
      // Sem nova tentativa em POST: evita gravar duas vezes
      const data = await chamarGas(gasUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(corpo)
      });
      return res.status(200).json(data);
    }

    return res.status(405).json({ status: 'erro', mensagem: 'Método não permitido.' });
  } catch (error) {
    const msg = error.name === 'AbortError' ? 'Tempo esgotado ao consultar o Google Apps Script.' : error.message;
    return res.status(502).json({ status: 'erro', mensagem: msg });
  }
}
