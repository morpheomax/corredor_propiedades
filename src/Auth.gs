function getCurrentUserEmailSafe() {
  try {
    return (Session.getActiveUser().getEmail() || '').toLowerCase();
  } catch (err) {
    return '';
  }
}

function assertAuthorized() {
  const cfg = getScriptConfig();
  const currentEmail = getCurrentUserEmailSafe();

  if (!cfg.allowedEmails.length) {
    return true;
  }

  if (!currentEmail || !cfg.allowedEmails.includes(currentEmail)) {
    throw new Error('Usuario no autorizado para usar esta aplicación.');
  }

  return true;
}
