export default async function handler(req, res) {
  // URL do Web App publicado no Google Apps Script
  const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz9mkraqbunOd0wao6vVv3ICoS-yIXioAzi6cfT2gLIlTZm5V4ad7uleO4EekcUnDhRSA/exec';

  try {
    if (req.method === 'GET') {
      // Repassa os parâmetros mantendo suporte a chamadas diretas da Vercel
      const queryString = new URLSearchParams(req.query).toString();
      const targetUrl = queryString ? `${GOOGLE_SCRIPT_URL}?${queryString}` : GOOGLE_SCRIPT_URL;

      const response = await fetch(targetUrl, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        redirect: 'follow'
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
        redirect: 'follow'
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
