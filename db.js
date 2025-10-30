const mongoose = require("mongoose");

let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    console.log("⚡ Conexão MongoDB já existente — reutilizando.");
    return;
  }

  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI não definida!");
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    isConnected = conn.connections[0].readyState === 1;
    console.log("✅ MongoDB conectado com sucesso");
  } catch (err) {
    console.error("❌ Erro ao conectar ao MongoDB:", err.message);
    throw err;
  }
};

module.exports = connectDB;
