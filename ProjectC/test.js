// // Regular vertex shader prog
var VSHADER_SOURCE0 =
'precision highp float;\n' +
'precision highp int;\n' +
// materials
'struct MatlT {\n' +		// Describes one Phong material by its reflectances:
'	vec3 emit;\n' +			// Ke: emissive -- surface 'glow' amount (r,g,b);
'	vec3 ambi;\n' +			// Ka: ambient reflectance (r,g,b)
'	vec3 diff;\n' +			// Kd: diffuse reflectance (r,g,b)
'	vec3 spec;\n' + 		// Ks: specular reflectance (r,g,b)
'	int shiny;\n' +			// Kshiny: specular exponent (integer >= 1; typ. <200)
'};\n' +

'struct LampT {\n' +		// Describes one point-like Phong light source
'   vec3 pos;\n' +			// (x,y,z,w); w==1.0 for local light at x,y,z position
'   vec3 ambi;\n' +			// Ia ==  ambient light source strength (r,g,b)
'   vec3 diff;\n' +			// Id ==  diffuse light source strength (r,g,b)
'   vec3 spec;\n' +			// Is == specular light source strength (r,g,b)
'}; \n' +

// attributes
'attribute vec4 a_Position;\n' +
'attribute vec4 a_Normal; \n' +     // send from outside
'attribute vec4 a_Color;\n' +

// uniforms
'uniform MatlT u_MatlSet[1];\n' +		// Array of all materials. Now there's only one material
'uniform LampT u_LampSet[1];\n' +		// Array of all light sources.
'uniform mat4 u_modelMatrix;\n' +
'uniform mat4 u_NormalMatrix; \n' +  	// Inverse Transpose of ModelMatrix;
'uniform mat4 u_MvpMatrix; \n' +
'uniform vec3 u_eyePosWorld; \n' + 	    // Camera/eye location in world coords. Not changing, so, it's uniform

// varying - send to fragment shader
'varying vec4 v_Color;\n' +

    'void main() {\n' +
    '  gl_Position = (u_MvpMatrix + u_modelMatrix - u_modelMatrix + u_NormalMatrix - u_NormalMatrix) * a_Position;\n' +
    '  float x = u_eyePosWorld.x - u_eyePosWorld.x + a_Normal.x - a_Normal.x' + 
    '  + u_LampSet[0].pos.x - u_LampSet[0].pos.x + u_MatlSet[0].emit.x - u_MatlSet[0].emit.x;\n' +
    '  v_Color = a_Color  + a_Color * x;\n' +
    '}\n';
// Fragment shader prog
var FSHADER_SOURCE0 =				
    'precision highp float;\n' +
    'precision highp int;\n' +
  													
    'varying vec4 v_Color;\n' +

    'void main() {\n' +
    '   gl_FragColor = v_Color;\n' +
    '}\n';



// phong shader + blinn-phong
var VSHADER_SOURCE1 =
// materials
    'struct MatlT {\n' +		// Describes one Phong material by its reflectances:
	'	vec3 emit;\n' +			// Ke: emissive -- surface 'glow' amount (r,g,b);
	'	vec3 ambi;\n' +			// Ka: ambient reflectance (r,g,b)
	'	vec3 diff;\n' +			// Kd: diffuse reflectance (r,g,b)
	'	vec3 spec;\n' + 		// Ks: specular reflectance (r,g,b)
	'	int shiny;\n' +			// Kshiny: specular exponent (integer >= 1; typ. <200)
    '};\n' +

    // attributes
    'attribute vec4 a_Position;\n' +
    'attribute vec4 a_Normal; \n' +     // send from outside
    'attribute vec4 a_Color;\n' +
    
    // uniforms
    'uniform MatlT u_MatlSet[1];\n' +		// Array of all materials. Now there's only one material
    'uniform mat4 u_modelMatrix;\n' +
    'uniform mat4 u_NormalMatrix; \n' +  	// Inverse Transpose of ModelMatrix;
    'uniform mat4 u_MvpMatrix; \n' +

    // varying - send to fragment shader
    'varying vec4 v_Color;\n' +
    'varying vec3 v_Kd; \n' +		// Phong Lighting: diffuse reflectance
    'varying vec4 v_Position; \n' +
    'varying vec3 v_Normal; \n' +	


    'void main() {\n' +
    '   gl_Position = u_MvpMatrix * a_Position;\n' +      // shoud be " '  gl_Position = u_MvpMatrix * a_Position;\n' +"
    '   v_Color = a_Color;\n' +
    '   v_Position = u_modelMatrix * a_Position; \n' +      // position in world sys (z axis up)
    '   v_Normal = normalize(vec3(u_NormalMatrix * a_Normal));\n' +
    '   v_Kd = u_MatlSet[0].diff; \n' +		// find per-pixel diffuse reflectance from per-vertex
											// (no per-pixel Ke,Ka, or Ks, but you can do it...)
    '}\n';

    
// Fragment shader prog
var FSHADER_SOURCE1 =				
    'precision highp float;\n' +
    'precision highp int;\n' +
    //--------------- GLSL Struct Definitions:
	'struct LampT {\n' +		// Describes one point-like Phong light source
	'   vec3 pos;\n' +			// (x,y,z,w); w==1.0 for local light at x,y,z position
								// w==0.0 for distant light from x,y,z direction 
	'   vec3 ambi;\n' +			// Ia ==  ambient light source strength (r,g,b)
	'   vec3 diff;\n' +			// Id ==  diffuse light source strength (r,g,b)
	'   vec3 spec;\n' +			// Is == specular light source strength (r,g,b)
    '}; \n' +
    
    'struct MatlT {\n' +		// Describes one Phong material by its reflectances:
	'	vec3 emit;\n' +			// Ke: emissive -- surface 'glow' amount (r,g,b);
	'	vec3 ambi;\n' +			// Ka: ambient reflectance (r,g,b)
	'	vec3 diff;\n' +			// Kd: diffuse reflectance (r,g,b)
	'	vec3 spec;\n' + 		// Ks: specular reflectance (r,g,b)
	'	int shiny;\n' +			// Kshiny: specular exponent (integer >= 1; typ. <200)
    '};\n' +

    // uniforms:
    'uniform LampT u_LampSet[1];\n' +		// Array of all light sources.
	'uniform MatlT u_MatlSet[1];\n' +		// Array of all materials.
    'uniform vec3 u_eyePosWorld; \n' + 	    // Camera/eye location in world coords. Not changing, so, it's uniform
    // varyings:
    'varying vec3 v_Normal;\n' +				// Find 3D surface normal at each pix
    'varying vec4 v_Position;\n' +			// pixel's 3D pos too -- in 'world' coords
    'varying vec3 v_Kd;	\n' +						// Find diffuse reflectance K_d per pix
                                                        // Ambient? Emissive? Specular? almost
  													// NEVER change per-vertex: I use 'uniform' values
     'varying vec4 v_Color;\n' +

    'void main() {\n' +
    // Normalize! !!IMPORTANT!! TROUBLE if you don't! 
     	// normals interpolated for each pixel aren't 1.0 in length any more!
    '   vec3 normal = normalize(v_Normal); \n' +
    '   vec3 lightDirection = normalize(u_LampSet[0].pos - v_Position.xyz);\n' +
    '   vec3 eyeDirection = normalize(u_eyePosWorld - v_Position.xyz); \n' +
    '   float nDotL = max(dot(lightDirection, normal), 0.0); \n' +
    '   vec3 H = normalize(lightDirection + eyeDirection); \n' +
    '   float nDotH = max(dot(H, normal), 0.0); \n' +
    '   float e64 = pow(nDotH, float(u_MatlSet[0].shiny));\n' +
    '   vec3 emissive = u_MatlSet[0].emit;' +
    '   vec3 ambient = u_LampSet[0].ambi * u_MatlSet[0].ambi;\n' +
    '   vec3 diffuse = u_LampSet[0].diff * v_Kd * nDotL;\n' +
    '	vec3 speculr = u_LampSet[0].spec * u_MatlSet[0].spec * e64;\n' +
    '   gl_FragColor = vec4(emissive + ambient + diffuse + speculr , v_Color );\n' + // 1.0
    '}\n';



