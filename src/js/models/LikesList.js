export default class LikesList {
    constructor () {
        this.likes = [];
    }

    addLike(id, title, publisher, image) {
        const like = {id, title, publisher, image}
        this.likes.push(like);
        return like;
    };

    deleteLike(id) { 
        const index = this.likes.findIndex(element => element.id === id);
        return this.likes.splice(index, 1);
    };

    isLiked(id){
        return (this.likes.findIndex(element => element.id === id) !== -1);
    };

    getNumLikes(){
        return this.likes.length;
    }
};