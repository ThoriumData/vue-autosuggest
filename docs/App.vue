<template>
    <main class="demo" v-if="theme">

        <button @click="toggleTheme(oppositeTheme)">{{ oppositeTheme === 'light' ? '🌞 Go Light' : 'Go Dark 🌛' }}</button>

        <h1>Vue-autosuggest</h1>

        <div>
            <vue-autosuggest
                v-model="searchText"
                componentAttrIdAutosuggest="demo-autosuggest"
                @input="(...args) => logEvent('input', args)"
                @highlighted="(...args) => logEvent('highlighted', args)"
                @selected="onSelected"
                :suggestions="filteredOptions"
                :input-props="inputProps"
                :section-configs="sectionConfigs"
                :getSuggestionValue="getSuggestionValue"
                :should-render-suggestions="(size, loading) => size >= 0 && !loading && searchText !== ''"
                ref="autocomplete"
            >
                <template slot="before-input">
                    <label :for="inputProps.id">Select a Character</label>
                </template>

                <template slot-scope="{suggestion, index, cs}">
                    <div>{{ suggestion && suggestion.item.Name }}</div>
                </template>

                <template slot="after-suggestions">
                    <p v-if="filteredOptions == 0" style="text-align: center;">
                        No Results... Try <a style="color: peachpuff;" :href="`https://www.google.com/search?safe=active&source=hp&ei=t_M-Xci6EYq6tgXrzbLoCw&q=${searchText}`" @mouseup.stop target="_blank">googling</a>
                    </p>
                </template>

            </vue-autosuggest>
        </div>

        <div class="characterCommentary">
            <span v-if="selected.Race === 'Human' && selected.Name === 'Aragorn I'">
                "Not idly do the leaves of Lórien fall," proclaimed Aragorn.
            </span>
            <span v-else-if="selected.Race === 'Human'">
                You have choosen poorly. Humans
                are like... the worst.
            </span>
            <span v-else-if="selected.Race === 'Elf' && selected.Name === 'Legolas'">
                Legolas is like... so hawt.
            </span>
            <span v-else-if="selected.Race === 'Elf' && selected.Name === 'Galadriel'">
                "Things that were... things that are... and some things... that have not
                yet come to pass." Wait... is that in the book?!
            </span>
            <span v-else-if="selected.Race === 'Dwarf' && selected.Name === 'Gimli'">
                And with my axe!
            </span>
            <span v-else-if="selected.Race === 'Dwarf'">
                What is the plural of Dwarf anyways?
            </span>
            <span v-else-if="selected.Race === 'Maiar' && selected.Name === 'Gandalf'">
                The counsel of Gandalf was not founded on foreknowledge of safety, for
                himself or for others," said Aragorn. "There are some things that it is
                better to begin than to refuse, even though the end may be dark."
            </span>
            <span v-else-if="selected.Race === 'Hobbit'">
                Sneaky little Hobbitses. Wicked. Tricksy.
            </span>
        </div>

        <div class="event-log">
            <div v-for="evt in events">
                <span class="evt-name">{{ evt.name }}</span>: <span class="evt-val">{{ evt.value }}</span>
            </div>
        </div>
    </main>
</template>

<script>
import VueAutosuggest from "../src/Autosuggest.vue";
import characters from './lotr-character';

function updateCSSVariables(theme) {
    for (const key in theme) {
        document.body.style.setProperty(`--theme-${key}`, theme[key]);
    }
}

const races = [...new Set(characters.map(c => { return c.Race }))];

export default {
    components: {
        VueAutosuggest
    },


    data() {
        return {
            selected: "",
            searchText: "",

            theme: null,

            options: races.map(r => ({
                label: r,
                name: r,
                data: characters.filter(c => c.Race === r)
                })
            ),

            sectionConfigs: {

                default: {
                    limit: 4,
                    sectionClass: null,
                    itemClass: null,
                },

                Elf: {
                    limit: 6,
                    itemClass: {'elf-row': true }
                }
            },
            inputProps: {
                id: "autosuggest-input",
                placeholder: "Search..."
            },
            themes: {
                dark: {
                    bg: '#21222C',
                    color: 'white',
                    header: '#8F73BD',
                    item_color_highlighted: '#80D4E7',
                    item_bg_highlighted: '#363948',
                },
                light: {
                    bg: 'white',
                    header: '#8F73BD',
                    color: 'black',
                    item_color_highlighted: 'black',
                    item_bg_highlighted: '#e0e0e0',
                }
            },
            events: []
        };
    },

    computed: {

        oppositeTheme() {
            return (this.theme === 'light') ? 'dark' : 'light';
        },

        filteredOptions() {
            const filtered = [];
            if (!this.searchText) {
                return [];
            }
            races.forEach(r => {
                const people = this.options.filter(o => o.name === r)[0].data.filter(p => {
                    return p.Name.toLowerCase().indexOf(this.searchText.toLowerCase()) > -1;
                }).map(p => {
                    p.itemClass = p.Name === 'Gandalf' ? {'gandalf': true} : null;
                    return p;
                });

                people.length > 0 &&
                filtered.push({
                    name: Object.keys(this.sectionConfigs).indexOf(r) > -1 ? r : 'default',
                    label: r,
                    // label: "Suggestions",
                    data: people
                });
            })

            return Object.freeze(filtered);
        }
    },

    methods: {
        toggleTheme(theme){
            this.theme = theme
            localStorage.setItem('autosuggest-theme', theme)
            console.log('setting', theme)
            updateCSSVariables(this.themes[this.theme])
        },

        getSuggestionValue(item) {
            return item.item.Name;
        },

        logEvent(name, value) {
            this.events.unshift({ name, value })
        },

        onSelected(...args) {
            const item = args[0];
            this.logEvent('selected', args);
            if (!item) {
                return;
            }
            this.selected = item.item;
        }
    },

    mounted(){
        const storageTheme = localStorage.getItem('autosuggest-theme');
        const theme = storageTheme || (window.matchMedia("(prefers-color-scheme: dark)").matches ? 'dark' : 'light');
        console.log({theme});
        this.toggleTheme(theme);
    },

};
</script>