// Gouraud shader + blinn-phong
var VSHADER_SOURCE2 =
    'precision highp float;\n' +
    'precision highp int;\n' +
// lilght
    'struct LampT {\n' +		// Describes one point-like Phong light source
	'vec3 pos;\n' +			    // (x,y,z,w); w==1.0 for local light at x,y,z position
								// w==0.0 for distant light from x,y,z direction 
	'vec3 ambi;\n' +			// Ia ==  ambient light source strength (r,g,b)
	'vec3 diff;\n' +			// Id ==  diffuse light source strength (r,g,b)
	'vec3 spec;\n' +			// Is == specular light source strength (r,g,b)
    '}; \n' +
// materials
    'struct MatlT {\n' +		// Describes one Phong material by its reflectances:
	'	vec3 emit;\n' +			// Ke: emissive -- surface 'glow' amount (r,g,b);
	'	vec3 ambi;\n' +			// Ka: ambient reflectance (r,g,b)
	'	vec3 diff;\n' +			// Kd: diffuse reflectance (r,g,b)
	'	vec3 spec;\n' + 		// Ks: specular reflectance (r,g,b)
	'	int shiny;\n' +			// Kshiny: specular exponent (integer >= 1; typ. <200)
    '};\n' +

    // attributes
    'attribute vec4 a_Position;\n' +
    'attribute vec4 a_Normal; \n' +     // send from outside
    'attribute vec4 a_Color;\n' +
    
    // uniforms
    'uniform MatlT u_MatlSet[1];\n' +		// Array of all materials. Now there's only one material
    'uniform mat4 u_modelMatrix;\n' +
    'uniform mat4 u_NormalMatrix; \n' +  	// Inverse Transpose of ModelMatrix;
    'uniform mat4 u_MvpMatrix; \n' +
    'uniform LampT u_LampSet[1];\n' +		// Array of all light sources.
    'uniform vec3 u_eyePosWorld; \n' + 	    // Camera/eye location in world coords. Not changing, so, it's uniform

    // varying - send to fragment shader
    'varying vec4 v_Color;\n' +

    'void main() {\n' +
    '   gl_Position = u_MvpMatrix * a_Position;\n' +      // shoud be " '  gl_Position = u_MvpMatrix * a_Position;\n' +"
                                                            // real position on canvas (CVV)
    '   vec3 normal = normalize(vec3(u_NormalMatrix * a_Normal));\n' +
    '   vec4 v_Position_none = u_modelMatrix * a_Position; \n' +      // position in world sys (z axis up)
    '   vec3 lightDirection = normalize(u_LampSet[0].pos - v_Position_none.xyz);\n' +
    '   vec3 eyeDirection = normalize(u_eyePosWorld - v_Position_none.xyz); \n' +
    '   float nDotL = max(dot(lightDirection, normal), 0.0); \n' +
    '   vec3 H = normalize(lightDirection + eyeDirection); \n' +
    '   float nDotH = max(dot(H, normal), 0.0); \n' +
    '   float e64 = pow(nDotH, float(u_MatlSet[0].shiny));\n' +
    '   vec3 emissive = u_MatlSet[0].emit;' +
    '   vec3 ambient = u_LampSet[0].ambi * u_MatlSet[0].ambi;\n' +
    '   vec3 diffuse = u_LampSet[0].diff * u_MatlSet[0].diff * nDotL;\n' +
    '	vec3 speculr = u_LampSet[0].spec * u_MatlSet[0].spec * e64;\n' +
    '   v_Color = vec4(emissive + ambient + diffuse + speculr , a_Color);\n' + // 1.0
    '}\n';
// Fragment shader prog
var FSHADER_SOURCE2 =				
    'precision highp float;\n' +
    'precision highp int;\n' +
   							// NEVER change per-vertex: I use 'uniform' values
    'varying vec4 v_Color;\n' +

    'void main() {\n' +
    '  gl_FragColor = v_Color;\n' +
    '}\n';

// phong shader + phong lighting
var VSHADER_SOURCE3 =
// materials
    'struct MatlT {\n' +		// Describes one Phong material by its reflectances:
	'	vec3 emit;\n' +			// Ke: emissive -- surface 'glow' amount (r,g,b);
	'	vec3 ambi;\n' +			// Ka: ambient reflectance (r,g,b)
	'	vec3 diff;\n' +			// Kd: diffuse reflectance (r,g,b)
	'	vec3 spec;\n' + 		// Ks: specular reflectance (r,g,b)
	'	int shiny;\n' +			// Kshiny: specular exponent (integer >= 1; typ. <200)
    '};\n' +

    // attributes
    'attribute vec4 a_Position;\n' +
    'attribute vec4 a_Normal; \n' +     // send from outside
    'attribute vec4 a_Color;\n' +
    
    // uniforms
    'uniform MatlT u_MatlSet[1];\n' +		// Array of all materials. Now there's only one material
    'uniform mat4 u_modelMatrix;\n' +
    'uniform mat4 u_NormalMatrix; \n' +  	// Inverse Transpose of ModelMatrix;
    'uniform mat4 u_MvpMatrix; \n' +

    // varying - send to fragment shader
    'varying vec4 v_Color;\n' +
    'varying vec3 v_Kd; \n' +		// Phong Lighting: diffuse reflectance
    'varying vec4 v_Position; \n' +
    'varying vec3 v_Normal; \n' +	


    'void main() {\n' +
    '   gl_Position = u_MvpMatrix * a_Position;\n' +      // shoud be " '  gl_Position = u_MvpMatrix * a_Position;\n' +"
                                                            // real position on canvas (CVV)
    '   v_Color = a_Color;\n' +
    '   v_Position = u_modelMatrix * a_Position; \n' +      // position in world sys (z axis up)
    '   v_Normal = normalize(vec3(u_NormalMatrix * a_Normal));\n' +
    '   v_Kd = u_MatlSet[0].diff; \n' +		// find per-pixel diffuse reflectance from per-vertex
											// (no per-pixel Ke,Ka, or Ks, but you can do it...)
    '}\n';

    
