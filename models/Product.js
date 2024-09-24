// models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Ürün adı gereklidir'],
    trim: true
  },
  description: { 
    type: String, 
    required: [true, 'Ürün açıklaması gereklidir'],
    trim: true
  },
  price: { 
    type: Number, 
    required: [true, 'Ürün fiyatı gereklidir'],
    min: [0, 'Fiyat 0\'dan küçük olamaz']
  },
  stock: { 
    type: Number, 
    required: [true, 'Stok miktarı gereklidir'],
    min: [0, 'Stok miktarı negatif olamaz'],
    integer: true
  },
  featuredImage: { 
    type: String, 
    required: [true, 'Ürün resmi gereklidir'],
    trim: true
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Güncelleme işlemlerinde updatedAt alanını otomatik olarak güncelle
productSchema.pre('findOneAndUpdate', function(next) {
  this.set({ updatedAt: new Date() });
  next();
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;