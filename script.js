const API_KEY = '7e10e4b497415342ea66c2cc86bd05ba'; // substitua pela sua chave se necessário

const input = document.getElementById('cityInput');
const suggestionsList = document.getElementById('suggestions');
const weatherContainer = document.getElementById('weatherContainer');

// Debounce para evitar chamadas excessivas
let timeout = null;
input.addEventListener('input', () => {
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    searchCity(input.value.trim());
  }, 500);
});

async function searchCity(query) {
  if (!query) {
    suggestionsList.innerHTML = '';
    suggestionsList.style.display = 'none';
    return;
  }

  try {
    const response = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${API_KEY}`);
    const cities = await response.json();

    suggestionsList.innerHTML = '';
    if (cities.length === 0) {
      const li = document.createElement('li');
      li.textContent = 'Nenhuma cidade encontrada';
      suggestionsList.appendChild(li);
      suggestionsList.style.display = 'block';
      return;
    }

    cities.forEach(city => {
      const li = document.createElement('li');
      const cityDisplay = `${city.name}${city.state ? ', ' + city.state : ''}, ${city.country}`;
      li.textContent = cityDisplay;
      li.addEventListener('click', () => {
        suggestionsList.innerHTML = '';
        suggestionsList.style.display = 'none';
        getWeather(city.lat, city.lon, cityDisplay);
      });
      suggestionsList.appendChild(li);
    });

    suggestionsList.style.display = 'block';

  } catch (error) {
    console.error('Erro ao buscar cidades:', error);
    suggestionsList.innerHTML = '';
    suggestionsList.style.display = 'none';
  }
}

async function getWeather(lat, lon, cityName) {
  try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=pt_br&appid=${API_KEY}`);
    const data = await response.json();

    if (!data.weather || !data.main) {
      throw new Error('Resposta da API incompleta');
    }

    const html = `
      <h2>Clima atual em ${cityName}</h2>
      <div class="forecast">
        <div class="day">
          <strong>${new Date().toLocaleDateString('pt-BR', { weekday: 'long' })}</strong><br/>
          Temp: ${data.main.temp}°C<br/>
          ${data.weather[0].description}<br/>
          <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}.png" alt="icon">
        </div>
      </div>
    `;

    weatherContainer.innerHTML = html;

  } catch (error) {
    console.error('Erro ao obter o clima:', error);
    weatherContainer.innerHTML = `<p>Erro ao obter dados climáticos. Tente novamente mais tarde.</p>`;
  }
}


