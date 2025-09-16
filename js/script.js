const lista = document.getElementById('lista');
const buscar = document.getElementById('inputBuscar');
const btnBuscar = document.getElementById('btnBuscar');
let pelis = [];

cargarPeliculas();

function cargarPeliculas() {
    fetch('https://japceibal.github.io/japflix_api/movies-data.json')
        .then(response => response.json())
        .then(data => {
            pelis = data;
            mostrarPeliculas(pelis);
        })
        .catch(error => console.error('Error al cargar las películas:', error));
}

btnBuscar.addEventListener('click', () => {
    const termino = buscar.value.toLowerCase().trim();
    if (!termino) return;

    let films = pelis.map(peli => {
        const generos = peli.genres.map(genero => genero.name);
        const regex = new RegExp(termino, 'i');
        let resultados = peli.title.toLowerCase().match(regex) || 
        peli.tagline.toLowerCase().match(regex) ||
        generos.some(genero => genero.toLowerCase().match(regex)) || 
        peli.overview.toLowerCase().match(regex);

        if (resultados) {
            return `
           <li class="list-group-item">
           ${crearOverflow(peli)} 
           `;
        }
    }).filter(peli => peli !== undefined).join('');

    lista.innerHTML = films;
});

buscar.addEventListener('input', lol => {
    if (lol.target.value === '') lista.innerHTML = '';
});

buscar.addEventListener('keypress', lol => {
    if (lol.key === 'Enter') btnBuscar.click();
}
)

function mostrarPeliculas(peliculas) {
    const items = peliculas.map(peli => `
        <li class="list-group-item">
        ${crearOverflow(peli)}
        </li>
    `).join('');
    lista.innerHTML = items;
}

function calificar(votar) {
    const estrellas = [];
    const calificacion = Math.floor(votar / 2);

    for (let i = 1; i <= 5; i++) {
        if (i <= calificacion) {
            estrellas.push('<span class="fa fa-star checked"></span>');
        } else {
            estrellas.push('<span class="fa fa-star"></span>');
        }
    }
    return estrellas.join('');
}

function crearOverflow(peli) {
    const offcanva = `offcanvas${peli.id}`;
    return `
    <button class="btn btn-link" data-bs-toggle="offcanvas" href="#${offcanva}" role="button" aria-controls="${offcanva}">
    <div class="row">
        <div class="col-4">
            <img src="${peli.image_url}" class="img-fluid" alt="${peli.title}">
        </div>
        <div class="col-8">
            <h5>${peli.title}</h5>
            <p>${peli.tagline}</p>
            <p>Rating: ${calificar(peli.vote_average)} (${peli.vote_count} votes)</p>
        </div>
    </div>
</button>
<div class="offcanvas offcanvas-start" tabindex="-1" id="${offcanva}" aria-labelledby="${offcanva}Label">
  <div class="offcanvas-header">
    <h5 class="offcanvas-title" id="${offcanva}Label">${peli.title}</h5>
    <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
  </div>
  <div class="offcanvas-body">
    <img src="${peli.image_url}" class="img-fluid mb-3" alt="${peli.title}">
    <p><strong>Tagline:</strong> ${peli.tagline}</p>
    <p><strong>Genres:</strong> ${peli.genres.map(g => g.name).join(', ')}</p>
    <p><strong>Overview:</strong> ${peli.overview}</p>
    <p><strong>Release Date:</strong> ${peli.release_date}</p>
    <p><strong>Rating:</strong> ${calificar(peli.vote_average)} (${peli.vote_count} votes)</p>
    <p><strong>Original Language:</strong> ${peli.original_language}</p>
  </div>
</div>
    `;
}