const windCurrent = document.getElementById('windCurrent');
const windDays = document.getElementById('windDays');
const tideDays = document.getElementById('tideDays');
const localDate = value => new Intl.DateTimeFormat('pt-BR',{weekday:'short',day:'2-digit',month:'short'}).format(new Date(`${value}T12:00:00`));
const compass = degrees => {
  const points=['N','NE','L','SE','S','SO','O','NO'];
  return points[Math.round(degrees/45)%8];
};

async function loadWind() {
  if (!windCurrent) return;
  const url = 'https://api.open-meteo.com/v1/forecast?latitude=-2.4688423&longitude=-44.2045922&current=wind_speed_10m,wind_direction_10m,wind_gusts_10m&daily=wind_speed_10m_max,wind_gusts_10m_max,wind_direction_10m_dominant&wind_speed_unit=kn&timezone=America%2FSao_Paulo&forecast_days=7';
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Previsão indisponível');
    const data = await response.json();
    const current = data.current;
    if (!current || typeof current.wind_speed_10m !== 'number') throw new Error('Dados incompletos');
    windCurrent.innerHTML = `<div class="wind-now"><strong>${Math.round(current.wind_speed_10m)} <span>nós</span></strong><div><span>Direção ${compass(current.wind_direction_10m)} · ${Math.round(current.wind_direction_10m)}°</span><span>Rajadas ${Math.round(current.wind_gusts_10m)} nós</span></div></div>`;
    document.getElementById('windUpdated').textContent = `Modelo atualizado: ${new Date(`${current.time}:00`).toLocaleString('pt-BR',{day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'})}`;
    windDays.innerHTML = data.daily.time.map((date,index)=>`<div class="wind-day"><span>${localDate(date)}</span><strong>${Math.round(data.daily.wind_speed_10m_max[index])} nós</strong><small>máx. · ${compass(data.daily.wind_direction_10m_dominant[index])}</small></div>`).join('');
  } catch {
    windCurrent.innerHTML = '<p>Não foi possível carregar o vento agora. Tente atualizar a página mais tarde.</p>';
    document.getElementById('windUpdated').textContent = 'Previsão indisponível';
    windDays.innerHTML = '';
  }
}

async function loadTides() {
  if (!tideDays) return;
  try {
    const response = await fetch('assets/tides-2026.json');
    if (!response.ok) throw new Error('Tábua indisponível');
    const tide = await response.json();
    const todayLabel = new Intl.DateTimeFormat('en-CA',{timeZone:'America/Sao_Paulo',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
    const [year,month,day]=todayLabel.split('-').map(Number);
    const start = new Date(year,month-1,day,12);
    const days = Array.from({length:7},(_,index)=>{const date=new Date(start);date.setDate(start.getDate()+index);return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;});
    tideDays.innerHTML = days.map(date=>{
      const entries=tide.days[date];
      return `<div class="tide-day"><h3>${localDate(date)}</h3>${entries?.length?`<div class="tide-events">${entries.map(entry=>`<div><span>${entry.height>=3.27?'Alta':'Baixa'}</span><strong>${entry.time}</strong><small>${entry.height.toFixed(2).replace('.',',')} m</small></div>`).join('')}</div>`:'<p>Dados não disponíveis para esta data.</p>'}</div>`;
    }).join('');
  } catch {
    tideDays.innerHTML = '<p>Não foi possível carregar a tábua. Consulte a publicação oficial da Marinha no link abaixo.</p>';
  }
}
loadWind();
loadTides();
window.setInterval(loadWind, 15 * 60 * 1000);
window.setInterval(loadTides, 60 * 60 * 1000);
