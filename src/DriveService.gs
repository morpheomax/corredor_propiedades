function getRootFolder_() {
  const cfg = validateRequiredConfig();
  return DriveApp.getFolderById(cfg.rootFolderId);
}

function createPropertyFolders_(propertyRecord) {
  const root = getRootFolder_();
  const folderName = sanitizeFolderName(
    `${propertyRecord.codigo_propiedad || propertyRecord.property_id} - ${propertyRecord.nombre_propiedad || 'Propiedad'} - ${propertyRecord.comuna || ''}`
  );

  const propertyFolder = root.createFolder(folderName);
  const createdSubfolders = {};

  CONFIG.PROPERTY_SUBFOLDERS.forEach((name) => {
    const folder = propertyFolder.createFolder(name);
    createdSubfolders[name] = {
      id: folder.getId(),
      url: folder.getUrl(),
      name
    };
  });

  return {
    propertyFolderId: propertyFolder.getId(),
    propertyFolderUrl: propertyFolder.getUrl(),
    subfolders: createdSubfolders
  };
}
