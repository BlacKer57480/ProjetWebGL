import * as THREE from 'three';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';
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
	var canvasWidth = 1000;
	var canvasHeight = 500;
	// For grading the window is fixed in size; here's general code:
	//var canvasWidth = window.innerWidth;
	//var canvasHeight = window.innerHeight;

	// RENDERER
	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.gammaInput = true;
	renderer.gammaOutput = true;
	renderer.setSize(canvasWidth, canvasHeight);
	renderer.setClearColor( 0x808080, 1.0 );
	// Ajoute de l'ombre
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap;
	renderer.shadowMapSoft = true;
	renderer.shadowMapAutoUpdate = true;
	renderer.shadowMap.needsUpdate = true;



	// CAMERA
	// aspect ratio of width of window divided by height of window
	aspectRatio = canvasWidth/canvasHeight;
	// OrthographicCamera( left, right, top, bottom, near, far )
	camera = new THREE.PerspectiveCamera( 45, aspectRatio, 10, 10000 );
	camera.position.set( 0, 500, 600 );

	// CONTROLS
	cameraControls = new OrbitControls(camera, renderer.domElement);
	cameraControls.target.set(0,0,0);

	

	var startdir = new THREE.Vector3();
	startdir.subVectors( camera.position, cameraControls.target );
	eyeTargetScale = Math.tan(camera.fov*(Math.PI/180)/2)*startdir.length();

	// décale la caméra sur la droite
	camera.position.z += 300;

    // Premier perso

    const fbxLoader = new FBXLoader()
    fbxLoader.load(
    'objet/rp_dennis_posed_004_30k.fbx',
    (object) => {
        object.traverse( function ( object ) {
            if ( object instanceof THREE.Mesh ) {
                object.castShadow = true;
                object.receiveShadow = true;
            }
        } );
        object.position.set(300, 35, 300)
	   object.rotation.y = Math.PI
        window.scene.add(object)
    },
    (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
    },
    (error) => {
        console.log(error)
    }
)

    // Deuxime perso

    fbxLoader.load(
    'objet/rp_mei_posed_001_30k.fbx',
    (object) => {
        object.traverse( function ( object ) {
            if ( object instanceof THREE.Mesh ) {
                object.castShadow = true;
                object.receiveShadow = true;
            }
        } );
        object.position.set(-50, 35, 550)
   
        // Pivote le 90°
        object.rotation.y = Math.PI/2
        window.scene.add(object)
    },
    (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
    },
    (error) => {
        console.log(error)
    }
    )

   
   //Deuxieme personnage
   
   var loader = new OBJLoader();
   
	loader.load('objet/rp_mei_posed_001_30k.OBJ', function (object) {
	   
	   
	   // Positionner le personnage
	   object.position.set(-50, 35, 550)
   
	   // Pivote le 90°
	   object.rotation.y = Math.PI/2
	   window.scene.add(object);
   });
   
   // charge nageur.obj
   var loader = new OBJLoader();
   
	loader.load('objet/swimmer.obj', function (object) {

		object.traverse( function ( object ) {
			if ( object instanceof THREE.Mesh ) {
				object.castShadow = true;
				object.receiveShadow = true;
			}
		} );
	   
	   // Positionner le personnage
	   object.position.set(-50, 0, 225)
   
	   // Pivote le 180°
	   object.rotation.y = Math.PI
   
	   // Met le a plat sur le sol
	   object.rotation.x = -Math.PI/2
   
	   // Oriente le de 90°
	   object.rotation.z = Math.PI/2

	   window.scene.add(object);
   
   });

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
				object.traverse( function ( object ) {
					if ( object instanceof THREE.Mesh ) {
						object.castShadow = true;
						object.receiveShadow = true;
					}
				} );
                object.rotation.y = Math.PI
                object.position.x = -800
                object.position.y = -140
                object.children[0].material.envMap = window.scene.background
                object.children[0].material.envMapIntensity = 0.5
				object.receiveShadow = true;
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


}

function drawHelpers() {
	Coordinates.drawGrid({size:10000,scale:0.01} );
}

//ajout de la scène
function fillScene() {
	window.scene = new THREE.Scene();

	// LIGHTS

	var light = new THREE.DirectionalLight( 0xFFFFFF, 0.5 );
	light.position.set( 200, 400, 500 );
	light.castShadow = true; 

	window.scene.add( light );

	light = new THREE.SpotLight( 0xFFFFFF, 5.0 );
	light.castShadow = true; 
	light.position.set( -1500, 500, -300 );
	light.shadow.mapSize.width = 512;
	light.shadow.mapSize.height = 512;
	light.shadow.camera.near = 1;
	light.shadow.camera.far =2500;

	window.scene.add( light );


	
	var helper = new THREE.CameraHelper( light.shadow.camera );
	window.scene.add( helper );

	var helper = new THREE.CameraHelper( light.shadow.camera );
	window.scene.add( helper );
	
}






// Ajouter moi du brouillard
function addFog() {
	window.scene.fog = new THREE.FogExp2(0x808080, 0.00025);
}










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
	drawHelpers();
	addToDOM();
	animate();
	initSkyBox();
	addFog();

} catch(e) {
	var errorReport = "Your program encountered an unrecoverable error, can not draw on canvas. Error was:<br/><br/>";
	$('#webGL').append(errorReport+e);
}


var container = document.createElement( 'div' );
document.body.appendChild( container );
container.appendChild( renderer.domElement );