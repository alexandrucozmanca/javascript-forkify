import axios from 'axios';

import {APIKEY, originalAPIURL} from '../config';

export default class Search {
    constructor(query) {
        this.query = query;      
    };
      
    

    async getResults() {
       
        try{
            const apiResponse = await axios(`${originalAPIURL}search?key=${APIKEY}&q=${this.query}`);
            this.results = apiResponse.data.recipes;


            // >>>>>>>>> this is a workaround for the API limit 50/day
            if(this.results){
                localStorage.setItem('recipes_results', JSON.stringify(this.results));
            }   
            else {
                console.warn('Loaded search response from Local Storage');
                this.results = JSON.parse(localStorage.getItem('recipes_results'));
            }
             // <<<<<<<<<
        }
        catch (error){
            console.warn(error);
            alert('Unable to retrieve search results')
        }
    };
}

