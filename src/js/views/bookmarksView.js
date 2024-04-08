import View from './View';
import previewView from './previewView';

class bookmarksView extends View {
  _data;
  _parentElement = document.querySelector('.bookmarks');

  _errorMessage = 'No bookmarks yet. Find a nice recipe and bookmark it ;)';
  _message = '';

  addHandlerBookmarks(handler) {
    window.addEventListener('load', handler);
  }

  _createHTML() {
    const html = this._data
      .map(bookmark => previewView.render(bookmark, false))
      .join(' ');
    return html;
  }
}

export default new bookmarksView();