// Fragment shader prog
var FSHADER_SOURCE3 =				
    'precision highp float;\n' +
    'precision highp int;\n' +
    //--------------- GLSL Struct Definitions:
	'struct LampT {\n' +		// Describes one point-like Phong light source
	'   vec3 pos;\n' +			// (x,y,z,w); w==1.0 for local light at x,y,z position
								// w==0.0 for distant light from x,y,z direction 
	'   vec3 ambi;\n' +			// Ia ==  ambient light source strength (r,g,b)
	'   vec3 diff;\n' +			// Id ==  diffuse light source strength (r,g,b)
	'   vec3 spec;\n' +			// Is == specular light source strength (r,g,b)
    '}; \n' +
    
    'struct MatlT {\n' +		// Describes one Phong material by its reflectances:
	'	vec3 emit;\n' +			// Ke: emissive -- surface 'glow' amount (r,g,b);
	'	vec3 ambi;\n' +			// Ka: ambient reflectance (r,g,b)
	'	vec3 diff;\n' +			// Kd: diffuse reflectance (r,g,b)
	'	vec3 spec;\n' + 		// Ks: specular reflectance (r,g,b)
	'	int shiny;\n' +			// Kshiny: specular exponent (integer >= 1; typ. <200)
    '};\n' +
    // uniforms:
    'uniform LampT u_LampSet[1];\n' +		// Array of all light sources.
	'uniform MatlT u_MatlSet[1];\n' +		// Array of all materials.
    'uniform vec3 u_eyePosWorld; \n' + 	    // Camera/eye location in world coords. Not changing, so, it's uniform
    // varyings:
    'varying vec3 v_Normal;\n' +				// Find 3D surface normal at each pix
    'varying vec4 v_Position;\n' +			// pixel's 3D pos too -- in 'world' coords
    'varying vec3 v_Kd;	\n' +						// Find diffuse reflectance K_d per pix
                                                        // Ambient? Emissive? Specular? almost
  													// NEVER change per-vertex: I use 'uniform' values
    'varying vec4 v_Color;\n' +

    'void main() {\n' +
    '  gl_FragColor = v_Color;\n' +
    // Normalize! !!IMPORTANT!! TROUBLE if you don't! 
     	// normals interpolated for each pixel aren't 1.0 in length any more!
    '   vec3 normal = normalize(v_Normal); \n' +
    '   vec3 lightDirection = normalize(u_LampSet[0].pos - v_Position.xyz);\n' +
    '   vec3 R = normalize(reflect(-lightDirection, normal))	 ;\n'+
    '   vec3 eyeDirection = normalize(u_eyePosWorld - v_Position.xyz); \n' +
    '   float nDotL = max(dot(lightDirection, normal), 0.0); \n' +
    '   float VDotR = max(dot(R, eyeDirection), 0.0); \n' +

    '   float e64 = pow(VDotR, float(u_MatlSet[0].shiny));\n' +
    '   vec3 emissive = u_MatlSet[0].emit;' +
    '   vec3 ambient = u_LampSet[0].ambi * u_MatlSet[0].ambi;\n' +
    '   vec3 diffuse = u_LampSet[0].diff * v_Kd * nDotL;\n' +
    '	vec3 speculr = u_LampSet[0].spec * u_MatlSet[0].spec * e64;\n' +
    '   gl_FragColor = vec4(emissive + ambient + diffuse + speculr , v_Color);\n' + // 1.0
    '}\n';



// Gouraud shader + phong
var VSHADER_SOURCE4 =
    'precision highp float;\n' +
    'precision highp int;\n' +
// lilght
    'struct LampT {\n' +		// Describes one point-like Phong light source
	'   vec3 pos;\n' +			// (x,y,z,w); w==1.0 for local light at x,y,z position
								// w==0.0 for distant light from x,y,z direction 
	'   vec3 ambi;\n' +			// Ia ==  ambient light source strength (r,g,b)
	'   vec3 diff;\n' +			// Id ==  diffuse light source strength (r,g,b)
	'   vec3 spec;\n' +			// Is == specular light source strength (r,g,b)
    '}; \n' +
// materials
    'struct MatlT {\n' +		// Describes one Phong material by its reflectances:
	'	vec3 emit;\n' +			// Ke: emissive -- surface 'glow' amount (r,g,b);
	'	vec3 ambi;\n' +			// Ka: ambient reflectance (r,g,b)
	'	vec3 diff;\n' +			// Kd: diffuse reflectance (r,g,b)
	'	vec3 spec;\n' + 		// Ks: specular reflectance (r,g,b)
	'	int shiny;\n' +			// Kshiny: specular exponent (integer >= 1; typ. <200)
    '};\n' +

    // attributes
    'attribute vec4 a_Position;\n' +
    'attribute vec4 a_Normal; \n' +     // send from outside
    'attribute vec4 a_Color;\n' +
    
    // uniforms
    'uniform MatlT u_MatlSet[1];\n' +		// Array of all materials. Now there's only one material
    'uniform mat4 u_modelMatrix;\n' +
    'uniform mat4 u_NormalMatrix; \n' +  	// Inverse Transpose of ModelMatrix;
    'uniform mat4 u_MvpMatrix; \n' +
    'uniform LampT u_LampSet[1];\n' +		// Array of all light sources.
    'uniform vec3 u_eyePosWorld; \n' + 	    // Camera/eye location in world coords. Not changing, so, it's uniform

    // varying - send to fragment shader
    'varying vec4 v_Color;\n' +

    'void main() {\n' +
    '   gl_Position = u_MvpMatrix * a_Position;\n' +      // shoud be " '  gl_Position = u_MvpMatrix * a_Position;\n' +"
    '   vec3 normal = normalize(vec3(u_NormalMatrix * a_Normal));\n' +
    '   vec4 v_Position_none = u_modelMatrix * a_Position; \n' +      // position in world sys (z axis up)                                         
    '   vec3 lightDirection = normalize(u_LampSet[0].pos - v_Position_none.xyz);\n' +
    '   vec3 eyeDirection = normalize(u_eyePosWorld - v_Position_none.xyz); \n' +
    '   float nDotL = max(dot(lightDirection, normal), 0.0); \n' +
    '   vec3 R = normalize(reflect(-lightDirection, normal))	 ;\n'+
    '   float VDotR = max(dot(R, eyeDirection), 0.0); \n' +
    '   float e64 = pow(VDotR, float(u_MatlSet[0].shiny));\n' +
    '   vec3 emissive = u_MatlSet[0].emit;' +
    '   vec3 ambient = u_LampSet[0].ambi * u_MatlSet[0].ambi;\n' +
    '   vec3 diffuse = u_LampSet[0].diff * u_MatlSet[0].diff * nDotL;\n' +
    '	vec3 speculr = u_LampSet[0].spec * u_MatlSet[0].spec * e64;\n' +
    '   v_Color = vec4(emissive + ambient + diffuse + speculr , a_Color);\n' + // 1.0
    '}\n';
// Fragment shader prog
var FSHADER_SOURCE4 =				
    'precision highp float;\n' +
    'precision highp int;\n' + 
   							
    'varying vec4 v_Color;\n' +

    'void main() {\n' +
    '  gl_FragColor = v_Color;\n' +
    '}\n';

//// ------------------------------------
//            global variable
//// ------------------------------------

var gl;     // rendering context for WebGL
var g_canvasID = document.getElementById('webgl');
var g_modelMatrix = new Matrix4();
var	mvpMatrix 	= new Matrix4();	// Model-view-projection matrix
var	normalMatrix= new Matrix4();	// Transformation matrix for normals

var uLoc_eyePosWorld 	= new Array(false, false, false, false, false);
var uLoc_modelMatrix    = new Array(false, false, false, false, false);
var uLoc_MvpMatrix 		= new Array(false, false, false, false, false);
var uLoc_NormalMatrix   = new Array(false, false, false, false, false);

