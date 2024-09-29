// server.js
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
require("dotenv").config(); // .env dosyasından çevre değişkenlerini yüklemek için
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB Atlas bağlantısı
const MONGODB_URI = process.env.MONGODB_URI;

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("MongoDB Atlas'a başarıyla bağlandı"))
  .catch((err) => console.error("MongoDB Atlas bağlantı hatası:", err));

// Middleware
app.use(bodyParser.json());
  // CORS configuration
  const corsOptions = {
    origin: 'http://localhost:3000', // Allow only your frontend origin
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
  };

  app.use(cors(corsOptions));

  // Handle preflight requests
  app.options('*', cors(corsOptions));

// Ürün şeması
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  featuredImage: { type: String, required: true },
});

const Product = mongoose.model("Product", productSchema);

// Ürün ekleme
app.post("/products", async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Ürünleri listeleme
app.get("/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Ürün güncelleme
app.put("/products/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) return res.status(404).json({ message: "Ürün bulunamadı" });
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.get("/products/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Ürün bulunamadı" });
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


// Ürün silme
app.delete("/products/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Ürün bulunamadı" });
    res.json({ message: "Ürün başarıyla silindi" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
