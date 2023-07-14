import icons from 'url:../../img/icons.svg';
import View from './View.js';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerPagination(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline ');
      if (!btn) return;
      handler(+btn.dataset.goto);
    });

    // Change pages on keydown (arrow) event
    window.addEventListener('keydown', function (e) {
      const [btnLeft, btnRight] = Array.from(
        document.querySelectorAll("[class*='pagination__btn']")
      );

      if (
        e.key === 'ArrowRight' &&
        (!btnLeft.classList.contains('pagination__btn--prev') || btnRight) // if there is only btnLeft(page1) or btnRight
      ) {
        if (btnRight) handler(+btnRight.dataset.goto);
        else handler(+btnLeft.dataset.goto);
      }

      if (
        e.key === 'ArrowLeft' &&
        !btnLeft.classList.contains('pagination__btn--next') // if btn is only for prev page (btnLeft always exists!)
      ) {
        handler(+btnLeft.dataset.goto);
      }
    });
  }

  _createHTML() {
    const curPage = this._data.page;
    const numOfPages = Math.ceil(
      this._data.results.length / this._data.numOfRecipesPerPage
    );

    if (curPage === 1 && numOfPages > 1)
      return this._generateArrowHTML(curPage, 'next');

    if (curPage > 1 && numOfPages > curPage)
      return (
        this._generateArrowHTML(curPage, 'prev') +
        this._generateArrowHTML(curPage, 'next')
      );

    if (curPage > 1 && numOfPages === curPage)
      return this._generateArrowHTML(curPage, 'prev');

    return '';
  }
  _generateArrowHTML(page, direction) {
    const isNext = direction === 'next';
    const arrow = isNext ? 'right' : 'left';
    const newPage = isNext ? page + 1 : page - 1;

    let html = `<button data-goto="${newPage}" class="btn--inline pagination__btn--${direction}">`;
    if (isNext) {
      html += `
            <span>Page ${newPage}</span>
            <svg class="search__icon">
                    <use href="${icons}#icon-arrow-${arrow}"></use>
            </svg>
        `;
    } else {
      html += `
            <svg class="search__icon">
                <use href="${icons}#icon-arrow-${arrow}"></use>
            </svg>
            <span>Page ${newPage}</span>
        `;
    }
    html += '</button>';
    return html;
  }
}

export default new PaginationView();
