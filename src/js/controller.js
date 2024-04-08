'use strict';

import * as model from './model.js';

import recipeView from './views/recipeView.js';

import searchView from './views/searchView.js';

import resultsView from './views/resultsView.js';

import paginationView from './views/paginationView.js';

import bookmarksView from './views/bookmarksView.js';

import addRecipeView from './views/addRecipeView.js';

import { MODAL_SUCCESS_SEC } from './config.js';

// if (module.hot) {
//   module.hot.accept();
// }

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;

    recipeView.renderLoader();

    await model.getRecipeData(id);

    resultsView.update(model.getSearchResultsPerPage());

    recipeView.render(model.state.recipe);

    bookmarksView.update(model.state.bookmarks);
  } catch (err) {
    recipeView.renderError();
  }
};

const controlSearch = async function () {
  try {
    const query = searchView.getQuery();

    resultsView.renderLoader();

    await model.getSearchResults(query);

    resultsView.render(model.getSearchResultsPerPage());
    console.log(model.state.search);

    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (page) {
  model.state.search.page = page;
  resultsView.render(model.getSearchResultsPerPage(page));
  paginationView.render(model.state.search);
};

const controlIngredients = function (servings) {
  model.updateIngredients(servings);
  recipeView.update(model.state.recipe);
};

const controlBookmarks = function () {
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.removeBookmark(model.state.recipe.id);

  recipeView.update(model.state.recipe);

  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarksStorage = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (data) {
  try {
    addRecipeView.toggleGrid();
    addRecipeView.renderLoader();

    await model.uploadRecipe(data);

    addRecipeView.renderMessage();
    setTimeout(() => addRecipeView.toggleWindow(), MODAL_SUCCESS_SEC * 1000);
    addRecipeView.toggleGrid();

    model.addBookmark(model.state.recipe);
    bookmarksView.render(model.state.bookmarks);

    recipeView.render(model.state.recipe);

    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    console.log(model.state.recipe);
  } catch (err) {
    console.log(err);
    addRecipeView.renderError(err.message);
  }
};

const init = function () {
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerIngredients(controlIngredients);
  recipeView.addHandlerBookmarks(controlBookmarks);
  searchView.addHandlerSearch(controlSearch);
  paginationView.addHandlerPagination(controlPagination);
  bookmarksView.addHandlerBookmarks(controlBookmarksStorage);
  addRecipeView.addHandlerGetData(controlAddRecipe);
};
init();
