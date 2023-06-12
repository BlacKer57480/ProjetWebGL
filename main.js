import * as THREE from 'three';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import {dat} from './lib/dat.gui.min.js';
var camera, renderer;
var windowScale;
window.scene = new THREE.Scene();
import {Coordinates} from './lib/Coordinates.js';

"use strict"; // good practice - see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode
////////////////////////////////////////////////////////////////////////////////
// Field of view exercise
////////////////////////////////////////////////////////////////////////////////
/*global THREE, Coordinates, document, window, $*/

var camera, renderer;
var cameraControls, effectController;
var clock = new THREE.Clock();
var cylinder, sphere, cube;
var bevelRadius = 1.9;	// TODO: 2.0 causes some geometry bug.
var aspectRatio;
var eyeTargetScale;

//parametre du menu
function setupGui() {
    //effect pour le menu fov
	effectController = {
    };
    var gui = new dat.GUI();
    effectController.fov = 45;
    gui.add( effectController, "fov", 0, 180, 5 ).name("Field of View").onChange( function() {
        camera.fov = effectController.fov;
        camera.updateProjectionMatrix();
    }
    );
}

// Mets moi une skybox 
function initSkyBox() {
	scene.background = new THREE.CubeTextureLoader()
    .setPath( 'skybox/' )
    .load( ['valley_ft.jpg', 'valley_bk.jpg',
            'valley_up.jpg', 'valley_dn.jpg',
            'valley_rt.jpg', 'valley_lf.jpg' ]);
}


//initialisation de la caméra
function init() {
	var canvasWidth = 846;
	var canvasHeight = 494;
	// For grading the window is fixed in size; here's general code:
	//var canvasWidth = window.innerWidth;
	//var canvasHeight = window.innerHeight;

	// RENDERER
	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.gammaInput = true;
	renderer.gammaOutput = true;
	renderer.setSize(canvasWidth, canvasHeight);
	renderer.setClearColor( 0x808080, 1.0 );

	// CAMERA
	// aspect ratio of width of window divided by height of window
	aspectRatio = canvasWidth/canvasHeight;
	// OrthographicCamera( left, right, top, bottom, near, far )
	camera = new THREE.PerspectiveCamera( 45, aspectRatio, 10, 10000 );
	camera.position.set( -200, 650, 1000 );

	// CONTROLS
	cameraControls = new OrbitControls(camera, renderer.domElement);
	cameraControls.target.set(-200,250,350);

	var startdir = new THREE.Vector3();
	startdir.subVectors( camera.position, cameraControls.target );
	eyeTargetScale = Math.tan(camera.fov*(Math.PI/180)/2)*startdir.length();

}

//ajout de la scène
function fillScene() {
	window.scene = new THREE.Scene();

	// LIGHTS
	window.scene.add( new THREE.AmbientLight( 0x222222 ) );

	var light = new THREE.DirectionalLight( 0xFFFFFF, 1.0 );
	light.position.set( 200, 400, 500 );

	window.scene.add( light );

	light = new THREE.DirectionalLight( 0xFFFFFF, 1.0 );
	light.position.set( -400, 200, -300 );

	window.scene.add( light );
}

//carreau d'aide pour la grille


// Charge moi un objet avec obj et mtlloader et applique lui une texture
const mtlLoader = new MTLLoader()
mtlLoader.load(
    'objet/swimming-pool.mtl',
    (materials) => {
        materials.preload()
        console.log(materials)
         const objLoader = new OBJLoader()
         objLoader.setMaterials(materials)
         objLoader.load(
            'objet/swimming-pool.obj',
             (object) => {
                object.rotation.y = Math.PI
                object.position.x = -800
                object.position.y = -140
                object.children[0].material.envMap = window.scene.background
                object.children[0].material.envMapIntensity = 0.5
                 scene.add(object)
             },
             (xhr) => {
                 console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
             },
             (error) => {
                 console.log('An error happened')
             }
         )
    },
    (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
    },
    (error) => {
        console.log('An error happened')
    }
)


// //ajout de la table
// var loader = new OBJLoader();
// var textureLoader = new THREE.TextureLoader();
// var texture = textureLoader.load('texture/tile-ext-border.jpg');

// loader.load('objet/swimming-pool.obj', function (object) {
//     // L'objet a été chargé avec succès
//     // Vous pouvez ajouter l'objet à votre scène WebGL ici
//     scene.add(object);

//     // Mettre la table à l'échelle
//     object.scale.set(1, 1, 0.9);

//     // Mettre la table à la position
//     object.position.set(0, 200, -11);

//     // appliquer à l'objet la texture
//     object.traverse(function (child) {
//         if (child instanceof THREE.Mesh) {
//             child.material.map = texture;
//         }
//     });
// });

// //ajout de la nape
// loader.load('objet/nape.obj', function (object) {
//     // L'objet a été chargé avec succès
//     // Vous pouvez ajouter l'objet à votre scène WebGL ici
//     scene.add(object);

//     // Mettre la table à l'échelle
//     object.scale.set(90, 100, 90);

//     // Mettre la nape sur la table à la bonne position
//     object.position.set(265, 100, -37);
//     //rotation de la nape 90°
//     object.rotation.y = Math.PI / 2;

//     // Charger la texture et l'appliquer à l'objet
//     textureLoader.load('texture/nape.png', function (texture) {
//         object.traverse(function (child) {
//             if (child instanceof THREE.Mesh) {
//                 child.material.map = texture;
//             }
//         });
//     });

// });

// //ajout du bowl
// loader.load('objet/bowl.obj', function (object) {
//     // L'objet a été chargé avec succès
//     // Vous pouvez ajouter l'objet à votre scène WebGL ici
//     scene.add(object);

//     // Mettre la table à l'échelle
//     object.scale.set(20, 20, 20);

//     // Mettre la nape sur la table à la bonne position
//     object.position.set(20, 230, 10);
//     //rotation de la nape 90°
//     object.rotation.y = Math.PI / 2;

//     // Charger la texture et l'appliquer à l'objet
//     textureLoader.load('texture/osier.png', function (texture) {
//         object.traverse(function (child) {
//             if (child instanceof THREE.Mesh) {
//                 child.material.map = texture;
//             }
//         });
//     });

// });

//ajout de la scène au DOM
function addToDOM() {
	var container = document.getElementById('webGL');
	var canvas = container.getElementsByTagName('canvas');
	if (canvas.length>0) {
		container.removeChild(canvas[0]);
	}
	container.appendChild( renderer.domElement );
}

//animation
function animate() {
	window.requestAnimationFrame(animate);
	render();
}

//rendu
function render() {
	var delta = clock.getDelta();
	cameraControls.update(delta);
	renderer.render(window.scene, camera);
}

//initialisation
try {
	init();
	fillScene();
	setupGui();
	addToDOM();
	animate();
	initSkyBox();
} catch(e) {
	var errorReport = "Your program encountered an unrecoverable error, can not draw on canvas. Error was:<br/><br/>";
	$('#webGL').append(errorReport+e);
}


var container = document.createElement( 'div' );
document.body.appendChild( container );
container.appendChild( renderer.domElement );