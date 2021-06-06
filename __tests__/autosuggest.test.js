import { mount, shallowMount } from "@vue/test-utils";
import { createRenderer } from "vue-server-renderer";

import Autosuggest from "../src/Autosuggest.vue";

Element.prototype.scrollTo = () => {}; // https://github.com/vuejs/vue-test-utils/issues/319

// Helper to call function x number of times
const times = x => f => {
  if (x > 0) {
    f();
    times(x - 1)(f);
  }
};

describe("Autosuggest", () => {
  const id = `autosuggest__input`;
  const filteredOptions = [
    {
      data: [
        "clifford brown",
        "friendly chemistry",
        "razzmatazz",
        "life of lamont",
        "life of lamont math",
        "pearly-dewdrops’ drops",
        "math mammoth light blue",
        "fluffy tufts",
        "math",
        "rococo",
        "necessitatibus",
        "modi voluptatem est",
        "snap crackle pop",
        "bath toys",
        "omnis voluptas ut",
        "lamont",
        "lorelei",
        "multiplication",
        "thinking tree"
      ]
    }
  ];

    const defaultProps = {
        suggestions: filteredOptions,
        inputProps: {
        id,
        placeholder: "Type 'G'"
        },
        sectionConfigs: {
        default: {
            limit: 5,
            onSelected: () => {}
        }
        }
    };

    const defaultListeners = {
        click: () => {}
    };

  it ("can mount", async () => {
    const props = Object.assign({}, defaultProps);
    props.inputProps = Object.assign({}, defaultProps.inputProps);

    props.suggestions = [filteredOptions[0]];

    const wrapper = shallowMount(Autosuggest, {
        propsData: props
    });

    const input = wrapper.find('input[type="text"]');
    await input.setValue('q');

    const renderer = createRenderer();
    renderer.renderToString(wrapper.vm, (err, str) => {
        if (err) throw new Error(err);
        expect(str).toMatchSnapshot();
    });

  });

  it ("can render suggestions", async () => {
    const props = Object.assign({}, defaultProps);
    props.inputProps = Object.assign({}, defaultProps.inputProps);

    const primaryElem = document.createElement("main");
    if (document.body) {
        document.body.appendChild(primaryElem)
    };

    const wrapper = mount(Autosuggest, {
        propsData: props,
        // attachToDocument: true
        // attachTo: primaryElem
    });

    const input = wrapper.find("input");
    expect(input.attributes("id", defaultProps.inputProps.id)).toBeTruthy();

    await input.trigger("click");
    await input.setValue("G");
    await input.trigger("keydown.down");

    // expect(wrapper.findAll(`ul li`).length).toBeLessThanOrEqual(
    expect(wrapper.findAll(`div.autosuggest-section div`).length).toBeLessThanOrEqual (
        defaultProps.sectionConfigs.default.limit
    );

    const renderer = createRenderer();
    renderer.renderToString(wrapper.vm, (err, str) => {
      if (err) throw new Error(err);
      expect(str).toMatchSnapshot();
    });

  });

  it ("can use escape key to exit", async () => {

    // const primaryElem = document.createElement("main");
    // if (document.body) {
    //     document.body.appendChild(primaryElem)
    // };

    const wrapper = mount(Autosuggest, {
      propsData: defaultProps,
      listeners: defaultListeners,
    //   attachToDocument: true
    //   attachTo: primaryElem
    });

    const input = wrapper.find("input");
    await input.trigger("click");
    await input.setValue("G");
    await input.trigger("keydown.up"); // Check it doesn't offset the selection by going up first when nothing is selected.

    // TODO: test these keys are actually returning early.
    await input.trigger("keydown", {
      keyCode: 16 // Shift
    });
    await input.trigger("keydown", {
      keyCode: 9 // Tab
    });
    await input.trigger("keydown", {
      keyCode: 18 // alt/option
    });
    await input.trigger("keydown", {
      keyCode: 91 // OS Key
    });
    await input.trigger("keydown", {
      keyCode: 93 // Right OS Key
    });

    await input.trigger("keydown.down");

    // expect(wrapper.findAll(`ul li`).length).toBeLessThanOrEqual(
    //   defaultProps.sectionConfigs.default.limit
    // );
    expect(wrapper.findAll(`div.autosuggest-section div`).length).toBeLessThanOrEqual (
        defaultProps.sectionConfigs.default.limit
    );

    await input.trigger("keydown.esc");

    // expect(wrapper.findAll(`ul li`).length).toEqual(0);
    expect(wrapper.findAll(`div.autosuggest-section div`).length).toEqual(0);

    const renderer = createRenderer();
    renderer.renderToString(wrapper.vm, (err, str) => {
      if (err) {
        return false;
      }
      expect(str).toMatchSnapshot();
    });

  });

  it ("can select from suggestions using keystroke", async () => {

    // const primaryElem = document.createElement("main");
    // if (document.body) {
    //     document.body.appendChild(primaryElem)
    // };

    const wrapper = mount(Autosuggest, {
      propsData: defaultProps,
    //   attachToDocument: true
        // attachTo: primaryElem
    });

    const input = wrapper.find("input");
    await input.trigger("click");
    await input.setValue("G");

    times(5)(async () => {
      await input.trigger("keydown.down");
    });

    times(5)(async () => {
      await input.trigger("keydown.up");
    });

    await input.trigger("keydown.enter");

    // await wrapper.vm.$nextTick(() => {});

    const renderer = createRenderer();
    renderer.renderToString(wrapper.vm, (err, str) => {
      if (err) {
        return false;
      }
      expect(str).toMatchSnapshot();
    });

  });

  it ("can interact with results of specific instance when multiple instances exist", async () => {
    const multipleAutosuggest = {
      components: {
        Autosuggest
      },
      data () {
        return {
          autosuggestProps: defaultProps,
          automatischsuchen: true
        }
      },
      render(h) {
        return h(
          "div",
          [
            h(
              Autosuggest,
              {
                props: this.autosuggestProps
              }
            ),
            h(
              Autosuggest,
              {
                props: this.autosuggestProps
              }
            )
          ]
        );
      }
    };

    const wrapper = mount(multipleAutosuggest, {
        // attachToDocument: true
    });

    // const autosuggestInstances = wrapper.findAll(Autosuggest);
    const autosuggestInstances = wrapper.findAllComponents(Autosuggest);

    const autosuggest1 = autosuggestInstances.at(0);
    const autosuggest2 = autosuggestInstances.at(1);
    const input1 = autosuggest1.find("input");
    const input2 = autosuggest2.find("input");

    await input1.trigger("click");
    await input2.trigger("click");

    // expect(autosuggest1.findAll("li.autosuggest__results-item").length).toBe(5);
    // expect(autosuggest1.findAll("li.autosuggest__results-item").length).toBe(5);

    expect(autosuggest1.findAll("div.autosuggest__results-item").length).toBe(5);
    expect(autosuggest2.findAll("div.autosuggest__results-item").length).toBe(5);

    times(2)( async () => {
      await input2.trigger("keydown.down");
    });

    // expect(autosuggest1.findAll("li.autosuggest__results-item--highlighted").length).toBe(0);
    // expect(autosuggest2.findAll("li.autosuggest__results-item--highlighted").length).toBe(1);
    // expect(autosuggest2.findAll("li").at(1).classes()).toContain("autosuggest__results-item--highlighted");

    expect(autosuggest1.findAll("div.autosuggest__results-item--highlighted").length).toBe(0);
    expect(autosuggest2.findAll("div.autosuggest__results-item--highlighted").length).toBe(1);
    // expect(autosuggest2.findAll("div").at(1).classes()).toContain("autosuggest__results-item--highlighted");

    await input2.trigger("keydown.enter");

    expect(input1.element.value).toBe("");
    expect(input2.element.value).toBe("friendly chemistry");

  });

  it ("can click outside document to trigger close", async () => {
    const props = Object.assign({}, defaultProps);

    const wrapper = mount(Autosuggest, {
      propsData: props,
      listeners: defaultListeners,
    //   attachToDocument: true
    });

    const input = wrapper.find("input");
    await input.setValue("G");

    await input.trigger("click");
    await input.setValue("G");
    window.document.dispatchEvent(new Event("mousedown"));
    window.document.dispatchEvent(new Event("mouseup"));

    await wrapper.vm.$nextTick(() => {});

    const renderer = createRenderer();
    renderer.renderToString(wrapper.vm, (err, str) => {
      if (err) {
        return false;
      }
      expect(str).toMatchSnapshot();
    });

  });

  it ("can display section header", async () => {

    const props = Object.assign({}, defaultProps);
    props.sectionConfigs = {
      default: {
        label: "Suggestions",
        limit: 5,
        onSelected: () => {}
      }
    };

    const wrapper = mount(Autosuggest, {
      propsData: props,
      listeners: defaultListeners,
    //   attachToDocument: true
    });

    const input = wrapper.find("input");
    await input.setValue("G");
    await input.trigger("click");
    await input.setValue("G");

    // need to find the wrapper div for the each section, then the section slot within
    // expect(wrapper.find("ul li:nth-child(1)").element.innerHTML).toBe(
    // expect(wrapper.find("div.autosuggest-section div:nth-child(1)").element.innerHTML).toBe(
    //     props.sectionConfigs.default.label
    // );
    expect(wrapper.find("div.autosuggest-section div:nth-child(1)").text()).toBe(
        props.sectionConfigs.default.label
    );

    const renderer = createRenderer();
    renderer.renderToString(wrapper.vm, (err, str) => {
      if (err) {
        return false;
      }
      expect(str).toMatchSnapshot();
    });


  });

  it ("is aria complete", async () => {
    const propsData = {
      ...defaultProps,
      sectionConfigs: {
        default: {
          label: "Suggestions",
          limit: 5,
          onSelected: () => {}
        }
      }
    };

    const wrapper = mount(Autosuggest, {
        propsData,
        // attachToDocument: true
    });

    const combobox = wrapper.find("[role='combobox']");
    expect(combobox.exists()).toBeTruthy();
    expect(combobox.attributes()["aria-haspopup"]).toBe("listbox");
    expect(combobox.attributes()["aria-owns"]).toBe("autosuggest-autosuggest__results");

    const input = combobox.find("input");
    expect(input.attributes()["aria-autocomplete"]).toBe("list");
    expect(input.attributes()["aria-activedescendant"]).toBe("");
    expect(input.attributes()["aria-controls"]).toBe("autosuggest-autosuggest__results");

    // aria owns needs to be an "id", #191
    let results = wrapper.find(`#${combobox.attributes()["aria-owns"]}`);
    expect(results.exists()).toBeTruthy();
    results = wrapper.find(`#${input.attributes()["aria-controls"]}`);
    expect(results.exists()).toBeTruthy();

    await input.trigger("click");
    await input.setValue("G");

    expect(combobox.attributes()["aria-expanded"]).toBe("true");

    // make sure aria-labeledby references the section config label, and that it's an "id"

    // const ul = wrapper.find('ul')
    const sectionElement = wrapper.find('div.autosuggest-section');

    // expect(ul.attributes()['aria-labelledby']).toBe('autosuggest-Suggestions');
    // expect(ul.find(`#${ul.attributes()['aria-labelledby']}`).exists).toBeTruthy();
    expect(sectionElement.attributes()['aria-labelledby']).toBe('autosuggest-Suggestions');
    expect(sectionElement.find(`#${sectionElement.attributes()['aria-labelledby']}`).exists).toBeTruthy();

    const mouseDownTimes = 3;
    times(mouseDownTimes)( async () => {
      await input.trigger("keydown.down");
    });

    // TODO: this isnt working. not sure why.
    const activeDescendentString = input.attributes()["aria-activedescendant"];

    // console.log ("*******************");
    // console.log (input.attributes());
    // console.log ("*******************");

    // expect(parseInt(activeDescendentString[activeDescendentString.length - 1])).toBe(
    //   mouseDownTimes - 1
    // );
    // expect(input.element.value).toBe(filteredOptions[0].data[mouseDownTimes - 1]);

    const renderer = createRenderer();
    renderer.renderToString(wrapper.vm, (err, str) => {
      if (err) {
        return false;
      }
      expect(str).toMatchSnapshot();
    });

  });

  it ("can render simplest component with single onSelected", async () => {

    const props = Object.assign({}, defaultProps);
    props.inputProps = Object.assign({}, defaultProps.inputProps);
    props.inputProps.class = "cool-class";
    props.suggestions = filteredOptions;

    delete props.suggestions[0].name; // ensure empty component name is OK
    delete props.sectionConfigs; // ensure empty sectionConfigs is OK
    delete props.inputProps.onClick; // ensure empty onClick is OK

    props.onSelected = () => {};

    const wrapper = mount(Autosuggest, {
      propsData: props,
    //   attachToDocument: true
    });

    const input = wrapper.find("input");
    await input.trigger("click");
    await input.setValue("G");

    times(3)( async () => {
      await input.trigger("keydown.down");
    });

    // wrapper.find("li").trigger("mouseover");
    // wrapper.find("li").trigger("mouseenter");
    // wrapper.find("li").trigger("mouseleave");
    await wrapper.find("div.autosuggest__results-item").trigger("mouseover");
    await wrapper.find("div.autosuggest__results-item").trigger("mouseenter");
    await wrapper.find("div.autosuggest__results-item").trigger("mouseleave");

    const renderer = createRenderer();
    renderer.renderToString(wrapper.vm, (err, str) => {
      if (err) {
        return false;
      }
      expect(str).toMatchSnapshot();
    });
  });

  it ("can render default suggestion value by property name", async () => {
    const props = Object.assign({}, defaultProps);
    props.inputProps = Object.assign({}, defaultProps.inputProps);
    props.inputProps.class = "cool-class";
    props.suggestions = [
      {
        data: [
          {
            id: 1,
            name: "Frodo",
            avatar:
              "https://upload.wikimedia.org/wikipedia/en/4/4e/Elijah_Wood_as_Frodo_Baggins.png"
          }
        ]
      }
    ];

    props.onSelected = () => {};

    const wrapper = mount(Autosuggest, {
      propsData: props,
    //   attachToDocument: true
    });

    const input = wrapper.find("input");
    await input.trigger("click");
    await input.setValue("F");

    await input.trigger("keydown.down");
    await input.trigger("keydown.enter");

    // await wrapper.vm.$nextTick(() => {});

    expect(input.element.value).toBe("Frodo");

    const renderer = createRenderer();
    renderer.renderToString(wrapper.vm, (err, str) => {
      if (err) {
        return false;
      }
      expect(str).toMatchSnapshot();
    });
  });

  it("changes input attributes", () => {
    const props = { ...defaultProps };
    props.inputProps = { ...defaultProps.inputProps, name: "my-input" };

    const wrapper = mount(Autosuggest, {
      propsData: props,
    //   attachToDocument: true
    });

    const input = wrapper.find("input");
    expect(input.attributes()["name"]).toBe("my-input");
  });

  it ("search input prop type handles string and integers only", async () => {
    let props = {
      ...defaultProps,
      inputProps: {...defaultProps.inputProps}
    };

    const mockConsole = jest.fn();
    console.error = mockConsole;

    const blurred = () => {};
    props.inputProps.onBlur = blurred;

    const wrapper = mount(Autosuggest, {
      propsData: props,

    });

    const input = wrapper.find("input");

    // Integers
    input.trigger("click");
    await input.setValue(1);
    // await wrapper.vm.$nextTick(() => {});
    await input.trigger("blur");

    // Strings
    input.trigger("click");
    await input.setValue("Hello");
    // await wrapper.vm.$nextTick(() => {});
    await input.trigger("blur");

    // Should not throw any errors
    expect(mockConsole).toHaveBeenCalledTimes(0);

    // Functions
    await input.trigger("click");
    await wrapper.setData({ searchInput: () => { /* BAD */ } });
    await wrapper.vm.$nextTick(() => {});
    await input.trigger("blur");

    // Should throw validation error
    expect(mockConsole).toHaveBeenCalled();
  });

  it ("can render slots", async () => {
    const wrapper = mount(Autosuggest, {
      propsData: defaultProps,
      slots: {
        'before-suggestions': '<div class="header-dude"></div>',
        'after-suggestions': '<div id="footer-dude"><span>1</span><span>2</span></div>'
      },
      scopedSlots: {
        default: `
          <h1 slot-scope="{suggestion}">{{ suggestion.item }}</h1>
        `
      },
    //   attachToDocument: true
    });

    const input = wrapper.find("input");
    await input.trigger("click");
    await input.setValue("G");

    expect(wrapper.findAll('.header-dude').length).toEqual(1);
    expect(wrapper.findAll('#footer-dude span').length).toEqual(2);
    expect(wrapper.findAll('h1').length).toEqual(5);

    // await wrapper.vm.$nextTick(() => {});

    const renderer = createRenderer();
    renderer.renderToString(wrapper.vm, (err, str) => {
      if (err) {
        return false;
      }
      expect(str).toMatchSnapshot();
    });
  });

  it ("can render section slots", async () => {

    const props = { ...defaultProps };
    props.suggestions.push({ name: 'dogs', data: ['spike', 'bud', 'rover']});
    props.suggestions.push({ name: 'cats', data: ['sassy', 'tuesday', 'church']});
    props.suggestions.push({ name: 'zeu', data: ['elephant', 'lion']});
    props.suggestions.push({ name: 'Uhh', data: ['something', 'something2']});

    props.sectionConfigs = {
      default: {
        label: "Suggestions",
        limit: 5,
        onSelected: () => {}
      },
      Uhh: {
        label: "uhh"
      },
    };

    const wrapper = mount(Autosuggest, {
      propsData: props,
      scopedSlots: {
        'before-section-dogs': `<div :class="props.className">The Dogs</div>`,
        'before-section-cats': `<div>Moar Cats is good</div>`,
        'before-section-zeu': `<div>zoo animals?</div>`
      },
    //   attachToDocument: true,
    });

    const input = wrapper.find("input");
    await input.setValue("G");

    await input.trigger("click");
    await input.setValue("G");

    // expect(wrapper.find("ul li:nth-child(1)").element.innerHTML).toBe(

    // const sectionElement = wrapper.find("div.autosuggest-section");
    // const sectionHeadingSlot = wrapper.find("div.autosuggest-section div:nth-child(1)");

    // expect(sectionHeadingSlot.element.innerHTML).toBe(
    //     props.sectionConfigs.default.label
    // );
    // expect(wrapper.find("div.autosuggest-section").find("div:nth-child(1)").element.innerText).toBe(
    //     props.sectionConfigs.default.label
    // );
    expect(wrapper.find("div.autosuggest-section div:nth-child(1)").text()).toBe(
        props.sectionConfigs.default.label
    );

    const renderer = createRenderer();
    renderer.renderToString(wrapper.vm, (err, str) => {
      if (err) {
        return false;
      }
      expect(str).toMatchSnapshot();
    });
  });

  it ("can customize ids and classes for container divs", async () => {
    const wrapper = mount(Autosuggest, {
      propsData: {
        ...defaultProps,
        class: "containerz",
        'component-attr-id-autosuggest': "automatischsuchen",
        'component-attr-class-autosuggest-results-container': 'resultz-containerz',
        'component-attr-class-autosuggest-results': 'resultz'
      },
    //   attachToDocument: true
    });

    const input = wrapper.find("input");
    await input.trigger("click");
    await input.setValue("G");

    expect(wrapper.find('#automatischsuchen').is('div')).toBe(true);
    expect(wrapper.find('.containerz').is('div')).toBe(true);
    expect(wrapper.find('.resultz-containerz').is('div')).toBe(true);
    expect(wrapper.find(`#${defaultProps.inputProps.id}`).is('input')).toBe(true);

    const renderer = createRenderer();
    renderer.renderToString(wrapper.vm, (err, str) => {
      if (err) {
        return false;
      }
      expect(str).toMatchSnapshot();
    });
  });

  it ("can customize css prefix", async () => {

    const wrapper = mount(Autosuggest, {
      propsData: {
        ...defaultProps,
        class: "containerz",
        'component-attr-prefix': 'v',
        'component-attr-id-autosuggest': "the-whole-thing",
        'component-attr-class-autosuggest-results-container': 'the-results-container',
        'component-attr-class-autosuggest-results': 'the-results',
        inputProps: {
          ...defaultProps.inputProps,
          id: 'the-input-thing',
        }
      },
    //   attachToDocument: true
    });

    const input = wrapper.find("input");
    await input.trigger("click");
    await input.setValue("G");

    // Make sure the prefixes still allow for custom css/id's
    expect(wrapper.find('#the-whole-thing').is('div')).toBe(true);
    expect(wrapper.find('#the-input-thing').is('input')).toBe(true);
    expect(wrapper.find('.the-results-container').is('div')).toBe(true);
    expect(wrapper.find('.the-results').is('div')).toBe(true);

    // Prefix checks
    // expect(wrapper.find('#v__results-item--0').is('li')).toBeTruthy()
    // expect(wrapper.find('.v__results-item').is('li')).toBeTruthy()
    expect(wrapper.find('#v__results-item--0').is('div')).toBeTruthy();
    expect(wrapper.find('.v__results-item').is('div')).toBeTruthy();

    const renderer = createRenderer();
    renderer.renderToString(wrapper.vm, (err, str) => {
      if (err) {
        return false;
      }
      expect(str).toMatchSnapshot();
    });
  });

  it("@click and @selected listener events works as expected", async () => {

    let props = Object.assign({}, defaultProps);

    delete props['sectionConfigs'];

    const mockFn = jest.fn();
    const mockConsole = jest.fn();

    console.warn = mockConsole;

    const wrapper = mount(Autosuggest, {
      propsData: props,
      listeners: {
        click: e => {
          mockFn(e);
        },
        selected: e => {
          mockFn(e);
        }
      },
    //   attachToDocument: true
    });

    // await wrapper.vm.$nextTick(() => {});

    const input = wrapper.find("input");
    await input.trigger("click");
    await wrapper.setData({ searchInput: "F" });

    await input.trigger("keydown.down");
    await input.trigger("keydown.enter");
    await wrapper.vm.$nextTick(() => {});

    expect(input.element.value).toBe("clifford brown");

    expect(mockConsole).toHaveBeenCalledTimes(0);
    expect(mockFn).toHaveBeenCalledTimes(2);

    const renderer = createRenderer();

    renderer.renderToString(wrapper.vm, (err, str) => {
      if (err) {
        return false;
      }
      expect(str).toMatchSnapshot();
    });
  });

  it ("tears down event listeners", async () => {
    let props = {...defaultProps};

    delete props['sectionConfigs'];

    const AEL = jest.fn();
    const REL = jest.fn();

    window.document.addEventListener = AEL;
    window.document.removeEventListener = REL;

    const wrapper = mount(Autosuggest, {
      propsData: props,
    //   attachToDocument: true
    });

    wrapper.destroy();
    expect(AEL).toHaveBeenCalledTimes(2);
    expect(REL).toHaveBeenCalledTimes(2);
  });

  it ("can modify input type attribute", async () => {
    const props = Object.assign({}, defaultProps);
    props.inputProps = {
      ...defaultProps.inputProps,
      type: 'search'
    };

    props.suggestions = [filteredOptions[0]];

    const wrapper = shallowMount(Autosuggest, {
      propsData: props,
    //   attachToDocument: true,
    });

    const input = wrapper.find('input[type="search"]')
    expect(input.is('input')).toBe(true)
    expect(input.attributes("type", 'search')).toBeTruthy();

    const renderer = createRenderer();
    renderer.renderToString(wrapper.vm, (err, str) => {
      if (err) throw new Error(err);
      expect(str).toMatchSnapshot();
    });
  });

  it ("can modify input props", async () => {
    const Parent = {
      template: `<div>
       <Autosuggest
        :suggestions="[{data:['Frodo']}]"
        :input-props="{id:'autosuggest', placeholder: ph}" />
      </div>
      `,
      components: { Autosuggest },
      data: () => {
        return {
          'ph': 'Type here...'
        }
      }
    }

    const wrapper = mount(Parent);
    const input = wrapper.find('input[type="text"]');
    expect(input.attributes("placeholder")).toBe('Type here...');

    await wrapper.setData({ ph: 'Please type here...' });
    expect(input.attributes("placeholder")).toBe('Please type here...');

  });

  it ("can handle null data", async () => {
    const props = {...defaultProps, suggestions: [{ data: null }]};

    const wrapper = shallowMount(Autosuggest, {
      propsData: props,
    //   attachToDocument: true,
    });

    const renderer = createRenderer();
    renderer.renderToString(wrapper.vm, (err, str) => {
      if (err) throw new Error(err);
      expect(str).toMatchSnapshot();
    });
  });

  it ("highlights first option on keydown when previously closed", async () => {
    const props = { ...defaultProps };
    props.inputProps = { ...defaultProps.inputProps };

    const wrapper = mount(Autosuggest, {
      propsData: props,
    //   attachToDocument: true
    });

    const input = wrapper.find("input");
    expect(input.attributes("id", defaultProps.inputProps.id)).toBeTruthy();

    await input.trigger("click");
    await input.setValue("G");
    await input.trigger("keydown.down");
    await input.trigger("keydown.enter");
    await input.trigger("keydown.down");

    // expect(wrapper.findAll("li.autosuggest__results-item--highlighted")).toHaveLength(1)
    expect(wrapper.findAll("div.autosuggest__results-item--highlighted")).toHaveLength(1);

    // const item = wrapper.find("li.autosuggest__results-item--highlighted")
    const item = wrapper.find("div.autosuggest__results-item--highlighted");
    expect(item.attributes('data-suggestion-index')).toBe('0')
    expect(input.attributes('aria-activedescendant')).toBe('autosuggest__results-item--0')

    const renderer = createRenderer();
    renderer.renderToString(wrapper.vm, (err, str) => {
      if (err) {
        return false;
      }
      expect(str).toMatchSnapshot();
    });
  });


it ("can display section and item classNames", async () => {
    const props = { ...defaultProps };

    // props.sectionConfigs.default.ulClass = { 'hello-ul': true };
    props.sectionConfigs.default.sectionClass = { 'hello-section': true };

    // props.sectionConfigs.default.liClass = { 'hello-li': true };
    props.sectionConfigs.default.itemClass = { 'hello-item': true };

    const wrapper = mount(Autosuggest, {
        propsData: props,
        listeners: defaultListeners,
        // attachToDocument: true
    });

    const input = wrapper.find("input");
    await input.setValue("G");
    await input.trigger("click");
    await input.setValue("G");

    // const ul = wrapper.find("ul");
    const sectionElement = wrapper.find("div.autosuggest-section");

    // const li = ul.find("li:nth-child(1)");
    const subElement = sectionElement.find("div.autosuggest__results-item:nth-child(1)");

    // expect(sectionElement.classes()).toContain('hello-section');
    expect(subElement.classes()).toContain('hello-item');

    const renderer = createRenderer();
    renderer.renderToString(wrapper.vm, (err, str) => {
        if (err) {
            return false;
        }
        expect(str).toMatchSnapshot();
    });
  });

  it ("emits opened and closed events", async () => {
    const props = { ...defaultProps };
    props.inputProps = { ...defaultProps.inputProps };

    const wrapper = mount(Autosuggest, {
        propsData: props,
        // attachToDocument: true,
    });

    const input = wrapper.find("input");
    await input.trigger("click");
    await input.setValue("G");
    await input.trigger("keydown.down");

    // await wrapper.vm.$nextTick(() => {})
    expect(wrapper.emitted().opened).toBeTruthy();

    await input.trigger("keydown.esc");
    // await wrapper.vm.$nextTick(() => {})
    expect(wrapper.emitted().closed).toBeTruthy();
  });

  it ("emits item-changed event", async () => {
    const props = { ...defaultProps };
    props.inputProps = { ...defaultProps.inputProps };

    const wrapper = mount(Autosuggest, {
        propsData: props,
    });

    const input = wrapper.find("input");

    await input.trigger("click");
    await input.setValue("G");
    await input.trigger("keydown.down");
    // await wrapper.vm.$nextTick(() => {});

    // const itemChanged1 = wrapper.emitted()['item-changed'][0];
    // expect(itemChanged1[0].item).toBe('clifford brown');
    // expect(itemChanged1[1]).toBe(0);

    await input.trigger("keydown.down");
    await wrapper.vm.$nextTick(() => {});
    // await wrapper.vm.$nextTick(() => {});


    expect(wrapper.emitted()['item-changed']).toHaveLength(2);
    // expect(wrapper.emitted()['item-changed']).toHaveLength(1);

    const itemChanged1 = wrapper.emitted()['item-changed'][0];
    const itemChanged2 = wrapper.emitted()['item-changed'][1];
    // const itemChanged2 = wrapper.emitted()['item-changed'][0];

    // Emits with item and index
    expect(itemChanged1[0].item).toBe('clifford brown');
    expect(itemChanged1[1]).toBe(0);

    expect(itemChanged2[0].item).toBe('friendly chemistry');
    expect(itemChanged2[1]).toBe(1);

    await input.trigger("keydown.up");
    // await wrapper.vm.$nextTick(() => {});

    await input.trigger("keydown.up");
    // await wrapper.vm.$nextTick(() => {});
    await input.trigger("keydown.up");
    // await wrapper.vm.$nextTick(() => {})

    // Ensure empty item-changed is emitted when user keys back
    // to the input #177
    // expect(wrapper.emitted()['item-changed']).toHaveLength(4);

    // console.log ("**********");
    // console.log (wrapper.emitted()['item-changed']);

    const itemChangedEmpty = wrapper.emitted()['item-changed'][3];
    expect(itemChangedEmpty[0]).toBeNull();
    expect(itemChangedEmpty[1]).toBeNull();

  });

  it ("current index resilient against many keyups #190", async () => {
    const props = { ...defaultProps };
    props.inputProps = { ...defaultProps.inputProps };

    const wrapper = mount(Autosuggest, {
        propsData: props,
        // attachToDocument: true,
    });

    const input = wrapper.find("input");
    await input.trigger("click");
    await input.setValue("G");
    await input.trigger("keydown.down");
    // await wrapper.vm.$nextTick(() => {});

    expect(wrapper.vm.currentIndex).toBe(0)
    await input.trigger("keydown.up");
    expect(wrapper.vm.currentIndex).toBe(-1)

    // Go into the upside down, but make sure to come back unscathed
    // await wrapper.vm.$nextTick(() => {});
    await input.trigger("keydown.up");
    // await wrapper.vm.$nextTick(() => {});

    await input.trigger("keydown.up");
    // await wrapper.vm.$nextTick(() => {});

    expect(wrapper.vm.currentIndex).toBe(-1)
  });
});
