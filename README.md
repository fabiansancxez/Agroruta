# AgroRuta - MVP

Prototipo funcional de **AgroRuta**: plataforma que conecta comerciantes de
Corabastos con excedentes de alimentos perecederos, frente a compradores
comerciales (restaurantes, fruvers) y organizaciones sociales que pueden
aprovecharlos por compra o donación.

Este MVP implementa el diferenciador que pidió el docente: no solo conecta
oferta y demanda, sino que **registra el tipo de alimento, sus condiciones y
estima su vida útil restante**, priorizando automáticamente qué excedentes
deben rescatarse primero (protocolo de clasificación / semaforización).

## Stack

- **Backend**: Node.js + Express (API REST, datos en memoria con seed de demo)
- **Frontend**: React + Vite

No requiere base de datos externa ni variables de entorno: todo corre en
local con datos de ejemplo que se regeneran cada vez que reinicias el
servidor.

## Cómo correrlo

Necesitas Node.js instalado (ya lo tienes: v24).

```bash
npm run install:all
```

Esto instala las dependencias del backend (`server/`) y del frontend
(`client/`). Luego, para levantar ambos al tiempo:

```bash
npm run dev
```

- Backend (API): http://localhost:4000
- Frontend (app): http://localhost:5173  ← esta es la que abres en el navegador

Para abrir el proyecto en VS Code:

```bash
code "C:\Users\HP VICTUS\Documents\AgroRuta-MVP"
```

## Publicarlo en la web

Ver [DEPLOY.md](DEPLOY.md) para la guía paso a paso (gratis, sin dominio
propio, usando Render.com).

## Estructura

```
AgroRuta-MVP/
├── server/                  API Express
│   └── src/
│       ├── index.js         arranque del servidor y montaje de rutas
│       ├── db.js            "base de datos" en memoria + datos semilla
│       ├── lib/vidaUtil.js  protocolo de clasificación por vida útil (semáforo)
│       └── routes/
│           ├── excedentes.js      publicar y listar excedentes
│           ├── transacciones.js   registrar compra / donación
│           └── metricas.js        dashboard e indicadores (North Star)
└── client/                  App React (Vite)
    └── src/
        ├── App.jsx                navegación entre las 3 vistas
        └── components/
            ├── ComercianteView.jsx    formulario para publicar excedentes
            ├── MarketplaceView.jsx    catálogo priorizado + compra/donación
            ├── MetricasView.jsx       North Star Metric y KPIs de impacto
            └── ExcedenteCard.jsx      tarjeta con semáforo de urgencia
```

## Cómo funciona el protocolo de vida útil (el diferenciador)

Cuando un comerciante publica un excedente, indica cuántas **horas** de vida
útil le quedan. El backend calcula en todo momento (`lib/vidaUtil.js`) el
tiempo restante y clasifica el producto en 4 niveles:

| Nivel | Umbral | Semáforo |
|---|---|---|
| Fresco | más de 24h restantes | 🟢 Verde |
| Pronto a vencer | entre 6h y 24h | 🟡 Amarillo |
| Urgente | 6h o menos | 🔴 Rojo |
| Vencido | 0h o menos | ⚪ Gris (sale del marketplace, cuenta como pérdida) |

El marketplace (`GET /api/excedentes`) siempre devuelve los excedentes
**ordenados por menor tiempo restante primero** — así se prioriza
automáticamente qué debe rescatarse ya, sin que el comprador tenga que
adivinarlo.

## North Star Metric

Tal como se definió en el plan de negocio: **kilogramos de alimentos
rescatados por semana**. El dashboard de Métricas la muestra en grande,
junto con la tasa de rescate, kg perdidos por vencimiento, número de
compras/donaciones e ingresos por comisión (8% sobre ventas, tal como en el
modelo de negocio).

## Guion sugerido para la sustentación (≈4 minutos)

1. **Problema** (20s): en Corabastos se pierden excedentes perecederos por
   falta de rotación oportuna, mientras restaurantes y comedores sociales
   necesitan alimento accesible.
2. **Vista Comerciante** (60s): publica un excedente en vivo (ej. "Tomate
   chonto", 180 kg, 4 horas de vida útil) y muestra cómo aparece clasificado
   automáticamente como 🔴 Urgente.
3. **Vista Marketplace** (60s): muestra el catálogo ya ordenado por urgencia,
   filtra "solo donación", y completa una compra y una donación en vivo —
   así se ve el flujo comerciante → comprador/organización → registro de
   la operación.
4. **Vista Métricas** (60s): abre el dashboard y señala el North Star Metric
   (kg rescatados), la tasa de rescate y los ingresos por comisión —
   conecta esto con el modelo de ingresos del plan de negocio.
5. **Cierre** (20s): este es un MVP de validación; el siguiente paso es
   sumar geolocalización, pasarela de pago (Wompi/PayU) y notificaciones
   automáticas por WhatsApp Business.

## Próximos pasos (fuera del alcance de este MVP)

- Autenticación real de usuarios por rol (comerciante / comprador / organización)
- Persistencia en base de datos (hoy los datos se reinician al reiniciar el servidor)
- Carga de fotos reales del producto
- Integración de pasarela de pago
- Notificaciones automáticas cuando un excedente pasa a "urgente"
