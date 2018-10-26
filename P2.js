/***
 * Created by Glen Berseth Feb 5, 2016
 * Created for Project 2 of CPSC314 Introduction to graphics Course.
 */


// CONSTANTS

// VERTICES PER PLANET

var NUM_VERTICES = 32;

// AXES

var X_AXIS = new THREE.Vector3(1, 0, 0);
var Y_AXIS = new THREE.Vector3(0, 1, 0);
var Z_AXIS = new THREE.Vector3(0, 0, 1);

// ROTATION SPEEDS

var SUN_ROTATION_SPEED = .5;
var EARTH_ROTATION_SPEED_ORIGINAL = .1;
var EARTH_ROTATION_SPEED = .1;
var MERCURY_ROTATION_SPEED = 176;
var VENUS_ROTATION_SPEED =  117;
var MARS_ROTATION_SPEED = 1;
var JUPITER_ROTATION_SPEED = .41;
var SATURN_ROTATION_SPEED = .44;
var URANUS_ROTATION_SPEED = .72;
var NEPTUNE_ROTATION_SPEED = .67;

// ORBITAL SPEEDS

var EARTH_ORBITAL_VELOCITY = .05;
var EARTH_ORBITAL_VELOCITY_ORIGINAL = .05;
var MERCURY_ORBITAL_VELOCITY =  .24;
var VENUS_ORBITAL_VELOCITY =  .61;
var MARS_ORBITAL_VELOCITY =  1.88;
var JUPITER_ORBITAL_VELOCITY =  5.9;
var SATURN_ORBITAL_VELOCITY =  14.4;
var URANUS_ORBITAL_VELOCITY =  30.7;
var NEPTUNE_ORBITAL_VELOCITY =  40.7;

// COLORS

var SUN_COLOR = 0xffdd00;
var MERCURY_COLOR = 0xf9f2ec;
var VENUS_COLOR = 0Xffffb3;
var EARTH_COLOR = 0x66a3ff;
var MARS_COLOR = 0xb32d00;
var JUPITER_COLOR = 0xff8533;
var SATURN_COLOR = 0xffe066;
var URANUS_COLOR = 0x99ddff;
var NEPTUNE_COLOR = 0x99ddff;


// Build a visual axis system
function buildAxis( src, dst, colorHex, dashed ) {
        var geom = new THREE.Geometry(),
            mat;

        if(dashed) {
                mat = new THREE.LineDashedMaterial({ linewidth: 3, color: colorHex, dashSize: 3, gapSize: 3 });
        } else {
                mat = new THREE.LineBasicMaterial({ linewidth: 3, color: colorHex });
        }

        geom.vertices.push( src.clone() );
        geom.vertices.push( dst.clone() );
        geom.computeLineDistances(); // This one is SUPER important, otherwise dashed lines will appear as simple plain lines

        var axis = new THREE.Line( geom, mat, THREE.LinePieces );

        return axis;

}
var length = 100.0;
// Build axis visuliaztion for debugging.
x_axis = buildAxis(
	    new THREE.Vector3( 0, 0, 0 ),
	    new THREE.Vector3( length, 0, 0 ),
	    0xFF0000,
	    false
	)
y_axis = buildAxis(
	    new THREE.Vector3( 0, 0, 0 ),
	    new THREE.Vector3( 0, length, 0 ),
	    0x00ff00,
	    false
	)
z_axis = buildAxis(
	    new THREE.Vector3( 0, 0, 0 ),
	    new THREE.Vector3( 0, 0, length ),
	    0x0000FF,
	    false
	)
	
// ASSIGNMENT-SPECIFIC API EXTENSION
THREE.Object3D.prototype.setMatrix = function(a) {
  this.matrix=a;
  this.matrix.decompose(this.position,this.quaternion,this.scale);
}
//ASSIGNMENT-SPECIFIC API EXTENSION
// For use with matrix stack
THREE.Object3D.prototype.setMatrixFromStack = function(a) {
  this.matrix=mvMatrix;
  this.matrix.decompose(this.position,this.quaternion,this.scale);
}

// Data to for the two camera view
var mouseX = 0, mouseY = 0;
var windowWidth, windowHeight;
var views = [
	{
		left: 0,
		bottom: 0,
		width: 0.499,
		height: 1.0,
		background: new THREE.Color().setRGB( 0.1, 0.1, 0.1 ),
		eye: [ 80, 20, 80 ],
		up: [ 0, 1, 0 ],
		fov: 100,
		updateCamera: function ( camera, scene, mouseX, mouseY ) {		}
	},
	{
		left: 0.501,
		bottom: 0.0,
		width: 0.499,
		height: 1.0,
		background: new THREE.Color().setRGB( 0.1, 0.1, 0.1 ),
		eye: [ 65, 20, 65 ],
		up: [ 0, 1, 0 ],
		fov: 45,
		updateCamera: function ( camera, scene, mouseX, mouseY ) {		}
	}
];



