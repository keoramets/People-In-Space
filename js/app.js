const astrosUrl = 'https://api.open-notify.org/astros.json';
const wikiUrl = 'https://en.wikipedia.org/api/rest_v1/page/summary/';
const header = document.querySelector('header');
const peopleList = document.getElementById('people');
const btn = document.querySelector('button');

function getProfiles(json) {
    const number = json.number;
  const profiles = json.people.map( person => {
    const craft =  person.craft;
    return fetch(wikiUrl + person.name)
      .then( response => response.json() )
      .then( profile => {
        let newObj = {...profile, craft, number};
        return newObj
      } )
      .catch( err => console.log(Error('Error fetching Wiki: ')) )   
  }); 
  return Promise.all(profiles);
}

function generateHTML(data) {
  data.map(person => {
    header.innerHTML = `
    <h1>People Currently in Space</h1>
    <h2>${person.number}</h2>
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
  event.target.textContent = "Loading";

  fetch(astrosUrl)
    .then( respnse => respnse.json() )
    .then(getProfiles)
    .then( generateHTML )
    .catch( err => {
      peopleList.innerHTML = '<h3> Something went wrong. Check your Internet Connection...</h3>';
      console.log(err);
    })
    .finally( () => event.target.remove() )
 
});
