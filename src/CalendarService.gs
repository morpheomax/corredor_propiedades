function createReminderEvent(input) {
  try {
    assertAuthorized();
    const cfg = validateRequiredConfig();
    const calendar = CalendarApp.getCalendarById(cfg.calendarId);

    const title = String(input.title || '').trim();
    const description = String(input.description || '').trim();
    const start = new Date(input.start);
    const end = new Date(input.end || input.start);

    if (!title) throw new Error('El título del recordatorio es obligatorio.');
    if (String(start) === 'Invalid Date') throw new Error('Fecha de inicio inválida.');

    const event = calendar.createEvent(title, start, end, { description });

    return ok({
      eventId: event.getId(),
      title: event.getTitle(),
      start: event.getStartTime(),
      end: event.getEndTime()
    });
  } catch (err) {
    return fail(err.message, String(err));
  }
}