//SETUP RENDERER & SCENE
var canvas = document.getElementById('canvas');
var scene = new THREE.Scene();
var renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
// renderer.setClearColor(0xFFFFFF); // white background colour
canvas.appendChild(renderer.domElement);

// Creating the two cameras and adding them to the scene.
function resetCamera() {
	var view = views[0];
	camera_MotherShip = new THREE.PerspectiveCamera( view.fov, window.innerWidth / window.innerHeight, 1, 10000 );
	camera_MotherShip.position.x = view.eye[ 0 ];
	camera_MotherShip.position.y = view.eye[ 1 ];
	camera_MotherShip.position.z = view.eye[ 2 ];
	camera_MotherShip.up.x = view.up[ 0 ];
	camera_MotherShip.up.y = view.up[ 1 ];
	camera_MotherShip.up.z = view.up[ 2 ];
	camera_MotherShip.lookAt( scene.position );
	view.camera = camera_MotherShip;
	scene.add(view.camera);

	var view = views[1];
	camera_ScoutShip = new THREE.PerspectiveCamera( view.fov, window.innerWidth / window.innerHeight, 1, 10000 );
	camera_ScoutShip.position.x = view.eye[ 0 ];
	camera_ScoutShip.position.y = view.eye[ 1 ];
	camera_ScoutShip.position.z = view.eye[ 2 ];
	camera_ScoutShip.up.x = view.up[ 0 ];
	camera_ScoutShip.up.y = view.up[ 1 ];
	camera_ScoutShip.up.z = view.up[ 2 ];
	camera_ScoutShip.lookAt( scene.position );
	view.camera = camera_ScoutShip;
	scene.add(view.camera);

			if (mothership_synced_planet) {
			mothership_synced_planet.remove(camera_MotherShip);
			mothership_synced_planet.remove(camera_ScoutShip);
		}
		if (scoutship_synced_planet) {
			scoutship_synced_planet.remove(camera_ScoutShip);
			scoutship_synced_planet.remove(camera_ScoutShip);
		}
			camera_MotherShip.add(mothership);
			camera_ScoutShip.add(scoutship);
		
}
	var view = views[0];
	camera_MotherShip = new THREE.PerspectiveCamera( view.fov, window.innerWidth / window.innerHeight, 1, 10000 );
	camera_MotherShip.position.x = view.eye[ 0 ];
	camera_MotherShip.position.y = view.eye[ 1 ];
	camera_MotherShip.position.z = view.eye[ 2 ];
	camera_MotherShip.up.x = view.up[ 0 ];
	camera_MotherShip.up.y = view.up[ 1 ];
	camera_MotherShip.up.z = view.up[ 2 ];
	camera_MotherShip.lookAt( scene.position );
	view.camera = camera_MotherShip;
	scene.add(view.camera);

	var view = views[1];
	camera_ScoutShip = new THREE.PerspectiveCamera( view.fov, window.innerWidth / window.innerHeight, 1, 10000 );
	camera_ScoutShip.position.x = view.eye[ 0 ];
	camera_ScoutShip.position.y = view.eye[ 1 ];
	camera_ScoutShip.position.z = view.eye[ 2 ];
	camera_ScoutShip.up.x = view.up[ 0 ];
	camera_ScoutShip.up.y = view.up[ 1 ];
	camera_ScoutShip.up.z = view.up[ 2 ];
	camera_ScoutShip.lookAt( scene.position );
	view.camera = camera_ScoutShip;
	scene.add(view.camera);

// ADDING THE AXIS DEBUG VISUALIZATIONS
scene.add(x_axis);
scene.add(y_axis);
scene.add(z_axis);


// ADAPT TO WINDOW RESIZE
function resize() {
	windowWidth = window.innerWidth;
	windowHeight = window.innerHeight;
  renderer.setSize(window.innerWidth,window.innerHeight);
}

// EVENT LISTENER RESIZE
window.addEventListener('resize',resize);
resize();

//SCROLLBAR FUNCTION DISABLE
window.onscroll = function () 
{
     window.scrollTo(0,0);
}

var ambientLight = new THREE.AmbientLight( 0x222222 );
scene.add( ambientLight );

var lights = [];
lights[0] = new THREE.PointLight( 0xffffff, 1, 0 );
lights[0].castShadow = true;

lights[0].position.set( 0, 0, 0 ); // IN THE SUN....

scene.add( lights[0] );

