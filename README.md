# Starfactory Front

Aplicacion frontend del CRM de **Star Factory Sevilla**. Permite gestionar clientes, etiquetas, productos, tarifas, cuotas, suscripciones, facturacion y contabilidad desde una interfaz web.

## Stack tecnologico

| Tecnologia | Version | Uso |
|---|---|---|
| React | 19 | Libreria de UI |
| Vite | 6 | Bundler y servidor de desarrollo |
| Redux Toolkit | 2.7 | Gestion de estado global |
| React Router DOM | 7.5 | Enrutamiento SPA |
| Axios | 1.9 | Peticiones HTTP al backend |
| Bootstrap | 5.3 | Framework CSS |
| Bootstrap Icons | 1.13 | Iconografia |
| Chart.js + react-chartjs-2 | 4.5 / 5.3 | Graficos y visualizaciones |
| SweetAlert2 | 11.23 | Dialogos de confirmacion y alertas |
| React Modal | 3.16 | Modales |
| jsPDF + jspdf-autotable | 4.0 / 5.0 | Generacion de facturas PDF |
| pdfmake | 0.2 | Generacion de tickets PDF |
| date-fns | 3.6 | Utilidades de fechas |
| Vitest | 4.0 | Framework de testing |
| Testing Library (React) | 16.3 | Testing de componentes |
| jsdom | 28.1 | Entorno DOM para tests |
| ESLint | 9.22 | Linter de codigo |

## Estructura del proyecto

```
src/
  main.jsx                    # Punto de entrada de la aplicacion
  StarFactoryApp.jsx          # Componente raiz (Provider + BrowserRouter)
  api/
    clientsApi.js             # Instancia de Axios con interceptores JWT
  router/
    AppRoutes.jsx             # Configuracion de rutas (lazy loading)
  store/
    store.js                  # Configuracion del store de Redux
    auth/
      authSlice.js            # Estado de autenticacion y usuarios
    clients/
      clientSlice.js          # Estado de clientes
    ui/
      uiSlice.js              # Estado de modales (apertura/cierre)
    label/
      labelSlice.js           # Estado de etiquetas
    storeFactory/
      categorySlice.js        # Estado de categorias de productos
      productSlice.js         # Estado de productos
    rates/
      rateSlice.js            # Estado de tarifas
      quotaSlice.js           # Estado de cuotas
    sales/
      productClientSlice.js   # Estado de ventas (producto-cliente)
      suscriptionClientSlice.js # Estado de suscripciones
  hooks/
    useAuthStore.js           # Operaciones de autenticacion
    useClientsStore.js        # CRUD de clientes
    useLabelsStore.js         # CRUD de etiquetas
    useProductStore.js        # CRUD de productos
    useRateStore.js           # CRUD de tarifas
    useQuotaStore.js          # CRUD de cuotas
    useCategoryStore.js       # CRUD de categorias
    useProductClientStore.js  # Operaciones de ventas
    useSuscriptionClientStore.js # Operaciones de suscripciones
    useUiStore.js             # Control de modales
    useForm.js                # Hook generico de formularios
    useFilterLabels.js        # Filtrado de etiquetas por cliente
    DateLabel.jsx             # Componente de fecha con etiqueta
    ticketGenerator.js        # Generacion de tickets de venta
  helpers/
    capitalizeFirstWord.js    # Capitalizar primera letra
    customStyleModal.js       # Estilos reutilizables para modales
    DateNavigator.jsx         # Componente de navegacion por fecha
    exportBillPdf.js          # Exportar factura a PDF
    exportSumaryPdf.js        # Exportar resumen mensual a PDF
    formatDate.js             # Formato de fechas
    getClientStatus.js        # Determinar estado del cliente (activo/inactivo)
    getEnvVariables.js        # Variables de entorno
    getNextPurchaseDate.js    # Calcular proxima fecha de compra
    gmailSendPdf.js           # Envio de tickets por Gmail API
    isColorDark.js            # Determinar si un color es oscuro
    IVAProduct.js             # Calculo de IVA
    loadingImagePdf.js        # Imagen base64 para PDFs
    normalizeText.js          # Normalizacion de texto (sin acentos)
    TicketPDF.js              # Construccion de tickets con pdfmake
    toLocalISO.js             # Fecha local en formato ISO
  auth/
    pages/
      LoginPage.jsx           # Pagina de inicio de sesion
      RegisterPage.jsx        # Pagina de registro
      ProfileUserPage.jsx     # Pagina de perfil de usuario
    components/
      PasswordModal.jsx       # Modal de cambio de contrasena
      ResendPassword.jsx      # Reenvio de contrasena
      UserDelete.jsx          # Eliminacion de usuario
      UserEdit.jsx            # Edicion de usuario
      UserEditModal.jsx       # Modal de edicion de usuario
  clients/
    pages/
      ClientsPage.jsx         # Listado de clientes
      ClientPage.jsx          # Detalle de un cliente
      StorePage.jsx           # Gestion de tienda (categorias y productos)
      RatesPage.jsx           # Gestion de tarifas y cuotas
      LabelsPage.jsx          # Gestion de etiquetas
      Accounting.jsx          # Contabilidad diaria
      MonthlySummary.jsx      # Resumen mensual
    components/
      ClientItem.jsx          # Fila de cliente en el listado
      Navbar.jsx              # Barra de navegacion superior
      Sidebar.jsx             # Menu lateral
      FindClient.jsx          # Buscador de clientes
      ClientAddNew.jsx        # Boton para crear cliente
      ClientModal.jsx         # Modal de creacion/edicion de cliente
      ClientEdit.jsx          # Boton de edicion de cliente
      ClientBill.jsx          # Boton de facturacion
      ClientModalBill.jsx     # Modal de facturacion
      label/                  # Componentes de etiquetas
      storePage/              # CRUD de categorias y productos
      ratePage/               # CRUD de tarifas y cuotas
      clientPage/             # Componentes del detalle de cliente
        cancellation/         # Bajas programadas
        productSusciption/    # Suscripciones del cliente
      accounting/             # Subcomponentes de contabilidad
      sales/                  # Componentes de ventas y tickets
  tests/                      # Tests unitarios y de integracion
```

