const admin = require('firebase-admin');
const User = require('../models/User');

if (!admin.apps.length) {
  try {
    const serviceAccount = process.env.NODE_ENV === 'production'
      ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
      : require('../config/serviceAccountKey.json');

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    console.log("✅ Firebase Admin Connected");
  } catch (error) {
    console.error("❌ Auth Init Error:", error.message);
  }
}

const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) return res.status(401).json({ message: "No Token" });

  const token = authHeader.split(' ')[1];
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    const selectedRole = req.headers['x-user-role'];
    
    let user = await User.findOne({ uid: decodedToken.uid });

    if (!user) {
      if (selectedRole === 'Admin' && decodedToken.email !== process.env.ADMIN_EMAIL) {
        return res.status(403).json({ message: "Restricted" });
      }
      user = await User.create({
        uid: decodedToken.uid,
        email: decodedToken.email,
        displayName: decodedToken.name || decodedToken.email.split('@')[0],
        photoURL: decodedToken.picture || `https://ui-avatars.com/api/?name=${decodedToken.email}`,
        role: selectedRole || 'Member'
      });
    }
    req.user = user;
    next();
  } catch (e) { res.status(401).json({ message: "Expired" }); }
};

module.exports = { protect };