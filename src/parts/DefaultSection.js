//
// AutoSuggest SOURCE
// Defaultsection
//

const DefaultSection = {
    name: "default-section",
    props: {
        /** @type ResultSection */
        section: {
            type: Object,
            required: true,
        },
        currentIndex: {
            type: [Number, String],
            required: false,
            default: Infinity,
        },
        renderSuggestion: {
            type: Function,
            required: false,
        },
        normalizeItemFunction: {
            type: Function,
            required: true,
        },
        componentAttrPrefix: {
            type: String,
            required: true,
        },
        componentAttrIdAutosuggest: {
            type: String,
            required: true,
        },
    },
    data: function () {
        return {
            /** @type Number */
            _currentIndex: this.currentIndex,
        };
    },
    computed: {

        // suggestions from the section
        // limit number to `limit` defined in the section config, or to number of items (if < limit)
        list: function () {
            let {limit, data} = this.section;
            if (data.length < limit) {
                limit = data.length;
            }
            return data.slice(0, limit);
        },
    },
    methods: {
        getItemIndex (i) {
            return this.section.start_index + i;
        },
        getItemByIndex (i) {
            return this.section.data[i];
        },
        onMouseEnter (event) {
            const idx = parseInt(event.currentTarget.getAttribute("data-suggestion-index"));
            this._currentIndex = idx;
            this.$emit("updateCurrentIndex", idx);
        },
        onMouseLeave () {
            this.$emit("updateCurrentIndex", null);
        },
    },

    // eslint-disable-next-line no-unused-vars
    render (h) {
        const componentAttrPrefix = this.componentAttrPrefix;
        const slots = {
            beforeSection: this.$scopedSlots[`before-section-${this.section.name}`],
            afterSectionDefault: this.$scopedSlots[`after-section`],
            afterSectionNamed: this.$scopedSlots[`after-section-${this.section.name}`]
        };

        const beforeClassName = `${componentAttrPrefix}-results-before ${componentAttrPrefix}-results-before-${this.section.name}`;
        const before = (slots.beforeSection && slots.beforeSection ({
            section: this.section,
            className: beforeClassName
        })) || [];

        return h (
            // each suggestion section in results
            "div",
            {
                attrs: {
                    role: "listbox",
                    "aria-labelledby": this.section.label && `${this.componentAttrIdAutosuggest}-${this.section.label}`
                },
                class: {
                    "autosuggest-section": true,
                    ...this.section.sectionClass
                }
            },

            [
                // named before section
                before[0] && before[0] || this.section.label && <div class={beforeClassName} id={`${this.componentAttrIdAutosuggest}-${this.section.label}`}>{this.section.label}</div> || "",
                // before[0] && before[0] || this.section.label && <div class={beforeClassName} id={`${componentAttrIdAutosuggest}-${this.section.name}`}> {this.section.label}</div> || "",

                this.list.map((val, key) => {
                    const item = this.normalizeItemFunction(this.section.name, this.section.type, this.section.label, this.section.itemClass, val);
                    const itemIndex = this.getItemIndex(key);
                    const isHighlighted = this._currentIndex === itemIndex || parseInt(this.currentIndex) === itemIndex;

                    return h (
                        // collection of items in a results section
                        "div",
                        {
                            attrs: {
                                role: "option",
                                "data-suggestion-index": itemIndex,
                                "data-section-name": item.name,
                                id: `${componentAttrPrefix}-results-item-${itemIndex}`,
                                ...item.itemAttributes,
                            },
                            key: itemIndex,
                            class: {
                                [`${componentAttrPrefix}-results-item-highlighted`]: isHighlighted,
                                [`${componentAttrPrefix}-results-item`]: true,
                                ...item.itemClass
                            },
                            on: {
                                mouseenter: this.onMouseEnter,
                                mouseleave: this.onMouseLeave
                            },
                        },
                        [
                            this.renderSuggestion ? this.renderSuggestion(item) : this.$scopedSlots.default && this.$scopedSlots.default ({
                                _key: key,
                                suggestion: item,
                            }),
                        ]
                    );
                }),

                slots.afterSectionDefault && slots.afterSectionDefault ({
                    section: this.section,
                    className: `${componentAttrPrefix}-results-after ${componentAttrPrefix}-results-after-${this.section.name}`
                }),

                slots.afterSectionNamed && slots.afterSectionNamed ({
                    section: this.section,
                    className: `${componentAttrPrefix}-results-after ${componentAttrPrefix}-results-after-${this.section.name}`
                }),
            ]
        );
    }
};

export default DefaultSection;
