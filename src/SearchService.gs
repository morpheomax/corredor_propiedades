function searchProperties(term) {
  try {
    assertAuthorized();
    const query = normalizeText(term);
    const rows = getAllRowsAsObjects_(CONFIG.SHEETS.PROPERTIES);

    if (!query) return ok(rows);

    const filtered = rows.filter((row) => {
      const haystack = [
        row.codigo_propiedad,
        row.nombre_propiedad,
        row.direccion,
        row.comuna,
        row.ciudad,
        row.estado_propiedad,
        row.destino
      ]
        .map(normalizeText)
        .join(' | ');

      return haystack.includes(query);
    });

    return ok(filtered);
  } catch (err) {
    return fail(err.message, String(err));
  }
}