// global vars that contain the values we send thru those uniforms,
//  ... for our camera:
var	eyePosWorld = new Float32Array(3);	// x,y,z in world coords
//  ... for our transforms:
// var modelMatrix = new Matrix4();  // Model matrix

//	... for our first light source:   (stays false if never initialized)
var lamp0 = new LightsT();

	// ... for our first material:
var matlSel= MATL_COPPER_SHINY;				// see keypress(): 'm' key changes matlSel
var matl0 = new Material(matlSel);	


var shaderLoc, shaderLoc0, shaderLoc1, shaderLoc2, shaderLoc3, shaderLoc4;
var vert;
var shaderIdx;

// quaternion
var qNew = new Quaternion(0,0,0,1); // most-recent mouse drag's rotation
var qTot = new Quaternion(0,0,0,1);	// 'current' orientation (made from qNew)
var quatMatrix = new Matrix4();				// rotation matrix, made from latest qTot

var g_vertCount;


// For animation:---------------------
var g_lastMS = Date.now();    			// Timestamp for most-recently-drawn image; 

//------------For mouse click-and-drag: -------------------------------
var g_isDrag = false;		// mouse-drag: true when user holds down mouse button
var g_xMclik = 0.0;			// last mouse button-down position (in CVV coords)
var g_yMclik = 0.0;
var g_xMdragTot = 0.0;	// total (accumulated) mouse-drag amounts (in CVV coords).
var g_yMdragTot = 0.0;
var g_digits = 5;			// DIAGNOSTICS: # of digits to print in console.log (

var cloud_x = 0, cloud_y = 0, cloud_z = 0; 

var g_xKmove = 0.0;	// total (accumulated) keyboard-drag amounts (in CVV coords).
var g_yKmove = 0.0;

// flags of movement
var cloudView = false;
var keyPressed;                 // 

// sphere
var g_angle12now = 0; 			// init Current rotation angle, in degrees.
var g_angle12rate = 20;				// init Rotation angle rate, in degrees/second.
var g_angle12min = -180;       // init min, max allowed angle, in degrees
var g_angle12max = 180;

// rigid objects' starting position and length.
var axis_S, axis_C, grid_S, grid_C;
var sphere_C, sphere_S;

// Cameras:
var eye_x = 0, eye_y = -4, eye_z = 3;
var direc_x = 0, direc_y = 0.8, direc_z = -0.6;
var la_x = direc_x, la_y = direc_y, la_z = direc_z;

var sphere_theta = 0, sphere_gamma = -37 * Math.PI / 180;
var near = 1, far = 15;
var wid;
var orthox = 0, orthoy = 0, orthoz = 0;
var inst_x, inst_y, inst_z;
var newdirx =1, newdiry = 0, newdirz = -1;
//// ------------------------------------
//         global variable end
//// ------------------------------------

function main() {
    // VBO creating
    vert = initVertexBuffers();
    if (vert.length < 0) {
        console.log('Failed to set the positions of the vertices');
        return;
    }

    gl = g_canvasID.getContext("webgl", { preserveDrawingBuffer: true });
    if (!gl) {
        console.log('Failed to get the rendering context for WebGL. Bye!');
        return;
    }

    gl.enable(gl.DEPTH_TEST); 
    // setting background color
    gl.clearColor(0.4, 0.2, 0.8, 0.5);   // stored in gl.COLOR_BUFFER_BIT
    
    //===================================================================== */
    //Initialize shaders
    shaderLoc0 = myInitShaders(VSHADER_SOURCE0, FSHADER_SOURCE0, "BASIC", 0);
    shaderLoc1 = myInitShaders(VSHADER_SOURCE1, FSHADER_SOURCE1, "PHONG + BLINN-PHONG", 1);
    shaderLoc2 = myInitShaders(VSHADER_SOURCE2, FSHADER_SOURCE2, "GOURAUD + BLINN-PHONG", 2);
    shaderLoc3 = myInitShaders(VSHADER_SOURCE3, FSHADER_SOURCE3, "PHONG + PHONG", 3);
    shaderLoc4 = myInitShaders(VSHADER_SOURCE4, FSHADER_SOURCE4, "GOURAUD + PHONG", 4);

    switchShader(shaderLoc1, 1);

    {
        window.addEventListener("keydown", myKeyDown, false);
        window.addEventListener("keyup", myKeyUp, false);
        window.addEventListener("mousedown", myMouseDown);
        window.addEventListener("mousemove", myMouseMove);
        window.addEventListener("mouseup", myMouseUp);
        window.addEventListener("click", myMouseClick);

        function calcOneThirdDis(asp, near, far) {
            var long = (far - near) / 6 + near;
            return 2 * long / (Math.cos(asp * Math.PI / 360)) * Math.sin(asp * 2 * Math.PI / 360);
        }
        wid = calcOneThirdDis(30, near, far);
    }

    var tick = function () {
        requestAnimationFrame(tick, g_canvasID);
        timerAll();
        drawResize()
        // Also display our current mouse-dragging state:
        document.getElementById('Mouse').innerHTML =
            'Mouse Drag totals (CVV coords):\t' +
            g_xMdragTot.toFixed(5) + ', \t' + g_yMdragTot.toFixed(g_digits);
    }

    tick();
    //drawResize()
}

// seting functions
{
function drawResize() {
        var xtraMargin = 16;    // keep a margin (otherwise, browser adds scroll-bars)
        g_canvasID.width = innerWidth - xtraMargin;
        g_canvasID.height = (innerHeight*2/3) - xtraMargin;
        drawAll();
}

function rotateNow(anglenow, anglerate, anglebreak, elapsedtime, min, max) {
    anglenow += anglerate * anglebreak * elapsedtime * 0.001;
    if ((anglenow >= max && anglerate > 0) || (anglenow <= min && anglerate < 0)) {
        anglerate *= -1;
    }
    if (min > max) {// if min and max don't limit the angle, then
        if (anglenow < -180.0) anglenow += 360.0;	// go to >= -180.0 or
        else if (anglenow > 180.0) anglenow -= 360.0;	// go to <= +180.0
    }
    return [anglenow, anglerate];
}

function timerAll() {
    var nowMS = Date.now();             // current time (in milliseconds)
    var elapsedMS = nowMS - g_lastMS;   // 
    g_lastMS = nowMS;                   // update for next webGL drawing.
    if (elapsedMS > 1000.0) {
        elapsedMS = 1000.0 / 30.0;
    }

    [g_angle12now, g_angle12rate] = rotateNow(g_angle12now, g_angle12rate, 1, elapsedMS, g_angle12min, g_angle12max);
}
}

function initVertexBuffers() {
    // vertices information
    var v_ans = groundgridV();
    grid_S = 0;
    grid_C = v_ans.length / 10;

    var curr_v = axisV();
    curr_v = axisV();
    axis_S = v_ans.length / 10;
    axis_C = curr_v.length / 10;
    v_ans = Array.prototype.concat.call(
        v_ans, curr_v,
    );
    curr_v.clear;

    curr_v = sphereV();
    sphere_S = v_ans.length / 10;
    sphere_C = curr_v.length / 10;
    
    v_ans = Array.prototype.concat.call(
        v_ans, curr_v,
    );
    curr_v.clear;

    var vertices = new Float32Array(v_ans);
    return vertices;
}

