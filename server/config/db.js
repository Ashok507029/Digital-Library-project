const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']); // Google DNS — fixes SRV lookup issues

const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://ashokmorda20_db_user:ashok507029@cluster0.68pew8i.mongodb.net/digital-library?retryWrites=true&w=majority&appName=Cluster0';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
