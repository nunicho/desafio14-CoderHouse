# Archivo readme
Información útil para analizar este repositorio


## 1. ALUMNO: 

Mauricio Javier ALONSO


## 2. COMISION:

 N° 55565


## 3. TITULO DESAFIO ENTREGABLE: 

Mocking  y manejo de errores

## 4. N° DESAFIO ENTREGABLE: 

N° 13

## 5. CONSIGNA DESAFIO ENTREGABLE: 

Se aplicará un módulo de mocking y un manejador de errores a tu servidor actual.


## 6. Como configurar una peticiones a la base de datos / Producto:

En postman: 
GET / http://localhost:8080/api/products

GET (con limit) / http://localhost:8080/api/products?limit=2

GET (con Id) / http://localhost:8080/api/products/65160d3c2d9e25f3e602ed3e

POST / http://localhost:8080/api/products
{
      "title":" Amoladora Bosh Professional",
      "description": "GWS 850 - Azul - 220V",
      "price":"40000",
      "thumbnail":"https://http2.mlstatic.com/D_NQ_NP_2X_652973-MLA53056734600_122022-F.webp",
      "code":"TA-104",
      "stock":"1" 

}

DELETE / http://localhost:8080/api/products/65160d3c2d9e25f3e602ed3e

PUT / http://localhost:8080/api/products/65160d3c2d9e25f3e602ed3e

{
      "title":" Tender para la ropa MEGAMAX PRO",
      "description": "Pie aluminio plegable",
      "price":"21000",
      "thumbnail":"https://http2.mlstatic.com/D_NQ_NP_685663-MLU69658396260_052023-O.webp",
      "code":"TA-100",
      "stock":"7" 

}

## 7. Como configurar una petición POST de Carrito:

GET / http://localhost:8080/api/carts

GET (con Id) / http://localhost:8080/api/carts/65160f162d9e25f3e602ed67

POST / http://localhost:8080/api/products

{
  "products": [    
    {"id": "65160d3c2d9e25f3e602ed3e",
     "quantity": "4"
     },
        {"id": "65160d662d9e25f3e602ed41",
     "quantity": 4
     },
    {"id": "65160d8f2d9e25f3e602ed44",
     "quantity": 2
     }
  ]
}

PUT / 

{
  "products": [    
    {"id": "65160d3c2d9e25f3e602ed3e",
     "quantity": "4"
     },
        {"id": "65160d662d9e25f3e602ed41",
     "quantity": 4
     },
    {"id": "65160d8f2d9e25f3e602ed44",
     "quantity": 2
     }
  ]
}

PUT / http://localhost:8080/api/carts/651615487520733661cb99f0 // Para editar todo el carro

{
  "products": [    
    {"id": "65160d8f2d9e25f3e602ed44",
     "quantity": "4"
     },
        {"id": "65160d8f2d9e25f3e602ed44",
     "quantity": 4
     }
  ]
}


PUT / http://localhost:8080/api/Carts/65161408d2e9f8ac5bc09f87/products/65160d8f2d9e25f3e602ed44  //esta petición sólo cambia la candidad de un determinado producto dentro de un carrito


{
    "quantity":"900"
}


DELETE / http://localhost:8080/api/carts/65161408d2e9f8ac5bc09f87

DELETE // http://localhost:8080/api/carts/651615487520733661cb99f0/products/65160ded2d9e25f3e602ed4a  // para eliminar un producto específico de un carrito, sin borrar el carrit## 8. FileSystem y MongoDB:

Puse todo el carpeta DAO, pero dejé funcionales las vistas de handlebars. El usuario puede elegir navegar dentro de filesystem o MongoDB.

Para esta entrega se creó un form, con un input donde el usuario ingresa el número de id del carrito, por ejemplo 651615487520733661cb99f0 y luego puede ir a 
http://localhost:8080/carts/651615487520733661cb99f0


## 9. Usuario Administrador:
Usuario: Coder
Email: adminCoder@coder.com
Pass: adminCod3r123

Se puso hardcodeado en el código de sessions.router.js porque no debía estar en la base de datos de usuarios. 

## 10. Claves para el acceso a Github

clientID: "Iv1.cc00dcea44bb45db",
clientSecret: "f942dbbff3e0ead468ab3731ba8b0283a6d70057",
callbackURL: "http://localhost:8080/api/sessions/callbackGithub",

## 11. Sessions o JWT
Para este repo se eligió Sessions .

## 12. Ruta Current

Se creó la ruta "/current" en "vistas.router.js" que informa si hay un usuario autenticado o no. 

## 13. Diferentes rutas para administrador y usuario
Se implementó que si ingresa un administrador, pueda borrar y agregar productos.
En cambio, si ingresa un usuario, podrá manejar el carrito de compras y el chat.

## 14. Se aplicó el patrón Repository
Para users y productos.

## 15. Se implementó un ticket con la compra

