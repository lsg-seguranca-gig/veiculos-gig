export default async function handler(req, res) {
  const GOOGLE_SCRIPT_URL = process.env.GAS_URL;

  if (!GOOGLE_SCRIPT_URL) {
    return res.status(500).json({ 
      status: 'erro', 
      mensagem: 'A variável de ambiente GAS_URL não foi configurada na Vercel.' 
    });
  }

  try {
    if (req.method === 'GET') {
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
