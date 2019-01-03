import axios from 'axios';

import {APIKEY, originalAPIURL} from '../config';

export default class Recipe {

    constructor(id) {
        this.id =id;
    }

    async getRecipe() {
        try{
            const apiResponse = await axios(`${originalAPIURL}get?key=${APIKEY}&rId=${this.id}`);
            console.log(apiResponse);
            this.results = apiResponse.data.recipe;
          
            // >>>>>>>>> this is a workaround for the API limit 50/day
            if(this.results){
                localStorage.setItem('recipe_result', JSON.stringify(this.results));
            }   
            else {
               this.results = JSON.parse(localStorage.getItem('recipe_result'));
               console.warn('Recipe loaded from localStorage');
               console.log(this.results);
            }
            // <<<<<<<<<

            this.title = this.results.title;
            this.publisher = this.results.publisher;
            this.image = this.results.image_url;
            this.url = this.results.source_url;
            this.ingredients = this.results.ingredients;
        } catch(error) {
            console.warn(error);
            alert(`Unable to retrieve recipe.`);
        }
    };

    calculateCookTime() {       
        // cookTime rule - for each 3 ingredients cookTime is 15 mins
        this.cookTime = Math.ceil(this.ingredients.length / 3) * 15;
    };

    calculateServings() {
        this.servings = 4;
    };
    
    updateServings (type) {
        console.log(type);
        // Servings
        const newServings = type === 'dec' ? this.servings - 1 : this.servings + 1;
        
        // Ingredients
        this.ingredients.forEach(ingredient => {
            ingredient.count *= (newServings / this.servings);
        })

        this.servings = newServings
    };

    parseIngredients() {
        const unitsLong = ['tablespoons', 'tablespoon', 
        'ounces', 'ounce',
        'teaspoons', 'teaspoon',
        'cups',
        'pounds'
        ];

        const unitsShort =['tbsp', 'tbsp', 
        'oz', 'oz',
        'tsp', 'tsp',
        'cup',
        'pound'
        ];

        const units = [...unitsShort, 'kg', 'g']

        const newIngredients = this.ingredients.map(element =>{
            // 1. Uniform units
            let ingredient = element.toLowerCase();
            unitsLong.forEach((unit, index) => {
                ingredient = ingredient.replace(unit, units[index]);
            });

            // 2. Remove parentheses
            ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');

            // 3. Parse ingredients into count, unit and ingredient
            const ingredientArray = ingredient.split(' ');
            const unitIndex = ingredientArray.findIndex(
                ingredientArrayElement => unitsShort.includes(ingredientArrayElement));

            let objectIngredient;

            if (unitIndex > -1) {
                // a unit exists in the array
                const arrayIngredientCount = ingredientArray.slice(0, unitIndex);
                let count;
                if(arrayIngredientCount.length ===1) {
                    count = eval(arrayIngredientCount[0].replace('-', '+'));
                } else {
                    count = eval(arrayIngredientCount.slice(0, unitIndex).join('+'));
                } 
                
                objectIngredient = {
                    count,
                    unit: ingredientArray[unitIndex],
                    ingredient: ingredientArray.slice(unitIndex + 1).join(' ')
                }

            } else if (parseInt(ingredientArray[0], 10)) {
                // there is no Unit, but first elem is a number
                objectIngredient = {
                    count: parseInt(ingredientArray[0], 10),
                    unit: '',
                    ingredient: ingredientArray.slice(1).join(' ')
                };
            } else if (unitIndex === -1) {
                //there is no unit and no number in 1st position
                objectIngredient = {
                    count: 1,
                    unit: '',
                    ingredient
                };
            }

            return objectIngredient;
        });
        this.ingredients = newIngredients;
    };
} 