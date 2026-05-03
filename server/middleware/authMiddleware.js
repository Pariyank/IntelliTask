const admin = require('firebase-admin');
const User = require('../models/User');
const fs = require('fs');
const path = require('path');

/**
 * 1. FIREBASE ADMIN INITIALIZATION
 * Standard Production Logic for Render "Secret Files"
 */
if (!admin.apps.length) {
  try {
    let serviceAccount;

    // Path A: Render's internal path for secret files
    const renderSecretPath = '/etc/secrets/serviceAccountKey.json';
    
    // Path B: Your local computer's path (development)
    const localSecretPath = path.join(__dirname, '..', 'config', 'serviceAccountKey.json');

    if (fs.existsSync(renderSecretPath)) {
      // ✅ Using Render Secret File (Production)
      serviceAccount = require(renderSecretPath);
      console.log("📡 Firebase Admin: Initializing via Render Secret File");
    } else if (fs.existsSync(localSecretPath)) {
      // ✅ Using Local JSON File (Development)
      serviceAccount = require(localSecretPath);
      console.log("💻 Firebase Admin: Initializing via local JSON file");
    } else {
      // ❌ Error: No key found
      throw new Error("Initialization Failed: serviceAccountKey.json not found in production or local paths.");
    }

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    console.log("✅ Firebase Admin Initialized Successfully");

  } catch (error) {
    console.error("❌ Firebase Admin Initialization Error:");
    console.error(error.message);
  }
}

/**
 * 2. PROTECT MIDDLEWARE
 * Verifies identity, enforces Admin exclusivity, and Locks user roles.
 */
const protect = async (req, res, next) => {
  try {
    // A. Check for Bearer Token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: "Unauthorized: Access Token Missing" });
    }

    const token = authHeader.split(' ')[1];

    // B. Verify Token with Firebase
    const decodedToken = await admin.auth().verifyIdToken(token);
    const { uid, email, name, picture } = decodedToken;

    // C. Get System Security Config
    const selectedRole = req.headers['x-user-role']; // From Frontend Role Selection
    const MASTER_ADMIN_EMAIL = process.env.ADMIN_EMAIL;

    // D. Sync with MongoDB
    let user = await User.findOne({ uid });

    if (user) {
      // --- SECURITY: EXISTING USER ---
      
      // 1. Force Admin role if the email matches the predefined Master Admin email
      if (user.email === MASTER_ADMIN_EMAIL && user.role !== 'Admin') {
        user.role = 'Admin';
        await user.save();
      }

      // 2. ROLE LOCK: Block if they selected a role different from their registered one
      if (selectedRole && user.role !== selectedRole) {
        return res.status(403).json({ 
          message: `Access Denied. This account is registered as a ${user.role}.` 
        });
      }
    } else {
      // --- SECURITY: NEW USER REGISTRATION ---

      // 1. Admin Gate: Only the MASTER_ADMIN email can create an Admin record
      if (selectedRole === 'Admin' && email !== MASTER_ADMIN_EMAIL) {
        return res.status(403).json({ 
          message: "Registration Restricted: Only the system owner can initialize the Admin role." 
        });
      }

      // 2. Create the user record (Syncing Firebase Auth with our MongoDB)
      user = await User.create({
        uid,
        email,
        displayName: name || email.split('@')[0],
        photoURL: picture || `https://ui-avatars.com/api/?name=${email}&background=6366f1&color=fff`,
        role: selectedRole || 'Member'
      });

      console.log(`✨ New ${user.role} Registered: ${user.email}`);
    }

    // E. Success: Attach user to req and proceed
    req.user = user;
    next();

  } catch (error) {
    console.error("🔒 Auth Middleware Runtime Error:", error.message);
    res.status(401).json({ message: "Session expired or invalid. Please login again." });
  }
};

module.exports = { protect };