'use strict';

var Config = require('./config');
var Heights = require('./prefabs/heightsGenerator');
var Landscape = require('./prefabs/landscapePrefab');
var Ocean = require('./prefabs/oceanPrefab');
require('../../libs/trackballControls');

window.scenes.littlePlanet = function (canvas, renderer) {

    var scene,
        heights,
        landscape,
        ocean;
    renderer.setClearColor(0x111111, 1.0);
    renderer.clear();
    var gl = renderer.getContext();
    Config.renderer = renderer;
    Config.aspectRatio = gl.canvas.clientWidth / gl.canvas.clientHeight;

    var camera = new THREE.PerspectiveCamera(60, Config.aspectRatio, 1, 10000);
    camera.position.z = 76;
    camera.position.y = 50;
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    camera.updateProjectionMatrix();

    scene = new THREE.Scene();

    heights = new Heights(renderer);
    Config.rtTexture = heights.texture;
    Config.rtTextureOld = heights.textureOld;

    landscape = new Landscape();
    scene.add(landscape.mesh);

    ocean = new Ocean();
    scene.add(ocean.mesh);

    landscape.mesh.material.needsUpdate = true;

    var trackballControls = new THREE.TrackballControls(camera, renderer.domElement);
    trackballControls.rotateSpeed = 3;
    trackballControls.noPan = true;
    trackballControls.minDistance = 40;
    trackballControls.maxDistance = 300;

    var changeLandscapeButton = document.createElement('BUTTON');
    var t = document.createTextNode('Change landscape');
    changeLandscapeButton.appendChild(t);
    changeLandscapeButton.onclick = function (e) {
        if (Config.time / 1000 - Config.changeLandscapeStartTime > Config.changeLandscapeLength) {
            Config.changeLandscapeStartTime = Config.time / 1000;
            Config.changeLandscapeStartFlag = true;
            console.log('changing landscape');
        }
    };

    changeLandscapeButton.style.position = 'absolute';
    changeLandscapeButton.style.bottom = 0;
    changeLandscapeButton.style.width = '20vh';
    changeLandscapeButton.style.height = '10vh';
    canvas.appendChild(changeLandscapeButton);

    return {
        scene: scene,

        update: function () {
            Config.time = (new Date()).getTime();

            if (Config.changeLandscapeStartFlag) {
                heights.update();
                landscape.changeLandscape();
                Config.changeLandscapeStartFlag = false;
                renderer.setViewport(0, 0, gl.canvas.width, gl.canvas.height);
            }

            trackballControls.update();
            landscape.update();
            renderer.render(scene, camera);
        },
        resize: function (width, height) {

            trackballControls.handleResize();
            Config.aspectRatio = width / height;
            if (camera.aspect !== Config.aspectRatio) {
                camera.aspect = Config.aspectRatio;
                camera.updateProjectionMatrix();
            }
        },
        dispose: function () {
            trackballControls.dispose();
            changeLandscapeButton.parentNode.removeChild(changeLandscapeButton);
        }
    };
};