<style lang="scss">

$font-size: .9rem;

$autosuggest-item-hilight-color:     #E1FFB9;


// for demo/doc
button {
    position: absolute;
    right: 1rem;
    bottom: 1rem;
    background: var(--theme-bg);
    color: var(--theme-color);
    text-transform: uppercase;
    font-weight: 700;
    font-size: 0.66rem;
    white-space: nowrap;
    border: 3px solid var(--theme-color);
    border-radius: 2rem;
    padding: 0.2rem 0.85rem 0.25rem 0.85rem;
    cursor: pointer;
}

// for demo/doc
h1 {
    color: var(--theme-header);
}

// for demo/doc
* {
    transition: height 0.2s linear;
    transition: border-color linear 0.1s;
}

// for demo/doc
#demo-autosuggest {
    label {
        margin-bottom: 1rem;
        display: block;
    }
}

.characterCommentary {
    margin-bottom: 1rem;
    padding-top: 1rem;
}



#autosuggest-input {
    background-color: var(--theme-bg);
    caret-color: #ddd;
    color: var(--theme-color);
    position: relative;
    display: block;
    font-family: monospace;
    font-size: 20px;
    border: 1px solid #616161;
    border-radius: 3px;
    padding: 10px;
    width: 100%;
    box-sizing: border-box;
}

#autosuggest-input {

    &.autosuggest-input-open,
    &:hover {
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
        border: 1px solid lightgray;
    }
}



.autosuggest-results-container {
    position: relative;
    width: 100%;
    background-color: var(--theme-bg);
}

.autosuggest-results {
    background-color: var(--theme-bg);
    font-weight: 300;
    margin: 0;
    position: absolute;
    z-index: 10000001;
    width: 100%;
    border: 1px solid #e0e0e0;
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
    padding: 0px;
    overflow: scroll;
    max-height: 400px;

    .autosuggest-results-item {
        cursor: pointer;
        background-color: var(--theme-bg);
        padding: 10px;
    }

}



// #autosuggest ul:nth-child(1) > .autosuggest-results-before {
//     border-top: none;
// }
// #autosuggest {
//     ul:nth-child(1) {
//         > .autosuggest-results-before {
//             border-top: none;
//         }

//     }
// }

#autosuggest {
    .autosuggest-section:nth-child(1) {
        > .autosuggest-results-before {
            border-top: none;
        }
    }
}



.autosuggest-results {

    // slot
    .autosuggest-results-before {
        color: var(--theme-color);
        // opacity: 0.5;
        font-size: 11px;
        margin-left: 0;
        padding: 15px 13px 5px;
        border-top: 1px solid lightgray;
    }
}

// .autosuggest-results .autosuggest-results-item:active,
// .autosuggest-results .autosuggest-results-item:hover,
// .autosuggest-results .autosuggest-results-item:focus,
// .autosuggest-results .autosuggest-results-item.autosuggest-results-item-highlighted {
//     background-color: var(--theme-item_bg_highlighted);
//     color: var(--theme-item_color_highlighted);
// }

.autosuggest-results {
    .autosuggest-results-item {

        &:active,
        &:hover,
        &:focus,
        &.autosuggest-results-item-highlighted {
            background-color: var(--theme-item_bg_highlighted);
            color: var(--theme-item_color_highlighted);
        }
    }
}


// event log element
/* @media screen and (max-width: 900px) {
  .event-log {
    display: none;
  }
} */

.event-log {
    left: 1rem;
    position: absolute;
    width: 800px;
    height: 500px;
    bottom: 1rem;
    border: 1px solid var(--theme-color);
    border-radius: 2px;
    padding: 1rem;
    overflow: scroll;
}

.evt-name {
    color: var(--theme-item_color_highlighted);
}
.evt-val {
    color: var(--theme-color);
}

.elf-row {
    font-style: italic;
}

.gandalf {
    color: var(--theme-header);
}
</style>
