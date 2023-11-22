const Router = require("express").Router;
const router = Router();
const path = require("path");
const fs = require("fs");

let ruta = path.join(__dirname, "..", "archivos", "carritos.json");
let rutaProductos = path.join(__dirname, "..", "archivos", "productos.json");


function getCarts() {
  if (fs.existsSync(ruta)) {
    return JSON.parse(fs.readFileSync(ruta, "utf-8"));
  } else {
    return [];
  }
}


function getProducts() {
  if (fs.existsSync(rutaProductos)) {
    return JSON.parse(fs.readFileSync(rutaProductos, "utf-8"));
  } else {
    return [];
  }
}



function saveProducts(carts) {
  fs.writeFileSync(ruta, JSON.stringify(carts, null, 5));
}


//------------------------------------------------------------------------ PETICION GET con /:ID

router.get("/:cid", (req, res) => {
  let carritos = getCarts();

  let cid = req.params.cid;
  cid = parseInt(cid);

  if (isNaN(cid)) {
    res.json({
      status: "error",
      mensaje: "Requiere un argumento 'cid' de tipo numérico",
    });
    return;
  }

  let resultado = carritos.filter((carrito) => carrito.id === cid);

  if (resultado.length > 0) {
    res.status(200).json({ data: resultado });
  } else {
    res
      .status(404)
      .json({ status: "error", mensaje: `El id ${cid} no existe` });
  }
});

//------------------------------------------------------------------------ PETICION POST


router.post("/products/", async (req, res) => {
  const carritos = getCarts();
  const productos = getProducts();

  const productsToAdd = req.body;

  if (productsToAdd.length > 0) {
    let allProductsExist = true;

    for (const product of productsToAdd) {
      const { id, quantity } = product;

      if (
        !id ||
        !quantity ||
        !productos.some((producto) => producto.id === id)
      ) {
        allProductsExist = false;
        break;
      }
    }

    if (allProductsExist) {
      const groupedProducts = {};

      for (const product of productsToAdd) {
        const { id, quantity } = product;

        if (!groupedProducts[id]) {
          groupedProducts[id] = quantity;
        } else {
          groupedProducts[id] += quantity;
        }
      }

      const updatedCarrito = {
        id: carritos.length > 0 ? carritos[carritos.length - 1].id + 1 : 1,
        products: Object.keys(groupedProducts).map((id) => ({
          id: parseInt(id),
          quantity: groupedProducts[id],
        })),
      };

      carritos.push(updatedCarrito);

      try {
        await fs.promises.writeFile(
          ruta,
          JSON.stringify(carritos, null, 2),
          "utf8"
        );
        res.status(201).json(updatedCarrito); // Agregar respuesta en caso de éxito
      } catch (error) {
        res.status(500).json({ error: "Error al guardar el carrito" });
      }
    } else {
      res
        .status(400)
        .json({ error: "Algunos productos no existen o datos incompletos" });
    }
  } else {
    res.status(400).json({ error: "Debe enviar al menos un producto" });
  }
});

module.exports = router;




