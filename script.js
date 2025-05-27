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

  eventDetails.innerHTML = `
    <div class="event-card">
      ${image ? `<img src="${image}" alt="${person || title}" class="person-image">` : ''}
      ${title ? `<h2>${title} ${year ? `(${year})` : ''}</h2>` : ''}
      ${person ? `<h3>${person}</h3>` : ''}
      ${location || meaning ? `<div class="meta">${location} ${meaning ? `— ${meaning}` : ''}</div>` : ''}
      ${description ? `<p>${description}</p>` : ''}
      ${impact ? `<p><em>${impact}</em></p>` : ''}
    </div>
  `;
}


function loadSection(section) {
  let apiUrl = '';
  const titleElement = document.getElementById('sectionTitle');
  const slider = document.getElementById('timelineSlider');
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
  const slider = document.getElementById('timelineSlider');
  titleElement.textContent = 'Sākums';
  slider.style.display = 'none';
  slider.oninput = null;
  currentData = [];
  eventDetails.innerHTML = `
    <div class="event-card">
      <h2>Laipni lūgti Siguldas notikumu laika joslā!</h2>
      <p>Šī vietne ļauj aplūkot nozīmīgākos Siguldas novada notikumus, personības un to mijiedarbību dažādos laikmetos.</p>
      <p>Izvēlies augšā kādu no sadaļām: <strong>Notikumi</strong>, <strong>Personas</strong> vai <strong>Notikumi + Personas</strong>.</p>
    </div>
  `;
}

