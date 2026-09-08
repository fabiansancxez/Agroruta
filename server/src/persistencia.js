import mongoose from "mongoose";

/**
 * Capa de persistencia opcional. Si no hay MONGODB_URI configurada, todas
 * las funciones de este archivo no hacen nada y la app sigue funcionando
 * en memoria (como el MVP original). Si SI hay MONGODB_URI, cada cambio se
 * escribe tambien en MongoDB Atlas, para que los datos sobrevivan aunque
 * el servidor se reinicie o "despierte" de dormir en Render.
 */
export const persistenciaActiva = Boolean(process.env.MONGODB_URI);

// strict:false porque guardamos los mismos objetos planos que ya usa el
// resto de la app (identificados por su campo "id", no por el _id de Mongo).
const excedenteSchema = new mongoose.Schema({}, { strict: false, collection: "excedentes" });
const transaccionSchema = new mongoose.Schema({}, { strict: false, collection: "transacciones" });

const ExcedenteModel = mongoose.models.Excedente || mongoose.model("Excedente", excedenteSchema);
const TransaccionModel =
  mongoose.models.Transaccion || mongoose.model("Transaccion", transaccionSchema);

export async function conectarBD() {
  if (!persistenciaActiva) {
    console.log("MONGODB_URI no configurada: usando datos en memoria (no persisten).");
    return;
  }
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Conectado a MongoDB Atlas: los datos ahora persisten entre reinicios.");
}

export async function cargarDatosGuardados() {
  if (!persistenciaActiva) return null;
  const [excedentes, transacciones] = await Promise.all([
    ExcedenteModel.find({}, { _id: 0, __v: 0 }).lean(),
    TransaccionModel.find({}, { _id: 0, __v: 0 }).lean(),
  ]);
  return { excedentes, transacciones };
}

export async function guardarExcedente(excedente) {
  if (!persistenciaActiva) return;
  await ExcedenteModel.create(excedente);
}

export async function actualizarExcedente(id, cambios) {
  if (!persistenciaActiva) return;
  await ExcedenteModel.updateOne({ id }, { $set: cambios });
}

export async function guardarTransaccion(transaccion) {
  if (!persistenciaActiva) return;
  await TransaccionModel.create(transaccion);
}
