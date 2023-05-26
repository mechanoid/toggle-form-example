// console.log('toggle-button.js loaded')


class ToggleButton extends HTMLElement {
  #toggleState
  #fallbackContent
  #form
  #toggleButton = toggleButtonElement()

  async connectedCallback() {
    this.#fallbackContent = this.querySelector('toggle-button-fallback')
    this.#fallbackContent?.classList.add('hidden')
    this.#form = document.querySelector('form')

    if (!this.#form) throw new Error('form not found')

    this.appendChild(this.#toggleButton)

    this.#toggleButton.addEventListener('click', this.onToggleHandler.bind(this))
  }

  async onToggleHandler() {
    const action = this.#form.action
    const method = (this.data.get('_method') ? data.get('_method') : 'post').toUpperCase()
    console.log('method', method)

    const url = new URL(action)
    // requesting only the form content, without layout
    url.searchParams.set('partial', true)

    const data = this.data
    const current = this.toggleState(data)
    data.set('toggle', !current)

    const fetchOptions = {
        method,
        body: JSON.stringify(Object.fromEntries(data)),
        headers: {
          'Content-type': 'application/json; charset=UTF-8'
        }
    }

    const response = await fetch(url, fetchOptions)

    if (!response.ok) {
      throw new Error('toggling was not successful')
    }

    const partial = await response.text()

    this.#fallbackContent.innerHTML = partial

    console.log('toggle state', this.toggleState)
  }

  get data() {
    return new FormData(this.#form)
  }

  toggleState(data) {
    this.#toggleState = data.get('toggle') === "true"
    return this.#toggleState
  }
}

customElements.define('toggle-button', ToggleButton)


function toggleButtonElement() {
  const toggleButton = document.createElement('button')
  toggleButton.type = 'button'
  toggleButton.textContent = 'toggle'
  return toggleButton
}
