const Router = require("express").Router;
const router = Router();
const path = require("path");
const fs = require("fs");


let ruta = path.join(__dirname, "..", "archivos", "productos.json");

function getProducts() {
  if (fs.existsSync(ruta)) {
    return JSON.parse(fs.readFileSync(ruta, "utf-8"));
  } else {
    return [];
  }
}

function saveProducts(products) {
  fs.writeFileSync(ruta, JSON.stringify(products, null, 5));
}

//------------------------------------------------------------------------ PETICION GET

router.get("/", (req, res) => {
  let productos = getProducts();

  const limit = parseInt(req.query.limit) || productos.length;
  const limitedData = productos.slice(0, limit);
  res.setHeader("Content-Type", "application/json");
  res.status(200).json({ data: limitedData });
});

//------------------------------------------------------------------------ PETICION GET con /:ID

router.get("/:id", (req, res) => {
  let productos = getProducts();

  let pid = req.params.id;
  pid = parseInt(pid);
  if (isNaN(pid)) {
    res.json({
      status: "error",
      mensaje: "Require un argumento id de tipo numerico",
    });
    return;
  }
  let resultado = productos.filter((producto) => producto.id === pid);

  if (resultado.length > 0) {
    res.status(200).json({ data: resultado });
  } else {
    res
      .status(404)
      .json({ status: "error", mensaje: `El id ${pid} no existe` });
  }
});

//------------------------------------------------------------------------ PETICION POST

router.post("/", async (req, res) => {
  const productos = getProducts();

  let ruta2 = path(__dirname,"../../archivos/products.json");

  const { title, description, price, thumbnail, code, stock } = req.body;

  if (productos.some((producto) => producto.code === code)) {
    return res
      .status(400)
      .json({ error: `El CODE ${code} ya está siendo usado` });
  }

  if (title && description && price && thumbnail && code && stock) {
    const nuevoProducto = {
      id: productos.length > 0 ? productos[productos.length - 1].id + 1 : 1,
      status: true, //por defecto se debe seleccionar TRUE.
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
    };

    productos.push(nuevoProducto);

    try {
      await fs.promises.writeFile(
        ruta2,
        JSON.stringify(productos, null, 5),
        "utf8"
      );
      res.status(201).json({ nuevoProducto });
    } catch (error) {     
      res.status(500).json({ error: "Error al escribir en el archivo" });
    }
  } else {
    res.status(400).json({ error: "Debe completar todos los datos" });
  }
});

//------------------------------------------------------------------------ PETICION PUT

router.put("/:id", (req, res) => {
  let items = getProducts();
  let idProducto = parseInt(req.params.id);

  let { title, description, price, thumbnail, code, stock } = req.body;

  const itemId = idProducto;
  const newTitle = title;
  const newDescription = description;
  const newPrice = price;
  const newThumbnail = thumbnail;
  const newCode = code;
  const newStock = stock;

  if (isNaN(idProducto)) {
    return res.status(400).json({ error: "El id debe ser numérico" });
  }

  const itemIndex = items.findIndex((item) => item.id === itemId);

  if (itemIndex !== -1) {
    if (title && description && price && thumbnail && code && stock) {
      let codeAControlar = code;  
      let itemsFiltrados = items.filter(
        (producto) => producto.id !== idProducto
      );
      let checkCode = itemsFiltrados.findIndex(
        (producto) => producto.code === codeAControlar
      );
      if (checkCode !== -1) {     
        return res.status(400).json({
          error: `El CODE ${code} ya está siendo usado`,
        });
      }
      items[itemIndex].title = newTitle;
      items[itemIndex].description = newDescription;
      items[itemIndex].price = newPrice;
      items[itemIndex].thumbnail = newThumbnail;
      items[itemIndex].code = newCode;
      items[itemIndex].stock = newStock;

      fs.writeFile(ruta, JSON.stringify(items, null, 2), "utf8", (err) => {
        if (err) {        
          return res.status(500).json({
            error: "Error al escribir en el archivo",
          });
        } else {          
          res.status(200).json({ productoModificado: items[itemIndex] });
        }
      });
    } else {
      return res.status(400).json({
        error: "Faltan datos de completar en el body",
      });
    }
  } else {
    return res.status(404).json({
      error: "Elemento no encontrado",
    });
  }
});

//------------------------------------------------------------------------ PETICION DELETE

router.delete("/:id", (req, res) => {
  let productos = getProducts();

  let pid = req.params.id;
  pid = parseInt(pid);

  if (isNaN(pid)) {
    res.json({
      status: "error",
      mensaje: "Require un argumento id de tipo numerico",
    });
    return;
  }

  let resultado = productos.filter((producto) => producto.id === pid);

  if (resultado.length > 0) {
    res.json({ status: "ok", data: resultado });
  } else {
    res.json({ status: "error", mensaje: `El id ${pid} no existe` });
  }
});

router.get("*", (req, res) => {
  res.send("Error 404 - page not found");
});

module.exports = router;