function bindVertBuff (vertices_array) {
    // create a buffer in GPU, its ID is vertexBufferID
    var vertexBufferID = gl.createBuffer();
    if (!vertexBufferID) {
        console.log('Failed to create the buffer object');
        return -1;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBufferID);     // bind the buffer with gl
    gl.bufferData(gl.ARRAY_BUFFER, vertices_array, gl.STATIC_DRAW);   // store the vertices' information in buffer from gl

    var FSIZE = vertices_array.BYTES_PER_ELEMENT;
    var aLoc_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (aLoc_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return -2;
    }
    gl.vertexAttribPointer(aLoc_Position, 4, gl.FLOAT, false, FSIZE * 10, 0);
    gl.enableVertexAttribArray(aLoc_Position);

    var a_Color = gl.getAttribLocation(gl.program, 'a_Color');
    if (a_Color < 0) {
        console.log('Failed to get the storage location of a_Color');
        return -2;
    }
    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 10, FSIZE * 4);
    gl.enableVertexAttribArray(a_Color);

    var a_Normal = gl.getAttribLocation(gl.program, 'a_Normal');
    if (a_Normal < 0) {
        console.log('Failed to get the storage location of a_Normal');
        return -2;
    }
    gl.vertexAttribPointer(a_Normal, 3, gl.FLOAT, false, FSIZE * 10, FSIZE * 7);
    gl.enableVertexAttribArray(a_Normal);

    return 0;
}

// vertices & draw function
{
    function sphereV() {
        var ans_ver;
        var d1 = 0, d2 = 0; // d1-degree to y, d2-degree to x
        var step = 36;
        var offset = Math.PI * 2 / step;
        //console.log("new");
        while(d1 <= Math.PI)
        {
            
            while(d2 <= Math.PI * 2)
            {
                //console.log(d1, d2);
                var p1 = [Math.sin(d1)*Math.cos(d2), Math.cos(d1), Math.sin(d1)*Math.sin(d2), 1.0, 153/255, 153/255, 255/255,];
                var p2 = [Math.sin(d1+offset)*Math.cos(d2), Math.cos(d1+offset), Math.sin(d1+offset)*Math.sin(d2), 1.0,  255/255, 153/255, 255/255,];
                var p3 = [Math.sin(d1+offset)*Math.cos(d2+offset), Math.cos(d1+offset), Math.sin(d1+offset)*Math.sin(d2+offset), 1.0, 255/255, 153/255, 255/255,];
                var p4 = [Math.sin(d1)*Math.cos(d2+offset), Math.cos(d1), Math.sin(d1)*Math.sin(d2+offset), 1.0,  255/255, 153/255, 255/255,];
                
                var n1 = [Math.sin(d1)*Math.cos(d2), Math.cos(d1), Math.sin(d1)*Math.sin(d2),];
                var n2 = [Math.sin(d1+offset)*Math.cos(d2), Math.cos(d1+offset), Math.sin(d1+offset)*Math.sin(d2),];
                var n3 = [Math.sin(d1+offset)*Math.cos(d2+offset), Math.cos(d1+offset), Math.sin(d1+offset)*Math.sin(d2+offset),];
                var n4 = [Math.sin(d1)*Math.cos(d2+offset), Math.cos(d1), Math.sin(d1)*Math.sin(d2+offset),];

                
                var curr_ver = Array.prototype.concat.call(
                    p1, n1, p2, n2, p3, n3, 
                    p1, n1, p3, n3, p4, n4,
                );

                if (ans_ver == null) {
                    ans_ver = curr_ver;
                }
                else {
                    ans_ver = Array.prototype.concat.call(ans_ver, curr_ver);
                }
                d2 = d2 + offset;
            }
            d1 = d1 + offset;
            d2 = 0;
        }
        return ans_ver;
        
    }

    function drawSphere() {
        pushMatrix(g_modelMatrix);

        pushMatrix(mvpMatrix);
            
            g_modelMatrix.translate(0, -1, 0);	
            g_modelMatrix.scale(0.4, 0.4, 0.4);	
            g_modelMatrix.rotate(g_angle12now, 0, 1, 0);

            mvpMatrix.multiply(g_modelMatrix);
            normalMatrix.setInverseOf(g_modelMatrix);
            normalMatrix.transpose();
            gl.uniformMatrix4fv(uLoc_MvpMatrix[shaderIdx], false, mvpMatrix.elements);
            gl.uniformMatrix4fv(uLoc_NormalMatrix[shaderIdx], false, normalMatrix.elements);

            gl.uniformMatrix4fv(uLoc_modelMatrix[shaderIdx], false, g_modelMatrix.elements);
            gl.drawArrays(gl.TRIANGLES, sphere_S, sphere_C);	// draw all vertices.
            
             
        mvpMatrix = popMatrix();
        g_modelMatrix = popMatrix();
        return 0;
    }

    function groundgridV() {
        var ans_ver;
        var x_max = 3;

        var x_num = -3;
        var x_gap = 0.1;

        while(x_num <= x_max) {
            
            var p1 = [x_num, -1, -3, 1.0, 204/255, 255/255, 229/255, 1.0, 1.0, 1.0,];
            var p2 = [x_num, -1, 3, 1.0, 204/255, 255/255, 229/255, 1.0, 1.0, 1.0,];

            var p3 = [-3, -1, x_num, 1.0, 255/255, 229/255, 204/255, 1.0, 1.0, 1.0,];
            var p4 = [3, -1, x_num, 1.0, 255/255, 229/255, 204/255, 1.0, 1.0, 1.0,];

            var curr_ver = Array.prototype.concat.call(
                p1, p2,
                p3, p4,
            );
            
            if (ans_ver == null) {
                ans_ver = curr_ver;
            }
            else {
                ans_ver = Array.prototype.concat.call(ans_ver, curr_ver);
            }
            x_num = x_num + x_gap;
        }
        return ans_ver;
    }

    function drawGrid() {
        pushMatrix(g_modelMatrix);

        pushMatrix(mvpMatrix);

            mvpMatrix.multiply(g_modelMatrix);
            normalMatrix.setInverseOf(g_modelMatrix);
            normalMatrix.transpose();
            gl.uniformMatrix4fv(uLoc_MvpMatrix[shaderIdx], false, mvpMatrix.elements);
            gl.uniformMatrix4fv(uLoc_NormalMatrix[shaderIdx], false, normalMatrix.elements);

            gl.uniformMatrix4fv(uLoc_modelMatrix[shaderIdx], false, g_modelMatrix.elements);
            gl.drawArrays(gl.LINES, grid_S, grid_C);	// draw all vertices.
            
        mvpMatrix = popMatrix();
        g_modelMatrix = popMatrix();
        return 0;
    }

    function axisV() {
        var v1 = [0.0, 0.0, 0.0, 1.0, 1.0, 0.0, 0.0, 1.0, 1.0, 1.0,];
        var v2 = [0.3, 0.0, 0.0, 1.0, 1.0, 0.0, 0.0, 1.0, 1.0, 1.0,];
        var v3 = [0.0, 0.0, 0.0, 1.0, 0.0, 1.0, 0.0, 1.0, 1.0, 1.0,];
        var v4 = [0.0, 0.3, 0.0, 1.0, 0.0, 1.0, 0.0, 1.0, 1.0, 1.0,];
        var v5 = [0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 1.0, 1.0, 1.0,];
        var v6 = [0.0, 0.0, 0.3, 1.0, 0.0, 0.0, 1.0, 1.0, 1.0, 1.0,];

        var vertices = Array.prototype.concat.call(
            v1, v2,
            v3, v4,
            v5, v6,
        );
        
        return vertices;
    }

    function drawAxis() {
        pushMatrix(g_modelMatrix);

        pushMatrix(mvpMatrix);
        
            g_modelMatrix.rotate(-90, 1, 0, 0);

            mvpMatrix.multiply(g_modelMatrix);
            normalMatrix.setInverseOf(g_modelMatrix);
            normalMatrix.transpose();
            gl.uniformMatrix4fv(uLoc_MvpMatrix[shaderIdx], false, mvpMatrix.elements);
            gl.uniformMatrix4fv(uLoc_NormalMatrix[shaderIdx], false, normalMatrix.elements);
            
            gl.uniformMatrix4fv(uLoc_modelMatrix[shaderIdx], false, g_modelMatrix.elements);
            
            gl.drawArrays(gl.LINES, axis_S, axis_C);	// draw all vertices.
            
            mvpMatrix = popMatrix();
        g_modelMatrix = popMatrix();

        return 0;
    }

}

