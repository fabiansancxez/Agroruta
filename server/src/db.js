import { randomUUID } from "node:crypto";

// "Base de datos" en memoria para el MVP. Se reinicializa con datos de
// demostracion cada vez que se levanta el servidor (npm run dev),
// asi el demo siempre arranca en un estado presentable.

function horasDesdeAhora(horas) {
  return new Date(Date.now() + horas * 60 * 60 * 1000).toISOString();
}

export const excedentes = [];
export const transacciones = [];

function seedExcedentes() {
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

  base.forEach((item) => {
    excedentes.push({
      id: randomUUID(),
      ...item,
      fechaPublicacion: new Date().toISOString(),
      fechaLimite: horasDesdeAhora(item.vidaUtilHoras),
      estadoTransaccion: "disponible",
    });
  });

  // Historial de ejemplo para que el dashboard de metricas no arranque en
  // cero durante la demo.
  const yaTransados = [
    {
      comerciante: "Distribuidora La Huerta",
      tipoAlimento: "Naranja Valencia",
      cantidadKg: 200,
      precio: 150000,
      modalidad: "venta",
      actorNombre: "Restaurante El Fogon",
      actorTipo: "comprador",
    },
    {
      comerciante: "Comercializadora El Surco",
      tipoAlimento: "Repollo",
      cantidadKg: 60,
      precio: 0,
      modalidad: "donacion",
      actorNombre: "Comedor Comunitario San Jose",
      actorTipo: "organizacion",
    },
    {
      comerciante: "Bodega Santa Helena",
      tipoAlimento: "Yuca",
      cantidadKg: 150,
      precio: 110000,
      modalidad: "venta",
      actorNombre: "Fruver La Esquina",
      actorTipo: "comprador",
    },
  ];

  yaTransados.forEach((t) => {
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
      fechaPublicacion: horasDesdeAhora(-30),
      fechaLimite: horasDesdeAhora(-6),
      estadoTransaccion: t.modalidad === "venta" ? "vendido" : "reclamado",
    };
    excedentes.push(excedente);

    const monto = t.modalidad === "venta" ? t.precio : 0;
    const comision = t.modalidad === "venta" ? Math.round(monto * 0.08) : 0;
    transacciones.push({
      id: randomUUID(),
      excedenteId: excedente.id,
      tipoOperacion: t.modalidad === "venta" ? "compra" : "donacion",
      actorNombre: t.actorNombre,
      actorTipo: t.actorTipo,
      cantidadKg: t.cantidadKg,
      monto,
      comision,
      fecha: horasDesdeAhora(-24),
    });
  });
}

seedExcedentes();
