import { randomUUID } from "node:crypto";
import {
  persistenciaActiva,
  cargarDatosGuardados,
  guardarExcedente,
  guardarTransaccion,
} from "./persistencia.js";

// "Base de datos" en memoria. Si hay MONGODB_URI configurada (ver
// persistencia.js), al arrancar se llena con lo que ya estaba guardado en
// MongoDB Atlas en vez de con datos de ejemplo, y cada nueva escritura se
// refleja tambien alla. Sin esa variable, sigue igual que el MVP original:
// datos de demostracion que se reinician con el servidor.
export const excedentes = [];
export const transacciones = [];

function horasDesdeAhora(horas) {
  return new Date(Date.now() + horas * 60 * 60 * 1000).toISOString();
}

function diasDesdeAhora(dias) {
  return new Date(Date.now() + dias * 24 * 60 * 60 * 1000).toISOString();
}

// Protocolo de inspeccion: los 4 puntos que un comerciante debe confirmar
// antes de publicar (ver ComercianteView.jsx en el frontend). Se guardan
// junto al excedente para dejar trazabilidad de que se verificaron.
const PROTOCOLO_COMPLETO = {
  empaqueEnBuenEstado: true,
  sinSignosDescomposicion: true,
  temperaturaAdecuada: true,
  pesoVerificado: true,
};

