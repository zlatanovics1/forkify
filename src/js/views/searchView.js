class searchView {
  _parentElement = document.querySelector('.search');

  getQuery() {
    const query = this._parentElement.firstElementChild.value;
    this._clear();
    return query;
  }
  _clear() {
    this._parentElement.firstElementChild.value = '';
  }
  addHandlerSearch(handler) {
    const callback = function (e) {
      e.preventDefault();
      handler();
    };
    this._parentElement.addEventListener('submit', callback);
    this._parentElement
      .querySelector('.btn')
      .addEventListener('click', callback);
  }
}

export default new searchView();
