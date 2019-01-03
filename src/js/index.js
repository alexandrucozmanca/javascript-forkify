import Search from "./models/Search";
import Recipe from "./models/Recipe";
import ShopingList from "./models/ShopingList";
import LikesList from "./models/LikesList";
import * as searchView from "./views/searchView";
import * as recipeView from "./views/recipeView";
import * as shopingListView from "./views/shopingListView";
import * as likesListView from "./views/likesListView";

import { DOMElem, renderLoader, clearLoader, resultsPages} from "./views/base"; 

/** Global app state
 *  Search object
 *  Current recipe object
 *  Shopping list
 *  Linked recipes
 **/ 
const state = {
};
window.state = state;


// enable or disable likes view based on current state
if(state.likes) {
    likesListView.toggleLikeMenu(state.likes.getNumLikes());
} else{
    likesListView.toggleLikeMenu(NaN);
}


// Search Button Controller
const controllerSearchBTN = async () =>{
    // 1. get Query form view
    const query = searchView.getInput(); 
    console.log(`Search for : ${query}`);

    try{
        // 2. create new search object
        if(query){
            state.search = new Search(query);
        }

        // 3. Prepare GUI for result
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(DOMElem.results);
        
        // 4. Perform the search
        await state.search.getResults();
        console.log('Search results:');
        console.log(state.search.results);

        // 5. Render results on GUI
        clearLoader();
        searchView.renderResults(state.search.results);
    } catch(error) {
        clearLoader();
        console.warn(error);
        alert('Unable to get search results');
    }
};

DOMElem.searchBtn.addEventListener('submit', event =>{
    event.preventDefault();
    controllerSearchBTN();
});

DOMElem.resultsPages.addEventListener('click', event =>{
    const button = event.target.closest('.btn-inline');
    if(button){
        const goToPage = parseInt(button.dataset.goto, 10);
        console.log(`Go to page: ${goToPage}`);
        searchView.clearResults();
        searchView.renderResults(state.search.results, goToPage);
    }
});

// Recipe controller
const controllerRecipe = async () => {
    // 1. Get id from URL
    const id = window.location.hash.replace('#', '');


    if (id) {

        // 2. Prepare UI for changes 
        recipeView.clearRecipe();
        renderLoader(DOMElem.recipe);
        if (state.search) {
            searchView.highlightSelected(id);
        }

        // 3. Create new recipe object
        state.recipe = new Recipe(id);
       
        try {// 4. Get recipe data
        await state.recipe.getRecipe();
        
        // 5. Calculate servings and cookTime
        state.recipe.calculateCookTime();
        state.recipe.calculateServings();
        state.recipe.parseIngredients();
        window.recipe = state.recipe;

        // 6. Render recipe to GUI
        clearLoader();   
        let liked = false;
        if(state.likes){
            liked = state.likes.isLiked(state.recipe.id);
        }
        
        recipeView.renderRecipe(state.recipe, liked);
        
       } catch (error) {
            console.warn(error);
            alert('Unable to get recipe');
        }
    }   
};

// List Controller
const controllerList = () => {
    // create a new list if none exists
    if (!state.list){
        state.list = new ShopingList();
    }

    // Add ingredient to list and GUI
    state.recipe.ingredients.forEach (element => {
        const item = state.list.addItem(element.count, element.unit, element.ingredient);
        shopingListView.renderItem(item);
    });
}

// Likes Controller
const controllerLike = () => {
    // create a new like object if none exists
    if(!state.likes){
        state.likes = new LikesList();
        likesListView.toggleLikeButton(false);
    }

    const currentId = state.recipe.id;

    // User HAS NOT liked current recipe
    if(!state.likes.isLiked(currentId)){
        // add like to the state
        const newLike = state.likes.addLike(
            currentId,
            state.recipe.title,
            state.recipe.publisher,
            state.recipe.image,
        );

        // Toggle like button
        likesListView.toggleLikeButton(true);

        // Add like to GUI
        likesListView.renderLike(newLike);  
    } else{
        // User HAS  liked current recipe
        // delete like from  state
        state.likes.deleteLike(currentId);
        

        // Toggle like button
        likesListView.toggleLikeButton(false);

        // Add like to GUI
        likesListView.deleteLike(currentId);
    }
    likesListView.toggleLikeMenu(state.likes.getNumLikes());
}


// handle delete and update list item events
DOMElem.shopingList.addEventListener('click', event=> {
    const id = event.target.closest('.shopping__item').dataset.itemid;

    //Handle delete button
    if(event.target.matches('.shopping__delete, .shopping__delete *')){
        // Delete from state
        state.list.deleteItem(id);

        // Delete from GUI
        shopingListView.deleteItem(id);

        // handle count update
    } else if(event.target.matches('.shopping__count--value')) {
        const value = parseFloat(event.target.value);
        state.list.updateCount(id, value);
    }

})

// handling recipe button actions
DOMElem.recipe.addEventListener('click', event => {
    if (event.target.matches('.btn-decrease, .btn-decrease *')){
        // Decrease button is clicked
        if(state.recipe.servings > 1){
            state.recipe.updateServings('dec');
        }
    }

    if (event.target.matches('.btn-increase, .btn-increase *')){
        // Increase button is clicked
        state.recipe.updateServings('inc');
    } else if(event.target.matches('.recipe__btn--add, .recipe__btn--add *')){
        controllerList()
    } else if(event.target.matches('.recipe__love, .recipe__love *')){
        // call LikeController
        controllerLike();
    }

    recipeView.updateServingsAndIngredients(state.recipe);
    console.log(state.recipe);
    
});



// window events 
[
    'hashchange',
    'load',
].forEach(event => window.addEventListener(event, controllerRecipe));