export default async function handler(req, res) {
  // Substitua pela URL do seu Web App publicado no Google Apps Script
  const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz9mkraqbunOd0wao6vVv3ICoS-yIXioAzi6cfT2gLIlTZm5V4ad7uleO4EekcUnDhRSA/exec';

  try {
    if (req.method === 'GET') {
      // Repassa os parâmetros da URL (ex: ?acao=obterOpcoes)
      const queryString = new URLSearchParams(req.query).toString();
      const targetUrl = queryString ? `${GOOGLE_SCRIPT_URL}?${queryString}` : GOOGLE_SCRIPT_URL;

      const response = await fetch(targetUrl, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json();
      return res.status(200).json(data);
    } 
    
    else if (req.method === 'POST') {
      // Repassa o corpo da requisição POST para o Apps Script
      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: typeof req.body === 'string' ? req.body : JSON.stringify(req.body),
      });

      const data = await response.json();
      return res.status(200).json(data);
    } 

    else {
      return res.status(405).json({ status: 'erro', mensagem: 'Método não permitido.' });
    }
  } catch (error) {
    return res.status(500).json({ status: 'erro', mensagem: 'Erro no servidor proxy Vercel: ' + error.message });
  }
}
