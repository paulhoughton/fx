class FxDirection extends HTMLElement {
  static get observedAttributes() {
    return ['data-direction'];
  }
  attributeChangedCallback(name, oldValue, newValue) {
    if (newValue === '') return;
    this.textContent = newValue === 'false' ? '▲' : '▼';
    this.style.color = newValue === 'false' ? 'green' : 'red';
  }
}

class FxRow extends HTMLElement {
  static get observedAttributes() {
    return ['data-bid-big', 'data-bid-pips'];
  }
  constructor(tmpl, title) {
    super();
    const clone = document.importNode(tmpl.content, true);
    clone.querySelector('[data-bind]').textContent = title;
    this.watch = clone.querySelector('[data-style-bind]').dataset.styleBind;
    this.appendChild(clone);
  }
  attributeChangedCallback(name, oldValue, newValue) {
    const camelName = name.substr(5).replace(/-([a-z])/g, x => x[1].toUpperCase());
    this.querySelector(`[data-bind=${camelName}]`).textContent = newValue;
    if (camelName === this.watch && oldValue) {
      const style = this.querySelector('[data-style]');
      style.classList.add(style.dataset.style);
      this.querySelector('[data-direction]').dataset.direction = !!(oldValue > newValue);
    }
  }
}

class FxTable extends HTMLElement {
  connectedCallback() {
    io(this.dataset.src).on('data', this.update.bind(this));
  }

  update(data) {
    let rows = this.querySelectorAll('fx-row');
    if (!rows.length) {
      const mainTmpl = document.getElementById("fx-table");
      const clone = document.importNode(mainTmpl.content, true);
      const rowTmpl = clone.querySelector('template');

      data.forEach(row => clone.appendChild(new FxRow(rowTmpl, row.currencyPair)));
      this.appendChild(clone);
      rows = this.querySelectorAll('fx-row');
    }
    const bindings=rows[0].querySelectorAll('[data-bind]');
    data.forEach((row, i) => {
      const style = rows[i].querySelector('[data-style]');
      style.classList.remove(style.dataset.style);
      Array.from(bindings).forEach(bind=>rows[i].dataset[bind.dataset.bind] = row[bind.dataset.bind])
    });
  }
}

customElements.define('fx-direction', FxDirection);
customElements.define('fx-row', FxRow);
customElements.define('fx-table', FxTable);