## Funcionalidades principales

- **Gestion de clientes**: Crear, editar, eliminar y buscar clientes. Visualizar perfil con etiquetas, suscripciones y ventas.
- **Etiquetas**: Crear, editar y eliminar etiquetas de colores. Asignar etiquetas a clientes para organizarlos. Filtrar clientes por etiqueta.
- **Tienda**: Gestionar categorias y productos con nombre, descripcion y precio.
- **Tarifas y cuotas**: Definir tarifas con cuotas (puntual o mensual), numero de dias y precio.
- **Ventas**: Registrar ventas de productos a clientes, generar tickets PDF, enviar tickets por email via Gmail API.
- **Suscripciones**: Compras automaticas recurrentes con precio, descuento, metodo de pago y fecha de proxima compra.
- **Facturacion**: Generar facturas en PDF con desglose de IVA.
- **Contabilidad**: Caja diaria, facturacion diaria, resumen mensual y pendientes del mes.
- **Bajas programadas**: Programar la cancelacion futura de clientes.
- **Graficos**: Visualizaciones con Chart.js en el resumen mensual.
- **Autenticacion**: Login, registro, edicion de perfil, cambio de contrasena, eliminacion de cuenta.

## Gestion de estado

La aplicacion utiliza Redux Toolkit con 10 slices:

| Slice | Descripcion |
|---|---|
| `authSlice` | Autenticacion, datos de usuario, listado de usuarios |
| `clientSlice` | Listado de clientes, cliente activo, paginacion, filtros, bajas programadas |
| `uiSlice` | Estado de apertura/cierre de todos los modales de la aplicacion |
| `labelSlice` | Listado de etiquetas, etiqueta activa, filtro de busqueda |
| `categorySlice` | Categorias de productos, categoria activa |
| `productSlice` | Productos, producto activo |
| `rateSlice` | Tarifas, tarifa activa |
| `quotaSlice` | Cuotas de tarifas, cuota activa |
| `productClientSlice` | Ventas (producto-cliente), venta activa, paginacion |
| `suscriptionClientSlice` | Suscripciones de clientes, suscripcion activa |

Cada slice tiene un custom hook asociado (ej. `useAuthStore`, `useClientsStore`) que encapsula las llamadas a la API y los dispatches de Redux.

## Variables de entorno

Crear un archivo `.env` en la **raiz del proyecto** (no en `src/`). Hay una plantilla en `.env.example`:

```bash
cp .env.example .env
```

