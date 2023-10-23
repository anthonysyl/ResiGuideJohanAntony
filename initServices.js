const Conjunto = require('./models/Conjunto');
const Servicio = require('./models/Servicio');

const services = ['Agua', 'Gas', 'Luz'];

async function initServices(conjuntoId) {
  const conjunto = await Conjunto.findByPk(conjuntoId);

  if (!conjunto) {
    console.log("Conjunto no encontrado");
    return;
  }

  for (let service of services) {
    // Buscar si el servicio ya existe para este conjunto
    const existingService = await Servicio.findOne({ 
      where: { 
        nombre: service,
        conjunto_id: conjunto.id 
      } 
    });

    // Si el servicio no existe, entonces lo creamos
    if (!existingService) {
      await Servicio.create({ 
        nombre: service, 
        estado: 'Activo', 
        conjunto_id: conjunto.id
      });
    }
  }

  console.log("Los servicios para el conjunto", conjuntoId, "se han inicializado correctamente");
}

module.exports = initServices;
