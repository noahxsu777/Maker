const https = require('https');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const vin = ((req.body || {}).vin || '').trim().toUpperCase();
  if (!vin || vin.length < 5) return res.status(400).json({ error: 'VIN inválido' });

  const options = {
    hostname: 'api.api-ninjas.com',
    path: `/v1/vinlookup?vin=${encodeURIComponent(vin)}`,
    method: 'GET',
    headers: { 'X-Api-Key': process.env.API_NINJAS_KEY || '' },
  };

  return new Promise((resolve) => {
    const apiReq = https.request(options, (apiRes) => {
      let raw = '';
      apiRes.on('data', chunk => { raw += chunk; });
      apiRes.on('end', () => {
        try { res.json(JSON.parse(raw)); }
        catch (_) { res.status(502).json({ error: 'Respuesta inválida de la API' }); }
        resolve();
      });
    });
    apiReq.on('error', err => {
      console.error('VIN lookup error:', err.message);
      res.status(500).json({ error: 'No se pudo contactar la API de VIN' });
      resolve();
    });
    apiReq.end();
  });
};
