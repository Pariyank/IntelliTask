const mongoose = require('mongoose');
const User = require('./models/User');
const admin = require('firebase-admin');
const serviceAccount = require('./config/serviceAccountKey.json');
require('dotenv').config();

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  try {

    const firebaseUser = await admin.auth().createUser({
      email,
      password,
      displayName: 'System Admin',
    });

    await User.create({
      uid: firebaseUser.uid,
      email: email,
      displayName: 'System Admin',
      role: 'Admin',
      photoURL: 'https://ui-avatars.com/api/?name=Admin&background=4f46e5&color=fff'
    });

    console.log("✅ Admin Account Created Successfully!");
  } catch (error) {
    console.error("❌ Error: Admin might already exist.", error.message);
  } finally {
    mongoose.connection.close();
  }
};

seed();