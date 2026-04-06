function getSpreadsheet_() {
  const cfg = validateRequiredConfig();
  return SpreadsheetApp.openById(cfg.spreadsheetId);
}

function getSheet_(sheetName) {
  const ss = getSpreadsheet_();
  const sheet = ss.getSheetByName(sheetName);
  if (!sheet) throw new Error(`No existe la hoja: ${sheetName}`);
  return sheet;
}

function getHeaders_(sheet) {
  const lastColumn = sheet.getLastColumn();
  if (lastColumn === 0)
    throw new Error(`La hoja ${sheet.getName()} no tiene encabezados.`);
  return sheet.getRange(1, 1, 1, lastColumn).getValues()[0].map(String);
}

function getAllRowsAsObjects_(sheetName) {
  const sheet = getSheet_(sheetName);
  const headers = getHeaders_(sheet);
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return [];

  const values = sheet.getRange(2, 1, lastRow - 1, headers.length).getValues();
  return values.map((row) => {
    const obj = {};
    headers.forEach((header, idx) => {
      obj[header] = row[idx];
    });
    return obj;
  });
}

function appendRowByHeaders_(sheetName, rowObject) {
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);

  try {
    const sheet = getSheet_(sheetName);
    const headers = getHeaders_(sheet);
    const row = headers.map((header) =>
      rowObject[header] !== undefined ? rowObject[header] : "",
    );
    sheet.appendRow(row);
    return true;
  } finally {
    lock.releaseLock();
  }
}

function findRowIndexByField_(sheetName, fieldName, fieldValue) {
  const sheet = getSheet_(sheetName);
  const headers = getHeaders_(sheet);
  const columnIndex = headers.indexOf(fieldName);
  if (columnIndex === -1)
    throw new Error(`No existe la columna ${fieldName} en ${sheetName}`);

  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return -1;

  const values = sheet
    .getRange(2, columnIndex + 1, lastRow - 1, 1)
    .getValues()
    .flat();
  const idx = values.findIndex((v) => String(v) === String(fieldValue));
  return idx === -1 ? -1 : idx + 2;
}

function updateRowByField_(sheetName, fieldName, fieldValue, patchObject) {
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);

  try {
    const sheet = getSheet_(sheetName);
    const headers = getHeaders_(sheet);
    const rowIndex = findRowIndexByField_(sheetName, fieldName, fieldValue);
    if (rowIndex === -1)
      throw new Error(
        `No se encontró fila en ${sheetName} para ${fieldName}=${fieldValue}`,
      );

    const currentRow = sheet
      .getRange(rowIndex, 1, 1, headers.length)
      .getValues()[0];
    const updated = headers.map((header, idx) => {
      if (Object.prototype.hasOwnProperty.call(patchObject, header)) {
        return patchObject[header];
      }
      return currentRow[idx];
    });

    sheet.getRange(rowIndex, 1, 1, headers.length).setValues([updated]);
    return true;
  } finally {
    lock.releaseLock();
  }
}

function deleteRowByField_(sheetName, fieldName, fieldValue) {
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);

  try {
    const sheet = getSheet_(sheetName);
    const rowIndex = findRowIndexByField_(sheetName, fieldName, fieldValue);

    if (rowIndex === -1) {
      throw new Error(
        `No se encontró fila en ${sheetName} para ${fieldName}=${fieldValue}`,
      );
    }

    sheet.deleteRow(rowIndex);
    return true;
  } finally {
    lock.releaseLock();
  }
}