// SETUP HELPER GRID
// Note: Press Z to show/hide
var gridGeometry = new THREE.Geometry();
var i;
for(i=-50;i<51;i+=2) {
    gridGeometry.vertices.push( new THREE.Vector3(i,0,-50));
    gridGeometry.vertices.push( new THREE.Vector3(i,0,50));
    gridGeometry.vertices.push( new THREE.Vector3(-50,0,i));
    gridGeometry.vertices.push( new THREE.Vector3(50,0,i));
}

var gridMaterial = new THREE.LineBasicMaterial({color:0xBBBBBB});
var grid = new THREE.Line(gridGeometry,gridMaterial,THREE.LinePieces);

/////////////////////////////////
//   YOUR WORK STARTS BELOW    //
/////////////////////////////////


// Create Solar System

var anchor = new THREE.SphereGeometry(0,0,0)

// CREATE MATERIALS FOR CELESTIAL BODIES

var materials = [];

var anchor_material = new THREE.MeshBasicMaterial( {color: 0x000000})
var sun_material = new THREE.MeshBasicMaterial( {color: SUN_COLOR} );
var mercury_material = new THREE.MeshBasicMaterial( {color: MERCURY_COLOR});
var venus_material = new THREE.MeshBasicMaterial( {color: VENUS_COLOR});
var earth_material = new THREE.MeshBasicMaterial( {color: EARTH_COLOR});
var mars_material = new THREE.MeshBasicMaterial( {color: MARS_COLOR});
var jupiter_material = new THREE.MeshBasicMaterial( {color: JUPITER_COLOR});
var saturn_material = new THREE.MeshBasicMaterial( {color: SATURN_COLOR});
var uranus_material = new THREE.MeshBasicMaterial( {color: URANUS_COLOR});
var neptune_material = new THREE.MeshBasicMaterial( {color: NEPTUNE_COLOR});

materials.push(sun_material, mercury_material, venus_material, earth_material, mars_material, jupiter_material, saturn_material, uranus_material, neptune_material);

for (var i = 0; i < materials.length; i++) {
	materials[i].transparent = true;
	materials[i].opacity = 1;
}

// PLANET GEOMETRY

var sun_geometry = new THREE.SphereGeometry( 20, NUM_VERTICES, NUM_VERTICES );
var mercury_geometry = new THREE.SphereGeometry( .4, NUM_VERTICES, NUM_VERTICES );
var venus_geometry = new THREE.SphereGeometry( .95, NUM_VERTICES, NUM_VERTICES );
var earth_geometry = new THREE.SphereGeometry( 1, NUM_VERTICES, NUM_VERTICES );
var mars_geometry = new THREE.SphereGeometry( .5, NUM_VERTICES, NUM_VERTICES );
var jupiter_geometry = new THREE.SphereGeometry( 11, NUM_VERTICES, NUM_VERTICES );
var saturn_geometry = new THREE.SphereGeometry( 9.5, NUM_VERTICES, NUM_VERTICES );
var uranus_geometry = new THREE.SphereGeometry( 4, NUM_VERTICES, NUM_VERTICES );
var neptune_geometry = new THREE.SphereGeometry( 3.8, NUM_VERTICES, NUM_VERTICES );


// CREATE ANCHORS TO ROTATE AROUND FOR PLANETS

var mercury_anchor = new THREE.Points(anchor, anchor_material);
var venus_anchor = new THREE.Points(anchor, anchor_material);
var earth_anchor = new THREE.Points(anchor, anchor_material);
var mars_anchor = new THREE.Points(anchor, anchor_material);
var jupiter_anchor = new THREE.Points(anchor, anchor_material);
var saturn_anchor = new THREE.Points(anchor, anchor_material);
var uranus_anchor = new THREE.Points(anchor, anchor_material);
var neptune_anchor = new THREE.Points(anchor, anchor_material);

// CREATE PLANETS

var mercury = new THREE.Line(mercury_geometry, mercury_material);
var venus = new THREE.Line(venus_geometry, venus_material);
var earth = new THREE.Line(venus_geometry, earth_material);
var mars = new THREE.Line(mars_geometry, mars_material);
var jupiter = new THREE.Line(jupiter_geometry, jupiter_material);
var saturn = new THREE.Line(saturn_geometry, saturn_material);

// saturn's rings

var saturn_rings = new THREE.RingGeometry(11, 16, 100);
var rings = new THREE.Line(saturn_rings, new THREE.MeshBasicMaterial( {color: MERCURY_COLOR} ));
saturn.add(rings);
rings.rotateOnAxis(X_AXIS, 70 * Math.PI / 180);

var uranus = new THREE.Line(uranus_geometry, uranus_material);
var neptune = new THREE.Line(neptune_geometry, neptune_material);

var planets = [mercury, venus, earth, mars, jupiter, saturn, uranus, neptune];

