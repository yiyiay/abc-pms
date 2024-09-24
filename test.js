// testDatabase.js
const mongoose = require('mongoose');
const Product = require('./models/Product'); // Ürün modelinizin yolu
require("dotenv").config(); // .env dosyasından çevre değişkenlerini yüklemek için

async function testDatabase() {
  try {
    // Veritabanına bağlan
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Veritabanına bağlandı');

    // Test ürünü oluştur
    const testProduct = {
      name: 'Test Ürünü',
      description: 'Bu bir test ürünüdür',
      price: 9.99,
      stock: 100,
      featuredImage: 'https://example.com/test-image.jpg'
    };

    // 1. Ürün Ekleme
    console.log('1. Ürün ekleniyor...');
    const addedProduct = await Product.create(testProduct);
    console.log('Eklenen ürün:', addedProduct);

    // 2. Ürünleri Listeleme
    console.log('\n2. Tüm ürünler listeleniyor...');
    const allProducts = await Product.find();
    console.log('Mevcut ürünler:', allProducts);

    // 3. Ürün Güncelleme
    console.log('\n3. Ürün güncelleniyor...');
    const updatedProduct = await Product.findByIdAndUpdate(
      addedProduct._id,
      { price: 19.99, stock: 50 },
      { new: true }
    );
    console.log('Güncellenen ürün:', updatedProduct);

    // 4. Güncellenmiş Ürünü Getirme
    console.log('\n4. Güncellenmiş ürün getiriliyor...');
    const retrievedProduct = await Product.findById(addedProduct._id);
    console.log('Getirilen ürün:', retrievedProduct);

    // 5. Ürün Silme
    console.log('\n5. Ürün siliniyor...');
    const deletedProduct = await Product.findByIdAndDelete(addedProduct._id);
    console.log('Silinen ürün:', deletedProduct);

    // 6. Silme İşlemini Doğrulama
    console.log('\n6. Silme işlemi doğrulanıyor...');
    const checkProduct = await Product.findById(addedProduct._id);
    console.log('Silinen ürün arandı:', checkProduct);

    console.log('\nTest tamamlandı!');
  } catch (error) {
    console.error('Test sırasında bir hata oluştu:', error);
  } finally {
    // Veritabanı bağlantısını kapat
    await mongoose.connection.close();
    console.log('Veritabanı bağlantısı kapatıldı');
  }
}

// Test fonksiyonunu çalıştır
testDatabase();