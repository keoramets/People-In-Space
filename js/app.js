const astrosUrl = 'https://cors-everywhere.herokuapp.com/http://api.open-notify.org/astros.json';
const wikiUrl = 'https://en.wikipedia.org/api/rest_v1/page/summary/';
const header = document.querySelector('header');
const peopleList = document.getElementById('people');
const btn = document.querySelector('button');

// Handle all fetch requests
async function getJSON(url) {
  try {
    const response =  await fetch(url);
    return await response.json();
  } catch (error) {
    throw error;
  }
} 

async function getPeopleInSpace(url) {

  const peopleJSON = await getJSON(url);

  const astrosNumber = peopleJSON.number;

  const profiles = peopleJSON.people.map( async (person) => {
    const craft = person.craft;
    const profileJSON = await getJSON(wikiUrl + person.name);

    return{ ...profileJSON, craft, astrosNumber }
  });
  return Promise.all(profiles);
}


function generateHTML(data) {
  data.map(person => {

    header.innerHTML = `
    <h1>People Currently in Space</h1>
    <h2>${person.astrosNumber}</h2>
    `;

    const section = document.createElement('section');
    peopleList.appendChild(section);
      section.innerHTML = `
        <img src=${person.thumbnail.source}>
        <span>Spacecraft: ${person.craft}</span>
        <h3>${person.title}</h3>
        <p>${person.description}</p>
        <p>${person.extract}</p>
      `;

  });
}

btn.addEventListener('click', (event) => {
  event.target.textContent = "Loading...";

  getPeopleInSpace(astrosUrl)
    .then(generateHTML)
    .catch( e => {
      peopleList.innerHTML = '<h3>Something went wrong!</h3>';
      console.error(e);
    })
    .finally( () => event.target.remove() )
});
