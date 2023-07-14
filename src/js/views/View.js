import icons from 'url:../../img/icons.svg';

export default class View {
  _data;
  _parentElement;
  _errorMessage;
  _message;

  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();

    this._data = data;
    const html = this._createHTML();
    if (!render) return html;
    this._clear();
    this._parentElement.insertAdjacentHTML('beforeend', html);
  }

  update(data) {
    this._data = data;
    const html = this._createHTML();

    const newDOM = Array.from(
      document
        .createRange()
        .createContextualFragment(html)
        .querySelectorAll('*')
    );
    const currentDOM = Array.from(this._parentElement.querySelectorAll('*'));

    newDOM.forEach((newNode, i) => {
      const currentNode = currentDOM[i];

      if (
        !newNode.isEqualNode(currentNode) &&
        currentNode.firstChild?.nodeValue.trim() !== ''
      ) {
        currentNode.textContent = newNode.textContent;
      }
      if (!newNode.isEqualNode(currentNode)) {
        Array.from(newNode.attributes).forEach(attr =>
          currentNode.setAttribute(attr.name, attr.value)
        );
      }
    });
  }

  renderLoader() {
    const loaderHTML = `
            <div class="spinner">
            <svg>
              <use href="${icons}#icon-loader"></use>
            </svg>
          </div> 
        `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', loaderHTML);
  }

  renderError(message = this._errorMessage) {
    const html = `
    <div class="error">
            <div>
              <svg>
                <use href="${icons}#icon-alert-triangle"></use>
              </svg>
            </div>
            <p>${message}</p>
    </div>
    `;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', html);
  }

  renderMessage(message = this._message) {
    const html = `
    <div class="message">
            <div>
              <svg>
                <use href="${icons}#icon-smile"></use>
              </svg>
            </div>
            <p>${message}</p>
    </div>
    `;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', html);
  }

  _clear() {
    this._parentElement.innerHTML = '';
  }
}
