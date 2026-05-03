const admin = require('firebase-admin');
const User = require('../models/User');

if (!admin.apps.length) {
  try {
    let serviceAccount;

    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
   
      serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      console.log("📡 Firebase Admin: Initializing via Environment Variable");
    } else {
  
      serviceAccount = require('../config/serviceAccountKey.json');
      console.log("💻 Firebase Admin: Initializing via local JSON file");
    }

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    console.log("✅ Firebase Admin Initialized Successfully");
  } catch (error) {
    console.error("❌ Firebase Admin Initialization Error:");
    console.error(error.message);

    if (error instanceof SyntaxError) {
      console.error("👉 HINT: The FIREBASE_SERVICE_ACCOUNT variable on Render is not valid JSON. Make sure you copied the ENTIRE content of the file correctly.");
    }
  }
}


const protect = async (req, res, next) => {
  try {

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(' ')[1];

    const decodedToken = await admin.auth().verifyIdToken(token);
    const { uid, email, name, picture } = decodedToken;

    const selectedRole = req.headers['x-user-role']; 
    const MASTER_ADMIN_EMAIL = process.env.ADMIN_EMAIL;

    let user = await User.findOne({ uid });

    if (user) {

  
      if (user.email === MASTER_ADMIN_EMAIL && user.role !== 'Admin') {
        user.role = 'Admin';
        await user.save();
      }

      if (selectedRole && user.role !== selectedRole) {
        return res.status(403).json({ 
          message: `Access Denied. This account is registered as a ${user.role}.` 
        });
      }
    } else {
     
      if (selectedRole === 'Admin' && email !== MASTER_ADMIN_EMAIL) {
        return res.status(403).json({ 
          message: "Registration Restricted: Only the system owner can initialize the Admin role." 
        });
      }

      user = await User.create({
        uid,
        email,
        displayName: name || email.split('@')[0],
        photoURL: picture || `https://ui-avatars.com/api/?name=${email}&background=6366f1&color=fff`,
        role: selectedRole || 'Member'
      });

      console.log(`✨ New ${user.role} Registered: ${user.email}`);
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("🔒 Auth Middleware Error:", error.message);
    res.status(401).json({ message: "Authentication failed. Token may be invalid or expired." });
  }
};

module.exports = { protect };