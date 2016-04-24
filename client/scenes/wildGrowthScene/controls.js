(function () {
    var Config = require('./config');
    'use strict';

    var controls = function ( appConfig ) {

        var self = this;

        this.resize = function (event) {

            Config.canvasWidth = appConfig.controlPanel.isVertical ?
                ( window.innerWidth - innerHeight * ( 0.2 - appConfig.controlPanel.offset / 100 ) ) :
                window.innerWidth;
            Config.canvasHeight = appConfig.controlPanel.isVertical ?
                window.innerHeight :
                ( innerHeight -  window.innerWidth * ( 0.2 - appConfig.controlPanel.offset / 100 ) );

            Config.aspectRatio = Config.canvasWidth / Config.canvasHeight;
            Config.renderer.setSize(Config.canvasWidth, Config.canvasHeight);
            Config.camera.aspect = Config.aspectRatio;
            Config.camera.updateProjectionMatrix();
        };

        this.mouseMoveFunc = function ( event ) {

        };

        var mouseDown = false;
        window.addEventListener('mousedown', function () {
            mouseDown = true
        });
        window.addEventListener('mouseup', function () {
            mouseDown = false
        });
        window.addEventListener('mousemove', self.mouseMoveFunc);

        window.addEventListener('resize', self.resize);

        window.addEventListener('keypress', function(event) {

            if (event.keyCode === 116) {
                Config.mixAmount += 0.1;
                if (Config.mixAmount > 1) Config.mixAmount = 1;
            } else if (event.keyCode === 103) {
                Config.mixAmount -= 0.1;
                if (Config.mixAmount < 0) Config.mixAmount = 0;
            } else if (event.keyCode === 113) {
                if (Config.time/1000 - Config.changeLandscapeStartTime > Config.changeLandscapeLength) {
                    Config.changeLandscapeStartTime = Config.time/1000;
                    Config.changeLandscapeStartFlag = true;
                    console.log('changing landspace');
                }
            }

        });
    };

    module.exports = controls;
})();