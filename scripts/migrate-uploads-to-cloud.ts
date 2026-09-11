import fs from 'fs';
import path from 'path';
import { connectDB } from '../src/lib/db';
import { Portafolio } from '../src/lib/models/Portafolio';
import { CloudinaryStorageProvider } from '../src/lib/storage/CloudinaryStorageProvider';

async function migrateUploadsToCloud() {
  console.log('🚀 Iniciando script de migracion de uploads a Cloudinary...');
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads');

  if (!fs.existsSync(uploadsDir)) {
    console.log('No existe directorio public/uploads, nada que migrar.');
    process.exit(0);
  }

  const cloudStorage = new CloudinaryStorageProvider();
  await connectDB();

  const portafolios = await Portafolio.find();
  console.log(`Encontrados ${portafolios.length} registros de portafolio para revisar.`);

  for (const item of portafolios) {
    let updated = false;

    if (item.fotoAntesUrl.startsWith('/uploads/')) {
      const fileName = path.basename(item.fotoAntesUrl);
      const filePath = path.join(uploadsDir, fileName);
      if (fs.existsSync(filePath)) {
        console.log(`Subiendo ${fileName} a Cloudinary...`);
        const buffer = fs.readFileSync(filePath);
        const cloudUrl = await cloudStorage.save(buffer, fileName);
        item.fotoAntesUrl = cloudUrl;
        updated = true;
      }
    }

    if (item.fotoDespuesUrl.startsWith('/uploads/')) {
      const fileName = path.basename(item.fotoDespuesUrl);
      const filePath = path.join(uploadsDir, fileName);
      if (fs.existsSync(filePath)) {
        console.log(`Subiendo ${fileName} a Cloudinary...`);
        const buffer = fs.readFileSync(filePath);
        const cloudUrl = await cloudStorage.save(buffer, fileName);
        item.fotoDespuesUrl = cloudUrl;
        updated = true;
      }
    }

    if (updated) {
      await item.save();
      console.log(`✅ Registro ${item._id} actualizado con URLs de nube.`);
    }
  }

  console.log('🎉 Migracion completada.');
  process.exit(0);
}

migrateUploadsToCloud().catch(err => {
  console.error('Error durante la migracion a la nube:', err);
  process.exit(1);
});
