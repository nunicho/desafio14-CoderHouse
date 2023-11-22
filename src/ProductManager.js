const fs = require("fs");

class ProductManager {
  constructor(path) {
    this.path = path;
  }

  async getProductos() {
    if (fs.existsSync(this.path)) {
      return JSON.parse(await fs.promises.readFile(this.path, "utf-8"));
    } else return [];
  }

  async addProducto(title, description, price, thumbnail, code, stock) {
    let productos = await this.getProductos();

    // Verificamos si el CODE del producto a ingresar ya pertenece a otro producto ya ingresado en el array.

    if (productos.length > 0) {
      let existe = productos.findIndex((producto) => producto.code === code);
      if (existe !== -1) {
        console.log(`El CODE ${code} ya está siendo usado...!!!`);
        return;
      }
    }

    let nuevoProducto = {
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
    };

    // Con (title && description && price && thumbnail && code && stock) validamos que todos los campos deban ser "true" porque son obligatorios. Si alguno no es completado, se devuelve "`Debe completar todos los datos`"
    if (title && description && price && thumbnail && code && stock) {
      if (productos.length === 0) {
        nuevoProducto.id = 1;
      } else {
        nuevoProducto.id = productos[productos.length - 1].id + 1;
      }
      productos.push(nuevoProducto);
      await fs.promises.writeFile(
        this.path,
        JSON.stringify(productos, null, 5)
      );
    } else {
      console.log(`Debe completar todos los datos`);
    }
  }

  // Metodo getProductbyId

  async getProductoById(idProducto) {
    let productos = await this.getProductos();
    let indiceProducto = productos.findIndex(
      (producto) => producto.id === idProducto
    );

    if (indiceProducto === -1) {
      console.log(`El producto ${idProducto} no existe...!!!`);
      return;
    }

    return productos[indiceProducto];
  }

  // Metodo editProductbyId

  async editProductoById(
    idProducto,
    title,
    description,
    price,
    thumbnail,
    code,
    stock
  ) {
    const itemId = idProducto;
    const newTitle = title;
    const newDescription = description;
    const newPrice = price;
    const newThumbnail = thumbnail;
    const newCode = code;
    const newStock = stock;

    // Leer el archivo JSON
    fs.readFile(this.path, "utf8", (err, data) => {
      if (err) {
        console.error("Error al leer el archivo:", err);
        return;
      }

      try {
        const items = JSON.parse(data);

        // Buscar el elemento por ID
        const itemIndex = items.findIndex((item) => item.id === itemId);

        // Si el index existe
        if (itemIndex !== -1) {
          // Validamos que todos los campos estén completos antes de actualizar
          if (title && description && price && thumbnail && code && stock) {
            // Antes de modificar los items, verifico que no se esté repitiendo el CODE
            // El código busca filtrar el array de productos, crear un nuevo array, y en ese nuevo array buscar el code si existe.
            // Hago esta separación del nuevo array para que no me incluya el ítem a editar en la búsqueda de un código repetido (si no no podría editar ningún ítem)
            let codeAControlar = code;
            console.log("El code a controlar es: " + codeAControlar);
            let itemsFiltrados = items.filter(
              (producto) => producto.id !== idProducto
            );
            //console.log(itemsFiltrados)
            let checkCode = itemsFiltrados.findIndex(
              (producto) => producto.code === codeAControlar
            );
            if (checkCode !== -1) {
              console.log(`El CODE ${code} ya está siendo usado...!!!`);
              return;
            }
            items[itemIndex].title = newTitle;
            items[itemIndex].description = newDescription;
            items[itemIndex].price = newPrice;
            items[itemIndex].thumbnail = newThumbnail;
            items[itemIndex].code = newCode;
            items[itemIndex].stock = newStock;

            // Escribir los cambios de vuelta al archivo JSON
            fs.writeFile(
              this.path,
              JSON.stringify(items, null, 2),
              "utf8",
              (err) => {
                if (err) {
                  console.error("Error al escribir en el archivo:", err);
                } else {
                  console.log("Elemento editado exitosamente.");
                }
              }
            );
          } else {
            console.log("Faltan elementos de completar antes de editar");
          }
        } else {
          console.log("Elemento no encontrado.");
        }
      } catch (parseError) {
        console.error("Error al analizar el archivo JSON:", parseError);
      }
    });
  }

  // Metodo deleteProductbyId

  async deleteProductoById(idProducto) {
    let productos = await this.getProductos();
    let productoEliminado = productos.filter(
      (producto) => producto.id === idProducto
    );  

    console.log(productoEliminado)

    if (productoEliminado.length === 0){
      console.log("El producto a eliminar no existe. ")
      return
    }
    let itemsFiltrados = productos.filter(
        (producto) => producto.id !== idProducto
      );         
      if (itemsFiltrados)
        fs.writeFile(this.path, JSON.stringify(itemsFiltrados, null, 2), "utf8", (err) => {
          if (err) {
            console.error("Error al escribir en el archivo", err);
            return
          } else {
            console.log(`El producto ha sido eliminado exitosamente.`);
          }
        });
   
  }
}


module.exports = ProductManager;