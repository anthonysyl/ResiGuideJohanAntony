const Conjunto = require('./models/Conjunto');
const Servicio = require('./models/Servicio');

const services = ['Agua', 'Gas', 'Luz'];

async function initServices() {
  const conjuntos = await Conjunto.findAll();

  for (let conjunto of conjuntos) {
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
  }
  console.log("Los servicios se han inicializado correctamente");
}

initServices();
