const PAGE_SIZE = 10
let currentPage = 1;
let pokemons = []



function updatePaginationDiv(currentPage, numPages) {



  $('#pagination').empty()
  var startPage = Math.max(1, currentPage - Math.floor(5 / 2))
  var endPage = Math.min(numPages, currentPage + Math.floor(5 / 2))

  // const startPage = 1;
  // const endPage = numPages;
  for (let i = startPage; i <= endPage; i++) {
    let active = ''
    if (i == currentPage) {
      active = "active"
    }

    $('#pagination').append(`
    <button class="btn btn-primary page ml-1 numberedButtons ${active}" value="${i}">${i} </button>
    `)
  }
  if (currentPage > 1) {
    $('#pagination').prepend(`
  <button class="btn btn-primary page ml-1 numberedButtons" value="${currentPage - 1}">&laquo; Previous</button>
`);
  }
    if (currentPage < numPages) {
      $("#pagination").append(`<button type = "button" class = "btn btn-primary pageBtn ml-1 numberedButtons"  value="${currentPage + 1}">Next</button>`)

      $("#pagination").append(`<button type = "button" class = "btn btn-primary pageBtn ml-1 numberedButtons"  value="${numPages}">Last</button>`)
    }

    if (currentPage == numPages) {
      $("#pagination").append(`<button type = "button" class = "btn btn-primary pageBtn numberedButtons"  value="1">First</button>`)
    }

  }

  const paginate = async (currentPage, PAGE_SIZE, pokemons) => {
    selected_pokemons = pokemons.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

    $('#pokeCards').empty()
    selected_pokemons.forEach(async (pokemon) => {
      const res = await axios.get(pokemon.url)
      $('#pokeCards').append(`
      <div class="pokeCard card" pokeName=${res.data.name}   >
        <h3>${res.data.name.toUpperCase()}</h3> 
        <img src="${res.data.sprites.front_default}" alt="${res.data.name}"/>
        <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#pokeModal">
          More
        </button>
        </div>  
        `)
    })
  }

  const setup = async () => {


    $('#pokeCards').empty()
    let response = await axios.get('https://pokeapi.co/api/v2/pokemon?offset=0&limit=810');
    pokemons = response.data.results;


    paginate(currentPage, PAGE_SIZE, pokemons)
    const numPages = Math.ceil(pokemons.length / PAGE_SIZE)
    updatePaginationDiv(currentPage, numPages)

    async function categories(){
      let response = await axios.get('https://pokeapi.co/api/v2/type')
 
      let types = response.data.results.map((type) => type.name);

      console.log(types)
      types.forEach((type) => {
        console.log(type)
        $('#pokeFilter').append(`
          <div  class="form-check">
            <input class="form-check-input type-checkbox" type="checkbox" value="${type}" id="${type}">
            <label class="form-check-label" for="${type}">
              ${type}
            </label>
          </div>
        `);
      });

    }
    categories();


function numberPokemon() {
  $("#pokemonnum").empty();
  const startIndex = (currentPage - 1) * PAGE_SIZE + 1;
  const endIndex = Math.min(currentPage * PAGE_SIZE, 810);
  $("#pokemonnum").append(`
    <h2>
      Showing ${startIndex}-${endIndex} of 810 pokemons
    </h2>
  `);
};numberPokemon()


    $('body').on('click', '.pokeCard', async function (e) {
      const pokemonName = $(this).attr('pokeName')
      const res = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)
      const types = res.data.types.map((type) => type.type.name)
      $('.modal-body').html(`
        <div style="width:200px">
        <img src="${res.data.sprites.other['official-artwork'].front_default}" alt="${res.data.name}"/>
        <div>
        <h3>Abilities</h3>
        <ul>
        ${res.data.abilities.map((ability) => `<li>${ability.ability.name}</li>`).join('')}
        </ul>
        </div>

        <div>
        <h3>Stats</h3>
        <ul>
        ${res.data.stats.map((stat) => `<li>${stat.stat.name}: ${stat.base_stat}</li>`).join('')}
        </ul>

        </div>

        </div>
          <h3>Types</h3>
          <ul>
          ${types.map((type) => `<li>${type}</li>`).join('')}
          </ul>
      
        `)
      $('.modal-title').html(`
        <h2>${res.data.name.toUpperCase()}</h2>
        <h5>${res.data.id}</h5>
        `)
    })

    $('body').on('click', ".numberedButtons", async function (e) {
      currentPage = Number(e.target.value)
      paginate(currentPage, PAGE_SIZE, pokemons)
      numberPokemon()

      updatePaginationDiv(currentPage, numPages)
    })

  }


  $(document).ready(setup)