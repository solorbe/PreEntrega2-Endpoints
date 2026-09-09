# PreEntrega2

## Qué hace la app

Es una **API REST** de un Sistema de Turnos y Reservas, construida con **Express**. Expone un **CRUD completo** del
recurso `services` con persistencia en un **archivo JSON** a través de la clase `ServiceManager` (usando `fs/promises`, nativo de Node): los datos ya
**sobreviven a un reinicio del servidor**. 

Además carga su configuración (puerto, URL de base de datos) desde variables de entorno usando `dotenv` si falta algo, la app avisa por consola y no arranca.

## Requisitos

- Node.js, por el soporte de `--watch` y ESM estable.
- git.

## Instalación paso a paso

```bash
git clone
npm install express dotenv 
completar .env.example .env   # completar PORT=8080 y MONGO_URI
npm run dev
```

## Dependencias del proyecto

- **`express`**: framework que provee el servidor HTTP, el router y los middlewares (`express.json()`, logger propio, etc.) usados para armar
  la API.
- **`dotenv`**: lee el archivo `.env` de la raíz del proyecto y carga cada variable definida ahí dentro de `process.env`, el objeto donde
  Node guarda las variables de entorno del proceso. Todo lo que dotenv carga llega como **string**, aunque en el `.env` parezca un número.

`fs` (más precisamente `fs/promises`) es un módulo **nativo** de Node.js: no aparece en `package.json` ni requiere instalación, ya viene
incluido en el runtime.

## Dónde se guardan los datos

Los servicios se persisten en `src/data/services.json`. Ese archivo se trackea en git (arranca como un array de 3 objetos) para que exista
apenas cloná el repo; a medida que creás, editás o borrás servicios, el ServiceManager` reescribe este archivo completo con el estado
actualizado.

## Cómo probar con Postman

Con el servidor corriendo (por defecto en `http://localhost:8080`, salvo que haya cambiado `PORT` en tu `.env`):

| Método | URL | Body (raw JSON) | Respuesta esperada |
|---|---|---|---|
| GET | `http://localhost:8080/api/services` | — | `200` · `{ status:'success', payload:[...] }` |
| GET | `http://localhost:8080/api/services/1` | — | `200` o `404` si no existe |
| POST | `http://localhost:8080/api/services` | `{ "name":"Masajes","duration":60,"price":8000,"category":"estetica" }` | `201` · servicio creado |
| POST | `http://localhost:8080/api/services` | `{ "name":"Incompleto" }` | `400` · faltan campos |
| PUT | `http://localhost:8080/api/services/1` | `{ "price":6000 }` | `200` o `404` |
| DELETE | `http://localhost:8080/api/services/1` | — | `200` o `404` |

También están disponibles `GET /` (estado del servidor)

## Prueba de persistencia

Para comprobar que los datos ya sobreviven a un reinicio:

1. Creá un servicio nuevo con `POST /api/services`.
2. Reiniciá el servidor (cortá `npm run dev`/`npm start` y volvé a
   levantarlo).
3. Hacé `GET /api/services`: el servicio creado sigue estando.
4. Abrí `src/data/services.json` y confirmá que quedó escrito ahí.

## Aviso de escalabilidad

Cada operación del `ServiceManager` lee y reescribe **el archivo completo**

## Estructura del proyecto

```bash
src/
  app.js                # App de Express: middlewares y rutas (CRUD de /api/services)
  server.js             # Levanta el servidor con app.listen
  config/
    config.js           # Carga y valida variables de entorno (dotenv + fail-fast)
  managers/
    ServiceManager.js   # Persistencia de services en FileSystem (fs/promises)
  data/
    services.json  
  .gitignore
  .env.example     # Archivo donde se guardan los servicios
  
```
