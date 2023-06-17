import * as THREE from 'three';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';
import { Reflector } from 'three/addons/objects/Reflector.js';
import {Coordinates} from './lib/Coordinates.js';
import {dat} from './lib/dat.gui.min.js';
var windowScale;
window.scene = new THREE.Scene();


var camera, renderer;
var cameraControls, effectController;
var clock = new THREE.Clock();
var aspectRatio, mirrorCam, mirrorCube ; 
let ambientLight;
const cubeRenderTarget = new THREE.WebGLCubeRenderTarget( 1024, { format: THREE.RGBFormat, generateMipmaps: true, minFilter: THREE.LinearMipmapLinearFilter } );



"use strict"; // good practice - see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode
////////////////////////////////////////////////////////////////////////////////
// Field of view exercise
////////////////////////////////////////////////////////////////////////////////
/*global THREE, Coordinates, document, window, $*/




const settings = {
    metalness: 1.0,
    roughness: 0.4,
    ambientIntensity: 0.2,
    aoMapIntensity: 1.0,
    envMapIntensity: 1.0,
    displacementScale: 2.436143, // from original model
    normalScale: 1.0
};

let mesh, material;

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
            //Pouvoir changer les valeurs de la normal map

            gui.add( settings, 'metalness' ).min( 0 ).max( 1 ).onChange( function ( value ) {

                material.metalness = value;

            } );

            gui.add( settings, 'roughness' ).min( 0 ).max( 1 ).onChange( function ( value ) {

                material.roughness = value;

            } );

            gui.add( settings, 'ambientIntensity' ).min( 0 ).max( 1 ).onChange( function ( value ) {

                ambientLight.intensity = value;

            } );

            gui.add( settings, 'normalScale' ).min( - 1 ).max( 1 ).onChange( function ( value ) {

                material.normalScale.set( 1, - 1 ).multiplyScalar( value );

            } );



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


	// décale la caméra sur la droite
	camera.position.z += 300;

    //Mets moi une sphere
    




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
        object.position.set(300, 0, 300)
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
        object.position.set(-50, 0, 550)
   
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

   

   
    // charge nageur.obj
    const loader = new OBJLoader();
    loader.load( 'objet/swimmer.obj', function ( group ) {

        const geometry = group.children[ 0 ].geometry;
        geometry.center();
        mesh = new THREE.Mesh( geometry, material );
        mesh.position.set(-50, -30, 225);
        mesh.rotation.y = Math.PI;
        mesh.rotation.x = -Math.PI / 2;
        mesh.rotation.z = Math.PI / 2;
        mesh.traverse( function ( object ) {
            if ( object instanceof THREE.Mesh ) {
                object.castShadow = true;
                object.receiveShadow = true;
            }
        } );
       
        window.scene.add( mesh );

    } );

    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load( 'objet/swimming-pool-tiles.jpg' );
    const normalMap = textureLoader.load( 'texture/normalmapnageur.png' );


    material = new THREE.MeshStandardMaterial( {

        roughness: settings.roughness,
        metalness: settings.metalness,

        normalMap: normalMap,
        normalScale: new THREE.Vector2( 1, - 1 ), // why does the normal map require negation in this case?

        texture: texture,

        side: THREE.DoubleSide

} );
    
  

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
                object.position.y = -172
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
    ambientLight = new THREE.AmbientLight( 0xffffff, settings.ambientIntensity );
	window.scene.add( ambientLight );

	window.scene.add( light );

    // Mirroir
    var cubeGeom = new THREE.BoxGeometry(1000, 300, 1);

    mirrorCam = new THREE.CubeCamera( 1, 1000, cubeRenderTarget   );
    mirrorCam.position.set(0, 500, -400); 
    scene.add(mirrorCam);


    var mirrorCubeMaterial = new THREE.MeshLambertMaterial( { color: 0xffffff, envMap: cubeRenderTarget.texture } );
    mirrorCube = new THREE.Mesh( cubeGeom, mirrorCubeMaterial );
    mirrorCube.position.set(0, +150, -487);
    scene.add(mirrorCube);

    // Sprite
    var disk = new THREE.TextureLoader().load('texture/oiseau.png');
    var material = new THREE.SpriteMaterial({ map: disk });
    material.color.setHSL(10.0, 10.0, 10.0)
    for (var i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            for (let k = 0; k < 8; k++) {
                var particles = new THREE.Sprite(material);
                var vertex = new THREE.Vector3();
                vertex.x = -1000 + Math.random() * 10 * 100 * k;
                vertex.y = -1000 + Math.random() * 10 * 100 * j;
                vertex.z = -1000 + Math.random() * 10 * 100 * i;
                particles.scale.set(35, 35, 35);
                particles.position.x = vertex.x;
                particles.position.y = vertex.y;
                particles.position.z = vertex.z;
                scene.add(particles);
            }
        }
    }

    const mtlLoader = new MTLLoader()
    mtlLoader.load('objet/Arbre2MTL.mtl', function (materials) {
        materials.preload();
        var objLoader = new OBJLoader();
        objLoader.setMaterials(materials);
    
        objLoader.load('objet/Arbre2.obj', function (object) {
            object.traverse( function ( object ) {
                if ( object instanceof THREE.Mesh ) {
                    object.castShadow = true;
                    object.receiveShadow = true;
                }
            });
            object.position.set( -1250, 0, -650 );
            object.scale.set( 100, 100, 100 );
            object.rotation.y = 180;
            window.scene.add(object);
        });
    });

	
	var helper = new THREE.CameraHelper( light.shadow.camera );
	window.scene.add( helper );

	var helper = new THREE.CameraHelper( light.shadow.camera );
	window.scene.add( helper );

	var solidGround = new THREE.Mesh(
        new THREE.PlaneGeometry(200, 1000),
        new THREE.MeshPhongMaterial({
            polygonOffset: true,
            polygonOffsetFactor: 1.0,
            polygonOffsetUnits: 4.0,
            receiveShadow: true,
            specular: new THREE.Color(0x000000),
            shininess: 0.0,
            emissive: new THREE.Color(0x000000),
            transparent: true,
            opacity: 1.0,
            illumination: 1,
            specularMap: null,
            alphaMap: null,
            combine: THREE.MultiplyOperation,
            reflectivity: 0,
            refractionRatio: 0.98,
            depthTest: true,
            depthWrite: true,
            clipShadows: false,
            fog: true
        })
    );
    solidGround.rotation.x = -Math.PI / 2;
    solidGround.position.x = 490;
    solidGround.position.z = 110;
	solidGround.receiveShadow = true;

    // Chargement de la texture
    var textureLoader = new THREE.TextureLoader();
    var texture = textureLoader.load('texture/tileable_wood_planks_texture.jpg');


    // Appliquer la texture au matériau de l'objet
    solidGround.material.map = texture;

    // Définir les paramètres du matériau
    solidGround.material.emissive.setHex(0x000000);
    solidGround.material.ambient = new THREE.Color(0x000000);
    solidGround.material.color = new THREE.Color(0x646464);

    // Définir les paramètres de la texture
    solidGround.material.shininess = 0.0;
    solidGround.material.specular = new THREE.Color(0x000000);
    solidGround.material.alphaMap = null;
    solidGround.material.combine = THREE.MultiplyOperation;
    solidGround.material.reflectivity = 0;
    solidGround.material.refractionRatio = 0.98;
    solidGround.material.depthTest = true;
    solidGround.material.depthWrite = true;
    solidGround.material.clipShadows = false;
    solidGround.material.fog = true;

    scene.add(solidGround);


    var solidGround = new THREE.Mesh(
        new THREE.PlaneGeometry(200, 1000),
        new THREE.MeshPhongMaterial({
            polygonOffset: true,
            polygonOffsetFactor: 1.0,
            polygonOffsetUnits: 4.0,
            receiveShadow: true,
            specular: new THREE.Color(0x000000),
            shininess: 0.0,
            emissive: new THREE.Color(0x000000),
            transparent: false,
            opacity: 1.0,
            illumination: 1,
            specularMap: null,
            alphaMap: null,
            combine: THREE.MultiplyOperation,
            reflectivity: 0,
            refractionRatio: 0.98,
            depthTest: true,
            depthWrite: true,
            clipShadows: false,
            fog: true
        })
    );
    solidGround.rotation.x = -Math.PI / 2;
    solidGround.position.x = -1400;
    solidGround.position.z = 110;
    solidGround.receiveShadow = true;
    
    // Chargement de la texture de base
    var textureLoader = new THREE.TextureLoader();
    var texture = textureLoader.load('texture/tileable_wood_planks_texture.jpg');
    
    // Appliquer la texture de base au matériau de l'objet
    solidGround.material.map = texture;
    
    // Chargement de la texture de la carte spéculaire
    var specularMapTexture = textureLoader.load('objet/tileable_wood_planks_texture_SPECULAR.jpg');
    
    // Appliquer la texture de la carte spéculaire au matériau de l'objet
    solidGround.material.specularMap = specularMapTexture;
    
    // Modifier les paramètres de la carte spéculaire
    solidGround.material.specular = new THREE.Color(0xffffff);
    solidGround.material.shininess = 0;
    solidGround.material.reflectivity = 1;
    
    // Définir les paramètres du matériau
    solidGround.material.emissive.setHex(0x000000);
    solidGround.material.ambient = new THREE.Color(0x000000);
    solidGround.material.color = new THREE.Color(0x646464);
    
    // Définir les paramètres de la texture
    solidGround.material.alphaMap = null;
    solidGround.material.combine = THREE.MultiplyOperation;
    solidGround.material.refractionRatio = 0.98;
    solidGround.material.depthTest = true;
    solidGround.material.depthWrite = true;
    solidGround.material.clipShadows = false;
    solidGround.material.fog = true;
    
    scene.add(solidGround);
    

    var solidGround = new THREE.Mesh(
        new THREE.PlaneGeometry(200,2080),
        new THREE.MeshPhongMaterial({
            polygonOffset: true,
            polygonOffsetFactor: 1.0,
            polygonOffsetUnits: 4.0,
            receiveShadow: true,
            specular: new THREE.Color(0x000000),
            shininess: 0.0,
            emissive: new THREE.Color(0x000000),
            transparent: false,
            opacity: 1.0,
            illumination: 1,
            alphaMap: null,
            combine: THREE.MultiplyOperation,
            reflectivity: 0,
            refractionRatio: 0.98,
            depthTest: true,
            depthWrite: true,
            clipShadows: false,
            fog: true
        })
    );
    solidGround.rotation.x = -Math.PI / 2;
    solidGround.position.x = -450;
    solidGround.position.z = -485;
    solidGround.receiveShadow = true;
    solidGround.rotation.z = -Math.PI / 2;
    
    // Chargement de la texture de base
    var textureLoader = new THREE.TextureLoader();
    var texture = textureLoader.load('texture/tileable_wood_planks_texture.jpg');
    
    // Appliquer la texture de base au matériau de l'objet
    solidGround.material.map = texture;

    // Chargement de la texture de la carte spéculaire
    var specularMapTexture = textureLoader.load('objet/tileable_wood_planks_texture_SPECULAR.jpg');

    // Appliquer la texture de la carte spéculaire au matériau de l'objet
    solidGround.material.specularMap = specularMapTexture;
    
    // Chargement de la texture de la carte spéculaire
    var specularMapTexture = textureLoader.load('objet/tileable_wood_planks_texture_SPECULAR.jpg');
    
    // Appliquer la texture de la carte spéculaire au matériau de l'objet
    solidGround.material.specularMap = specularMapTexture;
    
    // Définir les paramètres du matériau
    solidGround.material.emissive.setHex(0x000000);
    solidGround.material.ambient = new THREE.Color(0x000000);
    solidGround.material.color = new THREE.Color(0x646464);
    
    // Définir les paramètres de la texture
    solidGround.material.shininess = 0.0;
    solidGround.material.alphaMap = null;
    solidGround.material.combine = THREE.MultiplyOperation;
    solidGround.material.reflectivity = 0;
    solidGround.material.refractionRatio = 0.98;
    solidGround.material.depthTest = true;
    solidGround.material.depthWrite = true;
    solidGround.material.clipShadows = false;
    solidGround.material.fog = true;
    
    scene.add(solidGround);

	var solidGround = new THREE.Mesh(
        new THREE.PlaneGeometry(200,2080),
        new THREE.MeshPhongMaterial({
            polygonOffset: true,
            polygonOffsetFactor: 1.0,
            polygonOffsetUnits: 4.0,
            receiveShadow: true,
            specular: new THREE.Color(0x000000),
            shininess: 0.0,
            emissive: new THREE.Color(0x000000),
            transparent: false,
            opacity: 1.0,
            illumination: 1,
            specularMap: null,
            alphaMap: null,
            combine: THREE.MultiplyOperation,
            reflectivity: 0,
            refractionRatio: 0.98,
            depthTest: true,
            depthWrite: true,
            clipShadows: false,
            fog: true
        })
    );
    solidGround.rotation.x = -Math.PI / 2;
    solidGround.position.x = -450;
    solidGround.position.z = 687;
	solidGround.receiveShadow = true;
    solidGround.rotation.z = -Math.PI / 2;


    // Chargement de la texture
    var textureLoader = new THREE.TextureLoader();
    var texture = textureLoader.load('texture/tileable_wood_planks_texture.jpg');

    // Appliquer la texture au matériau de l'objet
    solidGround.material.map = texture;

    // Chargement de la texture de la carte spéculaire
    var specularMapTexture = textureLoader.load('objet/tileable_wood_planks_texture_SPECULAR.jpg');

    // Appliquer la texture de la carte spéculaire au matériau de l'objet
    solidGround.material.specularMap = specularMapTexture;

    // Définir les paramètres du matériau
    solidGround.material.emissive.setHex(0x000000);
    solidGround.material.ambient = new THREE.Color(0x000000);
    solidGround.material.color = new THREE.Color(0x646464);

    // Définir les paramètres de la texture
    solidGround.material.shininess = 0.0;
    solidGround.material.specular = new THREE.Color(0x000000);
    solidGround.material.alphaMap = null;
    solidGround.material.combine = THREE.MultiplyOperation;
    solidGround.material.reflectivity = 0;
    solidGround.material.refractionRatio = 0.98;
    solidGround.material.depthTest = true;
    solidGround.material.depthWrite = true;
    solidGround.material.clipShadows = false;
    solidGround.material.fog = true;

    scene.add(solidGround);



	
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
    mirrorCam.visible = false;
    mirrorCam.update( renderer, scene );
    mirrorCam.visible = true;
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