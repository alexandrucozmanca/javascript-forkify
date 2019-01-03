export const DOMElem = {
    searchBtn: document.querySelector('.search'),
    searchInput: document.querySelector('.search__field'),
    resultList: document.querySelector('.results__list'),
    results: document.querySelector('.results'),
    resultsPages: document.querySelector('.results__pages'),
    recipe: document.querySelector('.recipe'),
    shopingList: document.querySelector('.shopping__list'),
    likesMenu: document.querySelector('.likes__field'),
    likesList: document.querySelector('.likes__list'),
};

export const DOMStrings = {
    loader: 'loader',
};

export const renderLoader = parent => {
    const loader = `
        <div class="${DOMStrings.loader}">
            <svg>
                <use href="img/icons.svg#icon-cw"></use>
            </svg>
        </div>
    `;

    parent.insertAdjacentHTML('afterbegin', loader);
}

export const clearLoader = () => {
    const loader = document.querySelector(`.${DOMStrings.loader}`);
    
    if(loader) 
        loader.parentElement.removeChild(loader);
}