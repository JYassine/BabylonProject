var AudioGame = {

    addAllSongs : (audioManager) =>{
        audioManager.addSong("boatSong","audio/boat_song.wav",true,false,0.5)
        audioManager.addSong("checkPointSong","audio/success_checkpoint.wav",true,false,0.6)
        audioManager.addSong("windSong","audio/wind.wav",true,true,2)
        audioManager.addSong("backgroundSong","audio/music_bg.mp3",true,true,3)
        audioManager.addSong("clickSong","audio/button_click.wav",false,false,2)
        audioManager.addSong("crashSong","audio/crash.mp3",false,false,4)
        audioManager.addSong("clockSong","audio/tick_tock.wav",false,false,3)
        audioManager.addSong("winnerSong","audio/win.mp3",false,false,3)
        audioManager.addSong("loserSong","audio/fail_sound.mp3",false,false,3)
        
    }

}


export default AudioGame;