| Variable | Descripcion | Ejemplo |
|---|---|---|
| `VITE_API_URL1` | URL del backend en desarrollo (local) | `http://localhost:4001` |
| `VITE_API_URL2` | URL del backend en produccion | `https://www.tudominio.com/api` |
| `VITE_GOOGLE_CLIENT_ID` | Client ID de Google para Gmail API | `123456.apps.googleusercontent.com` |

Vite inyecta automaticamente las variables `VITE_*` en el bundle durante el build. Se acceden via `import.meta.env.VITE_*` o a traves del helper `getEnvVariables()`.

> **Importante:** El `.env` esta en `.gitignore` y NO se sube al repositorio. Cada entorno (local, servidor) debe tener su propio `.env`.

---

## Instalacion y ejecucion

### Requisitos previos

- Node.js v20 o superior
- npm
- Backend corriendo (ver README del backend)

---

### Entorno local (desarrollo)

1. **Clonar el repositorio e instalar dependencias:**

```bash
git clone <url-del-repo>
cd Starfactory-front
npm install
```

2. **Crear el archivo `.env`** a partir de la plantilla:

```bash
cp .env.example .env
```

Editar `.env` y configurar `VITE_API_URL1` apuntando al backend local:

```env
VITE_API_URL1=http://localhost:4001
VITE_API_URL2=https://www.tudominio.com/api
VITE_GOOGLE_CLIENT_ID=tu-google-client-id
```

3. **Arrancar el servidor de desarrollo:**

```bash
npm run dev
```

Vite arranca en `http://localhost:5173` con hot reload.

4. **Verificar** que la app carga y conecta con el backend (login funcional).

---

### Servidor (produccion)

El frontend se compila a archivos estaticos y se sirve con **Nginx** desde la ruta `/opt/starFactory/front/Starfactory-front/`.

#### Build de produccion

```bash
npm run build
```

Genera la carpeta `dist/` con los archivos optimizados (HTML, JS, CSS). Las variables `VITE_*` se inyectan en el bundle en tiempo de build.

> **Importante:** En el servidor, el `.env` debe tener `VITE_API_URL1` apuntando a la URL de produccion del backend **antes** de ejecutar el build.

```env
VITE_API_URL1=https://www.starfactorysevillaadmin.com/api
VITE_API_URL2=https://www.starfactorysevillaadmin.com/api
VITE_GOOGLE_CLIENT_ID=tu-google-client-id
```

#### Deploy manual

Conectarse al servidor por SSH y ejecutar:

```bash
cd /opt/starFactory/front/Starfactory-front
bash deploy.sh
```

El script `deploy.sh` realiza:

1. `git fetch && git pull` — descarga los ultimos cambios
2. `npm install` — instala dependencias nuevas
3. `npm run build` — compila el frontend a `dist/`
4. `sudo systemctl reload nginx` — recarga Nginx para servir los nuevos archivos

#### Deploy completo (front + back)

Para desplegar ambos proyectos a la vez desde el backend:

```bash
bash /opt/starFactory/back/Starfactory-back/deploy-all.sh
```

#### Configuracion de Nginx

Nginx debe servir la carpeta `dist/` y redirigir todas las rutas a `index.html` para que funcione el enrutamiento SPA de React Router:

```nginx
server {
    listen 80;
    server_name tudominio.com;
    root /opt/starFactory/front/Starfactory-front/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://localhost:4001/;
    }
}
```

#### Previsualizar el build localmente

Para comprobar el build antes de subir al servidor:

```bash
npm run preview
```

Sirve `dist/` en un servidor local de Vite.

---

### Scripts disponibles

| Comando              | Descripcion                                      |
|----------------------|--------------------------------------------------|
| `npm run dev`        | Servidor de desarrollo con hot reload (Vite)     |
| `npm run build`      | Compilar para produccion (genera `dist/`)        |
| `npm run preview`    | Previsualizar el build de produccion             |
| `npm run lint`       | Ejecutar ESLint                                  |
| `npm test`           | Ejecutar tests con Vitest                        |
| `npm run test:watch` | Ejecutar tests en modo watch                     |

---

## Testing

La aplicacion utiliza **Vitest** como framework de testing junto con **Testing Library** para tests de componentes React y **jsdom** como entorno DOM simulado.

```bash
# Ejecutar tests una vez
npm test

# Ejecutar tests en modo watch
npm run test:watch
```

## Linting

```bash
npm run lint
```
