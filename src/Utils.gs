function nowIso() {
  return new Date().toISOString();
}

function generateId(prefix) {
  const ts = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyyMMddHHmmss');
  const rand = Math.floor(Math.random() * 9000) + 1000;
  return `${prefix}_${ts}_${rand}`;
}

function sanitizeFolderName(value) {
  return String(value || '')
    .trim()
    .replace(/[\\/:*?"<>|#%{}~&]/g, '-')
    .replace(/\s+/g, ' ')
    .substring(0, 120);
}

function normalizeText(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function toNumber(value) {
  if (value === null || value === undefined || value === '') return 0;
  const cleaned = String(value).replace(/\./g, '').replace(',', '.').replace(/[^0-9.-]/g, '');
  const num = Number(cleaned);
  return Number.isFinite(num) ? num : 0;
}

function ok(data) {
  return {
    success: true,
    data
  };
}

function fail(message, details) {
  return {
    success: false,
    message,
    details: details || null
  };
}
