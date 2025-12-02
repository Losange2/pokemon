import './assets/main.css'

export default class Obj {
    constructor(name, description) {
        this.name = name;
        this.description = description;
    }

    getInfo() {
        return document.getElementById('container').innerText += `${this.name}: ${this.description} ` + ",  ";
    }

    afficher() {
        return document.html  += (`${this.name}: ${this.description}`);
    }
}

export class Pkm extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        this.shadowRoot.innerHTML = `
            <style>
                .pkm-container {
                    border: 2px solid #000;
                    padding: 10px;
                    margin: 10px;
                    background-color: #f0f0f0;
                }
                h2 {
                    color: #000;
                    font-size: 1.2rem;
                    text-align: center;
                    margin: 5px 0;
                }
                img {
                    max-width: 150px;
                    display: block;
                    margin: 10px auto;
                }
                p {
                    color: #000;
                    text-align: center;
                    margin: 5px 0;
                }
                details {
                    margin: 10px 0;
                    padding: 10px;
                    background: #fff;
                    border-radius: 5px;
                    cursor: pointer;
                }
                summary {
                    font-weight: bold;
                    color: #000;
                    list-style: none;
                    text-align: center;
                    padding: 5px;
                }
                summary::after {
                    content: ' ▼';
                }
                details[open] summary::after {
                    content: ' ▲';
                }
                .game-list {
                    margin-top: 10px;
                    padding: 10px;
                    background: #f9f9f9;
                    border-radius: 3px;
                }
                .game-item {
                    color: #333;
                    font-size: 0.9rem;
                    padding: 3px 0;
                }
            </style>
            <div id="pkm-container" class="pkm-container">
                <h2 id="pokemon-name">connectedCallback()</h2>
                <img id="pokemon-sprite" alt="Pokémon">
                <p id="pokemon-type"></p>
                <p id="pokemon-ability"></p>
                <p id="pokemon-base-hp"></p>
                <p id="pokemon-base-attack"></p>
                <p id="pokemon-base-defense"></p>
                <p id="pokemon-base-special-attack"></p>
                <p id="pokemon-base-special-defense"></p>
                <p id="pokemon-base-speed"></p>
                <details>
                    <summary>Games</summary>
                    <div id="pokemon-games" class="game-list"></div>
                </details>
            </div>
        `;
        this.card = this.shadowRoot.querySelector('.pkm-container');
    }
    

    connectedCallback() {
        this.loadpokemon();
    }

    loadpokemon() {
        var i = 0;
        const h2 = this.shadowRoot.querySelector('#pokemon-name');
        const img = this.shadowRoot.querySelector('#pokemon-sprite');
        const ability = this.shadowRoot.querySelector('#pokemon-ability');
        const type = this.shadowRoot.querySelector('#pokemon-type');
        const base_attack = this.shadowRoot.querySelector('#pokemon-base-attack');
        const base_defense = this.shadowRoot.querySelector('#pokemon-base-defense');
        const base_hp = this.shadowRoot.querySelector('#pokemon-base-hp');
        const base_speed = this.shadowRoot.querySelector('#pokemon-base-speed');
        const base_special_attack = this.shadowRoot.querySelector('#pokemon-base-special-attack');
        const base_special_defense = this.shadowRoot.querySelector('#pokemon-base-special-defense');
        const games = this.shadowRoot.querySelector('#pokemon-games');
        h2.textContent = 'Chargement...';
        
        fetch('https://pokeapi.co/api/v2/pokemon?limit=1000&offset=0')
            .then(response => response.json())
            .then(pokemon => {
                let pokemonNames = [];
                for(let j=0; j<1; j++){
                var random = Math.floor(Math.random() * pokemon.results.length);
                    fetch('https://pokeapi.co/api/v2/pokemon/'+random)
                        .then(response => response.json())
                        .then(pokeData => {
                            h2.textContent = pokeData.name;
                            const shiny = Math.floor(Math.random() * 100) + 1;
                            if(shiny == 1){
                                img.src = pokeData.sprites.other.home.front_shiny;
                            }
                            else
                            {
                                img.src = pokeData.sprites.other.home.front_default;
                            }
                            ability.textContent = "Ability : " + pokeData.abilities[0].ability.name;
                            type.textContent = "Type : " + pokeData.types[0].type.name;
                            if (pokeData.types[1]){
                                type.textContent += ', ' + pokeData.types[1].type.name;
                            }
                            if(pokeData.abilities[1]){
                                ability.textContent += ', ' + pokeData.abilities[1].ability.name;
                            }
                            if(pokeData.abilities[2]){
                                ability.textContent += ', ' + pokeData.abilities[2].ability.name;
                            }
                            base_attack.textContent = "Attack : " + pokeData.stats[1].base_stat;
                            base_defense.textContent = "Defense : " + pokeData.stats[2].base_stat;
                            base_hp.textContent = "HP : " + pokeData.stats[0].base_stat;
                            base_speed.textContent = "Speed : " + pokeData.stats[5].base_stat;
                            base_special_attack.textContent = "Special Attack : " + pokeData.stats[3].base_stat;
                            base_special_defense.textContent = "Special Defense : " +  pokeData.stats[4].base_stat;
                            
                            // Récupérer les informations de l'espèce pour obtenir les jeux
                            fetch(pokeData.species.url)
                                .then(response => response.json())
                                .then(speciesData => {
                                    const gameVersions = speciesData.flavor_text_entries
                                        .map(entry => entry.version.name)
                                        .filter((value, index, self) => self.indexOf(value) === index);
                                    
                                    games.innerHTML = gameVersions
                                        .map(game => `<div class="game-item">• ${game}</div>`)
                                        .join('');
                                });
                            
                            i++;
                        });
                } 
            });
        
    }
}
customElements.define('pkm-component', Pkm);