var moon = new THREE.Line(mercury_geometry, mercury_material);

earth.add(moon.translateOnAxis(X_AXIS, 2));

// ANCHOR PLANETS

var distance_from_sun = [23, 25, 34, 51, 80, 120, 155, 175];
var geometry = new THREE.RingGeometry(2, 3, 50, 1, 0, Math.PI * 2);
var ring = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({color: 0xff0000, side: THREE.DoubleSide}));
ring.rotateOnAxis(X_AXIS, Math.PI / 2);
earth.add(ring);

var anchors = [];
anchors.push(mercury_anchor, venus_anchor, earth_anchor, mars_anchor, jupiter_anchor, saturn_anchor, uranus_anchor, neptune_anchor);

mercury_anchor.add(mercury.translateOnAxis(X_AXIS, distance_from_sun[0]));
venus_anchor.add(venus.translateOnAxis(X_AXIS, distance_from_sun[1]));
earth_anchor.add(earth.translateOnAxis(X_AXIS, distance_from_sun[2]));
mars_anchor.add(mars.translateOnAxis(X_AXIS, distance_from_sun[3]));
jupiter_anchor.add(jupiter.translateOnAxis(X_AXIS, distance_from_sun[4]));
saturn_anchor.add(saturn.translateOnAxis(X_AXIS, distance_from_sun[5]));
uranus_anchor.add(uranus.translateOnAxis(X_AXIS, distance_from_sun[6]));
neptune_anchor.add(neptune.translateOnAxis(X_AXIS, distance_from_sun[7]));

var sun = new THREE.Line(sun_geometry, sun_material);

var geometries = [mercury_geometry,venus_geometry, earth_geometry, mars_geometry, jupiter_geometry, saturn_geometry, uranus_geometry, neptune_geometry, sun_geometry];

for (var i=0; i < geometries.length; i++) {
	generateVertexColors( geometries[i] );
}

scene.add(sun);

for (var i = 0; i < anchors.length; i++) {
	scene.add(anchors[i]);
}

for (i = 0; i < anchors.length; i++) {
	var geometry = new THREE.RingGeometry(distance_from_sun[i], distance_from_sun[i] + 1, 50, 1, 0, Math.PI * 2);
	var ring = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({color: 0xff0000, side: THREE.DoubleSide}));
	ring.rotateOnAxis(X_AXIS, Math.PI / 2);
	scene.add(ring);
}

var mothership = new THREE.Mesh(new THREE.BoxGeometry(3, 3, 3), sun_material);
var scoutship = new THREE.Mesh(new THREE.CircleGeometry(5), new THREE.MeshBasicMaterial({ color: 0x0000ff }));





//TO-DO: INITIALIZE THE REST OF YOUR PLANETS


//Note: Use of parent attribute IS allowed.
//Hint: Keep hierarchies in mind! 

var clock = new THREE.Clock(true);
function updateSystem() 
{	
	if(!freeze_state) {

		// ANIMATE YOUR SOLAR SYSTEM HERE.

		sun.rotateOnAxis(Y_AXIS, SUN_ROTATION_SPEED);
		mercury_anchor.rotateOnAxis(Y_AXIS, EARTH_ORBITAL_VELOCITY / MERCURY_ORBITAL_VELOCITY);
		venus_anchor.rotateOnAxis(Y_AXIS, EARTH_ORBITAL_VELOCITY / VENUS_ORBITAL_VELOCITY);
		earth_anchor.rotateOnAxis(Y_AXIS, EARTH_ORBITAL_VELOCITY);
		mars_anchor.rotateOnAxis(Y_AXIS, EARTH_ORBITAL_VELOCITY / MARS_ORBITAL_VELOCITY);
		jupiter_anchor.rotateOnAxis(Y_AXIS, EARTH_ORBITAL_VELOCITY / JUPITER_ORBITAL_VELOCITY);
		saturn_anchor.rotateOnAxis(Y_AXIS, EARTH_ORBITAL_VELOCITY / SATURN_ORBITAL_VELOCITY);
		uranus_anchor.rotateOnAxis(Y_AXIS, EARTH_ORBITAL_VELOCITY / URANUS_ORBITAL_VELOCITY);
		neptune_anchor.rotateOnAxis(Y_AXIS, EARTH_ORBITAL_VELOCITY / NEPTUNE_ORBITAL_VELOCITY);

		mercury.rotateOnAxis(Y_AXIS, EARTH_ROTATION_SPEED * MERCURY_ROTATION_SPEED);
		venus.rotateOnAxis(Y_AXIS, EARTH_ROTATION_SPEED * VENUS_ROTATION_SPEED * EARTH_ROTATION_SPEED);
		earth.rotateOnAxis(Y_AXIS, EARTH_ROTATION_SPEED);
		mars.rotateOnAxis(Y_AXIS, EARTH_ROTATION_SPEED * MARS_ROTATION_SPEED);
		jupiter.rotateOnAxis(Y_AXIS, EARTH_ROTATION_SPEED * JUPITER_ROTATION_SPEED);
		saturn.rotateOnAxis(Y_AXIS, EARTH_ROTATION_SPEED * SATURN_ROTATION_SPEED);
		uranus.rotateOnAxis(Y_AXIS, EARTH_ROTATION_SPEED * URANUS_ROTATION_SPEED);
		neptune.rotateOnAxis(Y_AXIS, EARTH_ROTATION_SPEED * NEPTUNE_ROTATION_SPEED);


		

		if (geosynchronous_state) {
    		if (mothership_geosynchronous) {
    			mothership_synced_planet.add(camera_MotherShip);
    			camera_MotherShip.add(mothership);
    		} 
    		else {
    			if(mothership_synced_planet) {
    			mothership_synced_planet.remove(camera_MotherShip);
    		}
    		}
    		if (scoutship_synchronous) {
    			scoutship_synced_planet.add(camera_ScoutShip);
				camera_ScoutShip.add(scoutship);
    		}
    		else {
    			if (scoutship_synced_planet) {
    			scoutship_synced_planet.remove(camera_ScoutShip);
    		}
    		}

		}
		else {
		if (mothership_synced_planet) {
			mothership_synced_planet.remove(camera_MotherShip);
			mothership_synced_planet.remove(camera_ScoutShip);
		}
			camera_MotherShip.add(mothership);
			camera_ScoutShip.add(scoutship);
		}
	}
}

