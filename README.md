# Archivo readme
Información útil para analizar este repositorio


## 1. ALUMNO: 

Mauricio Javier ALONSO


## 2. COMISION:

 N° 55565


## 3. TITULO DESAFIO ENTREGABLE: 

Implementación de logger

## 4. N° DESAFIO ENTREGABLE: 

N° 14

## 5. CONSIGNA DESAFIO ENTREGABLE: 

Se aplicará un módulo de mocking y un manejador de errores a tu servidor actual.


## 6. Usuario Administrador:

### En modo production
Usuario: Coder
Email: adminCoder@coder.com
Pass: adminCod3r123

### En modo development
Usuario: CoderPrueba
Email: adminCoderPrueba@coder.com
Pass: adminCod3r123


## 7. Claves para el acceso a Github

clientID: "Iv1.cc00dcea44bb45db",
clientSecret: "f942dbbff3e0ead468ab3731ba8b0283a6d70057",
callbackURL: "http://localhost:8080/api/sessions/callbackGithub",

## 8. Sessions o JWT
Para este repo se eligió Sessions .

## 9. Ruta Current

Se creó la ruta "/current" en "vistas.router.js" que informa si hay un usuario autenticado o no. 

## 10. Diferentes rutas para administrador y usuario
Se implementó que si ingresa un administrador, pueda borrar y agregar productos.
En cambio, si ingresa un usuario, podrá manejar el carrito de compras y el chat.

## 11. Se aplicó el patrón Repository
Para users y productos.

## 12. Se implementó un ticket con la compra

## 13. Se implementó una ruta para FAKER.JS
La ruta es /mockingproducts

## 14. Se implementó una ruta para Logger
La ruta es /loggerTest

Y los archivos log son:

logWarnError.log ---> guarda los errores desde el nivel info. Este archivo se visualiza en esta ruta si se ingresa con la variable de entorno development. 

errors.log ---> guarda los errores desde el nivel error. Este archivo se visualiza en esta ruta si se ingresa con la variable de entorno production. 

## 15. Scripts para activar variables de entorno

npm run pro   ---> activa modo production
npm run dev   ---> activa modo development

