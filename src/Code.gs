function doGet() {
  try {
    assertAuthorized();

    return HtmlService
      .createTemplateFromFile('index')
      .evaluate()
      .setTitle(getScriptConfig().appTitle)
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  } catch (err) {
    return HtmlService.createHtmlOutput(`
      <html>
        <body style="font-family:Arial,sans-serif;padding:24px;">
          <h2>Acceso no disponible</h2>
          <p>${err.message}</p>
        </body>
      </html>
    `);
  }
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

function getBootstrapData() {
  try {
    assertAuthorized();
    const cfg = getScriptConfig();
    const properties = getAllRowsAsObjects_(CONFIG.SHEETS.PROPERTIES);

    return ok({
      appTitle: cfg.appTitle,
      userEmail: getCurrentUserEmailSafe(),
      counts: {
        properties: properties.length
      },
      properties: properties.slice(0, 50)
    });
  } catch (err) {
    return fail(err.message, String(err));
  }
}
