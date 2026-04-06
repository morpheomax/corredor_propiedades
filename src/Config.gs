const CONFIG = Object.freeze({
  SHEETS: {
    PROPERTIES: 'propiedades',
    OWNERS: 'propietarios',
    TENANTS: 'arrendatarios',
    CONTRACTS: 'contratos',
    CHARGES: 'cobros',
    TASKS: 'tareas',
    FILES: 'archivos',
    AUDIT: 'audit_log',
    CATALOGS: 'catalogos'
  },
  PROPERTY_SUBFOLDERS: [
    '01_Documentos_Propiedad',
    '02_Documentos_Arrendatario',
    '03_Fotos_Propiedad',
    '04_Contratos',
    '05_Comprobantes_y_Pagos'
  ],
  DEFAULTS: {
    APP_TITLE: 'Corredor de Propiedades',
    TIMEZONE: 'America/Santiago'
  }
});

function getScriptConfig() {
  const props = PropertiesService.getScriptProperties();
  return {
    spreadsheetId: props.getProperty('SPREADSHEET_ID') || '',
    rootFolderId: props.getProperty('ROOT_FOLDER_ID') || '',
    calendarId: props.getProperty('CALENDAR_ID') || 'primary',
    allowedEmails: (props.getProperty('ALLOWED_EMAILS') || '')
      .split(',')
      .map((v) => v.trim().toLowerCase())
      .filter(Boolean),
    appTitle: props.getProperty('APP_TITLE') || CONFIG.DEFAULTS.APP_TITLE,
    timezone: props.getProperty('TIMEZONE') || CONFIG.DEFAULTS.TIMEZONE
  };
}

function validateRequiredConfig() {
  const cfg = getScriptConfig();
  const missing = [];

  if (!cfg.spreadsheetId) missing.push('SPREADSHEET_ID');
  if (!cfg.rootFolderId) missing.push('ROOT_FOLDER_ID');
  if (!cfg.calendarId) missing.push('CALENDAR_ID');

  if (missing.length) {
    throw new Error(`Faltan Script Properties obligatorias: ${missing.join(', ')}`);
  }

  return cfg;
}