// draw all + draw things
{
function drawThings() {
    g_modelMatrix.rotate(90, 1, 0, 0);
    pushMatrix(g_modelMatrix);

    // Axis
    {
        pushMatrix(g_modelMatrix);
            g_modelMatrix.scale(4, 4, 4);
            drawAxis();
            
        g_modelMatrix = popMatrix();
    }

    {
        pushMatrix(g_modelMatrix);
            g_modelMatrix.translate(0, 1, 0);
            drawSphere();
            drawGrid();
            g_modelMatrix.translate(2, -0.5, 0);
            g_modelMatrix.scale(0.5, 0.5, 0.5);
            drawSphere();

        g_modelMatrix = popMatrix();
    }

    g_modelMatrix = popMatrix();
    return 0;
}

// calculation functions
{
    function calcLPoint (theta, gamma) {      // theta-> x-y, gamma-> vertical
        var z = Math.sin(gamma);
        var x = Math.cos(gamma) * Math.sin(theta);
        var y = Math.cos(gamma) * Math.cos(theta); 
        return [x, y, z];
    }
}



function drawAll() {
    // clear <canvas>
    gl.clear(gl.CLEAR_COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    // CLEAR BOTH the color AND the depth buffers before you draw stuff!!
    gl.clear(gl.COLOR_BUFFER_BIT);
    mvpMatrix.setIdentity();
    g_modelMatrix.setIdentity();
    // ---------------------------------
    inst_x = cloud_x;
    inst_y = cloud_z;
    inst_z = cloud_y;

    setCamera();
    setLights();
    setMatrials();
    
    // set perspective:
    gl.viewport(0,											// Viewport lower-left corner
				0, 			// location(in pixels)
                g_canvasID.width, 				// viewport width,
                g_canvasID.height);			// viewport height in pixels.

    var vpAspect = g_canvasID.width /			// On-screen aspect ratio for
                    (g_canvasID.height);	// this camera: width/height.
        
    if(keyPressed == "c" && !cloudView)
    {
                keyPressed = "";
                cloudView = true;
    }
    if(keyPressed == "c" && cloudView ) {
                keyPressed = "";
                cloudView = false;
    }
            
    if(cloudView)
    {
        mvpMatrix.perspective(  30.0,
            vpAspect,
            0.1,              // near
            far);        // far

            mvpMatrix.lookAt(   inst_x, inst_y, inst_z + 1  ,	// center of projection
                                newdirx, newdiry, newdirz,	// look-at point 
                                0.0, 0.0, 1.0);	// View UP vector.
    }
    else {

        mvpMatrix.perspective(  30.0,
            vpAspect,
            near,              // near
            far);        // far
        mvpMatrix.lookAt(   eye_x, eye_y, eye_z,	// center of projection
                            la_x, la_y, la_z,	// look-at point 
                            0.0, 0.0, 1.0);	// View UP vector.
    }


    // ---------------------------------
    drawThings();

    return 0;
}

}

// input handling
{
    //==================HTML Button Callbacks======================
    
    function resetQuat() {
          var res=5;
            qTot.clear();
            document.getElementById('QuatValue').innerHTML= 
                                                                 '\t X=' +qTot.x.toFixed(res)+
                                                                'i\t Y=' +qTot.y.toFixed(res)+
                                                                'j\t Z=' +qTot.z.toFixed(res)+
                                                                'k\t W=' +qTot.w.toFixed(res)+
                                                                '<br>length='+qTot.length().toFixed(res);
    }
    
    //===================Mouse and Keyboard event-handling Callbacks
    // Mouse
    {
    function myMouseDown(ev) {

        var rect = ev.target.getBoundingClientRect();	// get canvas corners in pixels
        var xp = ev.clientX - rect.left;									// x==0 at canvas left edge
        var yp = g_canvasID.height - (ev.clientY - rect.top);	// y==0 at canvas bottom edge

        var x = (xp - g_canvasID.width / 2) / 		// move origin to center of canvas and
            (g_canvasID.width / 2);			// normalize canvas to -1 <= x < +1,
        var y = (yp - g_canvasID.height / 2) /		//										 -1 <= y < +1.
            (g_canvasID.height / 2);
        g_isDrag = true;											// set our mouse-dragging flag
        g_xMclik = x;													// record where mouse-dragging began
        g_yMclik = y;
        // report on webpage
        document.getElementById('MouseAtResult').innerHTML =
            'Mouse At: ' + x.toFixed(g_digits) + ', ' + y.toFixed(g_digits);
    };
    
    
    function myMouseMove(ev) { 
    
        if (g_isDrag == false) return;			
        var rect = ev.target.getBoundingClientRect();	// get canvas corners in pixels
        var xp = ev.clientX - rect.left;									// x==0 at canvas left edge
        var yp = g_canvasID.height - (ev.clientY - rect.top);	// y==0 at canvas bottom edge

        var x = (xp - g_canvasID.width / 2) / 		// move origin to center of canvas and
            (g_canvasID.width / 2);		// normalize canvas to -1 <= x < +1,
        var y = (yp - g_canvasID.height / 2) /		//									-1 <= y < +1.
            (g_canvasID.height / 2);

        g_xMdragTot += (x - g_xMclik);			// Accumulate change-in-mouse-position,&
        g_yMdragTot += (y - g_yMclik);


        // for quaternion
        dragQuat(x - g_xMclik, y - g_yMclik);
        // for quaternion

        // Report new mouse position & how far we moved on webpage:
        document.getElementById('MouseAtResult').innerHTML =
            'Mouse At: ' + x.toFixed(g_digits) + ', ' + y.toFixed(g_digits);
        document.getElementById('MouseDragResult').innerHTML =
            'Mouse Drag: ' + (x - g_xMclik).toFixed(g_digits) + ', '
            + (y - g_yMclik).toFixed(g_digits);
    
        g_xMclik = x;											// Make next drag-measurement from here.
        g_yMclik = y;
    };
    
    function myMouseUp(ev) {

        var rect = ev.target.getBoundingClientRect();	// get canvas corners in pixels
        var xp = ev.clientX - rect.left;									// x==0 at canvas left edge
        var yp = g_canvasID.height - (ev.clientY - rect.top);	// y==0 at canvas bottom edge
        //  console.log('myMouseUp  (pixel coords):\n\t xp,yp=\t',xp,',\t',yp);
    
        // Convert to Canonical View Volume (CVV) coordinates too:
        var x = (xp - g_canvasID.width / 2) / 		// move origin to center of canvas and
            (g_canvasID.width / 2);			// normalize canvas to -1 <= x < +1,
        var y = (yp - g_canvasID.height / 2) /		//										 -1 <= y < +1.
            (g_canvasID.height / 2);
        console.log('myMouseUp  (CVV coords  ):\n\t x, y=\t', x, ',\t', y);
    
        g_isDrag = false;											// CLEAR our mouse-dragging flag, and
        // accumulate any final bit of mouse-dragging we did:
        g_xMdragTot += (x - g_xMclik);
        g_yMdragTot += (y - g_yMclik);

        // AND use any mouse-dragging we found to update quaternions qNew and qTot;
        dragQuat(x - g_xMclik, y - g_yMclik);
    
        // Report new mouse position:
        document.getElementById('MouseAtResult').innerHTML =
            'Mouse At: ' + x.toFixed(g_digits) + ', ' + y.toFixed(g_digits);
        console.log('myMouseUp: g_xMdragTot,g_yMdragTot =',
            g_xMdragTot.toFixed(g_digits), ',\t', g_yMdragTot.toFixed(g_digits));
    };
    
    function dragQuat(xdrag, ydrag) {

            var res = 5;
            var qTmp = new Quaternion(0,0,0,1);
            var dist = Math.sqrt(xdrag*xdrag + ydrag*ydrag);
            qNew.setFromAxisAngle(-ydrag*Math.cos(sphere_theta) + 0.0001, xdrag*Math.cos(sphere_gamma) + 0.0001, -ydrag*Math.sin(sphere_theta) + xdrag * Math.sin(sphere_gamma), dist*150.0);             
            qTmp.multiply(qNew,qTot);			// apply new rotation to current rotation. 
            qTot.copy(qTmp);
            document.getElementById('QuatValue').innerHTML= 
                                                                 '\t X=' +qTot.x.toFixed(res)+
                                                                'i\t Y=' +qTot.y.toFixed(res)+
                                                                'j\t Z=' +qTot.z.toFixed(res)+
                                                                'k\t W=' +qTot.w.toFixed(res)+
                                                                '<br>length='+qTot.length().toFixed(res);
        };

    function myMouseClick(ev) {
        console.log("myMouseClick() on button: ", ev.button);
    }
    
    }

    {
    function myKeyDown(kev) {

        

        console.log("--kev.code:", kev.code, "\t\t--kev.key:", kev.key,
            "\n--kev.ctrlKey:", kev.ctrlKey, "\t--kev.shiftKey:", kev.shiftKey,
            "\n--kev.altKey:", kev.altKey, "\t--kev.metaKey:", kev.metaKey);
        console.log("Bone is at: ", g_xKmove + ", " + g_yKmove)
    
        keyPressed = kev.key;
    
        // and report EVERYTHING on webpage:
        document.getElementById('KeyDownResult').innerHTML = ''; // clear old results
        document.getElementById('KeyModResult').innerHTML = '';
    
        // key details:
        document.getElementById('KeyModResult').innerHTML =
            "   --kev.code:" + kev.code + "      --kev.key:" + kev.key +
            "<br>--kev.ctrlKey:" + kev.ctrlKey + " --kev.shiftKey:" + kev.shiftKey +
            "<br>--kev.altKey:" + kev.altKey + "  --kev.metaKey:" + kev.metaKey;
    
        switch (kev.code) {
            case "KeyP":
                console.log("Pause/unPause!\n");                // print on console,
                document.getElementById('KeyDownResult').innerHTML =
                    'myKeyDown() found p/P key. Pause/unPause!';   // print on webpage
                if (g_isRun == true) {
                    g_isRun = false;    // STOP animation
                }
                else {
                    g_isRun = true;     // RESTART animation
                    tick();
                }
                break;
            //------------------WASD navigation-----------------
            case "KeyA":
    
                g_xKmove = g_xKmove - 0.05;
                console.log("a/A key: Strafe LEFT!\n");
                document.getElementById('KeyDownResult').innerHTML =
                    'myKeyDown() found a/A key. Strafe LEFT!';
                break;
            case "KeyD":
                g_xKmove = g_xKmove + 0.05;
                console.log("d/D key: Strafe RIGHT!\n");
                document.getElementById('KeyDownResult').innerHTML =
                    'myKeyDown() found d/D key. Strafe RIGHT!';
                break;
            case "KeyS":
                g_yKmove = g_yKmove - 0.05;
                console.log("s/S key: Move BACK!\n");
                document.getElementById('KeyDownResult').innerHTML =
                    'myKeyDown() found s/Sa key. Move BACK.';
                break;
            case "KeyW":
                g_yKmove = g_yKmove + 0.05;
                console.log("w/W key: Move FWD!\n");
                document.getElementById('KeyDownResult').innerHTML =
                    'myKeyDown() found w/W key. Move FWD!';
                break;
            //------------------IJKL navigation (Camera gazing) -----------------
            case "KeyI":
    
                sphere_gamma = sphere_gamma + 0.05;
                console.log("i/I key: Look Up!\n");
                document.getElementById('KeyDownResult').innerHTML =
                    'myKeyDown() found i/I key. Look Up!';
                break;
            case "KeyK":
                sphere_gamma = sphere_gamma - 0.05;
                console.log("k/K key: Look Down!\n");
                document.getElementById('KeyDownResult').innerHTML =
                    'myKeyDown() found k/K key. Look Down!';
                break;
            case "KeyJ":
                sphere_theta = sphere_theta - 0.05;
                console.log("j/J key: Turn Left!\n");
                document.getElementById('KeyDownResult').innerHTML =
                    'myKeyDown() found j/J key. Turn Left.';
                break;
            case "KeyL":
                sphere_theta = sphere_theta + 0.05;
                console.log("l/L key: Turn Right!\n");
                document.getElementById('KeyDownResult').innerHTML =
                    'myKeyDown() found l/L key. Turn Right!';
                break;

            //----------------Arrow keys Strafe ------------------------
            case "ArrowLeft":
                eye_x  = eye_x - 0.1 * direc_y;
                eye_y  = eye_y + 0.1 * direc_x;

                orthox -= 0.1;

                console.log(' left-arrow. Strafe Left!');
                // and print on webpage in the <div> element with id='Result':  
                document.getElementById('KeyDownResult').innerHTML =
                    'myKeyDown(): Left Arrow=' + kev.keyCode;
                break;
            case "ArrowRight":
                eye_x  = eye_x + 0.1 * direc_y;
                eye_y  = eye_y - 0.1 * direc_x;

                orthox += 0.1;
                console.log('right-arrow. Strafe Right!');
                document.getElementById('KeyDownResult').innerHTML =
                    'myKeyDown():Right Arrow:keyCode=' + kev.keyCode;
                break;
            case "ArrowUp":
                eye_x  = eye_x + 0.5* direc_x;
                eye_y  = eye_y + 0.5* direc_y;
                eye_z  = eye_z + 0.5* direc_z;

                wid -= 0.5;

                console.log('  up-arrow. Go FWD!');
                document.getElementById('KeyDownResult').innerHTML =
                    'myKeyDown():   Up Arrow:keyCode=' + kev.keyCode;
                break;
            case "ArrowDown":
                eye_x  = eye_x - 0.5* direc_x;
                eye_y  = eye_y - 0.5* direc_y;
                eye_z  = eye_z - 0.5* direc_z;
                wid += 0.5;
                console.log(' down-arrow. Go BKW!');
                document.getElementById('KeyDownResult').innerHTML =
                    'myKeyDown(): Down Arrow:keyCode=' + kev.keyCode;
                break;
            default:
                console.log("UNUSED!");
                document.getElementById('KeyDownResult').innerHTML =
                    'myKeyDown(): UNUSED!';
                break;
        }

        [direc_x, direc_y, direc_z] = calcLPoint(sphere_theta, sphere_gamma);
        console.log("direction: ", direc_x, direc_y, direc_z);
        la_x = eye_x + direc_x;
        la_y = eye_y + direc_y;
        la_z = eye_z + direc_z;
        console.log(" theta: ", sphere_theta, " gamma: ", sphere_gamma);
        //onsole.log("Eye point: ", eye_x, eye_y, eye_z, " Look at point: ", la_x, la_y, la_z, " theta: ", sphere_theta, " gamma: ", sphere_gamma);


    }
    
    function myKeyUp(kev) {
        //===============================================================================
        // Called when user releases ANY key on the keyboard; captures scancodes well
        console.log('myKeyUp()--keyCode=' + kev.keyCode + ' released.');
    }
}
    }


    
// functions for muli-shader 
function normCalc(x1, y1, z1, x2, y2, z2, x3, y3, z3) {
    var u = [x2 - x1, y2 - y1, z2 - z1];
    var v = [x3 - x2, y3 - y2, z3 - z2];

    return [u[1] * v[2] - u[2]*v[1], u[2]* v[0] - u[0] * v[2], u[0]* v[1] - u[1] * v[0]];
}

function myInitShaders(VSHADER, FSHADER, name, idx) {
    shaderLoc = createProgram(gl, VSHADER, FSHADER);
    if (!shaderLoc) {
        console.log('Failed to create ', name);
        return false;
    }

    gl.useProgram(shaderLoc);
    gl.program = shaderLoc;	

    // generate buffers in new shader
    uLoc_modelMatrix[idx] = gl.getUniformLocation(gl.program, 'u_modelMatrix');  // = u_ModelMatrix in starter code BasicShapesCam
    if (!uLoc_modelMatrix[idx]) {
        console.log('Failed to get the storage location of u_modelMatrix for ', name);
        return;
    }
 
    uLoc_MvpMatrix[idx] = gl.getUniformLocation(gl.program, 'u_MvpMatrix');
    if (!uLoc_MvpMatrix[idx] ) {
        console.log('Failed to get the storage location of u_MvpMatrixv for ', name);
        return;
    }
    uLoc_NormalMatrix[idx] = gl.getUniformLocation(gl.program, 'u_NormalMatrix');
    if (!uLoc_NormalMatrix[idx] ) {
        console.log('Failed to get the storage location of u_NormalMatrix for ', name);
        return;
    }

    uLoc_eyePosWorld[idx]  = gl.getUniformLocation(gl.program, 'u_eyePosWorld');
    if (!uLoc_eyePosWorld[idx] ) {
        console.log('Failed to get the storage location of u_eyePosWorld for ', name);
        return;
    }

    //  ... for Phong light source:
	// NEW!  Note we're getting the location of a GLSL struct array member:
    lamp0.u_pos[idx]  = gl.getUniformLocation(gl.program, 'u_LampSet[0].pos');	
    lamp0.u_ambi[idx] = gl.getUniformLocation(gl.program, 'u_LampSet[0].ambi');
    lamp0.u_diff[idx] = gl.getUniformLocation(gl.program, 'u_LampSet[0].diff');
    lamp0.u_spec[idx] = gl.getUniformLocation(gl.program, 'u_LampSet[0].spec');
    if( !lamp0.u_pos[idx] || !lamp0.u_ambi[idx] || !lamp0.u_diff[idx] || !lamp0.u_spec[idx] ) {
        console.log('Failed to get GPUs Lamp0 storage locations for ', name);
        return;
    }
	// ... for Phong material/reflectance:
	matl0.uLoc_Ke[idx] = gl.getUniformLocation(gl.program, 'u_MatlSet[0].emit');
	matl0.uLoc_Ka[idx] = gl.getUniformLocation(gl.program, 'u_MatlSet[0].ambi');
	matl0.uLoc_Kd[idx] = gl.getUniformLocation(gl.program, 'u_MatlSet[0].diff');
	matl0.uLoc_Ks[idx] = gl.getUniformLocation(gl.program, 'u_MatlSet[0].spec');
	matl0.uLoc_Kshiny[idx] = gl.getUniformLocation(gl.program, 'u_MatlSet[0].shiny');
	if(!matl0.uLoc_Ke[idx] || !matl0.uLoc_Ka[idx] || !matl0.uLoc_Kd[idx] || !matl0.uLoc_Ks[idx] || !matl0.uLoc_Kshiny[idx] ) {
		console.log('Failed to get GPUs Reflectance storage locationsfor ', name);
		return;
	}
    
    eyePosWorld.set([eye_x, eye_y, eye_z]);
	gl.uniform3fv(uLoc_eyePosWorld[idx], eyePosWorld);// use it to set our uniform

    return shaderLoc;
}

function setLights() {

	// (Note: uniform4fv() expects 4-element float32Array as its 2nd argument)
    // Init World-coord. position & colors of first light source in global vars;
    lamp0.I_pos.elements.set([0, 0, 6]);
    lamp0.I_ambi.elements.set([0.4, 0.4, 0.4]);   // color rgb
    lamp0.I_diff.elements.set([0.4, 0.4, 0.4]);
    lamp0.I_spec.elements.set([0.8, 0.8, 0.8]);

    gl.uniform3fv(lamp0.u_pos[shaderIdx],  lamp0.I_pos.elements.slice(0,3));
    //		 ('slice(0,3) member func returns elements 0,1,2 (x,y,z) ) 
    gl.uniform3fv(lamp0.u_ambi[shaderIdx], lamp0.I_ambi.elements);		// ambient
    gl.uniform3fv(lamp0.u_diff[shaderIdx], lamp0.I_diff.elements);		// diffuse
    gl.uniform3fv(lamp0.u_spec[shaderIdx], lamp0.I_spec.elements);		// Specular
}

function setMatrials() {
    //---------------For the Material object(s):
	gl.uniform3fv(matl0.uLoc_Ke[shaderIdx], matl0.K_emit.slice(0,3));				// Ke emissive
	gl.uniform3fv(matl0.uLoc_Ka[shaderIdx], matl0.K_ambi.slice(0,3));				// Ka ambient
    gl.uniform3fv(matl0.uLoc_Kd[shaderIdx], matl0.K_diff.slice(0,3));				// Kd	diffuse
	gl.uniform3fv(matl0.uLoc_Ks[shaderIdx], matl0.K_spec.slice(0,3));				// Ks specular
	gl.uniform1i(matl0.uLoc_Kshiny[shaderIdx], parseInt(matl0.K_shiny, 10));     // Kshiny 
}

function setCamera() {
    gl.uniform3fv(uLoc_eyePosWorld[shaderIdx], [eye_x, eye_y, eye_z]);// use it to set our uniform
}

// change shader + init vertexbuffer
function switchShader(shadername, i) {
    shaderLoc = shadername;
    gl.useProgram(shaderLoc);
    gl.program = shaderLoc;	
    console.log("Switch shader successfully!");

    bindVertBuff(vert);
    console.log("Vertecies binded successfully!");

    shaderIdx = i;
}