// LISTEN TO KEYBOARD
// Hint: Pay careful attention to how the keys already specified work!
var keyboard = new THREEx.KeyboardState();
var grid_state = false;
var freeze_state = false;
var mothership_state = false;
var scoutship_state = false;
var lookat_state = false;
var relative_state = false;
var geosynchronous_state = false;
var mothership_geosynchronous = false;
var scoutship_synchronous = false;
var stepsize = 1;
var motherCurrentScene = new THREE.Scene();
var scoutCurentScene = new THREE.Scene();
var tkey = false;
var scoutship_synced_planet = null;
var mothership_synced_planet = null;


function onDocumentMouseDown(event) {
	mouseX = event.clientX;
	mouseY = event.clientY;
}

function onDocumentMouseUp(event) {
	mouseX = event.clientX - mouseX;
	mouseY = event.clientY - mouseY;
	if((relative_state) && (mothership_state || scoutship_state)) {
		if(tkey) {
			mothership_state? camera_MotherShip.translateOnAxis(Z_AXIS, mouseY) : camera_ScoutShip.translateOnAxis(Z_AXIS, mouseY);
		} 
		else {
			mothership_state? camera_MotherShip.lookAt(motherCurrentScene.position.setY(motherCurrentScene.position.y - mouseY / 10 * stepsize)) : camera_ScoutShip.lookAt(scoutCurentScene.position.setY(scoutCurentScene.position.y - mouseY / 10 * stepsize));
			mothership_state? camera_MotherShip.lookAt(motherCurrentScene.position.setX(motherCurrentScene.position.x + mouseX / 10 * stepsize)) : camera_ScoutShip.lookAt(scoutCurentScene.position.setX(scoutCurentScene.position.x + mouseX / 10 * stepsize));
			mothership_state? camera_MotherShip.lookAt(motherCurrentScene.position.setZ(motherCurrentScene.position.z - mouseX / 10 * stepsize)) : camera_ScoutShip.lookAt(scoutCurentScene.position.setZ(scoutCurentScene.position.z - mouseX / 10 * stepsize));
		}
	}
	if (geosynchronous_state && (mothership_state || scoutship_state)) {
		
			mothership_state? camera_MotherShip.translateOnAxis(Z_AXIS, mouseY) : camera_ScoutShip.translateOnAxis(Z_AXIS, mouseY);
}
}

function onKeyUp(event) {
	if(keyboard.eventMatches(event, "t")) {
		tkey = false;
	}
}

