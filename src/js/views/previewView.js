import View from './View';
import icons from 'url:../../img/icons.svg';

class previewView extends View {
  _data;
  _parentElement = null;

  _createHTML() {
    const id = window.location.hash.slice(1);
    const sameId = id === this._data.id;
    return `<li class="preview ${sameId ? 'preview__link--active' : ''}">
            <a class="preview__link" href="#${this._data.id}">
              <figure class="preview__fig">
                <img src="${this._data.image}" alt="Dish image" />
              </figure>
              <div class="preview__data">
                <h4 class="preview__title">${this._data.title}</h4>
                <p class="preview__publisher">${this._data.publisher}</p>

                <div class="recipe__user-generated ${
                  this._data.key ? '' : 'hidden'
                }">
                  <svg>
                    <use href="${icons}#icon-user"></use>
                  </svg>
                </div>
              </div>
            </a>
          </li>`;
  }
}

export default new previewView();
