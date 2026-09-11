import mongoose, { Schema, Document, Model } from 'mongoose';

export type TipoServicio = 'Corte' | 'Tinte' | 'Keratina' | 'Peinado' | 'Otros';

export interface IPortafolio extends Document {
  tipoServicio: TipoServicio;
  descripcion?: string;
  fotoAntesUrl: string;
  fotoDespuesUrl: string;
  fechaCreacion: Date;
}

const PortafolioSchema = new Schema<IPortafolio>({
  tipoServicio: {
    type: String,
    required: true,
    enum: ['Corte', 'Tinte', 'Keratina', 'Peinado', 'Otros']
  },
  descripcion: { type: String, trim: true },
  fotoAntesUrl: { type: String, required: true },
  fotoDespuesUrl: { type: String, required: true },
  fechaCreacion: { type: Date, default: Date.now }
});

export const Portafolio: Model<IPortafolio> =
  mongoose.models.Portafolio || mongoose.model<IPortafolio>('Portafolio', PortafolioSchema);

export default Portafolio;
