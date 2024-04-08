import View from './View';
import previewView from './previewView';

class ResultsView extends View {
  _data;
  _parentElement = document.querySelector('.results');

  _errorMessage = 'No recipes found for your query! Please try again.';
  _message = '';

  _createHTML() {
    const html = this._data
      .map(result => previewView.render(result, false))
      .join(' ');
    return html;
  }
}

export default new ResultsView();
