function convertToList(text) {
  if (!text) return '';
  const items = text.split('\n').map(item => item.trim()).filter(item => item !== '');
  return `<ul>${items.map(i => `<li>${i}</li>`).join('')}</ul>`;
}

const slider = document.getElementById('timelineSlider');
const eventDetails = document.getElementById('eventDetails');
const letterDisplay = document.getElementById('letterDisplay');

let currentData = [];

function showSlide(data, index, section) {
  const item = data[index];
  const title = item.title || '';
  const year = item.event_year || '';
  const location = item.location || '';
  const description = item.description || '';
  const person = item.Person || item.person || '';
  const image = item.image_url || '';
  const bio = item.bio || '';
  const achievements = item.achievements || '';
  const moreInfo = item.more_info || '';
  const meaning = item["Common feature or meaning"] || '';
  const impact = item["Impact on society"] || '';

  if (section === 'persons' && person) {
    letterDisplay.textContent = person.trim()[0].toUpperCase();
  } else {
    letterDisplay.textContent = '';
  }

  const extraInfoHTML = (bio || achievements || moreInfo || meaning || impact) ? `
    <div class="extra-info-toggle">
      <button onclick="toggleExtraInfo()">Skatīt vairāk</button>
    </div>
    <div id="extraInfo" class="hidden">
      ${bio ? `<h4>Biogrāfija</h4><p>${bio}</p>` : ''}
      ${achievements ? `<h4>Sasniegumi</h4>${convertToList(achievements)}` : ''}
      ${moreInfo ? `<h4>Vairāk informācijas</h4>${convertToList(moreInfo)}` : ''}
      ${meaning ? `<h4>Kopīgā iezīme vai nozīme</h4><p>${meaning}</p>` : ''}
      ${impact ? `<h4>Ietekme uz sabiedrību</h4><p>${impact}</p>` : ''}
    </div>
  ` : '';

  let relatedSectionHTML = '';

  if (section === 'events' && item.related_persons) {
    relatedSectionHTML = `
      <h4>Saistītās personas</h4>
      ${item.related_persons.map(p => `
        <div class="event-card">
          ${p.image_url ? `<img src="${p.image_url}" alt="${p.Person}" class="person-image">` : ''}
          <h3>${p.Person}</h3>
          ${p.bio ? `<p>${p.bio}</p>` : ''}
          ${p.achievements ? `<h4>Sasniegumi</h4>${convertToList(p.achievements)}` : ''}
          ${p.more_info ? `<h4>Vairāk informācijas</h4>${convertToList(p.more_info)}` : ''}
        </div>
      `).join('')}
    `;
  }

  if (section === 'persons' && item.related_events) {
    relatedSectionHTML = `
      <h4>Saistītie notikumi</h4>
      ${item.related_events.map(e => `
        <div class="event-card">
          <h3>${e.title} ${e.event_year ? `(${e.event_year})` : ''}</h3>
          ${e.location ? `<div class="meta">${e.location}</div>` : ''}
          ${e.description ? `<p>${e.description}</p>` : ''}
        </div>
      `).join('')}
    `;
  }

  const mainCard = `
    <div class="event-card">
      ${image ? `<img src="${image}" alt="${person || title}" class="person-image">` : ''}
      ${person ? `<h2>${person}</h2>` : ''}
      ${title && !person ? `<h2>${title} ${year ? `(${year})` : ''}</h2>` : ''}
      ${(location || meaning) ? `<div class="meta">${location} ${meaning ? `— ${meaning}` : ''}</div>` : ''}
      ${description ? `<p>${description}</p>` : ''}
      ${impact ? `<p><em>${impact}</em></p>` : ''}
      ${extraInfoHTML}
      ${relatedSectionHTML}
    </div>
  `;

  eventDetails.innerHTML = mainCard;
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

function showEventPersonSlide(data, index) {
  const item = data[index];
  if (!item) {
    eventDetails.innerHTML = '<p>Nav informācijas.</p>';
    return;
  }

  letterDisplay.textContent = '';

  const title = item.title || '';
  const year = item.event_year || '';
  const location = item.location || '';
  const description = item.description || '';
  const person = item.Person || '';
  const feature = item.common_feature || item["Common feature or meaning"] || '';
  const impact = item.impact_on_society || item["Impact on society"] || '';

  const content = `
    <div class="event-card">
      ${person ? `<h2>${person}</h2>` : ''}
      ${title ? `<h3>${title}${year ? ` (${year})` : ''}</h3>` : ''}
      ${location ? `<div class="meta">${location}</div>` : ''}
      ${description ? `<p>${description}</p>` : ''}
      ${feature ? `<p><strong>Raksturojums:</strong> ${feature}</p>` : ''}
      ${impact ? `<p><strong>Ietekme:</strong> ${impact}</p>` : ''}
    </div>
  `;

  eventDetails.innerHTML = content;
}

function loadSection(section) {
  const titleElement = document.getElementById('sectionTitle');
  slider.style.display = 'block';
  letterDisplay.textContent = '';
  eventDetails.innerHTML = '';
  document.getElementById('content').innerHTML = '';
  currentData = [];

  let apiUrl = '';
  if (section === 'events') {
    apiUrl = 'api.php';
    titleElement.textContent = 'Notikumu laika josla';
  } else if (section === 'persons') {
    apiUrl = 'persons.php';
    titleElement.textContent = 'Personu alfabētiskā josla';
  } else if (section === 'event_person') {
    apiUrl = 'event_person.php';
    titleElement.textContent = 'Notikumi un personas';
  }

  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      if (data.error) {
        eventDetails.innerHTML = `<p>${data.error}</p>`;
        slider.style.display = 'none';
        return;
      }

      currentData = data;

      if (data.length > 0) {
        slider.max = data.length - 1;
        slider.value = 0;

        if (section === 'event_person') {
          showEventPersonSlide(data, 0);
          slider.oninput = () => showEventPersonSlide(currentData, slider.value);
        } else {
          showSlide(data, 0, section);
          slider.oninput = () => showSlide(currentData, slider.value, section);
        }
      } else {
        slider.style.display = 'none';
        eventDetails.innerHTML = '<p>Nav datu.</p>';
      }
    })
    .catch(err => {
      eventDetails.innerHTML = `<p>Kļūda ielādē: ${err.message}</p>`;
      slider.style.display = 'none';
    });
}

function showHome() {
  document.getElementById('sectionTitle').innerText = "Siguldas vēsturisko notikumu un personību izpēte";
  document.getElementById('content').innerHTML = `
    <div class="event-card">
      <h2>Laipni lūgti!</h2>
      <p>Šī vietne ļauj aplūkot nozīmīgākos Siguldas novada notikumus, personības un to mijiedarbību dažādos laikmetos.</p>
      <p>Izvēlies lejā kādu no sadaļām: <strong>Notikumi</strong>, <strong>Personas</strong>, vai <strong>Notikumi + Personas</strong>.</p>
    </div>
  `;
  eventDetails.innerHTML = '';
  slider.style.display = 'none';
  letterDisplay.textContent = '';
}