function onKeyDown(event) {
	// TO-DO: BIND KEYS TO YOUR CONTROLS	    
  if(keyboard.eventMatches(event,"shift+g"))
  {  // Reveal/Hide helper grid
    grid_state = !grid_state;
    grid_state? scene.add(grid) : scene.remove(grid);
  }   
  if(keyboard.eventMatches(event, "space")) {
	  freeze_state = !freeze_state;
  }
  if(keyboard.eventMatches(event, "o")) {
  	  if (mothership_state) {
  	  	mothership_geosynchronous = !mothership_geosynchronous;
  	  }
	  mothership_state = true;
	  scoutship_state = false;
	  EARTH_ROTATION_SPEED = EARTH_ROTATION_SPEED_ORIGINAL;
	  EARTH_ORBITAL_VELOCITY = EARTH_ORBITAL_VELOCITY_ORIGINAL;
  }
  if(keyboard.eventMatches(event, "p")) {  	
  	  if (scoutship_state) {
  	  	scoutship_synchronous = !scoutship_synchronous;
  	  }
	  scoutship_state = true;
	  mothership_state = false;
	  EARTH_ROTATION_SPEED = EARTH_ROTATION_SPEED_ORIGINAL;
	  EARTH_ORBITAL_VELOCITY = EARTH_ORBITAL_VELOCITY_ORIGINAL;
  }
  if(keyboard.eventMatches(event, "m") || keyboard.eventMatches(event, "l") || keyboard.eventMatches(event, "r")) {
		mothership_geosynchronous = false;
		scoutship_synchronous = false;

		scoutCurentScene.position.set(0, 0, 0);
		motherCurrentScene.position.set(0, 0, 0);
		EARTH_ROTATION_SPEED = EARTH_ROTATION_SPEED_ORIGINAL;
		EARTH_ORBITAL_VELOCITY = EARTH_ORBITAL_VELOCITY_ORIGINAL;
	  resetCamera();
  }
  if(keyboard.eventMatches(event, "l")) {
	 lookat_state = !lookat_state;
	 relative_state = false;
	 geosynchronous_state = false;
  }
  if(keyboard.eventMatches(event, "r")) {
	  relative_state = !relative_state;
	  lookat_state = false;
	  geosynchronous_state = false;
  }
  if(keyboard.eventMatches(event, "g")) {
  	if (!geosynchronous_state) {
  		geosynchronous_state = true;
  		mothership_geosynchronous = scoutship_synchronous = true;
  		mothership_synced_planet = scoutship_synced_planet = earth;
  	}
  	else {
	  geosynchronous_state = !geosynchronous_state;
	  mothership_geosynchronous = scoutship_synchronous = false;
	  lookat_state = false;
	  relative_state = false;
	  if (!geosynchronous_state) {
	  	resetCamera();
	  }
	}
  }


  if (geosynchronous_state) {
  	if(keyboard.eventMatches(event, "1")){
  		if (mothership_state) {
  			mothership_geosynchronous = true;
  		mothership_synced_planet = mercury;
  		}
  		else { 
  			scoutship_synchronous = true;
  			scoutship_synced_planet = mercury;
  		}

  	}
  	if(keyboard.eventMatches(event, "2")){
  		if (mothership_state) {
  			mothership_geosynchronous = true;
  			mothership_synced_planet = venus;
  		}
  		else { 
  			scoutship_synchronous = true;
  			scoutship_synced_planet = venus;
  		}
  	}
  	if(keyboard.eventMatches(event, "3")){
  		if (mothership_state) {
  			mothership_geosynchronous = true;
  			mothership_synced_planet = earth;
  		}
  		else { 
  			scoutship_synchronous = true;
  			scoutship_synced_planet = earth;
  		}
  	}
  	if(keyboard.eventMatches(event, "4")){
  		if (mothership_state) {
  			mothership_geosynchronous = true;
  			mothership_synced_planet = mars;
  		}
  		else { 
  			scoutship_synchronous = true;
  			scoutship_synced_planet = mars;
  		}
  	}
  	if(keyboard.eventMatches(event, "5")){
  		if (mothership_state) {
  			mothership_geosynchronous = true;
  			mothership_synced_planet = jupiter;
  		}
  		else { 
  			scoutship_synchronous = true;
  			scoutship_synced_planet = jupiter;
  		}
  	}
  	if(keyboard.eventMatches(event, "6")){
  		if (mothership_state) {
  			mothership_geosynchronous = true;
  			mothership_synced_planet = saturn;
  		}
  		else { 
  			scoutship_synchronous = true;
  			scoutship_synced_planet = saturn;
  		}
  	}
  	if(keyboard.eventMatches(event, "7")){
  		if (mothership_state) {
  			mothership_geosynchronous = true;
  			mothership_synced_planet = uranus;
  		}
  		else { 
  			scoutship_synchronous = true;
  			scoutship_synced_planet = uranus;
  		}
  	}
  	if(keyboard.eventMatches(event, "8")){
  		if (mothership_state) {
  			mothership_geosynchronous = true;
  		mothership_synced_planet = neptune;
  		}
  		else { 
  			scoutship_synchronous = true;
  			scoutship_synced_planet = neptune;
  		}
  	}
  	  	if(keyboard.eventMatches(event, "0")){
  		if (mothership_state) {
  			mothership_geosynchronous = true;
  		mothership_synced_planet = moon;
  		}
  		else { 
  			scoutship_synchronous = true
  			scoutship_synced_planet = moon;
  		}
  	}
  }
  

	if (geosynchronous_state) {
		if(keyboard.eventMatches(event, "k")) {
		  	if(keyboard.eventMatches(event, "shift+k")) {
			  EARTH_ROTATION_SPEED /= 2;
	  	} 
	  	else {
			  EARTH_ROTATION_SPEED *= 2;
	  		}
		}
	}
	else {
			if(keyboard.eventMatches(event, "k")) {
		  if(keyboard.eventMatches(event, "shift+k")) {
		  stepsize--;
	  } else {
		  stepsize++;
	  }
	}

	}

		if (geosynchronous_state) {
		if(keyboard.eventMatches(event, "v")) {
		  	if(keyboard.eventMatches(event, "shift+v")) {
			  EARTH_ORBITAL_VELOCITY /= 2;
	  	} 
	  	else {
			  EARTH_ORBITAL_VELOCITY *= 2;
	  		}
		}
	}
	
	if(keyboard.eventMatches(event, "t")) {
		tkey = true;
	}
	
	if(lookat_state && (mothership_state || scoutship_state) && keyboard.eventMatches(event, "x")) {
		if(keyboard.eventMatches(event, "shift+x")) {
			mothership_state? camera_MotherShip.position.x -= stepsize : camera_ScoutShip.position.x -= stepsize;
		} else {
			mothership_state? camera_MotherShip.position.x += stepsize : camera_ScoutShip.position.x += stepsize;
		}
	}			
	
	if(lookat_state && (mothership_state || scoutship_state) && keyboard.eventMatches(event, "y")) {
		if(keyboard.eventMatches(event, "shift+y")) {
			mothership_state? camera_MotherShip.position.y -= stepsize : camera_ScoutShip.position.y -= stepsize;
		} else {
			mothership_state? camera_MotherShip.position.y += stepsize : camera_ScoutShip.position.y += stepsize;
		}
	}		
	
	if( (mothership_state || scoutship_state) && (lookat_state && keyboard.eventMatches(event, "z"))) {
		if(keyboard.eventMatches(event, "shift+z")) {
			mothership_state? camera_MotherShip.position.z -= stepsize : camera_ScoutShip.position.z -= stepsize;
		}
		else {
			mothership_state? camera_MotherShip.position.z += stepsize : camera_ScoutShip.position.z += stepsize;
		}
	}

	if ( (mothership_state || scoutship_state) && (geosynchronous_state && keyboard.eventMatches(event, "w"))) {
		if (keyboard.eventMatches(event, "shift+w")) {
			mothership_state? camera_MotherShip.translateOnAxis(Z_AXIS, stepsize) : camera_ScoutShip.translateOnAxis(Z_AXIS, stepsize);
		}
		else {
			mothership_state? camera_MotherShip.translateOnAxis(Z_AXIS, stepsize * -1) : camera_ScoutShip.translateOnAxis(Z_AXIS, stepsize * -1);
		}
	}
	
	if( (mothership_state || scoutship_state) && ( (lookat_state && keyboard.eventMatches(event, "d")) 
	 || (relative_state && keyboard.eventMatches(event, "a")) ) ){
		 if(keyboard.eventMatches(event, "shift+d") || keyboard.eventMatches(event, "shift+a")) {
			mothership_state? camera_MotherShip.up.x -= stepsize : camera_ScoutShip.up.x -= stepsize;
		} else {
			mothership_state? camera_MotherShip.up.x += stepsize : camera_ScoutShip.up.x += stepsize;
		}
		camera_MotherShip.lookAt(scene.position);
		camera_ScoutShip.lookAt(scene.position);
	}			
	
	if(lookat_state && (mothership_state || scoutship_state) && keyboard.eventMatches(event, "e")) {
		if(keyboard.eventMatches(event, "shift+e")) {
			mothership_state? camera_MotherShip.up.y -= stepsize : camera_ScoutShip.up.y -= stepsize;
		} else {
			mothership_state? camera_MotherShip.up.y += stepsize : camera_ScoutShip.up.y += stepsize;
		}
		camera_MotherShip.lookAt(scene.position);
		camera_ScoutShip.lookAt(scene.position);
	}
	
	if(lookat_state && (mothership_state || scoutship_state) && keyboard.eventMatches(event, "f")) {
		if(keyboard.eventMatches(event, "shift+f")) {
			mothership_state? camera_MotherShip.up.z -= stepsize : camera_ScoutShip.up.z -= stepsize;
		} else {
			mothership_state? camera_MotherShip.up.z += stepsize : camera_ScoutShip.up.z += stepsize;
		}
		camera_MotherShip.lookAt(scene.position);
		camera_ScoutShip.lookAt(scene.position);
	}	
	
	if( (mothership_state || scoutship_state) && ( (lookat_state && keyboard.eventMatches(event, "a")) 
	 || (relative_state && keyboard.eventMatches(event, "q")) ) ){
		if(keyboard.eventMatches(event, "shift+a") || (!keyboard.eventMatches(event, "shift+q") && relative_state)) {
			mothership_state? camera_MotherShip.lookAt(motherCurrentScene.position.setX(motherCurrentScene.position.x - stepsize)) : camera_ScoutShip.lookAt(scoutCurentScene.position.setX(scoutCurentScene.position.x - stepsize));
		} else {
			mothership_state? camera_MotherShip.lookAt(motherCurrentScene.position.setX(motherCurrentScene.position.x + stepsize)) : camera_ScoutShip.lookAt(scoutCurentScene.position.setX(scoutCurentScene.position.x + stepsize));
		}
	}			
	
	if( (mothership_state || scoutship_state) && ( (lookat_state && keyboard.eventMatches(event, "b")) 
	 || (relative_state && keyboard.eventMatches(event, "s")) ) ){
		 if(keyboard.eventMatches(event, "shift+b") || (!keyboard.eventMatches(event, "shift+s") && relative_state)) {
			mothership_state? camera_MotherShip.lookAt(motherCurrentScene.position.setY(motherCurrentScene.position.y - stepsize)) : camera_ScoutShip.lookAt(scoutCurentScene.position.setY(scoutCurentScene.position.y - stepsize));
		} else {
			mothership_state? camera_MotherShip.lookAt(motherCurrentScene.position.setY(motherCurrentScene.position.y + stepsize)) : camera_ScoutShip.lookAt(scoutCurentScene.position.setY(scoutCurentScene.position.y + stepsize));
		}
	}
	
	if( (mothership_state || scoutship_state) && ( (lookat_state && keyboard.eventMatches(event, "c")) 
	 || (relative_state && keyboard.eventMatches(event, "q")) ) ){
		 if(keyboard.eventMatches(event, "shift+c") || keyboard.eventMatches(event, "shift+q")) {
			mothership_state? camera_MotherShip.lookAt(motherCurrentScene.position.setZ(motherCurrentScene.position.z - stepsize)) : camera_ScoutShip.lookAt(scoutCurentScene.position.setZ(scoutCurentScene.position.z - stepsize));
		} else {
			mothership_state? camera_MotherShip.lookAt(motherCurrentScene.position.setZ(motherCurrentScene.position.z + stepsize)) : camera_ScoutShip.lookAt(scoutCurentScene.position.setZ(scoutCurentScene.position.z + stepsize));
		}
	}	
		if ((mothership_state || scoutship_state) && (relative_state && keyboard.eventMatches(event, "w")) ){
		 if(keyboard.eventMatches(event, "shift+w")) {
			mothership_state? camera_MotherShip.translateOnAxis(Z_AXIS, stepsize) : camera_ScoutShip.translateOnAxis(Z_AXIS, stepsize);
		} else {
			mothership_state? camera_MotherShip.translateOnAxis(Z_AXIS, -stepsize) : camera_ScoutShip.translateOnAxis(Z_AXIS, -stepsize);
		}
	}
}

