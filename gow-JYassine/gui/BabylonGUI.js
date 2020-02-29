import GUI from "./GUI.js";

export default class BabylonGUI extends GUI{

    constructor(gui){
        super(gui)
        this.baseGUI=undefined;
    }


    getGUI(){
        return this.baseGUI;
    }
    
    createGui(){
        super.createGui()
        this.baseGUI = this.gui.AdvancedDynamicTexture.CreateFullscreenUI("UI");
         
    }

    add (element) {
        super.add(element)
        this.baseGUI.addControl(element)
    }


    destroy(){
        super.destroy()
        this.baseGUI.dispose()
    }

    
    

   
}