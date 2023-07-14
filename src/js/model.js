import { AJAX } from './helpers.js';
import { NUM_REC_PER_PAGE, RECIPE_URL, API_KEY } from './config.js';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1, // default
    numOfRecipesPerPage: NUM_REC_PER_PAGE,
  },
  bookmarks: [],
};

const getObjectData = function (data) {
  const recipeData = data.data.recipe;
  return {
    id: recipeData.id,
    title: recipeData.title,
    publisher: recipeData.publisher,
    sourceUrl: recipeData.source_url,
    image: recipeData.image_url,
    servings: recipeData.servings,
    cookingTime: recipeData.cooking_time,
    ingredients: recipeData.ingredients,
    ...(recipeData.key && { key: recipeData.key }),
  };
};

export const getRecipeData = async function (id) {
  try {
    const data = await AJAX(`${RECIPE_URL}/${id}?key=${API_KEY}`);

    state.recipe = getObjectData(data);

    if (state.bookmarks.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
  } catch (err) {
    throw err;
  }
};

export const getSearchResults = async function (query) {
  try {
    const data = await AJAX(`${RECIPE_URL}?search=${query}&key=${API_KEY}`);

    state.search.results = data.data.recipes.map(recipeData => {
      return {
        id: recipeData.id,
        title: recipeData.title,
        publisher: recipeData.publisher,
        image: recipeData.image_url,
        ...(recipeData.key && { key: recipeData.key }),
      };
    });
    state.search.page = 1;
    state.search.query = query;
  } catch (err) {
    throw err;
  }
};

export const getSearchResultsPerPage = function (page = state.search.page) {
  const start = (page - 1) * NUM_REC_PER_PAGE; // default 0
  const end = page * NUM_REC_PER_PAGE; // default 10

  return state.search.results.slice(start, end);
};

export const updateIngredients = function (servings) {
  state.recipe.ingredients.forEach(
    ing => (ing.quantity = (ing.quantity * servings) / state.recipe.servings)
  );
  state.recipe.servings = servings;
};

const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookmark = function (recipe) {
  state.bookmarks.push(recipe);

  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  persistBookmarks();
};

export const removeBookmark = function (id) {
  const index = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(index, 1);

  if (id === state.recipe.id) state.recipe.bookmarked = false;

  persistBookmarks();
};

// get bookmarks(if any) from local storage on page load
const init = function () {
  const storageBookmarks = localStorage.getItem('bookmarks');
  if (storageBookmarks) state.bookmarks = JSON.parse(storageBookmarks);
};
init();

export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(el => el[0].startsWith('ingredient') && el[1])
      .map(ing => {
        const ingArr = ing[1].split(',').map(el => el.trim());
        if (ingArr.length < 3)
          throw new Error(
            'Invalid ingredient format! Please try again using the correct format.'
          );
        const [quantity, unit, description] = ingArr;
        return {
          quantity: quantity ? +quantity : null,
          unit,
          description,
        };
      });

    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };

    const APIdata = await AJAX(`${RECIPE_URL}?key=${API_KEY}`, recipe);
    state.recipe = getObjectData(APIdata);
  } catch (err) {
    throw err;
  }
};