keyboard.domElement.addEventListener('keydown', onKeyDown );
keyboard.domElement.addEventListener('keyup', onKeyUp);
document.addEventListener('mousedown', onDocumentMouseDown, false);
document.addEventListener('mouseup', onDocumentMouseUp, false);

// SETUP UPDATE CALL-BACK
// Hint: It is useful to understand what is being updated here, the effect, and why.
// DON'T TOUCH THIS
function update() {
  updateSystem();

  requestAnimationFrame(update);
  
  // UPDATES THE MULTIPLE CAMERAS IN THE SIMULATION
  for ( var ii = 0; ii < views.length; ++ii ) 
  {

		view = views[ii];
		camera_ = view.camera;

		view.updateCamera( camera_, scene, mouseX, mouseY );

		var left   = Math.floor( windowWidth  * view.left );
		var bottom = Math.floor( windowHeight * view.bottom );
		var width  = Math.floor( windowWidth  * view.width );
		var height = Math.floor( windowHeight * view.height );
		renderer.setViewport( left, bottom, width, height );
		renderer.setScissor( left, bottom, width, height );
		renderer.enableScissorTest ( true );
		renderer.setClearColor( view.background );

		camera_.aspect = width / height;
		camera_.updateProjectionMatrix();

		renderer.render( scene, camera_ );
	}
}
	resetCamera();
	update();