import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IVisita {
  _id?: mongoose.Types.ObjectId;
  fecha: Date;
  servicio: string;
  monto: number;
}

export interface ICliente extends Document {
  nombre: string;
  whatsapp: string;
  historialVisitas: IVisita[];
  totalVisitas: number;
  fechaRegistro: Date;
}

const VisitaSchema = new Schema<IVisita>({
  fecha: { type: Date, default: Date.now },
  servicio: { type: String, required: true, trim: true, minlength: 3, maxlength: 120 },
  monto: { type: Number, required: true, min: 0, max: 100000 }
});

const ClienteSchema = new Schema<ICliente>({
  nombre: { type: String, required: true, trim: true, minlength: 3, maxlength: 120 },
  whatsapp: {
    type: String,
    required: true,
    trim: true,
    match: /^09\d{8}$/
  },
  historialVisitas: [VisitaSchema],
  totalVisitas: { type: Number, default: 0 },
  fechaRegistro: { type: Date, default: Date.now }
});

ClienteSchema.index({ nombre: 1, whatsapp: 1 });

export const Cliente: Model<ICliente> =
  mongoose.models.Cliente || mongoose.model<ICliente>('Cliente', ClienteSchema);

export default Cliente;
