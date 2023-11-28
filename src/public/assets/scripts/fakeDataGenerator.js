const {faker} =require("@faker-js/faker")
const productosModeloFaker = require("../../../dao/Faker/models/productosFaker.modelo")
const mongoose = require("mongoose");




const generateFakeProducts = (quantity) => {
  const fakeProducts = [];

  for (let i = 0; i < quantity; i++) {
    const fakeProduct = {
      _id: faker.database.mongodbObjectId(),
      status: true,
      title: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: faker.commerce.price({
        min: 100,
        max: 50000,
        dec: 0,
        symbol: "$",
      }),
      thumbnail: faker.image.urlLoremFlickr({ category: "abstract" }),
      code: Math.floor(Math.random() * 1000000) + 1,
      stock: faker.commerce.price({
        min: 10,
        max: 25,
        dec: 0,
      }),
    };

    fakeProducts.push(fakeProduct);
  }

  return fakeProducts;
};

// Endpoint para generar y agregar productos falsos a la base de datos
const generateAndAddFakeProducts = async (req, res) => {
  try {
    // Genera 100 productos falsos
    const fakeProducts = generateFakeProducts(100);

    // Agrega los productos falsos a la base de datos
    await productosModeloFaker.create(fakeProducts);

    res
      .status(200)
      .json({ message: "Productos falsos generados y agregados con éxito." });
  } catch (error) {  
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

module.exports = { generateFakeProducts, generateAndAddFakeProducts };
