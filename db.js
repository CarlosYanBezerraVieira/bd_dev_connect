const mongoose = require("mongoose");

let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    console.log("⚡ Conexão MongoDB já existente — reutilizando.");
    return;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    isConnected = conn.connections[0].readyState === 1;
    console.log("✅ MongoDB conectado com sucesso");
  } catch (err) {
    console.error("❌ Erro ao conectar ao MongoDB:", err.message);
    throw err;
  }
};

module.exports = connectDB;
