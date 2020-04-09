const vshader = `
	varying vec2 v_uv;
	// varying vec3 v_position;

	void main() {
		// v_position = position;
		v_uv = uv; // Here we are copying our uv value to our fragment shader
		gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
	}
`;

const fshader = `
	uniform vec2 u_resolution;
	varying vec2 v_uv;
	// varying vec3 v_position;

	void main(void) {
		// vec3 color = vec3(v_position.x, v_position.y, 0.0);
		vec3 color = vec3(v_uv.x, v_uv.y, 0.0);

		// vec2 uv = gl_FragCoord.xy / u_resolution;
		// vec3 color = mix(vec3(1.0, 0.0, 0.0), vec3(0.0, 0.0, 1.0), uv.y);
		// vec3 color = vec3(v_uv.x, v_uv.y, 0.0);
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
const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);

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
	u_color_a: { value: new THREE.Color(0xff0000) },
	u_color_b: { value: new THREE.Color(0x0000ffff) },
	u_time: { value: 0.0 },
	u_mouse: { value: { x: 0.0, y: 0.0 }},
	u_resolution: { value: { x: 0.0, y: 0.0 }}
}

////////////////////////////////////////////////////////////////////////////////
// MATERIAL
////////////////////////////////////////////////////////////////////////////////
const material = new THREE.ShaderMaterial({
  uniforms: uniforms,
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

if ('ontouchstart' in window){
  document.addEventListener('touchmove', move);
} else {
  window.addEventListener( 'resize', onWindowResize, false );
  document.addEventListener('mousemove', move);
}

function move(event){
  uniforms.u_mouse.value.x = (event.touches) ? event.touches[0].clientX : event.clientX;
  uniforms.u_mouse.value.y = (event.touches) ? event.touches[0].clientY : event.clientY;
}

animate();

// render the plane so it fills the screen regardless of the aspect ratio
function onWindowResize(event) {
  const aspectRatio = window.innerWidth / window.innerHeight;
  let width, height;
  if (aspectRatio >= 1) {
    width = 1;
    height = (window.innerHeight / window.innerWidth) * width;
  } else {
    width = aspectRatio;
    height = 1;
  }
  camera.left = -width;
  camera.right = width;
  camera.top = height;
  camera.bottom = -height;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);

  if (uniforms.u_resolution !== undefined) {
	  uniforms.u_resolution.value.x = window.innerWidth;
	  uniforms.u_resolution.value.y = window.innerHeight;
  }
}

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  uniforms.u_time.value = clock.getElapsedTime();
}

// function animate() {
//   requestAnimationFrame( animate );
//   uniforms.u_time.value += clock.getDelta();
//   renderer.render( scene, camera );
// }
