function buildPropertyCode_() {
  return `PROP-${Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyyMMdd-HHmmss")}`;
}

function createProperty(payload) {
  try {
    assertAuthorized();
    validateRequiredConfig();

    const property = {
      property_id: generateId("property"),
      codigo_propiedad: buildPropertyCode_(),
      nombre_propiedad: String(payload.nombre_propiedad || "").trim(),
      tipo_propiedad: String(payload.tipo_propiedad || "").trim(),
      direccion: String(payload.direccion || "").trim(),
      comuna: String(payload.comuna || "").trim(),
      ciudad: String(payload.ciudad || "").trim(),
      rol_avaluo: String(payload.rol_avaluo || "").trim(),
      estado_propiedad: String(
        payload.estado_propiedad || "Disponible para arriendo",
      ).trim(),
      destino: String(payload.destino || "Arriendo").trim(),
      canon_mensual: toNumber(payload.canon_mensual || 0),
      garantia: toNumber(payload.garantia || 0),
      gastos_comunes_ref: toNumber(payload.gastos_comunes_ref || 0),
      propietario_id: String(payload.propietario_id || "").trim(),
      arrendatario_actual_id: "",
      contrato_actual_id: "",
      drive_folder_id: "",
      drive_folder_url: "",
      subfolder_docs_propiedad_url: "",
      subfolder_docs_arrendatario_url: "",
      subfolder_fotos_url: "",
      subfolder_contratos_url: "",
      subfolder_comprobantes_url: "",
      fecha_creacion: nowIso(),
      fecha_actualizacion: nowIso(),
      observaciones: String(payload.observaciones || "").trim(),
    };

    if (!property.nombre_propiedad) {
      throw new Error("El nombre de la propiedad es obligatorio.");
    }

    const folders = createPropertyFolders_(property);

    property.drive_folder_id = folders.propertyFolderId;
    property.drive_folder_url = folders.propertyFolderUrl;
    property.subfolder_docs_propiedad_url =
      folders.subfolders["01_Documentos_Propiedad"].url;
    property.subfolder_docs_arrendatario_url =
      folders.subfolders["02_Documentos_Arrendatario"].url;
    property.subfolder_fotos_url = folders.subfolders["03_Fotos_Propiedad"].url;
    property.subfolder_contratos_url = folders.subfolders["04_Contratos"].url;
    property.subfolder_comprobantes_url =
      folders.subfolders["05_Comprobantes_y_Pagos"].url;

    appendRowByHeaders_(CONFIG.SHEETS.PROPERTIES, property);
    logAudit_("CREATE_PROPERTY", property.property_id, property);

    return ok(property);
  } catch (err) {
    return fail(err.message, String(err));
  }
}

function listProperties() {
  try {
    assertAuthorized();
    const rows = getAllRowsAsObjects_(CONFIG.SHEETS.PROPERTIES).sort((a, b) =>
      String(b.fecha_creacion || "").localeCompare(
        String(a.fecha_creacion || ""),
      ),
    );
    return ok(rows);
  } catch (err) {
    return fail(err.message, String(err));
  }
}

function getPropertyById(propertyId) {
  try {
    assertAuthorized();
    const rows = getAllRowsAsObjects_(CONFIG.SHEETS.PROPERTIES);
    const found = rows.find(
      (row) => String(row.property_id) === String(propertyId),
    );

    if (!found) {
      throw new Error("Propiedad no encontrada.");
    }

    return ok(found);
  } catch (err) {
    return fail(err.message, String(err));
  }
}

function updateProperty(payload) {
  try {
    assertAuthorized();
    validateRequiredConfig();

    const propertyId = String(payload.property_id || "").trim();
    if (!propertyId) {
      throw new Error("El property_id es obligatorio para editar.");
    }

    const rows = getAllRowsAsObjects_(CONFIG.SHEETS.PROPERTIES);
    const current = rows.find((row) => String(row.property_id) === propertyId);

    if (!current) {
      throw new Error("Propiedad no encontrada para editar.");
    }

    const patch = {
      nombre_propiedad: String(payload.nombre_propiedad || "").trim(),
      tipo_propiedad: String(payload.tipo_propiedad || "").trim(),
      direccion: String(payload.direccion || "").trim(),
      comuna: String(payload.comuna || "").trim(),
      ciudad: String(payload.ciudad || "").trim(),
      rol_avaluo: String(payload.rol_avaluo || "").trim(),
      estado_propiedad: String(
        payload.estado_propiedad || "Disponible para arriendo",
      ).trim(),
      destino: String(payload.destino || "Arriendo").trim(),
      canon_mensual: toNumber(payload.canon_mensual || 0),
      garantia: toNumber(payload.garantia || 0),
      gastos_comunes_ref: toNumber(payload.gastos_comunes_ref || 0),
      propietario_id: String(payload.propietario_id || "").trim(),
      observaciones: String(payload.observaciones || "").trim(),
      fecha_actualizacion: nowIso(),
    };

    if (!patch.nombre_propiedad) {
      throw new Error("El nombre de la propiedad es obligatorio.");
    }

    updateRowByField_(
      CONFIG.SHEETS.PROPERTIES,
      "property_id",
      propertyId,
      patch,
    );

    const updatedRows = getAllRowsAsObjects_(CONFIG.SHEETS.PROPERTIES);
    const updated = updatedRows.find(
      (row) => String(row.property_id) === propertyId,
    );

    logAudit_("UPDATE_PROPERTY", propertyId, patch);

    return ok(updated);
  } catch (err) {
    return fail(err.message, String(err));
  }
}

function deleteProperty(propertyId) {
  try {
    assertAuthorized();

    const propertyIdClean = String(propertyId || "").trim();
    if (!propertyIdClean) {
      throw new Error("El property_id es obligatorio para eliminar.");
    }

    const rows = getAllRowsAsObjects_(CONFIG.SHEETS.PROPERTIES);
    const current = rows.find(
      (row) => String(row.property_id) === propertyIdClean,
    );

    if (!current) {
      throw new Error("Propiedad no encontrada para eliminar.");
    }

    deleteRowByField_(CONFIG.SHEETS.PROPERTIES, "property_id", propertyIdClean);

    logAudit_("DELETE_PROPERTY", propertyIdClean, {
      property_id: propertyIdClean,
      codigo_propiedad: current.codigo_propiedad || "",
      nombre_propiedad: current.nombre_propiedad || "",
      drive_folder_url: current.drive_folder_url || "",
      note: "Se eliminó el registro del sistema. No se eliminó la carpeta de Drive.",
    });

    return ok({
      property_id: propertyIdClean,
      deleted: true,
      drive_folder_url: current.drive_folder_url || "",
    });
  } catch (err) {
    return fail(err.message, String(err));
  }
}

function logAudit_(action, entityId, payload) {
  try {
    const email = getCurrentUserEmailSafe();
    appendRowByHeaders_(CONFIG.SHEETS.AUDIT, {
      action,
      user_email: email,
      timestamp: nowIso(),
      entity: "property",
      entity_id: entityId,
      payload_json: JSON.stringify(payload),
    });
  } catch (err) {
    // No bloquear operación principal por fallo de log
  }
}
