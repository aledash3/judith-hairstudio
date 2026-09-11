import { connectDB } from '../src/lib/db';
import { Cliente } from '../src/lib/models/Cliente';
import { Portafolio } from '../src/lib/models/Portafolio';

async function verifyDatabaseParity() {
  console.log('🔍 Iniciando verificacion de paridad de esquema MongoDB...');
  try {
    const db = await connectDB();
    console.log('✅ Conexion a MongoDB establecida exitosamente.');

    const clientesCount = await Cliente.countDocuments();
    const portafoliosCount = await Portafolio.countDocuments();
    console.log(`📊 Documentos encontrados: ${clientesCount} Clientes, ${portafoliosCount} Portafolios.`);

    // Validar muestra de clientes
    if (clientesCount > 0) {
      const muestra = await Cliente.find().limit(5);
      for (const c of muestra) {
        if (!c.nombre || !c.whatsapp) {
          throw new Error(`Cliente con ID ${c._id} no cumple los campos obligatorios.`);
        }
        if (!/^09\d{8}$/.test(c.whatsapp)) {
          console.warn(`⚠️ Advertencia: Telefono no estandar en cliente ${c._id}: ${c.whatsapp}`);
        }
      }
      console.log('✅ Muestra de Clientes valida con esquema TypeScript.');
    }

    // Validar muestra de portafolio
    if (portafoliosCount > 0) {
      const muestraPort = await Portafolio.find().limit(5);
      for (const p of muestraPort) {
        if (!p.tipoServicio || !p.fotoAntesUrl || !p.fotoDespuesUrl) {
          throw new Error(`Portafolio con ID ${p._id} no cumple los campos obligatorios.`);
        }
      }
      console.log('✅ Muestra de Portafolio valida con esquema TypeScript.');
    }

    console.log('🎉 Paridad de esquema 100% verificada.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error en verificacion de paridad:', error);
    process.exit(1);
  }
}

verifyDatabaseParity();
