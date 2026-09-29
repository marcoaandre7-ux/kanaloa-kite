const lessonForm = document.getElementById('lessonForm');
const lessonDate = document.getElementById('lessonDate');
if (lessonDate) {
  const today = new Date();
  const localToday = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().slice(0,10);
  lessonDate.min = localToday;
}
lessonForm?.addEventListener('submit', event => {
  event.preventDefault();
  if (!lessonForm.reportValidity()) return;
  const name = document.getElementById('lessonName').value.trim();
  const dateValue = lessonDate.value;
  const period = document.getElementById('lessonPeriod').value;
  const notes = document.getElementById('lessonNotes').value.trim();
  const [year, month, day] = dateValue.split('-');
  const date = `${day}/${month}/${year}`;
  const message = [
    'Olá, Kanaloa! Gostaria de solicitar uma aula de kitesurf.',
    `Nome: ${name}`,
    `Data desejada: ${date}`,
    `Período preferido: ${period}`,
    notes ? `Observações: ${notes}` : '',
    'Podem confirmar disponibilidade, horários e valores?'
  ].filter(Boolean).join('\n');
  window.open(`https://wa.me/5598988404040?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
});
