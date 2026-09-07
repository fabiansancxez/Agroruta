# Cómo publicar AgroRuta en la web (gratis, sin dominio propio)

No necesitas comprar un dominio. Vamos a usar **Render.com**, que da una URL
gratuita tipo `https://agroruta-app-xxxx.onrender.com` para compartir con tu
profesor y compañeros.

El código ya está listo para esto (variable `VITE_API_URL`, script `start`
en el backend). Estos pasos los haces tú en tu navegador, con tu propia
cuenta — nadie más que tú debe crear tus cuentas o iniciar tus sesiones.

## Paso 0: el código ya está en GitHub

(Si llegaste a esta guía después de subir el repo con ayuda de Claude, este
paso ya está hecho — salta al Paso 1.)

## Paso 1: crear cuenta en Render

1. Ve a https://render.com
2. Clic en **"Get Started"** → elige **"Sign up with GitHub"** (así conectas
   tu repo sin tener que copiar/pegar código a mano).
3. Autoriza a Render a acceder a tus repositorios de GitHub.

## Paso 2: desplegar el backend (la API)

1. En el dashboard de Render, clic en **"New +"** → **"Web Service"**.
2. Selecciona el repositorio `agroruta-mvp` (o el nombre que le hayas dado).
3. Completa así:
   - **Name**: `agroruta-api`
   - **Root Directory**: `server`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`
4. Clic en **"Create Web Service"** y espera a que termine el deploy
   (unos 2-3 minutos, verás los logs en pantalla).
5. Cuando termine, copia la URL que te asigna Render, arriba del panel.
   Se ve así: `https://agroruta-api-xxxx.onrender.com`
   **Guárdala, la necesitas en el siguiente paso.**
6. Verifícala abriéndola en el navegador agregando `/api/health` al final:
   `https://agroruta-api-xxxx.onrender.com/api/health` — debe responder un
   JSON con `"ok": true`.

## Paso 3: desplegar el frontend (la app que verán tus compañeros)

1. Otra vez **"New +"** → esta vez **"Static Site"**.
2. Selecciona el mismo repositorio.
3. Completa así:
   - **Name**: `agroruta-app`
   - **Root Directory**: `client`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
4. Antes de crear (sección **"Environment Variables"**, o después en
   **Environment** dentro del servicio ya creado), agrega:
   - **Key**: `VITE_API_URL`
   - **Value**: la URL del backend que copiaste en el paso 2 (sin `/api`
     al final, solo la raíz: `https://agroruta-api-xxxx.onrender.com`)
5. Clic en **"Create Static Site"** y espera el deploy.
6. Esa URL final (`https://agroruta-app-xxxx.onrender.com`) es la que
   compartes con tu profesor y compañeros — ábrela para confirmar que
   carga el marketplace con los excedentes de ejemplo.

## Importante: el plan gratuito "duerme"

El backend gratuito de Render se apaga tras ~15 minutos sin visitas. La
primera visita después de eso tarda 30-50 segundos en responder mientras
"despierta". **Recomendación:** abre tú el link de tu app unos 3-5 minutos
antes de tu sustentación o de que tus compañeros la vean, para que ya esté
despierta.

## Si cambias el código después

Cada vez que hagas `git push` a la rama principal, Render vuelve a
desplegar automáticamente ambos servicios (no tienes que repetir estos
pasos).
