const admin = require('firebase-admin');
const User = require('../models/User');

if (!admin.apps.length) {
  try {
    let serviceAccount;

    if (process.env.FIREBASE_SERVICE_ACCOUNT) {

      serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    } else {
    
      serviceAccount = require('../config/serviceAccountKey.json');
    }

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    console.log("✅ Firebase Admin Initialized Successfully");
  } catch (error) {
    console.error("❌ Firebase Admin Init Error:", error.message);
  }
}


const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: "Access Denied: No token provided." });
    }

    const token = authHeader.split(' ')[1];

    const decodedToken = await admin.auth().verifyIdToken(token);
    const { uid, email, name, picture } = decodedToken;

  
    const selectedRole = req.headers['x-user-role']; 
    const MASTER_ADMIN = process.env.ADMIN_EMAIL;

    let user = await User.findOne({ uid });

    if (user) {
      
      if (user.email === MASTER_ADMIN) {
        user.role = 'Admin';
        await user.save();
      } 
      
    
      if (selectedRole && user.role !== selectedRole) {
        return res.status(403).json({ 
          message: `Access Denied. You are registered as a ${user.role}.` 
        });
      }
    } else {

      let roleToAssign = selectedRole || 'Member';

      if (roleToAssign === 'Admin' && email !== MASTER_ADMIN) {
        return res.status(403).json({ 
          message: "Registration Restricted: Unauthorized Administrative attempt." 
        });
      }

      user = await User.create({
        uid,
        email,
        displayName: name || email.split('@')[0],
        photoURL: picture || `https://ui-avatars.com/api/?name=${email}&background=6366f1&color=fff`,
        role: roleToAssign
      });
      
      console.log(`✨ New User Registered: ${user.email} as ${user.role}`);
    }

  
    req.user = user;
    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error.message);
    res.status(401).json({ message: "Authentication failed. Please login again." });
  }
};

module.exports = { protect };