# Sistema Corredor de Propiedades - Starter (Google Apps Script + VSCode)

Starter base para construir un sistema de gestión de propiedades usando:

- Google Apps Script Web App
- Google Sheets como datastore operativo
- Google Drive para carpetas y archivos
- Google Calendar para recordatorios
- VSCode + clasp para desarrollo local

## Qué incluye este starter

- Estructura lista para usar en VSCode
- Web app con HTML Service
- Configuración por `Script Properties`
- Servicio para leer/escribir en Google Sheets
- Creación de propiedades
- Creación automática de carpeta raíz y subcarpetas en Drive
- Búsqueda básica de propiedades
- UI base con foco en uso prolongado

## Requisitos

- Node.js 20+
- npm
- Cuenta Google con acceso a Apps Script, Sheets, Drive y Calendar
- Un Spreadsheet ya creado con las hojas necesarias
- Una carpeta raíz en Google Drive donde vivirán las propiedades
- `clasp` para trabajar localmente

## Estructura

```txt
real-estate-gas-starter/
├── .clasp.example.json
├── .gitignore
├── appsscript.json
├── package.json
├── .vscode/
│   └── settings.json
└── src/
    ├── Code.gs
    ├── Config.gs
    ├── Utils.gs
    ├── Auth.gs
    ├── SheetService.gs
    ├── DriveService.gs
    ├── PropertyService.gs
    ├── SearchService.gs
    ├── CalendarService.gs
    ├── index.html
    ├── styles.html
    └── scripts.html
```

## Paso 1: instalar dependencias

```bash
npm install
```

## Paso 2: instalar / usar clasp

Si no lo tienes instalado globalmente:

```bash
npm install -g @google/clasp
```

## Paso 3: autenticación

```bash
clasp login
```

## Paso 4: crear o enlazar proyecto Apps Script

### Opción A: crear proyecto nuevo

```bash
clasp create --type standalone --title "Corredor Propiedades MVP"
```

Luego ajusta `.clasp.json` usando como base `.clasp.example.json`.

### Opción B: clonar un proyecto existente

```bash
clasp clone <SCRIPT_ID>
```

## Paso 5: configurar Script Properties

Antes de usar la app, en el editor de Apps Script o mediante una función temporal, configura estas propiedades:

- `SPREADSHEET_ID`
- `ROOT_FOLDER_ID`
- `CALENDAR_ID`
- `ALLOWED_EMAILS`
- `APP_TITLE`
- `TIMEZONE`

Ejemplo:

```txt
SPREADSHEET_ID=tu_google_sheet_id
ROOT_FOLDER_ID=tu_carpeta_raiz_drive_id
CALENDAR_ID=primary
ALLOWED_EMAILS=correo1@dominio.com,correo2@dominio.com
APP_TITLE=Corredor de Propiedades
TIMEZONE=America/Santiago
```

## Paso 6: verificar nombres de hojas

Este starter usa por defecto las siguientes hojas:

- `propiedades`
- `propietarios`
- `arrendatarios`
- `contratos`
- `cobros`
- `tareas`
- `archivos`
- `audit_log`
- `catalogos`

Si tus nombres cambian, ajusta `Config.gs`.

## Paso 7: publicar cambios

```bash
npm run push
```

## Paso 8: abrir editor Apps Script

```bash
npm run open
```

## Paso 9: desplegar web app

Desde el editor de Apps Script:

1. Deploy
2. New deployment
3. Tipo: Web app
4. Ejecutar como: tú
5. Acceso: usuarios autorizados de tu organización o quienes definas

## Flujo funcional inicial

### Crear propiedad

La UI actual permite:

- ingresar nombre de propiedad
- dirección
- comuna
- tipo de propiedad
- estado
- propietario
- canon mensual
- observaciones

Al guardar:

- crea un `property_id`
- inserta fila en `propiedades`
- crea carpeta raíz de la propiedad
- crea subcarpetas:
  - `01_Documentos_Propiedad`
  - `02_Documentos_Arrendatario`
  - `03_Fotos_Propiedad`
  - `04_Contratos`
  - `05_Comprobantes_y_Pagos`
- guarda links y folder IDs en la hoja

## Próximos pasos recomendados

1. Conectar carga real de archivos desde la UI
2. Ficha detalle de propiedad
3. Contratos y generación automática de cobros mensuales
4. Recordatorios en Calendar
5. Dashboard operativo
6. Auditoría completa
7. Control por roles

## Notas de diseño

- Este starter mantiene la lógica del lado servidor en `.gs`
- La UI usa HTML Service y `google.script.run`
- La data queda en Sheets, pero la estructura ya está pensada para futura migración a DB

## Comandos útiles

```bash
npm run login
npm run push
npm run pull
npm run open
npm run deploy
```

## Sugerencia de git

No subas `.clasp.json` real si contiene identificadores del proyecto que no quieras compartir. Usa `.clasp.example.json` como plantilla.
# corredor_propiedades
