const { connectToDatabase } = require('../../lib/mongodb');
const { verifyAdmin } = require('../../lib/auth');

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const token = req.headers.authorization?.split(' ')[1];
    console.log('Token:', token);

    const adminUser = await verifyAdmin(token);
    if (!adminUser) {
      return res.status(403).json({ error: 'Access denied. Admins only.' });
    }

    const { db } = await connectToDatabase();
    const candidates = await db.collection('candidates').find({}).toArray();

    return res.status(200).json({ candidates });
  } catch (error) {
    console.error('❌ Fetch Candidates Error:', error);
    return res.status(500).json({ error: 'Failed to load candidates' });
  }
}