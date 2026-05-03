const admin = require('firebase-admin');
const User = require('../models/User');
const path = require('path');

try {
  const serviceAccount = require(path.join(__dirname, '..', 'config', 'serviceAccountKey.json'));

  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    console.log("✅ Firebase Admin Initialized");
  }
} catch (error) {
  console.error("❌ Firebase Admin Init Error:", error.message);
}

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(' ')[1];

    const decodedToken = await admin.auth().verifyIdToken(token);
    const { uid, email } = decodedToken;

    const selectedRole = req.headers['x-user-role'];
    let user = await User.findOne({ uid });

    if (user) {
      if (selectedRole && user.role !== selectedRole) {
        return res.status(403).json({ message: `Role mismatch: Registered as ${user.role}` });
      }
    } else {

      if (selectedRole === 'Admin' && email !== process.env.ADMIN_EMAIL) {
        return res.status(403).json({ message: "Unauthorized Admin attempt" });
      }

      user = await User.create({
        uid,
        email,
        displayName: decodedToken.name || email.split('@')[0],
        photoURL: decodedToken.picture || `https://ui-avatars.com/api/?name=${email}`,
        role: selectedRole || 'Member'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error.message);
    res.status(401).json({ message: "Auth failed: " + error.message });
  }
};

module.exports = { protect };