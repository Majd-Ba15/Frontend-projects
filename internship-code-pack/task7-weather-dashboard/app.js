/**
 * Weather Dashboard
 * - Current weather + 3-day forecast
 * - Search by city
 * - Use geolocation
 * - Loading & error states
 * Replace API_KEY below with your OpenWeatherMap key.
 */
const API_KEY = "78c1f0062bd3c04b8095ad33bf36538c";

const ICON = (code)=> `https://openweathermap.org/img/wn/${code}@2x.png`;

const statusEl = document.getElementById('status');
const current = document.getElementById('current');
const cityName = document.getElementById('cityName');
const currentTemp = document.getElementById('currentTemp');
const currentDesc = document.getElementById('currentDesc');
const currentIcon = document.getElementById('currentIcon');
const humidity = document.getElementById('humidity');
const wind = document.getElementById('wind');
const forecast = document.getElementById('forecast');
const searchForm = document.getElementById('searchForm');
const queryInput = document.getElementById('query');
const geoBtn = document.getElementById('geoBtn');

function setStatus(msg){ statusEl.textContent = msg || ''; }
function show(el){ el.hidden = false }
function hide(el){ el.hidden = true }

function kelvinToC(x){ return (x - 273.15).toFixed(1) }

async function fetchJSON(url){
  const res = await fetch(url);
  if(!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json();
}

async function fetchByCity(q){
  setStatus('Loading weather...');
  try{
    const cur = await fetchJSON(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(q)}&appid=${API_KEY}`);
    renderCurrent(cur);

    const fc = await fetchJSON(`https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(q)}&appid=${API_KEY}`);
    renderForecast(fc);
    setStatus('');
  }catch(err){
    console.error(err);
    setStatus('Could not load weather for that city.');
    hide(current); hide(forecast);
  }
}

async function fetchByCoords(lat, lon){
  setStatus('Loading weather for your location...');
  try{
    const cur = await fetchJSON(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`);
    renderCurrent(cur);
    const fc = await fetchJSON(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`);
    renderForecast(fc);
    setStatus('');
  }catch(err){
    console.error(err);
    setStatus('Location lookup failed.');
    hide(current); hide(forecast);
  }
}

function renderCurrent(data){
  cityName.textContent = `${data.name}, ${data.sys?.country ?? ''}`;
  currentTemp.textContent = `${kelvinToC(data.main.temp)}°C`;
  currentDesc.textContent = data.weather?.[0]?.description ?? '';
  const icon = data.weather?.[0]?.icon;
  if(icon){
    currentIcon.src = ICON(icon);
    currentIcon.alt = data.weather?.[0]?.main ?? 'Weather icon';
  }
  humidity.textContent = `${data.main.humidity}%`;
  wind.textContent = `${Math.round(data.wind.speed)} m/s`;
  show(current);
}

function groupForecastByDay(list){
  const map = new Map();
  for(const item of list){
    const date = new Date(item.dt * 1000);
    const key = date.toISOString().substring(0,10);
    if(!map.has(key)) map.set(key, []);
    map.get(key).push(item);
  }
  return Array.from(map.entries())
    .map(([day, arr])=>{
      // choose the item closest to 12:00 for daily overview
      let pick = arr.reduce((prev, cur)=>{
        const prevDiff = Math.abs(new Date(prev.dt*1000).getHours() - 12);
        const curDiff = Math.abs(new Date(cur.dt*1000).getHours() - 12);
        return curDiff < prevDiff ? cur : prev;
      });
      return { day, item: pick };
    })
    .slice(1, 4); // next 3 days
}

function renderForecast(data){
  const days = groupForecastByDay(data.list);
  forecast.innerHTML = '';
  for(const d of days){
    const { day, item } = d;
    const icon = item.weather?.[0]?.icon;
    const desc = item.weather?.[0]?.description ?? '';
    const temp = kelvinToC(item.main.temp);

    const el = document.createElement('article');
    el.className = 'day';
    el.innerHTML = `
      <div class="left">
        <img src="${ICON(icon)}" alt="${item.weather?.[0]?.main ?? 'Weather'}"/>
        <div>
          <div><strong>${new Date(day).toLocaleDateString(undefined,{weekday:'short', month:'short', day:'numeric'})}</strong></div>
          <div class="muted">${desc}</div>
        </div>
      </div>
      <div class="temp">${temp}°C</div>
    `;
    forecast.appendChild(el);
  }
  show(forecast);
}

// Events
searchForm.addEventListener('submit', (e)=>{
  e.preventDefault();
  const q = queryInput.value.trim();
  if(q) fetchByCity(q);
});

geoBtn.addEventListener('click', ()=>{
  if(!navigator.geolocation) return setStatus('Geolocation is not supported in this browser.');
  navigator.geolocation.getCurrentPosition(
    (pos)=> fetchByCoords(pos.coords.latitude, pos.coords.longitude),
    ()=> setStatus('Permission denied or unavailable.')
  );
});

// Optional: initial city
// fetchByCity('Beirut')
