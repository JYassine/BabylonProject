 var GuiGame = {

    displayGUI : (textPassed, babylonGUI,textStart,maxTime,numberCheckPointPassed,numberCheckPoint,textTimer,timer) => {
        babylonGUI.createGui()

        var rect1 = new BABYLON.GUI.Rectangle();
        rect1.adaptWidthToChildren = true;
        rect1.height = "40px";
        rect1.width = "200px"
        rect1.cornerRadius = 20;
        rect1.color = "Orange";
        rect1.thickness = 4;
        rect1.background = "green";
        rect1.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
        babylonGUI.add(rect1)

        textStart.text = "Click anywhere to START ! You have " + maxTime + " seconds to finish ! ";
        textStart.color = "RED";
        textStart.fontSize = 48;
        textStart.fontWeight = "bold"
        babylonGUI.add(textStart);


        var rectTimer = new BABYLON.GUI.Rectangle();
        rectTimer.adaptWidthToChildren = true;
        rectTimer.height = "40px";
        rectTimer.width = "200px"
        rectTimer.cornerRadius = 20;
        rectTimer.color = "Orange";
        rectTimer.thickness = 4;
        rectTimer.background = "green";
        rectTimer.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP
        rectTimer.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT
        babylonGUI.add(rectTimer);

        textPassed.text = "PASSED : " + numberCheckPointPassed + "/" + numberCheckPoint;
        textPassed.color = "white";
        textPassed.fontSize = 24;
        rect1.addControl(textPassed);

        textTimer.text = "Time : " + timer;

        rectTimer.addControl(textTimer);


        var meContMoveBtnWidth = "40px";
        var meContMoveBtnHeight = "40px";

        var style = babylonGUI.getGUI().createStyle();
        style.fontSize = 20;
        style.fontFamily = "Arial, Helvetica, sans-serif";
        style.fontWeight = "bold";

        var menuContainerMove = new BABYLON.GUI.Rectangle()
        menuContainerMove.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
        menuContainerMove.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        menuContainerMove.width = "100px";
        menuContainerMove.height = "100px";
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
        buttonZ.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
        buttonZ.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        buttonZ.width = meContMoveBtnWidth;
        buttonZ.height = meContMoveBtnHeight;
        buttonZ.background = "red";
        buttonZ.style = style;

        menuContainerMoveGrid.addControl(buttonZ, 0, 2);


        var buttonQ = BABYLON.GUI.Button.CreateSimpleButton("Q", "Q");
        buttonQ.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
        buttonQ.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
        buttonQ.width = meContMoveBtnWidth;
        buttonQ.height = meContMoveBtnHeight;
        buttonQ.background = "red";
        buttonQ.style = style;

        menuContainerMoveGrid.addControl(buttonQ, 2, 1);

        var buttonD = BABYLON.GUI.Button.CreateSimpleButton("D", "D");
        buttonD.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
        buttonD.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        buttonD.width = meContMoveBtnWidth;
        buttonD.height = meContMoveBtnHeight;
        buttonD.background = "red";
        buttonD.style = style;
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

}

}

export default GuiGame;