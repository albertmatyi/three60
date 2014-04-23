/*
	Three.js 'tutorials by example'
	Author: Lee Stemkoski
	Date: July 2013 (three.js v59dev)
	*/
	
// MAIN
var VIDEO_URL = 'vids/three60.10M.vid.webm';

// standard global variables
var container, scene, camera, renderer, controls, stats;
var keyboard = new THREEx.KeyboardState();

// custom global variables
var video, videoImage, videoImageContext, videoTexture;

// FUNCTIONS 		
function init() {
	// SCENE
	scene = new THREE.Scene();
	// CAMERA
	var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;
	var VIEW_ANGLE = 45, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 0.1, FAR = 20000;
	camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
	scene.add(camera);
	camera.position.set(0,0,0);
	camera.lookAt(scene.position);	
	
	// RENDERER
	if ( Detector.webgl ) {
		renderer = new THREE.WebGLRenderer( {antialias:true} );
	}
	else {
		renderer = new THREE.CanvasRenderer(); 
		console.log('No WebGL support');
	}
	renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
	container = document.getElementById( 'ThreeJS' );
	container.appendChild( renderer.domElement );
	// CONTROLS
	controls = new THREE.OrbitControls( camera, renderer.domElement );
	// EVENTS
	THREEx.WindowResize(renderer, camera);
	THREEx.FullScreen.bindKey({ charCode : 'm'.charCodeAt(0) });
	// STATS
	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.bottom = '0px';
	stats.domElement.style.zIndex = 100;
	container.appendChild( stats.domElement );
	
	///////////
	// VIDEO //
	///////////
	
	// create the video element
	video = document.createElement( 'video' );
	// video.id = 'video';
	// video.type = ' video/ogg; codecs='theora, vorbis' ';
	video.volume = 0;
	video.loop = true;
	video.src = VIDEO_URL;
	video.load(); // must call after setting/changing source
	video.play();
	
	videoImage = document.createElement( 'canvas' );
	videoImage.width = 1600;
	videoImage.height = 800;

	videoImageContext = videoImage.getContext( '2d' );
	// background color if no video present
	videoImageContext.fillStyle = '#000000';
	videoImageContext.fillRect( 0, 0, videoImage.width, videoImage.height );

	videoTexture = new THREE.Texture( videoImage );
	videoTexture.minFilter = THREE.LinearFilter;
	videoTexture.magFilter = THREE.LinearFilter;
	
	var movieMaterial = new THREE.MeshBasicMaterial( { map: videoTexture, overdraw: true, side:THREE.DoubleSide } );
	// the geometry on which the movie will be displayed;
	// 		movie image will be scaled to fit these dimensions.
	// var movieGeometry = new THREE.PlaneGeometry( 240, 100, 4, 4 );
	var movieGeometry = new THREE.SphereGeometry(240, 100, 100);
	var movieScreen = new THREE.Mesh( movieGeometry, movieMaterial );
	movieScreen.position.set(0,0,0);
	scene.add(movieScreen);
	
	camera.position.set(0,0,120);
	camera.lookAt(movieScreen.position);

	
}

function animate() {
	requestAnimationFrame( animate );
	render();		
	update();
}

function update()
{
	if ( keyboard.pressed('p') ) {
		video.play();
	}

	if ( keyboard.pressed('space') ) {
		video.pause();
	}

	if ( keyboard.pressed('s') ) {
		video.pause();
		video.currentTime = 0;
	}
	
	if ( keyboard.pressed('r') ) {
		video.currentTime = 0;
	}
	
	controls.update();
	stats.update();
}

function render() {	
	if ( video.readyState === video.HAVE_ENOUGH_DATA ) {
		videoImageContext.drawImage( video, 0, 0 );
		if ( videoTexture ) {
			videoTexture.needsUpdate = true;
		}
	}

	renderer.render( scene, camera );
}
