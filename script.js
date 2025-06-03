function convertToList(text) {
  if (!text) return '';
  const items = text.split('\n').map(item => item.trim()).filter(item => item !== '');
  return `<ul>${items.map(i => `<li>${i}</li>`).join('')}</ul>`;
}

const slider = document.getElementById('timelineSlider');
const eventDetails = document.getElementById('eventDetails');

let currentData = [];

function showSlide(data, index) {
  const item = data[index];

  const title = item.title || '';
  const year = item.event_year || '';
  const location = item.location || '';
  const description = item.description || '';
  const person = item["Person"] || '';
  const meaning = item["Common feature or meaning"] || '';
  const impact = item["Impact on society"] || '';
  const image = item.image_url || '';
  const bio = item.bio || '';
  const achievements = item.achievements || '';
  const moreInfo = item.more_info || '';

  eventDetails.innerHTML = `
    <div class="event-card">
      ${image ? `<img src="${image}" alt="${person || title}" class="person-image">` : ''}
      ${title ? `<h2>${title} ${year ? `(${year})` : ''}</h2>` : ''}
      ${person ? `<h3>${person}</h3>` : ''}
      ${location || meaning ? `<div class="meta">${location} ${meaning ? `— ${meaning}` : ''}</div>` : ''}
      ${description ? `<p>${description}</p>` : ''}
      ${impact ? `<p><em>${impact}</em></p>` : ''}
      ${bio || achievements || moreInfo ? `
        <div class="extra-info-toggle">
          <button onclick="toggleExtraInfo()">Skatīt vairāk</button>
        </div>
        <div id="extraInfo" class="hidden">
          ${bio ? `<h4>Biogrāfija</h4><p>${bio}</p>` : ''}
          ${achievements ? `<h4>Sasniegumi</h4>${convertToList(achievements)}` : ''}
          ${moreInfo ? `<h4>Vairāk informācijas</h4>${convertToList(moreInfo)}` : ''}
        </div>
      ` : ''}
    </div>
  `;
}

function toggleExtraInfo() {
  const extraDiv = document.getElementById('extraInfo');
  const btn = extraDiv.previousElementSibling.querySelector('button');

  if (extraDiv.classList.contains('hidden')) {
    extraDiv.classList.remove('hidden');
    btn.textContent = 'Skatīt mazāk';
  } else {
    extraDiv.classList.add('hidden');
    btn.textContent = 'Skatīt vairāk';
  }
}

function loadSection(section) {
  let apiUrl = '';
  const titleElement = document.getElementById('sectionTitle');
  slider.style.display = 'block';

  if (section === 'events') {
    apiUrl = 'api.php';
    titleElement.textContent = 'Notikumu laika josla';
  } else if (section === 'persons') {
    apiUrl = 'persons.php';
    titleElement.textContent = 'Personu alfabētiskā josla';
  } else if (section === 'event_person') {
    apiUrl = 'event_person.php';
    titleElement.textContent = 'Personu un notikumu laika josla';
  }

  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      if (data.error) {
        eventDetails.innerHTML = `<p>${data.error}</p>`;
        return;
      }

      currentData = data;

      if (data.length > 0) {
        slider.style.display = 'block';
        slider.max = data.length - 1;
        slider.value = 0;
        showSlide(data, 0);
        slider.oninput = () => {
          showSlide(currentData, slider.value);
        };
      } else {
        slider.style.display = 'none';
        eventDetails.innerHTML = '<p>Nav datu.</p>';
      }
    })
    .catch(err => {
      eventDetails.innerHTML = `<p>Kļūda ielādē: ${err.message}</p>`;
    });
}

function renderList(data) {
  eventDetails.innerHTML = data.map(item => {
    const person = item.Person || '';
    const meaning = item["Common feature or meaning"] || '';
    const impact = item["Impact on society"] || '';
    const image = item.image_url || '';

    return `
      <div class="event-card">
        ${image ? `<img src="${image}" alt="${person}" class="person-image">` : ''}
        <h3>${person}</h3>
        ${meaning ? `<p><strong>Kopīgā iezīme vai nozīme:</strong> ${meaning}</p>` : ''}
        ${impact ? `<p><strong>Ietekme uz sabiedrību:</strong> ${impact}</p>` : ''}
      </div>
    `;
  }).join('');
}

function showHome() {
  const titleElement = document.getElementById('sectionTitle');
  slider.style.display = 'none';
  slider.oninput = null;
  currentData = [];
  eventDetails.innerHTML = `
    <div class="event-card">
      <h2>Laipni lūgti Siguldas notikumu laika joslā!</h2>
      <p>Šī vietne ļauj aplūkot nozīmīgākos Siguldas novada notikumus, personības un to mijiedarbību dažādos laikmetos.</p>
      <p>Izvēlies lejā kādu no sadaļām: <strong>Notikumi</strong>, <strong>Personas</strong> vai <strong>Notikumi + Personas</strong>.</p>
    </div>
  `;
}
