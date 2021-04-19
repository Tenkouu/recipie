require("@babel/polyfill");
import Search from './model/search';
import {elements, renderLoader, clearLoader} from './view/base';
import * as searchView from './view/searchView';
import Recipe from './model/recipe';

/**
 * Web аппын төлөв
 * - Хайлтын query, үр дүн
 * - Тухайн үзүүлж байгаа жор
 * - Лайкалсан жорууд
 * - Захиалж байгаа жорын найрлагууд
 */

const state = {};

/**
 *  Хайлтын контроллер = Model --> Controller <-- View
 */

const controlSearch = async () => {
    // 1. Вэбээс хайлтын түлхүүр үгийг гаргаж авна.
    const query = searchView.getInput();

    if(query){
    // 2. Шинээр хайлтын обьектийг үүсгэж өгнө.
        state.search = new Search(query);

    // 3. Хайлт хийхэд зориулж дэлгэцийн UI-г бэлтгэнэ.
        searchView.clearSearchQuery();
        searchView.clearSearchResult();
        renderLoader(elements.searchResultDiv);


    // 4. Хайлтыг гүйцэтгэнэ.
        await state.search.doSearch();

    // 5. Хайлтын үр дүнг дэлгэцэнд үзүүлнэ.
        clearLoader();
        if (state.search.result === undefined) alert('Хайлтаар илэрцгүй.')
        else searchView.renderRecipes(state.search.result);
    }
    
};

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});

elements.pageButtons.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');

    if (btn) {
        const gotoPageNumber = parseInt(btn.dataset.goto, 10);

        searchView.clearSearchResult();
        searchView.renderRecipes(state.search.result, gotoPageNumber);
    }
});

/**
 *  Жорын контроллер
 */

const controlRecipe = async () => {
    // 1. URL-аас ID-ийг салгаж авна.
    const id = window.location.hash.replace('#', '');

    // 2. Жорын моделийг үүсгэж өгнө. 
    state.recipe = new Recipe(id);

    // 3. UI-ийг бэлтгэнэ.


    // 4. Жороо татаж авчирна.
    await state.recipe.getRecipe();

    // 5. Жорыг гүйцэтгэх хугацаа болох орцыг тооцоолно.
    state.recipe.calcTime();
    state.recipe.calcPortion();

    // 6. Жороо дэлгэцэнд гаргана.
    console.log(state.recipe);

}
window.addEventListener('hashchange', controlRecipe);