function construirSemilla() {
  const base = [
    {
      comerciante: "Don Alfonso - Bodega 12",
      tipoAlimento: "Tomate chonto",
      descripcion: "Cosecha con exceso de madurez, apto para consumo inmediato.",
      cantidadKg: 180,
      estadoProducto: "Por vencer",
      precio: 90000,
      modalidad: "venta",
      ubicacion: "Corabastos - Bodega 12",
      vidaUtilHoras: 4,
    },
    {
      comerciante: "Distribuidora La Huerta",
      tipoAlimento: "Platano hartón",
      descripcion: "Excedente de despacho no reclamado, buen estado.",
      cantidadKg: 320,
      estadoProducto: "Bueno",
      precio: 210000,
      modalidad: "venta",
      ubicacion: "Corabastos - Bodega 27",
      vidaUtilHoras: 30,
    },
    {
      comerciante: "Comercializadora El Surco",
      tipoAlimento: "Cebolla cabezona",
      descripcion: "Sobrestock de fin de semana, empaques abiertos.",
      cantidadKg: 250,
      estadoProducto: "Bueno",
      precio: 0,
      modalidad: "donacion",
      ubicacion: "Corabastos - Bodega 8",
      vidaUtilHoras: 48,
    },
    {
      comerciante: "Frutas del Llano",
      tipoAlimento: "Mango Tommy",
      descripcion: "Golpes leves de transporte, sabor y textura intactos.",
      cantidadKg: 140,
      estadoProducto: "Por vencer",
      precio: 60000,
      modalidad: "venta",
      ubicacion: "Corabastos - Bodega 15",
      vidaUtilHoras: 2,
    },
    {
      comerciante: "Bodega Santa Helena",
      tipoAlimento: "Papa criolla",
      descripcion: "Excedente de clasificacion, tamaño irregular.",
      cantidadKg: 400,
      estadoProducto: "Bueno",
      precio: 300000,
      modalidad: "venta",
      ubicacion: "Corabastos - Bodega 33",
      vidaUtilHoras: 60,
    },
    {
      comerciante: "Verduras San Isidro",
      tipoAlimento: "Zanahoria",
      descripcion: "Lote a punto de vencer bodega, ideal para comedores.",
      cantidadKg: 90,
      estadoProducto: "Por vencer",
      precio: 0,
      modalidad: "donacion",
      ubicacion: "Corabastos - Bodega 19",
      vidaUtilHoras: 8,
    },
    {
      comerciante: "Don Alfonso - Bodega 12",
      tipoAlimento: "Aguacate hass",
      descripcion: "Punto de maduracion avanzado, consumo en 24h.",
      cantidadKg: 75,
      estadoProducto: "Por vencer",
      precio: 95000,
      modalidad: "venta",
      ubicacion: "Corabastos - Bodega 12",
      vidaUtilHoras: 18,
    },
  ];

  const excedentesSemilla = base.map((item) => ({
    id: randomUUID(),
    ...item,
    protocolo: PROTOCOLO_COMPLETO,
    fechaPublicacion: new Date().toISOString(),
    fechaLimite: horasDesdeAhora(item.vidaUtilHoras),
    estadoTransaccion: "disponible",
  }));

  // Historial repartido en los ultimos 6 dias, para que el grafico de
  // evolucion de kg rescatados (North Star Metric en el tiempo) se vea con
  // una tendencia real en la demo, en vez de un solo punto.
  const yaTransados = [
    {
      diasAtras: -6,
      comerciante: "Distribuidora La Huerta",
      tipoAlimento: "Naranja Valencia",
      cantidadKg: 150,
      precio: 110000,
      modalidad: "venta",
      actorNombre: "Restaurante El Fogon",
      actorTipo: "comprador",
    },
    {
      diasAtras: -5,
      comerciante: "Comercializadora El Surco",
      tipoAlimento: "Repollo",
      cantidadKg: 60,
      precio: 0,
      modalidad: "donacion",
      actorNombre: "Comedor Comunitario San Jose",
      actorTipo: "organizacion",
    },
    {
      diasAtras: -4,
      comerciante: "Bodega Santa Helena",
      tipoAlimento: "Yuca",
      cantidadKg: 120,
      precio: 90000,
      modalidad: "venta",
      actorNombre: "Fruver La Esquina",
      actorTipo: "comprador",
    },
    {
      diasAtras: -3,
      comerciante: "Frutas del Llano",
      tipoAlimento: "Guayaba",
      cantidadKg: 80,
      precio: 55000,
      modalidad: "venta",
      actorNombre: "Restaurante La Sazon",
      actorTipo: "comprador",
    },
    {
      diasAtras: -2,
      comerciante: "Verduras San Isidro",
      tipoAlimento: "Espinaca",
      cantidadKg: 40,
      precio: 0,
      modalidad: "donacion",
      actorNombre: "Fundacion Manos Unidas",
      actorTipo: "organizacion",
    },
    {
      diasAtras: -1,
      comerciante: "Distribuidora La Huerta",
      tipoAlimento: "Pimenton",
      cantidadKg: 100,
      precio: 130000,
      modalidad: "venta",
      actorNombre: "Fruver La Esquina",
      actorTipo: "comprador",
    },
  ];

  const transaccionesSemilla = yaTransados.map((t) => {
    const excedente = {
      id: randomUUID(),
      comerciante: t.comerciante,
      tipoAlimento: t.tipoAlimento,
      descripcion: "Operacion ya completada (historial de demostracion).",
      cantidadKg: t.cantidadKg,
      estadoProducto: "Bueno",
      precio: t.precio,
      modalidad: t.modalidad,
      ubicacion: "Corabastos",
      protocolo: PROTOCOLO_COMPLETO,
      fechaPublicacion: diasDesdeAhora(t.diasAtras - 1),
      fechaLimite: diasDesdeAhora(t.diasAtras),
      estadoTransaccion: t.modalidad === "venta" ? "vendido" : "reclamado",
    };
    excedentesSemilla.push(excedente);

    const monto = t.modalidad === "venta" ? t.precio : 0;
    const comision = t.modalidad === "venta" ? Math.round(monto * 0.08) : 0;
    return {
      id: randomUUID(),
      excedenteId: excedente.id,
      tipoOperacion: t.modalidad === "venta" ? "compra" : "donacion",
      tipoAlimento: t.tipoAlimento,
      comerciante: t.comerciante,
      actorNombre: t.actorNombre,
      actorTipo: t.actorTipo,
      cantidadKg: t.cantidadKg,
      monto,
      comision,
      fecha: diasDesdeAhora(t.diasAtras),
    };
  });

  return { excedentesSemilla, transaccionesSemilla };
}

/**
 * Debe llamarse una vez al arrancar el servidor (antes de app.listen).
 * Si hay datos guardados en MongoDB los carga; si no, siembra datos de
 * demostracion (y los guarda en MongoDB si la persistencia esta activa,
 * para que la proxima vez ya encuentre datos reales en vez de sembrar de nuevo).
 */
export async function iniciarDatos() {
  if (persistenciaActiva) {
    const guardados = await cargarDatosGuardados();
    if (guardados && (guardados.excedentes.length > 0 || guardados.transacciones.length > 0)) {
      excedentes.push(...guardados.excedentes);
      transacciones.push(...guardados.transacciones);
      console.log(
        `Datos cargados desde MongoDB: ${excedentes.length} excedentes, ${transacciones.length} transacciones.`
      );
      return;
    }
  }

  const { excedentesSemilla, transaccionesSemilla } = construirSemilla();
  excedentes.push(...excedentesSemilla);
  transacciones.push(...transaccionesSemilla);

  if (persistenciaActiva) {
    await Promise.all(excedentesSemilla.map((e) => guardarExcedente(e)));
    await Promise.all(transaccionesSemilla.map((t) => guardarTransaccion(t)));
    console.log("Datos de demostracion sembrados y guardados en MongoDB por primera vez.");
  }
}
