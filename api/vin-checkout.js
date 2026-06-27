const Stripe = require('stripe');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { vin = '' } = req.body || {};
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const origin = req.headers.origin || 'https://maker-wine.vercel.app';

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [{
        quantity: 1,
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'VIN Report — Money Makers LLC',
            description: `Reporte completo del vehículo${vin ? ` VIN: ${vin}` : ''}. Historial de accidentes, dueños, kilometraje, robo, recalls y más.`,
            metadata: { company: 'Money Makers LLC', vin },
          },
          unit_amount: 199,
        },
      }],
      payment_intent_data: {
        description: `Money Makers LLC — VIN Report${vin ? ` (VIN: ${vin})` : ''}`,
        metadata: { company: 'Money Makers LLC', vin },
      },
      success_url: `${origin}/?vin_success=true${vin ? `&vin=${encodeURIComponent(vin)}` : ''}`,
      cancel_url: `${origin}/#vin`,
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error('Stripe error:', err.message);
    res.status(500).json({ error: err.message });
  }
};
