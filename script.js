const vshader = `
	void main() {
		gl_Position = projectionMatrix * modelViewMatrix * vec4(position * 0.5, 1.0);
	}
`;

const fshader = `
	void main() {
		gl_FragColor = vec4(1.0, 1.0, 0.0, 1.0);
	}
`;



//Enter your code here
const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10); // This camera has no perspective of depth
										// left, right, top, bottom, near, far
const renderer = new THREE.WebGLRenderer(); // WebGL uses the OpenGL ES library.
renderer.setSize(window.innerWidth, window.innerHeight); // when the renderer is initialized it creates a canvas (domELement)
document.body.appendChild(renderer.domElement); // add this domElement to the body

const geometry = new THREE.PlaneGeometry(2, 2); // width, height
const material = new THREE.ShaderMaterial({
	vertexShader: vshader,
	fragmentShader: fshader
	});
const plane = new THREE.Mesh(geometry, material);
scene.add(plane);

camera.position.z = 1; // camera is one unit away from the plane

onWindowResize();

animate();

//End of your code
// Render the scene.
function animate() {
  requestAnimationFrame( animate );
  renderer.render( scene, camera );
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
}
