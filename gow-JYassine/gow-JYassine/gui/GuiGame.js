 var GuiGame = {

    displayGUI : (textPassed, babylonGUI,textStart,maxTime,numberCheckPointPassed,numberCheckPoint,textTimer,timer) => {
        babylonGUI.createGui()

        // GUI FOR TEXT STARTING
        textStart.text = "Click anywhere to START ! You have " + maxTime + " seconds to finish ! ";
        babylonGUI.decorText(textStart)
        babylonGUI.add(textStart);



        // GUI FOR VALIDATION CHECKPOINT
        var rect1 = new BABYLON.GUI.Rectangle();
        rect1.adaptWidthToChildren = true;
        babylonGUI.decor(rect1)
        babylonGUI.positionElement(rect1,BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP,BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER)
        babylonGUI.add(rect1)

        textPassed.text = "PASSED : " + numberCheckPointPassed + "/" + numberCheckPoint;
        babylonGUI.decorText(textPassed,"white","24")
        rect1.addControl(textPassed);




        // GUI FOR THE TIMER
        var rectTimer = new BABYLON.GUI.Rectangle();
        rectTimer.adaptWidthToChildren = true;
        babylonGUI.decor(rectTimer)
        babylonGUI.positionElement(rectTimer,BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP,BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT)
        babylonGUI.add(rectTimer);

        textTimer.text = "Time : " + timer;
        rectTimer.addControl(textTimer);

        

        
        // GUI TO HELP USER TO UNDERSTAND HOW TO PLAY
        var meContMoveBtnWidth = "40px";
        var meContMoveBtnHeight = "40px";

        var style = babylonGUI.getGUI().createStyle();
        style.fontSize = 20;
        style.fontFamily = "Arial, Helvetica, sans-serif";
        style.fontWeight = "bold";

        var menuContainerMove = new BABYLON.GUI.Rectangle()
        babylonGUI.positionElement(menuContainerMove,BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP,BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT)
        babylonGUI.decor(menuContainerMove,"100px","100px","white",4,"black")
        babylonGUI.add(menuContainerMove);

        var menuContainerMoveGrid = new BABYLON.GUI.Grid();
        menuContainerMove.addControl(menuContainerMoveGrid);
        menuContainerMoveGrid.addColumnDefinition(0, false);
        menuContainerMoveGrid.addColumnDefinition(0.3);
        menuContainerMoveGrid.addColumnDefinition(0.3);
        menuContainerMoveGrid.addColumnDefinition(0.3);
        menuContainerMoveGrid.addColumnDefinition(0, false);
        menuContainerMoveGrid.addRowDefinition(0.3);
        menuContainerMoveGrid.addRowDefinition(0.3);
        menuContainerMoveGrid.addRowDefinition(0.3);


        var buttonZ = BABYLON.GUI.Button.CreateSimpleButton("Z", "Z");
        babylonGUI.positionElement(buttonZ,BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM,BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER)
        babylonGUI.decor(buttonZ,meContMoveBtnHeight,meContMoveBtnWidth,"white",2,"red",style)
        menuContainerMoveGrid.addControl(buttonZ, 0, 2);

        var buttonQ = BABYLON.GUI.Button.CreateSimpleButton("Q", "Q");
        babylonGUI.positionElement(buttonQ,BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM,BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT)
        babylonGUI.decor(buttonQ,meContMoveBtnHeight,meContMoveBtnWidth,"white",2,"red",style)
        menuContainerMoveGrid.addControl(buttonQ, 2, 1);

        var buttonD = BABYLON.GUI.Button.CreateSimpleButton("D", "D");
        babylonGUI.positionElement(buttonD, BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM,BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER)
        babylonGUI.decor(buttonD,meContMoveBtnHeight,meContMoveBtnWidth,"white",2,"red",style)
        menuContainerMoveGrid.addControl(buttonD, 2, 3);

        document.addEventListener("keydown", function (e) {
            switch (e.keyCode) {
                case 90:
                    buttonZ.background = "green";
                    break;
                case 81:
                    buttonQ.background = "green";
                    break;
                case 68:
                    buttonD.background = "green";
                    break;


            }
        });

        document.addEventListener("keyup", function (e) {
            switch (e.keyCode) {
                case 90:
                    buttonZ.background = "red";
                    break;
                case 81:
                    buttonQ.background = "red";
                    break;
                case 68:
                    buttonD.background = "red";
                    break;
            }

        });
    },


}

export default GuiGame;