
import express from "express";
import {ServiceManager} from "./managers/ServiceManager.js";

const serviceManager = new ServiceManager();

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

app.get('/api/services',async (req, res) => {
  const { category } = req.query; // permite queries simples en la URL, por ejemplo: /api/services?category=salud
  const allServices = await serviceManager.getServices();

  const payload = category
    ? allServices.filter((service) => service.category === category)
    : allServices;

  res.status(200).json({ status: 'success', payload });
});
  
app.get('/api/services/:sid', async (req, res) => {
  const service = await serviceManager.getServiceById(req.params.sid);

  if (!service) {
    return res
      .status(404)
      .json({ status: 'error', message: 'Servicio no encontrado' });
  }
  res.status(200).json({ status: 'success', payload: service });
});


app.post('/api/services', async (req, res) => {
  const { name, duration, price, category } = req.body;
  // Validación mínima: si falta algún campo obligatorio, no seguimos.
  // Esto se queda acá, en la ruta: el ServiceManager no valida nada, solo
  // persiste lo que le llega.
  if (!name || !duration || !price || !category) {
    // 400 Bad Request: la petición está mal formada (culpa del cliente)
    return res
      .status(400)
      .json({ status: 'error', message: 'Faltan campos obligatorios' });
  }
  const newService = await serviceManager.addService(req.body);
  // 201 Created: la petición creó un recurso nuevo. 
  res.status(201).json({ status: 'success', payload: newService });
});

app.put('/api/services/:sid', async (req, res) => { //reemplaza datos de un servicio
  const updatedService = await serviceManager.updateService(req.params.sid, req.body);

  if (!updatedService) {
    return res
      .status(404)
      .json({ status: 'error', message: 'Servicio no encontrado' });
  }

  res.status(200).json({ status: 'success', payload: updatedService });
});

app.delete('/api/services/:sid', async (req, res) => {
  const deletedService = await serviceManager.deleteService(req.params.sid);

  if (!deletedService) {
    return res
      .status(404)
      .json({ status: 'error', message: 'Servicio no encontrado' });
  }

  res.status(200).json({ status: 'success', payload: deletedService });
});

//DELETE
// app.delete('/api/services/:sid', (req, res) => {
//   const { sid } = req.params;
//   const serviceIndex = services.findIndex((service) => service.id === Number(sid));

//   if (serviceIndex === -1) {
//     return res.status(404).json({
//       status: 'error',
//       message: 'Servicio no encontrado'
//     });
//   }

//   const deletedService = services.splice(serviceIndex, 1);

//   res.status(200).json({
//     status: 'success',
//     payload: deletedService[0]
//   });
// });
export default app;

/*
Endpoints de la API:
GET /api/services permite listar todos los servicios.

GET /api/services/:sid permite obtener un servicio por id.

POST /api/services permite crear un nuevo servicio.

PUT /api/services/:sid permite actualizar un servicio existente.

DELETE /api/services/:sid permite eliminar un servicio.
*/