export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const GAS_URL = "https://script.google.com/macros/s/AKfycbz9mkraqbunOd0wao6vVv3ICoS-yIXioAzi6cfT2gLIlTZm5V4ad7uleO4EekcUnDhRSA/exec";

  try {
    let response;
    if (req.method === 'GET') {
      const queryString = new URLSearchParams(req.query).toString();
      const targetUrl = queryString ? `${GAS_URL}?${queryString}` : GAS_URL;
      response = await fetch(targetUrl, { method: 'GET', redirect: 'follow' });
    } else if (req.method === 'POST') {
      response = await fetch(GAS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: typeof req.body === 'string' ? req.body : JSON.stringify(req.body),
        redirect: 'follow'
      });
    } else {
      return res.status(405).json({ status: 'erro', mensagem: 'Método não permitido.' });
    }

    const dataText = await response.text();
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).send(dataText);
  } catch (error) {
    return res.status(500).json({ status: 'erro', mensagem: 'Erro Proxy Vercel', detalhe: error.toString() });
  }
}
