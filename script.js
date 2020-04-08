const vshader = `
	void main() {
		gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
	}
`;

const fshader = `
	uniform float u_time;
	uniform vec2 u_mouse;
	uniform vec2 u_resolution;
	uniform vec3 u_color; // must be declared outside the main function
	// gl_FragColor = vec4(1.0, 1.0, 0.0, 1.0);

	void main() {
		// GLSL will divide the first component of u_mouse with the first component of u_resolution, and the second by the second
		// so I can acces the kvot using v.x and v.y
		vec2 v = u_mouse / u_resolution;

		// Color based on mouse position. Top left is 0,0, so: rgb(0,0,0)
		// bottom right is (window.innerWidth, window.innerHeight) so like rgb(1200, 0, 800)

		// vec3 color = vec3(v.x, 0.0, v.y); // same as vec3(u_mouse.x/u_resolution.x, 0.0, u_mouse.y/u_resolution.y);

		vec3 color = vec3((sin(u_time) + 1.0) / 2.0, 0.0, (cos(u_time) + 1.0) / 2.0);
		// sin() returns a value between -1.0 and 1.0.
		// Color channels need a value between 0.0 and 1.0. How make it return a value between 0.0-1.0 instead?
		// sin(x) + 1.0 returns a value between 0.0 and 2.0, and 2.0/2 = 1.0

		gl_FragColor = vec4(color, 1.0);
	}
`;



////////////////////////////////////////////////////////////////////////////////
// SCENE
////////////////////////////////////////////////////////////////////////////////
const scene = new THREE.Scene();

////////////////////////////////////////////////////////////////////////////////
// CAMERA
////////////////////////////////////////////////////////////////////////////////
const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10); // This camera has no perspective of depth
										// left, right, top, bottom, near, far

////////////////////////////////////////////////////////////////////////////////
// RENDERER
////////////////////////////////////////////////////////////////////////////////
const renderer = new THREE.WebGLRenderer(); // WebGL uses the OpenGL ES library.
renderer.setSize(window.innerWidth, window.innerHeight); // when the renderer is initialized it creates a canvas (domELement)
document.body.appendChild(renderer.domElement); // add this domElement to body

////////////////////////////////////////////////////////////////////////////////
// CLOCK
////////////////////////////////////////////////////////////////////////////////
const clock = new THREE.Clock();

////////////////////////////////////////////////////////////////////////////////
// GEOMETRY
////////////////////////////////////////////////////////////////////////////////
const geometry = new THREE.PlaneGeometry(2, 2); // width, height

////////////////////////////////////////////////////////////////////////////////
// UNIFORMS
////////////////////////////////////////////////////////////////////////////////
// Uniforms are used to pass data between the control program and the shaders
// The name uniform is used to indicate that this value will be the same for each vertex and each pixel

const uniforms = {
	u_time: { value: 0.0 },
	u_mouse: { value: { x: 0.0, y: 0.0 }},
	u_resolution: { value: { x: 0.0, y: 0.0 }},
	u_color: { value: new THREE.Color(0x00FF00) } // 0x signifies it's a hex value. A THREE.js color translates to a vec3 type
}

////////////////////////////////////////////////////////////////////////////////
// MATERIAL
////////////////////////////////////////////////////////////////////////////////
const material = new THREE.ShaderMaterial({
	uniforms: uniforms, // pass the color from the control program to the GLSL-shader
	vertexShader: vshader,
	fragmentShader: fshader
});

const plane = new THREE.Mesh(geometry, material);

////////////////////////////////////////////////////////////////////////////////
// ADD IT TO THE SCENE
////////////////////////////////////////////////////////////////////////////////
scene.add(plane);

camera.position.z = 1; // camera is one unit away from the plane


////////////////////////////////////////////////////////////////////////////////
// BÖS
////////////////////////////////////////////////////////////////////////////////
onWindowResize();

if ('ontouchstart' in window) {
	document.addEventListener('touchmove', mode);
} else {
	window.addEventListener('resize', onWindowResize, false);
	document.addEventListener('mousemove', move);
}

animate();


function move(event) {
	// If the event object contains a property called touches, we're using a touch device
	// Then we need to use the first value in the touches array the get the mouse value
	uniforms.u_mouse.value.x = event.touches ? event.touches[0].clientX : event.clientX;
	uniforms.u_mouse.value.y = event.touches ? event.touches[0].clientY : event.clientY;
}

//End of your code
// Render the scene.
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  uniforms.u_time.value = clock.getElapsedTime();
}

// render the plane so it fills the screen regardless of the aspect ratio
function onWindowResize( event ) {
  const aspectRatio = window.innerWidth/window.innerHeight;
  let width, height;
  if (aspectRatio>=1){
    width = 1;
    height = (window.innerHeight/window.innerWidth) * width;
  }else{
    width = aspectRatio;
    height = 1;
  }
  camera.left = -width;
  camera.right = width;
  camera.top = height;
  camera.bottom = -height;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );

  if (uniforms.u_resolution !== undefined) {
	  uniforms.u_resolution.value.x = window.innerWidth;
	  uniforms.u_resolution.value.y = window.innerHeight;
  }
}
