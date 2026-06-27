require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const https   = require('https');
const stripe  = require('stripe')(process.env.STRIPE_SECRET_KEY);
const path    = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Serve the static site (index.html + logos/)
app.use(express.static(path.join(__dirname)));

// ──────────────────────────────────────────────
//  POST /api/vin-checkout
//  Creates a Stripe Checkout Session for VIN Report subscriptions
// ──────────────────────────────────────────────
app.post('/api/vin-checkout', async (req, res) => {
  const { plan = 'monthly', vin = '' } = req.body;

  const prices = {
    monthly: { unit_amount: 999,  interval: 'month', label: 'Mensual' },
    annual:  { unit_amount: 5999, interval: 'year',  label: 'Anual'   },
  };

  const selected = prices[plan] ?? prices.monthly;
  const origin   = req.headers.origin || `http://localhost:${process.env.PORT || 3000}`;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],

      line_items: [{
        quantity: 1,
        price_data: {
          currency: 'usd',
          recurring: { interval: selected.interval },
          product_data: {
            name:        'VIN Report Premium — Stelvio Broker LLC',
            description: 'Acceso ilimitado a reportes VIN: historial de accidentes, dueños, kilometraje, robo, recalls y más.',
            images:      [],
            metadata:    { company: 'Stelvio Broker LLC', vin },
          },
          unit_amount: selected.unit_amount,
        },
      }],

      subscription_data: {
        description: `Stelvio Broker LLC — VIN Report ${selected.label}${vin ? ` (VIN: ${vin})` : ''}`,
        metadata: {
          company: 'Stelvio Broker LLC',
          plan,
          vin,
        },
      },

      success_url: process.env.SUCCESS_URL || `${origin}/?vin_success=true`,
      cancel_url:  process.env.CANCEL_URL  || `${origin}/#vin`,
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error('Stripe error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ──────────────────────────────────────────────
//  POST /api/vin-lookup
//  Proxies API Ninjas VIN lookup to keep the key server-side
// ──────────────────────────────────────────────
app.post('/api/vin-lookup', (req, res) => {
  const vin = (req.body.vin || '').trim().toUpperCase();
  if (!vin || vin.length < 5) {
    return res.status(400).json({ error: 'VIN inválido' });
  }

  const options = {
    hostname: 'api.api-ninjas.com',
    path: `/v1/vinlookup?vin=${encodeURIComponent(vin)}`,
    method: 'GET',
    headers: { 'X-Api-Key': process.env.API_NINJAS_KEY || '' },
  };

  const apiReq = https.request(options, apiRes => {
    let raw = '';
    apiRes.on('data', chunk => { raw += chunk; });
    apiRes.on('end', () => {
      try {
        const parsed = JSON.parse(raw);
        res.json(parsed);
      } catch (_) {
        res.status(502).json({ error: 'Respuesta inválida de la API' });
      }
    });
  });

  apiReq.on('error', err => {
    console.error('VIN lookup error:', err.message);
    res.status(500).json({ error: 'No se pudo contactar la API de VIN' });
  });

  apiReq.end();
});

// Health check
app.get('/api/health', (_req, res) => res.json({ ok: true }));

// Fallback: serve index.html for any unknown GET route
app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅  Stelvio Broker LLC server running → http://localhost:${PORT}`);
  if (!process.env.STRIPE_SECRET_KEY?.startsWith('sk_')) {
    console.warn('⚠️   STRIPE_SECRET_KEY missing or invalid in .env');
  }
});
