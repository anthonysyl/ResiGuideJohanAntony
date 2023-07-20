const Servicio = require('../models/Servicio');

// Obtener todos los servicios
const getServicios = async (req, res) => {
  try {
    const servicios = await Servicio.findAll();
    res.json(servicios);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al obtener los servicios.' });
  }
};

// Obtener un servicio específico
const getServicio = async (req, res) => {
  const { id } = req.params;
  try {
    const servicio = await Servicio.findOne({ where: { id } });
    if (!servicio) {
      return res.status(404).json({ message: 'No se encontró el servicio.' });
    }
    res.json(servicio);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al obtener el servicio.' });
  }
};

// Crear un nuevo servicio
const createServicio = async (req, res) => {
  const { nombre, estado, conjunto_id } = req.body;
  try {
    const nuevoServicio = await Servicio.create({ nombre, estado, conjunto_id });
    res.status(201).json(nuevoServicio);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al crear el servicio.' });
  }
};

// Actualizar un servicio
const updateServicio = async (req, res) => {
  const { id } = req.params;
  const { nombre, estado } = req.body;
  try {
    const servicio = await Servicio.findOne({ where: { id } });
    if (!servicio) {
      return res.status(404).json({ message: 'No se encontró el servicio.' });
    }

    servicio.nombre = nombre;
    servicio.estado = estado;
    await servicio.save();

    res.json(servicio);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al actualizar el servicio.' });
  }
};

module.exports = {
  getServicios,
  getServicio,
  createServicio,
  updateServicio
};
