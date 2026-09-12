
import express from "express";

import servicesRouter from "./routes/services.router.js";

const app = express();

app.use(express.json()); //midlleware para parsear el body de las peticiones entrantes en formato JSON

app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "API del Sistema de Turnos y Reservas"
  });
});

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.use('/api/services', servicesRouter);

export default app;

/*
Endpoints de la API:
GET /api/services permite listar todos los servicios.
GET /api/services/:sid permite obtener un servicio por id.
POST /api/services permite crear un nuevo servicio.
PUT /api/services/:sid permite actualizar un servicio existente.
DELETE /api/services/:sid permite eliminar un servicio.
*/