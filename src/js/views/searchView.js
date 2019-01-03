import { DOMElem } from "./base"; 

export const getInput = () => DOMElem.searchInput.value;

export const clearInput = () => {
    DOMElem.searchInput.value = '';
};

export const clearResults = () => {
    DOMElem.resultList.innerHTML = '';
    DOMElem.resultsPages.innerHTML = '';
};

export const renderResults = (recipes, page = 1, resultsPerPage = 10) => {
       
    recipes.slice((page - 1) * resultsPerPage , page * resultsPerPage).forEach(element => renderRecipe(element));
   
    // render pagination buttons
    renderButtons(page, recipes.length, resultsPerPage);
};

export const highlightSelected = id =>{
    Array.from(document.querySelectorAll('.results__link')).forEach( el =>{
        el.classList.remove('results__link--active')
    });
    document.querySelector(`.results__link[href="#${id}"]`).classList.add('results__link--active');
}
    

const createButton = (page, type) =>`
    <button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page - 1 : page + 1}>
        <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>    
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
        </svg>    
    </button>
    `;

const renderButtons = (page, numberOfResults, resultsPerPage) => {
    const pages = Math.ceil(numberOfResults / resultsPerPage);

    let button = '';

    if(page === 1 && pages > 1) {
        // button for next page
        button = createButton(page, 'next');
    } else if (page < pages){
        // button for both page
        button = `${createButton(page, 'prev')} ${createButton(page, 'next')}`;
    } else if (page === pages && pages > 1){
        // button for previous page
        button = createButton(page, 'prev');
    }

    DOMElem.resultsPages.insertAdjacentHTML('afterbegin', button);
};

const renderRecipe = recipe => {

    const markup = `
    <li>
        <a class="results__link" href="#${recipe.recipe_id}">
            <figure class="results__fig">
                <img src="${recipe.image_url}" alt="${recipe.title}">
            </figure>
            <div class="results__data">
                <h4 class="results__name">${formatTitle(recipe.title)}</h4>
                <p class="results__author">${recipe.publisher}</p>
            </div>
        </a>
    </li>`;

    DOMElem.resultList.insertAdjacentHTML('beforeend', markup);
};

export const formatTitle = (title, limit = 17) => {
    const newTitle = [];

    if(title.length > limit){
        var titleArray = title.split(' ');

        titleArray.reduce((acc, cur) => {
            if(acc + cur.length <= limit) {
                newTitle.push(cur);
            } 

            return acc + cur.length;
        }, 0);

        return `${newTitle.join(' ')} ...`;
    }  
    return title;
};