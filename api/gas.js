export default async function handler(req, res) {
  // Substitua pela URL da sua Web App executável do Google Apps Script
  const GAS_URL = 'https://script.google.com/macros/s/AKfycbz9mkraqbunOd0wao6vVv3ICoS-yIXioAzi6cfT2gLIlTZm5V4ad7uleO4EekcUnDhRSA/exec';

  try {
    if (req.method === 'GET') {
      const queryParams = new URLSearchParams(req.query).toString();
      const response = await fetch(`${GAS_URL}?${queryParams}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      return res.status(200).json(data);
    } 

    if (req.method === 'POST') {
      const response = await fetch(GAS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req.body)
      });
      const data = await response.json();
      return res.status(200).json(data);
    }

    return res.status(405).json({ status: 'erro', mensagem: 'Método não permitido.' });
  } catch (error) {
    return res.status(500).json({ status: 'erro', mensagem: error.toString() });
  }
}
