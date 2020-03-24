export default class AudioManager{

    constructor(){
        this.listSongs=[]
    }

    addSong(name,path){
        console.log(path+ " loaded.")
    }

    find(nameSong){
        for(let i =0;i<this.listSongs.length;i++){
            if(this.listSongs[i].name===nameSong){
                return this.listSongs[i]
            }

        }
    }
}