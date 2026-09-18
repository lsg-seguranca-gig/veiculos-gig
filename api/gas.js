export default async function handler(req, res) {
  // Configuração dos cabeçalhos CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // URL do Web App do Google Apps Script
  const GAS_URL = "https://script.google.com/macros/s/AKfycbz9mkraqbunOd0wao6vVv3ICoS-yIXioAzi6cfT2gLIlTZm5V4ad7uleO4EekcUnDhRSA/exec";

  try {
    if (req.method === 'GET') {
      const queryString = new URLSearchParams(req.query).toString();
      const targetUrl = queryString ? `${GAS_URL}?${queryString}` : GAS_URL;

      const response = await fetch(targetUrl, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        redirect: 'follow'
      });

      const data = await response.text();
      res.setHeader('Content-Type', 'application/json');
      return res.status(200).send(data);
    } 
    
    if (req.method === 'POST') {
      const response = await fetch(GAS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: typeof req.body === 'string' ? req.body : JSON.stringify(req.body),
        redirect: 'follow'
      });

      const data = await response.text();
      res.setHeader('Content-Type', 'application/json');
      return res.status(200).send(data);
    }

    return res.status(405).json({ status: 'erro', mensagem: 'Método não permitido.' });
  } catch (error) {
    console.error('Erro no Proxy GAS:', error);
    return res.status(500).json({ 
      status: 'erro', 
      mensagem: 'Falha na comunicação com o Google Apps Script.', 
      detalhe: error.toString() 
    });
  }
}
