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
'	float ori;\n' +			// Kori, original color portion

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
'uniform LampT u_LampSet[2];\n' +		// Array of all light sources.
'uniform mat4 u_modelMatrix;\n' +
'uniform mat4 u_NormalMatrix; \n' +  	// Inverse Transpose of ModelMatrix;
'uniform mat4 u_MvpMatrix; \n' +
'uniform vec3 u_eyePosWorld; \n' + 	    // Camera/eye location in world coords. Not changing, so, it's uniform

// varying - send to fragment shader
'varying vec4 v_Color;\n' +

    'void main() {\n' +
    '  gl_Position = (u_MvpMatrix + u_modelMatrix - u_modelMatrix + u_NormalMatrix - u_NormalMatrix) * a_Position;\n' +
    '  float x = u_eyePosWorld.x - u_eyePosWorld.x + a_Normal.x - a_Normal.x' + 
    '   + u_LampSet[0].pos.x - u_LampSet[0].pos.x + u_MatlSet[0].emit.x - u_MatlSet[0].emit.x + u_LampSet[1].pos.x - u_LampSet[1].pos.x;\n' +
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
    '	float ori;\n' +			// Kori, original color portion
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
    '	float ori;\n' +			// Kori, original color portion
    '};\n' +

    // uniforms:
    'uniform LampT u_LampSet[2];\n' +		// Array of all light sources.
	'uniform MatlT u_MatlSet[1];\n' +		// Array of all materials.
    'uniform vec3 u_eyePosWorld; \n' + 	    // Camera/eye location in world coords. Not changing, so, it's uniform
    'uniform int u_Matindex;\n' +  // materials index


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

    '   vec3 lightDirection1 = normalize(u_LampSet[1].pos - v_Position.xyz);\n' +

    '   vec3 eyeDirection = normalize(u_eyePosWorld - v_Position.xyz); \n' +
    '   float nDotL = max(dot(lightDirection, normal), 0.0); \n' +
    '   vec3 H = normalize(lightDirection + eyeDirection); \n' +
    '   float nDotH = max(dot(H, normal), 0.0); \n' +
    '   float e64 = pow(nDotH, float(u_MatlSet[0].shiny));\n' +

    '   float nDotL1 = max(dot(lightDirection1, normal), 0.0); \n' +
    '   vec3 H1 = normalize(lightDirection1 + eyeDirection); \n' +
    '   float nDotH1 = max(dot(H1, normal), 0.0); \n' +
    '   float e641 = pow(nDotH1, float(u_MatlSet[0].shiny));\n' +

    '   vec3 emissive = u_MatlSet[0].emit;' +
    '   vec3 ambient = u_LampSet[0].ambi * u_MatlSet[0].ambi + u_LampSet[1].ambi * u_MatlSet[0].ambi;\n' +
    '   vec3 diffuse = u_LampSet[0].diff * v_Kd * nDotL + u_LampSet[1].diff * v_Kd * nDotL1;\n' +
    '	vec3 speculr = u_LampSet[0].spec * u_MatlSet[0].spec * e64 + u_LampSet[1].spec * u_MatlSet[0].spec * e641;\n' +
    '   vec3 light = (emissive + ambient + diffuse + speculr);' +
    
    '   gl_FragColor = vec4(light.x  + (v_Color.x - light.x)* u_MatlSet[0].ori, light.y + (v_Color.y - light.y)* u_MatlSet[0].ori, light.z + (v_Color.z - light.z)* u_MatlSet[0].ori, 1.0);\n' + // 1.0
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
    '	float ori;\n' +			// Kori, original color portion
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
    'uniform LampT u_LampSet[2];\n' +		// Array of all light sources.
    'uniform vec3 u_eyePosWorld; \n' + 	    // Camera/eye location in world coords. Not changing, so, it's uniform

    // varying - send to fragment shader
    'varying vec4 v_Color;\n' +

    'void main() {\n' +
    '   gl_Position = u_MvpMatrix * a_Position;\n' +      // shoud be " '  gl_Position = u_MvpMatrix * a_Position;\n' +"
                                                            // real position on canvas (CVV)
    '   vec3 normal = normalize(vec3(u_NormalMatrix * a_Normal));\n' +
    '   vec4 v_Position_none = u_modelMatrix * a_Position; \n' +      // position in world sys (z axis up)
    '   vec3 lightDirection = normalize(u_LampSet[0].pos - v_Position_none.xyz);\n' +

    '   vec3 lightDirection1 = normalize(u_LampSet[1].pos - v_Position_none.xyz);\n' +

    '   vec3 eyeDirection = normalize(u_eyePosWorld - v_Position_none.xyz); \n' +
    '   float nDotL = max(dot(lightDirection, normal), 0.0); \n' +
    '   vec3 H = normalize(lightDirection + eyeDirection); \n' +
    '   float nDotH = max(dot(H, normal), 0.0); \n' +
    '   float e64 = pow(nDotH, float(u_MatlSet[0].shiny));\n' +

    '   float nDotL1 = max(dot(lightDirection1, normal), 0.0); \n' +
    '   vec3 H1 = normalize(lightDirection1 + eyeDirection); \n' +
    '   float nDotH1 = max(dot(H1, normal), 0.0); \n' +
    '   float e641 = pow(nDotH1, float(u_MatlSet[0].shiny));\n' +

    '   vec3 emissive = u_MatlSet[0].emit;' +
    '   vec3 ambient = u_LampSet[0].ambi * u_MatlSet[0].ambi + u_LampSet[1].ambi * u_MatlSet[0].ambi;\n' +
    '   vec3 diffuse = u_LampSet[0].diff * u_MatlSet[0].diff * nDotL + u_LampSet[1].diff * u_MatlSet[0].diff * nDotL;\n' +
    '	vec3 speculr = u_LampSet[0].spec * u_MatlSet[0].spec * e64 + u_LampSet[1].spec * u_MatlSet[0].spec * e641;\n' +
    //'   v_Color = vec4((emissive + ambient + diffuse + speculr) * (1-u_MatlSet[0].ori) + u_MatlSet[0].ori *  a_Color, 1.0);\n' + // 1.0
    '   vec3 light = (emissive + ambient + diffuse + speculr);' +
    
    '   v_Color = vec4(light.x  + (a_Color.x - light.x)* u_MatlSet[0].ori, light.y + (a_Color.y - light.y)* u_MatlSet[0].ori, light.z + (a_Color.z - light.z)* u_MatlSet[0].ori, 1.0);\n' + // 1.0
    
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
    '	float ori;\n' +			// Kori, original color portion
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
    '	float ori;\n' +			// Kori, original color portion
    '};\n' +
    // uniforms:
    'uniform LampT u_LampSet[2];\n' +		// Array of all light sources.
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

    '   vec3 lightDirection1 = normalize(u_LampSet[1].pos - v_Position.xyz);\n' +
    '   vec3 R1 = normalize(reflect(-lightDirection1, normal))	 ;\n'+
    
    '   vec3 eyeDirection = normalize(u_eyePosWorld - v_Position.xyz); \n' +
    '   float nDotL = max(dot(lightDirection, normal), 0.0); \n' +
    '   float VDotR = max(dot(R, eyeDirection), 0.0); \n' +
    '   float e64 = pow(VDotR, float(u_MatlSet[0].shiny));\n' +

    '   float nDotL1 = max(dot(lightDirection1, normal), 0.0); \n' +
    '   float VDotR1 = max(dot(R1, eyeDirection), 0.0); \n' +
    '   float e641 = pow(VDotR1, float(u_MatlSet[0].shiny));\n' +

    '   vec3 emissive = u_MatlSet[0].emit;' +
    '   vec3 ambient = u_LampSet[0].ambi * u_MatlSet[0].ambi + u_LampSet[1].ambi * u_MatlSet[0].ambi;\n' +
    '   vec3 diffuse = u_LampSet[0].diff * v_Kd * nDotL + u_LampSet[1].diff * v_Kd * nDotL1;\n' +
    '	vec3 speculr = u_LampSet[0].spec * u_MatlSet[0].spec * e64 + u_LampSet[1].spec * u_MatlSet[0].spec * e641;\n' +
    '   vec3 light = (emissive + ambient + diffuse + speculr);' +
    '   gl_FragColor = vec4(light.x  + (v_Color.x - light.x)* u_MatlSet[0].ori, light.y + (v_Color.y - light.y)* u_MatlSet[0].ori, light.z + (v_Color.z - light.z)* u_MatlSet[0].ori, 1.0);\n' + // 1.0
    //'   gl_FragColor = vec4((emissive + ambient + diffuse + speculr , v_Color) * (1-u_MatlSet[0].ori) + u_MatlSet[0].ori *  v_Color, 1.0);\n' + // 1.0
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
    '	float ori;\n' +			// Kori, original color portion
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
    'uniform LampT u_LampSet[2];\n' +		// Array of all light sources.
    'uniform vec3 u_eyePosWorld; \n' + 	    // Camera/eye location in world coords. Not changing, so, it's uniform

    // varying - send to fragment shader
    'varying vec4 v_Color;\n' +

    'void main() {\n' +
    '   gl_Position = u_MvpMatrix * a_Position;\n' +      // shoud be " '  gl_Position = u_MvpMatrix * a_Position;\n' +"
    '   vec3 normal = normalize(vec3(u_NormalMatrix * a_Normal));\n' +
    '   vec4 v_Position_none = u_modelMatrix * a_Position; \n' +      // position in world sys (z axis up)                                         
    '   vec3 lightDirection = normalize(u_LampSet[0].pos - v_Position_none.xyz);\n' +

    '   vec3 lightDirection1 = normalize(u_LampSet[1].pos - v_Position_none.xyz);\n' +

    '   vec3 eyeDirection = normalize(u_eyePosWorld - v_Position_none.xyz); \n' +
    '   float nDotL = max(dot(lightDirection, normal), 0.0); \n' +
    '   vec3 R = normalize(reflect(-lightDirection, normal))	 ;\n'+
    '   float VDotR = max(dot(R, eyeDirection), 0.0); \n' +
    '   float e64 = pow(VDotR, float(u_MatlSet[0].shiny));\n' +

    '   float nDotL1 = max(dot(lightDirection1, normal), 0.0); \n' +
    '   vec3 R1 = normalize(reflect(-lightDirection1, normal))	 ;\n'+
    '   float VDotR1 = max(dot(R1, eyeDirection), 0.0); \n' +
    '   float e641 = pow(VDotR1, float(u_MatlSet[0].shiny));\n' +

    '   vec3 emissive = u_MatlSet[0].emit;' +
    '   vec3 ambient = u_LampSet[0].ambi * u_MatlSet[0].ambi + u_LampSet[1].ambi * u_MatlSet[0].ambi;\n' +
    '   vec3 diffuse = u_LampSet[0].diff * u_MatlSet[0].diff * nDotL + u_LampSet[1].diff * u_MatlSet[0].diff * nDotL1;\n' +
    '	vec3 speculr = u_LampSet[0].spec * u_MatlSet[0].spec * e64 + u_LampSet[1].spec * u_MatlSet[0].spec * e641;\n' +
    //'   v_Color = vec4((emissive + ambient + diffuse + speculr , a_Color) * (1-u_MatlSet[0].ori) + u_MatlSet[0].ori *  a_Color, 1.0);\n' + // 1.0
    '   vec3 light = (emissive + ambient + diffuse + speculr);' +
    '   v_Color = vec4(light.x  + (a_Color.x - light.x)* u_MatlSet[0].ori, light.y + (a_Color.y - light.y)* u_MatlSet[0].ori, light.z + (a_Color.z - light.z)* u_MatlSet[0].ori, 1.0);\n' + // 1.0
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
var lamp1 = new LightsT();


// pos, ambi, diff, spect
var lamp0pos = new Array( 0, 0, 6);
var lamp0ambi = new Array(0.4, 0.4,0.4);
var lamp0diff = new Array(0.4, 0.4,0.4);
var lamp0spec = new Array(0.8, 0.8,0.8);
var lamp0L = document.getElementById('directL');
var lamp0A = document.getElementById('directA');
var lamp0D = document.getElementById('directD');
var lamp0S = document.getElementById('directS');



var lamp1pos = new Array( 0, -3, 6);
var lamp1ambi = new Array(0.4, 0.4,0.4);
var lamp1diff = new Array(0.4, 0.4,0.4);
var lamp1spec = new Array(0.8, 0.8,0.8);

var lamp1L = document.getElementById('pointL');
var lamp1A = document.getElementById('pointA');
var lamp1D = document.getElementById('pointD');
var lamp1S = document.getElementById('pointS');

var resetl0 = false; resetl1 = false;

	// ... for our first material:

var matlSel= [MATL_ORIGIN, MATL_SILVER_SHINY, MATL_TURQUOISE, MATL_JADE, MATL_RED_PLASTIC];				// see keypress(): 'm' key changes matlSel
var matidx = 1;
var matl0 = new Material(matlSel[matidx]);	
var matSphere, matLoop, matBone, matCloud, matDog;

var shaderLoc = [5];
var vert;
var shaderIdx = 3;
// shader switching
var cartoonish = false;
var shadeM = document.getElementById('shadeM');
var LightM = document.getElementById('LightM');

var PhongShader = true;
var BlinnLighting = true;



// quaternion
var qNew = new Quaternion(0,0,0,1); // most-recent mouse drag's rotation
var qTot = new Quaternion(0,0,0,1);	// 'current' orientation (made from qNew)
var quatMatrix = new Matrix4();				// rotation matrix, made from latest qTot

var g_vertCount;


// For animation:---------------------
var g_isRun = true;     
var g_lastMS = Date.now();    			// Timestamp for most-recently-drawn image; 
// in milliseconds; used by 'animate()' fcn 
// (now called 'timerAll()' ) to find time
// elapsed since last on-screen image.
// used for turning whole scene.
var g_angle01 = 0;                  // initial rotation angle
//------------For mouse click-and-drag: -------------------------------
var g_isDrag = false;		// mouse-drag: true when user holds down mouse button
var g_xMclik = 0.0;			// last mouse button-down position (in CVV coords)
var g_yMclik = 0.0;
var g_xMdragTot = 0.0;	// total (accumulated) mouse-drag amounts (in CVV coords).
var g_yMdragTot = 0.0;
var g_digits = 5;			// DIAGNOSTICS: # of digits to print in console.log (

var cloud_x = 0, cloud_y = 0, cloud_z = 0; 
var a_x = 0, a_y = 0, a_z = 0;
var target_x, target_y, target_z;
var bf_target_x, bf_target_y;

var g_xKmove = 0.0;	// total (accumulated) keyboard-drag amounts (in CVV coords).
var g_yKmove = 0.0;

// flags of movement
var SW = 0;                     // flag of switching dog to sit or walk
var Run = false;                // flag of switchinf dog to walk or run
var boneExist = false;          // flag of whether bone is showing
var cloudView = false;
var keyPressed;                 // 

// ============================
// self-rotating varialbles:
// ============================
// left front leg                                //---------------
var g_angle0now = 0.0;       // init Current rotation angle, in degrees
var g_angle0rate = 0.0;       // init Rotation angle rate, in degrees/second.
var g_angle0min = 0.0;       // init min, max allowed angle, in degrees.
var g_angle0max = 0.0;
// right front leg                                //---------------
var g_angle1now = 0.0; 			// init Current rotation angle, in degrees > 0
var g_angle1rate = 0.0;				// init Rotation angle rate, in degrees/second.
var g_angle1min = 0.0;       // init min, max allowed angle, in degrees
var g_angle1max = 0.0;
// left back leg                                 //---------------
var g_angle2now = -60; 			// init Current rotation angle, in degrees.
var g_angle2rate = 0.0;				// init Rotation angle rate, in degrees/second.
var g_angle2min = 0.0;       // init min, max allowed angle, in degrees
var g_angle2max = 0.0;
// right back leg
var g_angle3now = -60; 			// init Current rotation angle, in degrees.
var g_angle3rate = 0.0;				// init Rotation angle rate, in degrees/second.
var g_angle3min = 0.0;       // init min, max allowed angle, in degrees
var g_angle3max = 0.0;

// loop                                 //---------------
var g_angle4now = 0.0;       // init Current rotation angle, in degrees
var g_angle4rate = 0.0;       // init Rotation angle rate, in degrees/second.
var g_angle4min = -360.0;       // init min, max allowed angle, in degrees.
var g_angle4max = 360.0;
// YOU can add more time-varying params of your own here -- try it!
// For example, could you add angle3, have it run without limits, and
// use sin(angle3) to slowly translate the robot-arm base horizontally,
// moving back-and-forth smoothly and sinusoidally?

// calves:
// left front calf
var g_angle5now = 0.0; 			// init Current rotation angle, in degrees.
var g_angle5rate = 0.0;				// init Rotation angle rate, in degrees/second.
var g_angle5min = 0.0;       // init min, max allowed angle, in degrees
var g_angle5max = 0.0;
// right front calf
var g_angle6now = 0.0; 			// init Current rotation angle, in degrees.
var g_angle6rate = 0.0;				// init Rotation angle rate, in degrees/second.
var g_angle6min = 0.0;       // init min, max allowed angle, in degrees
var g_angle6max = 0.0;
// left back calf
var g_angle7now = -10; 			// init Current rotation angle, in degrees.
var g_angle7rate = 0.0;				// init Rotation angle rate, in degrees/second.
var g_angle7min = 0.0;       // init min, max allowed angle, in degrees
var g_angle7max = 0.0;
// right back calf
var g_angle8now = -10; 			// init Current rotation angle, in degrees.
var g_angle8rate = 0.0;				// init Rotation angle rate, in degrees/second.
var g_angle8min = 0.0;       // init min, max allowed angle, in degrees
var g_angle8max = 0.0;

// front paws
var g_angle9now = 0; 			// init Current rotation angle, in degrees.
var g_angle9rate = 0.0;				// init Rotation angle rate, in degrees/second.
var g_angle9min = 0.0;       // init min, max allowed angle, in degrees
var g_angle9max = 0.0;
// back paws
var g_angle10now = 30; 			// init Current rotation angle, in degrees.
var g_angle10rate = 0.0;				// init Rotation angle rate, in degrees/second.
var g_angle10min = 0.0;       // init min, max allowed angle, in degrees
var g_angle10max = 0.0;

// cloud
var g_angle11now = 0; 			// init Current rotation angle, in degrees.
var g_angle11rate = 10;				// init Rotation angle rate, in degrees/second.
var g_angle11min = -40;       // init min, max allowed angle, in degrees
var g_angle11max = 40;

// sphere
var g_angle12now = 0; 			// init Current rotation angle, in degrees.
var g_angle12rate = 20;				// init Rotation angle rate, in degrees/second.
var g_angle12min = -180;       // init min, max allowed angle, in degrees
var g_angle12max = 180;


// body position --> for reseting sit/walk dog's gesture
var g_anglebody = -50; 			// init Current rotation angle, in degrees.
var g_transheadx = 0.15;
var g_transheady = 0.25;
var g_frontlegs = 0.1;
var g_tail = -0.2;

// rigid objects' starting position and length.
var loop_S, loop_C, grid_S, grid_C;
var cube_S, cube_C, axis_S, axis_C;
var head_S, head_C, body_S, body_C;
var fthigh_S, fthigh_C, bthigh_S, bthigh_C;
var fcalf_S, fcalf_C, bcalf_S, bcalf_C;
var paw_S, paw_C, tail_S, tail_C;
var cloud_C, cloud_S, sphere_C, sphere_S;

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
    // set sitting parameters (global variables)
    sit();
    
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
    
    // ===================================================================== */
    //Initialize shaders
    myInitShaders(VSHADER_SOURCE0, FSHADER_SOURCE0, "BASIC", 0);
    myInitShaders(VSHADER_SOURCE1, FSHADER_SOURCE1, "PHONG + BLINN-PHONG", 1);
    myInitShaders(VSHADER_SOURCE2, FSHADER_SOURCE2, "GOURAUD + BLINN-PHONG", 2);
    myInitShaders(VSHADER_SOURCE3, FSHADER_SOURCE3, "PHONG + PHONG", 3);
    myInitShaders(VSHADER_SOURCE4, FSHADER_SOURCE4, "GOURAUD + PHONG", 4);

    switchShader();

    setMatrials();

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
    //drawResize();
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
    // thighs
    [g_angle0now, g_angle0rate] = rotateNow(g_angle0now, g_angle0rate, 1, elapsedMS, g_angle0min, g_angle0max);
    [g_angle1now, g_angle1rate] = rotateNow(g_angle1now, g_angle1rate, 1, elapsedMS, g_angle1min, g_angle1max);
    [g_angle2now, g_angle2rate] = rotateNow(g_angle2now, g_angle2rate, 1, elapsedMS, g_angle2min, g_angle2max);
    [g_angle3now, g_angle3rate] = rotateNow(g_angle3now, g_angle3rate, 1, elapsedMS, g_angle3min, g_angle3max);
    // loop
    g_angle4now += g_angle4rate * elapsedMS * 0.001;
    // calves
    [g_angle5now, g_angle5rate] = rotateNow(g_angle5now, g_angle5rate, 1, elapsedMS, g_angle5min, g_angle5max);
    [g_angle6now, g_angle6rate] = rotateNow(g_angle6now, g_angle6rate, 1, elapsedMS, g_angle6min, g_angle6max);
    [g_angle7now, g_angle7rate] = rotateNow(g_angle7now, g_angle7rate, 1, elapsedMS, g_angle7min, g_angle7max);
    [g_angle8now, g_angle8rate] = rotateNow(g_angle8now, g_angle8rate, 1, elapsedMS, g_angle8min, g_angle8max);
    // paws
    [g_angle9now, g_angle9rate] = rotateNow(g_angle9now, g_angle9rate, 1, elapsedMS, g_angle9min, g_angle9max);
    [g_angle10now, g_angle10rate] = rotateNow(g_angle10now, g_angle10rate, 1, elapsedMS, g_angle10min, g_angle10max);
    [g_angle11now, g_angle11rate] = rotateNow(g_angle11now, g_angle11rate, 1, elapsedMS, g_angle11min, g_angle11max);
    [g_angle12now, g_angle12rate] = rotateNow(g_angle12now, g_angle12rate, 1, elapsedMS, g_angle12min, g_angle12max);
}
}


// vertices & draw function
{
function initVertexBuffers() {
    // vertices information
    var v_ans = loopV();
    loop_S = 0;
    loop_C = v_ans.length / 10;

    var curr_v = cubeV();
    v_ans = Array.prototype.concat.call(
        v_ans, curr_v,
    );
    cube_S = loop_C;
    cube_C = curr_v.length / 10;
    curr_v.clear;

    curr_v = bodyV();
    body_S = v_ans.length/10;
    body_C = curr_v.length/10;
    v_ans = Array.prototype.concat.call(
        v_ans, curr_v,
    );
    curr_v.clear;

    curr_v = headV();
    head_S = v_ans.length / 10;
    head_C = curr_v.length / 10;
    v_ans = Array.prototype.concat.call(
        v_ans, curr_v,
    );
    curr_v.clear;

    curr_v = fthighV();
    fthigh_S = v_ans.length / 10;
    fthigh_C = curr_v.length / 10;
    v_ans = Array.prototype.concat.call(
        v_ans, curr_v,
    );
    curr_v.clear;

    curr_v = bthighV();
    bthigh_S = v_ans.length / 10;
    bthigh_C = curr_v.length / 10;
    v_ans = Array.prototype.concat.call(
        v_ans, curr_v,
    );
    curr_v.clear;

    curr_v = fcalfV();
    fcalf_S = v_ans.length / 10;
    fcalf_C = curr_v.length / 10;
    v_ans = Array.prototype.concat.call(
        v_ans, curr_v,
    );
    curr_v.clear;

    curr_v = bcalfV();
    bcalf_S = v_ans.length / 10;
    bcalf_C = curr_v.length / 10;
    v_ans = Array.prototype.concat.call(
        v_ans, curr_v,
    );
    curr_v.clear;
    
    curr_v = pawV();
    paw_S = v_ans.length / 10;
    paw_C = curr_v.length / 10;
    v_ans = Array.prototype.concat.call(
        v_ans, curr_v,
    );
    curr_v.clear;

    curr_v = tailV();
    tail_S = v_ans.length / 10;
    tail_C = curr_v.length / 10;
    v_ans = Array.prototype.concat.call(
        v_ans, curr_v,
    );
    curr_v.clear;

    curr_v = cloudV();
    cloud_S = v_ans.length / 10;
    cloud_C = curr_v.length / 10;
    v_ans = Array.prototype.concat.call(
        v_ans, curr_v,
    );
    curr_v.clear;

    curr_v = groundgridV();
    grid_S = v_ans.length / 10;
    grid_C = curr_v.length / 10;
    v_ans = Array.prototype.concat.call(
        v_ans, curr_v,
    );
    curr_v.clear;

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


    function sphereV() {
        var ans_ver;
        var d1 = 0, d2 = 0; // d1-degree to y, d2-degree to x
        var step = 24;
        var offset = Math.PI * 2 / step;
        while(d1 <= Math.PI)
        {
            
            while(d2 <= Math.PI * 2)
            {
                //console.log(d1, d2);
                var p1 = [Math.sin(d1)*Math.cos(d2), Math.cos(d1), Math.sin(d1)*Math.sin(d2), 1.0, 255/255, 255/255, 255/255,];
                var p2 = [Math.sin(d1+offset)*Math.cos(d2), Math.cos(d1+offset), Math.sin(d1+offset)*Math.sin(d2), 1.0,  134/255, 67/255, 222/255,];
                var p3 = [Math.sin(d1+offset)*Math.cos(d2+offset), Math.cos(d1+offset), Math.sin(d1+offset)*Math.sin(d2+offset), 1.0, 255/255, 255/255, 255/255,];
                var p4 = [Math.sin(d1)*Math.cos(d2+offset), Math.cos(d1), Math.sin(d1)*Math.sin(d2+offset), 1.0,  255/255, 255/255, 255/255,];
                
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
        matidx = matSphere;
        setMatrials();

        pushMatrix(g_modelMatrix);
        {
            pushMatrix(mvpMatrix);
            {
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
            }
        g_modelMatrix = popMatrix();
        }

        return 0;
    }

    // loop's vertices
    function loopV() {
        var ans_ver;
        var i = 0;
        var step = 12;
        var dim = 0.9;
        while (i < 360) {
            var p1 = [Math.cos((i + step) * 0.0175), Math.sin((i + step) * 0.0175), 0.2, 1.0, 1.0, 0.7, 1.0,];
            var p2 = [Math.cos(i * 0.0175), Math.sin(i * 0.0175), 0.2, 1.0, 0.7, 0.2, 0.7,];
            var p3 = [dim * Math.cos((i + step) * 0.0175), dim * Math.sin((i + step) * 0.0175), 0.2, 1.0, 0.8, 0.3, 0.8,];
            var p4 = [dim * Math.cos(i * 0.0175), dim * Math.sin(i * 0.0175), 0.2, 1.0, 0.6, 0.4, 1.0,];

            var p1_b = [Math.cos((i + step) * 0.0175), Math.sin((i + step) * 0.0175), -0.2, 1.0, 0.0, 1.0, 1.0,];
            var p2_b = [Math.cos(i * 0.0175), Math.sin(i * 0.0175), -0.2, 1.0, 1.0, 1.0, 1.0,];
            var p3_b = [dim * Math.cos((i + step) * 0.0175), dim * Math.sin((i + step) * 0.0175), -0.2, 1.0, 1.0, 0.0, 1.0,];
            var p4_b = [dim * Math.cos(i * 0.0175), dim * Math.sin(i * 0.0175), -0.2, 1.0, 0.0, 1.0, 1.0,];

            var n1 = [0,0,1];
            var n2 = [0,0,-1]; 
            var np1 = [p1[0], p1[1], p1[2],];
            var np2 = [p2[0], p2[1], p2[2],];
            var np3 = [-p1[0], -p1[1], -p1[2],];
            var np4 = [-p2[0], -p2[1], -p2[2],];

            var curr_ver = Array.prototype.concat.call(

                p1, n1, p3, n1, p2, n1,
                p3, n1, p4, n1, p2, n1,

                p1, np1, p2, np2, p2_b, np2,
                p1, np1, p2_b, np2, p1_b, np1,

                p1_b, n2, p2_b, n2, p4_b, n2,
                p3_b, n2, p2_b, n2, p4_b, n2,

                p3, np3, p3_b, np3, p4_b, np4,
                p3, np3, p4_b, np4, p4, np4,

                // p1, p1_b, p3_b,
                // p1, p3_b, p3,

                // p4, p4_b, p2_b,
                // p4, p2_b, p2,
            );

            if (ans_ver == null) {
                ans_ver = curr_ver;
            }
            else {
                ans_ver = Array.prototype.concat.call(ans_ver, curr_ver);
            }
            i = i + step;
        }
        return ans_ver;
    }

    function drawLoop() {
        matidx = matLoop;
        setMatrials();

        pushMatrix(g_modelMatrix);
        {
            pushMatrix(mvpMatrix);
            {
            mvpMatrix.multiply(g_modelMatrix);
            normalMatrix.setInverseOf(g_modelMatrix);
            normalMatrix.transpose();
            gl.uniformMatrix4fv(uLoc_MvpMatrix[shaderIdx], false, mvpMatrix.elements);
            gl.uniformMatrix4fv(uLoc_NormalMatrix[shaderIdx], false, normalMatrix.elements);

            gl.uniformMatrix4fv(uLoc_modelMatrix[shaderIdx], false, g_modelMatrix.elements);
            gl.drawArrays(gl.TRIANGLES, loop_S, loop_C);	// draw all vertices.
            
            mvpMatrix = popMatrix();
            }

        g_modelMatrix = popMatrix();
        }
        return 0;
    }

    function cubeV() {

        var v1 = [0.0, 0.0, 0.5, 1.0, 1.0, 1.0, 1.0,];
        var v2 = [0.0, -0.5, 0.5, 1.0, 0.0, 0.0, 0.0,];
        var v3 = [0.5, -0.5, 0.5, 1.0, 1.0, 1.0, 1.0,];
        var v4 = [0.5, 0.0, 0.5, 1.0, 1.0, 1.0, 1.0,];
        var v5 = [0.5, -0.5, 0.0, 1.0, 1.0, 1.0, 1.0,];
        var v6 = [0.5, 0.0, 0.0, 1.0, 1.0, 1.0, 1.0,];
        var v7 = [0.0, 0.0, 0.0, 1.0, 1.0, 1.0, 1.0,];
        var v8 = [0.0, -0.5, 0.0, 1.0, 0.0, 0.0, 0.0,];

        var n1 = [-1, 0, 0,];
        var n2 = [1, 0, 0,];
        var n3 = [0, 0, 1];
        var n4 = [0, 0, -1];
        var n5 = [0, 1, 0];
        var n6 = [0, -1, 0];

        var vertices = Array.prototype.concat.call(
            v1, n1, v2, n1, v8, n1,
            v1, n1, v8, n1, v7, n1,

            v1, n3, v2, n3, v3, n3,
            v1, n3, v3, n3, v4, n3,

            v3, n2, v4, n2, v5, n2,
            v4, n2, v5, n2, v6, n2,

            v7, n4, v5, n4, v8, n4,
            v7, n4, v6, n4, v5, n4,

            v7, n5, v1, n5, v4, n5,
            v7, n5, v4, n5, v6, n5,

            v2, n6, v8, n6, v3, n6,
            v8, n6, v5, n6, v3, n6,
        );
        
        return vertices;
    }

    function drawBone() {

        matidx = matBone;
        setMatrials();

        pushMatrix(g_modelMatrix);
        {
            drawAxis();
            g_modelMatrix.translate(-0.05, 0.15, 0.0);

            pushMatrix(g_modelMatrix);
            {

                pushMatrix(mvpMatrix);
                {
                g_modelMatrix.scale(0.1, 0.1, 0.1);				// Make new drawing axes that

                mvpMatrix.multiply(g_modelMatrix);
                normalMatrix.setInverseOf(g_modelMatrix);
                normalMatrix.transpose();
                gl.uniformMatrix4fv(uLoc_MvpMatrix[shaderIdx], false, mvpMatrix.elements);
                gl.uniformMatrix4fv(uLoc_NormalMatrix[shaderIdx], false, normalMatrix.elements);

                gl.uniformMatrix4fv(uLoc_modelMatrix[shaderIdx], false, g_modelMatrix.elements);
                gl.drawArrays(gl.TRIANGLES, cube_S, cube_C);	// draw all vertices.

                mvpMatrix = popMatrix();
                }

                pushMatrix(mvpMatrix);
                {
                g_modelMatrix.translate(0.8, 0.0, 0.0);
                
                mvpMatrix.multiply(g_modelMatrix);
                normalMatrix.setInverseOf(g_modelMatrix);
                normalMatrix.transpose();
                gl.uniformMatrix4fv(uLoc_MvpMatrix[shaderIdx], false, mvpMatrix.elements);
                gl.uniformMatrix4fv(uLoc_NormalMatrix[shaderIdx], false, normalMatrix.elements);

                gl.uniformMatrix4fv(uLoc_modelMatrix[shaderIdx], false, g_modelMatrix.elements);

                gl.drawArrays(gl.TRIANGLES, cube_S, cube_C);	// draw all vertices.

                mvpMatrix = popMatrix();
                }

                pushMatrix(mvpMatrix);
                {
                g_modelMatrix.translate(0.0, -2, 0.0);
                
                mvpMatrix.multiply(g_modelMatrix);
                normalMatrix.setInverseOf(g_modelMatrix);
                normalMatrix.transpose();
                gl.uniformMatrix4fv(uLoc_MvpMatrix[shaderIdx], false, mvpMatrix.elements);
                gl.uniformMatrix4fv(uLoc_NormalMatrix[shaderIdx], false, normalMatrix.elements);

                gl.uniformMatrix4fv(uLoc_modelMatrix[shaderIdx], false, g_modelMatrix.elements);

                gl.drawArrays(gl.TRIANGLES, cube_S, cube_C);	// draw all vertices.

                mvpMatrix = popMatrix();
                }

                pushMatrix(mvpMatrix);
                {
                g_modelMatrix.translate(-0.8, 0.0, 0.0);
                
                mvpMatrix.multiply(g_modelMatrix);
                normalMatrix.setInverseOf(g_modelMatrix);
                normalMatrix.transpose();
                gl.uniformMatrix4fv(uLoc_MvpMatrix[shaderIdx], false, mvpMatrix.elements);
                gl.uniformMatrix4fv(uLoc_NormalMatrix[shaderIdx], false, normalMatrix.elements);

                gl.uniformMatrix4fv(uLoc_modelMatrix[shaderIdx], false, g_modelMatrix.elements);

                gl.drawArrays(gl.TRIANGLES, cube_S, cube_C);	// draw all vertices.
                
                mvpMatrix = popMatrix();
                }

            g_modelMatrix = popMatrix();
            }

            g_modelMatrix.translate(0.05, -0.03, 0.0);
            g_modelMatrix.scale(0.07, 0.38, 0.08);				// Make new drawing axes that
            

            pushMatrix(mvpMatrix);
            {
                mvpMatrix.multiply(g_modelMatrix);
                normalMatrix.setInverseOf(g_modelMatrix);
                normalMatrix.transpose();
                gl.uniformMatrix4fv(uLoc_MvpMatrix[shaderIdx], false, mvpMatrix.elements);
                gl.uniformMatrix4fv(uLoc_NormalMatrix[shaderIdx], false, normalMatrix.elements);

                gl.uniformMatrix4fv(uLoc_modelMatrix[shaderIdx], false, g_modelMatrix.elements);

                gl.drawArrays(gl.TRIANGLES, cube_S, cube_C);	// draw all vertices.

            mvpMatrix = popMatrix();
            }

        g_modelMatrix = popMatrix();
        }
    }

    // dog's part
    {
        function bodyV () {
            // vertices information
            var v1 = [-0.3, 0.15, 0.05, 1.0, 183/255, 99/255, 24/255,];
            var v2 = [-0.3, 0.0, 0.05, 1.0, 255/255, 239/255, 192/255,];
            var v3 = [-0.2, 0.1, 0.1, 1.0, 183/255, 99/255, 24/255,];
            var v4 = [-0.2, -0.1, 0.1, 1.0, 255/255, 239/255, 192/255,];
            var v5 = [0.3, 0.1, 0.1, 1.0,  183/255, 99/255, 24/255,];
            var v6 = [0.3, -0.1, 0.1, 1.0, 255/255, 239/255, 192/255,];
            var v7 = [0.3, 0.1, -0.1, 1.0, 183/255, 99/255, 24/255,];
            var v8 = [0.3, -0.1, -0.1, 1.0, 255/255, 239/255, 192/255,];
            var v9 = [-0.2, 0.1, -0.1, 1.0, 183/255, 99/255, 24/255,];
            var v10 = [-0.2, -0.1, -0.1, 1.0, 255/255, 239/255, 192/255,];
            var v11 = [-0.3, 0.15, -0.05, 1.0, 183/255, 99/255, 24/255,];
            var v12 = [-0.3, 0.0, -0.05, 1.0, 255/255, 239/255, 192/255,];

            var n1 = normByP(v1, v2, v4);
            var n2 = normByP(v3, v4, v6);
            var n3 = normByP(v5, v6, v8);
            var n4 = normByP(v7, v8, v9);
            var n5 = normByP(v9, v10, v11);
            var n6 = normByP(v11, v12, v1);
            var n7 = normByP(v11, v1, v3);
            var n8 = normByP(v9, v3, v5);
            var n9 = normByP(v12, v2, v4);
            var n10 = normByP(v10, v4, v6);
            


            var vertices = Array.prototype.concat.call(
                // 1
                v1, n1, v2, n1, v4, n1,
                v3, n1, v1, n1, v4, n1,
                //2
                v3, n2, v4, n2, v6, n2,
                v5, n2, v3, n2, v6, n2,
                //3
                v5, n3, v6, n3, v8, n3,
                v5, n3, v8, n3, v7, n3,
                //4
                v7, n4, v8, n4, v9, n4,
                v9, n4, v8, n4, v10, n4,
                //5
                v9, n5, v10, n5, v11, n5,
                v11, n5, v10, n5, v12, n5,
                //6
                v11, n6, v12, n6, v1, n6,
                v1, n6, v12, n6, v2, n6,
                //7
                v11, n7, v1, n7, v3, n7,
                v11, n7, v3, n7, v9, n7,
                //8 
                v9, n8, v3, n8, v5, n8,
                v9, n8, v5, n8, v7, n8,
                //9
                v12, n9, v2, n9, v4, n9,
                v12, n9, v4, n9, v10, n9,
                //10
                v10, n10, v4, n10, v6, n10,
                v10, n10, v6, n10, v8, n10,
            );
            return vertices;
        }

        function headV () {
            // vertices information
            var v1 = [-0.6, 0.05, 0.05, 1.0, 141/255, 62/255, 23/255,];
            var v2 = [-0.6, 0.05, -0.05, 1.0, 141/255, 62/255, 23/255,];
            var v3 = [-0.6, -0.03, 0.05, 1.0,  141/255, 62/255, 23/255,];
            var v4 = [-0.6, -0.03, -0.05, 1.0, 141/255, 62/255, 23/255,];

            var v5 = [-0.5, 0.05, 0.05, 1.0, 255/255, 245/255, 200/255,];
            var v6 = [-0.5, 0.05, -0.05, 1.0, 255/255, 245/255, 200/255,];

            var v7 = [-0.45, 0.2, 0.15, 1.0, 255/255, 239/255, 192/255,];
            var v8 = [-0.45, -0.05, 0.15, 1.0, 255/255, 239/255, 192/255,];
            var v9 = [-0.3, -0.05, 0.15, 1.0, 183/255, 99/255, 24/255,];
            var v10 = [-0.3, 0.2, 0.15, 1.0, 183/255, 99/255, 24/255,];

            var v11 = [-0.3, -0.05, -0.15, 1.0,  122/255, 73/255, 9/255,];
            var v12 = [-0.3, 0.2, -0.15, 1.0, 122/255, 73/255, 9/255,];
            var v13 = [-0.45, 0.2, -0.15, 1.0, 255/255, 239/255, 192/255,];
            var v14 = [-0.45, -0.05, -0.15, 1.0, 255/255, 239/255, 192/255,];

            var v15 = [-0.4, 0.3, 0.1, 1.0, 209/255, 135/255, 24/255,];
            var v16 = [-0.4, 0.3, -0.1, 1.0, 209/255, 135/255, 24/255,];

            var v17 = [-0.4, 0.2, 0.05, 1.0, 124/255, 75/255, 12/255,];
            var v18 = [-0.4, 0.2, -0.05, 1.0, 124/255, 75/255, 12/255,];

            var vertices = Array.prototype.concat.call(
                //face
                v1, normCalc(v1, v3, v5), v3, normCalc(v1, v3, v5), v5, normCalc(v1, v3, v5),
                v5, normCalc(v5, v3, v8), v3, normCalc(v5, v3, v8), v8, normCalc(v5, v3, v8),
                v7, normCalc(v7, v5, v8), v5, normCalc(v7, v5, v8), v8, normCalc(v7, v5, v8),
                v5, normCalc(v5, v7, v6), v7, normCalc(v5, v7, v6), v6, normCalc(v5, v7, v6),
                v6, normCalc(v5, v7, v6), v7, normCalc(v5, v7, v6), v13, normCalc(v5, v7, v6),
                v6, normCalc(v6, v13, v14), v13, normCalc(v6, v13, v14), v14, normCalc(v6, v13, v14),
                v4, normCalc(v4, v6, v14), v6, normCalc(v4, v6, v14), v14, normCalc(v4, v6, v14),
                v2, normCalc(v2, v4, v6), v4, normCalc(v2, v4, v6), v6, normCalc(v2, v4, v6),
                v1, [-1, 0, 0,], v3, [-1, 0, 0,], v4, [-1, 0, 0,],
                v1, [-1, 0, 0,], v2, [-1, 0, 0,], v4, [-1, 0, 0,],
                v1, [0, 1, 0,], v5, [0, 1, 0,], v2, [0, 1, 0,],
                v6, [0, 1, 0,], v2, [0, 1, 0,], v5, [0, 1, 0,],
                //head
                v7, [0, 0, 1,], v8, [0, 0, 1,], v10, [0, 0, 1,],
                v8, [0, 0, 1,], v9, [0, 0, 1,], v10, [0, 0, 1,],
                v10, [1, 0, 0,], v9, [1, 0, 0,], v11, [1, 0, 0,],
                v10, [1, 0, 0,], v11, [1, 0, 0,], v12, [1, 0, 0,],
                v13, [0, 0, -1,], v12, [0, 0, -1,], v14, [0, 0, -1,],
                v12, [0, 0, -1,], v11, [0, 0, -1,], v14, [0, 0, -1,],
                v14, [0, -1, 0,], v9, [0, -1, 0,], v11, [0, -1, 0,],
                v8, [0, -1, 0,], v9, [0, -1, 0,], v14, [0, -1, 0,],
                v7, [0, 1, 0,], v10, [0, 1, 0,], v12, [0, 1, 0,],
                v7, [0, 1, 0,], v12, [0, 1, 0,], v13, [0, 1, 0,],
                // ears
                v7, normCalc(v7, v15, v17), v15, normCalc(v7, v15, v17), v17, normCalc(v7, v15, v17),
                v15, normCalc(v15, v10, v17), v10, normCalc(v15, v10, v17), v17, normCalc(v15, v10, v17),

                v16, normCalc(v16, v13, v18), v13, normCalc(v16, v13, v18), v18, normCalc(v16, v13, v18),
                v12, normCalc(v12, v16, v18), v16, normCalc(v12, v16, v18), v18, normCalc(v12, v16, v18),
            );
            return vertices;
        }

        function fthighV () {
            // vertices information
            var v1 = [0.0, 0.02, 0.05, 1.0, 183/255, 99/255, 24/255,];
            var v2 = [0.0, -0.18, 0.05, 1.0, 183/255, 99/255, 24/255,];
            var v3 = [0.05, -0.18, 0.05, 1.0, 255/255, 239/255, 192/255,];
            var v4 = [0.1, 0.02, 0.05, 1.0, 255/255, 239/255, 192/255,];
            var v5 = [0.05, -0.18, 0.0, 1.0, 255/255, 239/255, 192/255,];
            var v6 = [0.1, 0.02, 0.0, 1.0, 255/255, 239/255, 192/255,];
            var v7 = [0.0, 0.02, 0.0, 1.0, 183/255, 99/255, 24/255,];
            var v8 = [0.0, -0.18, 0.0, 1.0, 183/255, 99/255, 24/255,];

           

            var vertices = Array.prototype.concat.call(
                v1, normCalc(v1, v2, v8), v2, normCalc(v1, v2, v8), v8, normCalc(v1, v2, v8),
                v1, normCalc(v1, v2, v8), v8, normCalc(v1, v2, v8), v7, normCalc(v1, v2, v8),

                v1, normCalc(v1, v2, v3), v2, normCalc(v1, v2, v3), v3, normCalc(v1, v2, v3),
                v1, normCalc(v1, v2, v3), v3, normCalc(v1, v2, v3), v4, normCalc(v1, v2, v3),

                v3, normCalc(v3, v4, v5), v4, normCalc(v3, v4, v5), v5, normCalc(v3, v4, v5),
                v4, normCalc(v3, v4, v5), v5, normCalc(v3, v4, v5), v6, normCalc(v3, v4, v5),

                v7, normCalc(v7, v5, v8), v5, normCalc(v7, v5, v8), v8, normCalc(v7, v5, v8),
                v7, normCalc(v7, v5, v8), v6, normCalc(v7, v5, v8), v5, normCalc(v7, v5, v8),

                v7, normCalc(v7, v1, v4), v1, normCalc(v7, v1, v4), v4, normCalc(v7, v1, v4),
                v7, normCalc(v7, v1, v4), v4, normCalc(v7, v1, v4), v6, normCalc(v7, v1, v4),

                v2, normCalc(v2, v8, v3), v8, normCalc(v2, v8, v3), v3, normCalc(v2, v8, v3),
                v8, normCalc(v2, v8, v3), v5, normCalc(v2, v8, v3), v3, normCalc(v2, v8, v3),
            );
            return vertices;
        }

        function bthighV () {
            // vertices information
            var v1 = [0.0, 0.0, 0.1, 1.0,183/255, 99/255, 24/255,];
            var v2 = [0.2, -0.15, 0.1, 1.0,183/255, 99/255, 24/255,];
            var v3 = [0.25, -0.15, 0.1, 1.0, 255/255, 239/255, 192/255,];
            var v4 = [0.22, 0.0, 0.1, 1.0, 255/255, 239/255, 192/255,];
            var v5 = [0.25, -0.15, 0.0, 1.0, 255/255, 239/255, 192/255,];
            var v6 = [0.22, 0.0, 0.0, 1.0, 255/255, 239/255, 192/255,];
            var v7 = [0.0, 0.0, 0.0, 1.0, 183/255, 99/255, 24/255,];
            var v8 = [0.2, -0.15, 0.0, 1.0, 183/255, 99/255, 24/255,];

            var vertices = Array.prototype.concat.call(
                v1, normCalc(v1, v2, v8), v2, normCalc(v1, v2, v8), v8, normCalc(v1, v2, v8),
                v1, normCalc(v1, v2, v8), v8, normCalc(v1, v2, v8), v7, normCalc(v1, v2, v8),

                v1, normCalc(v1, v2, v3), v2, normCalc(v1, v2, v3), v3, normCalc(v1, v2, v3),
                v1, normCalc(v1, v2, v3), v3, normCalc(v1, v2, v3), v4, normCalc(v1, v2, v3),

                v3, normCalc(v3, v4, v5), v4, normCalc(v3, v4, v5), v5, normCalc(v3, v4, v5),
                v4, normCalc(v3, v4, v5), v5, normCalc(v3, v4, v5), v6, normCalc(v3, v4, v5),

                v7, normCalc(v7, v5, v8), v5, normCalc(v7, v5, v8), v8, normCalc(v7, v5, v8),
                v7, normCalc(v7, v5, v8), v6, normCalc(v7, v5, v8), v5, normCalc(v7, v5, v8),

                v7, normCalc(v7, v1, v4), v1, normCalc(v7, v1, v4), v4, normCalc(v7, v1, v4),
                v7, normCalc(v7, v1, v4), v4, normCalc(v7, v1, v4), v6, normCalc(v7, v1, v4),

                v2, normCalc(v2, v8, v3), v8, normCalc(v2, v8, v3), v3, normCalc(v2, v8, v3),
                v8, normCalc(v2, v8, v3), v5, normCalc(v2, v8, v3), v3, normCalc(v2, v8, v3),
            );
            return vertices;
        }

        function fcalfV () {
            // vertices information
            var v1 = [0.0, 0.0, 0.05, 1.0, 183/255, 99/255, 24/255,];
            var v2 = [0.0, -0.15, 0.05, 1.0, 183/255, 99/255, 24/255,];
            var v3 = [0.025, -0.15, 0.05, 1.0, 255/255, 239/255, 192/255,];
            var v4 = [0.05, 0.0, 0.05, 1.0, 255/255, 239/255, 192/255,];
            var v5 = [0.025, -0.15, 0.0, 1.0, 255/255, 239/255, 192/255,];
            var v6 = [0.05, 0.0, 0.0, 1.0, 255/255, 239/255, 192/255,];
            var v7 = [0.0, 0.0, 0.0, 1.0, 183/255, 99/255, 24/255,];
            var v8 = [0.0, -0.15, 0.0, 1.0, 183/255, 99/255, 24/255,];

            

            var vertices = Array.prototype.concat.call(
                v1, normCalc(v1, v2, v8), v2, normCalc(v1, v2, v8), v8, normCalc(v1, v2, v8),
                v1, normCalc(v1, v2, v8), v8, normCalc(v1, v2, v8), v7, normCalc(v1, v2, v8),

                v1, normCalc(v1, v2, v3), v2, normCalc(v1, v2, v3), v3, normCalc(v1, v2, v3),
                v1, normCalc(v1, v2, v3), v3, normCalc(v1, v2, v3), v4, normCalc(v1, v2, v3),

                v3, normCalc(v3, v4, v5), v4, normCalc(v3, v4, v5), v5, normCalc(v3, v4, v5),
                v4, normCalc(v3, v4, v5), v5, normCalc(v3, v4, v5), v6, normCalc(v3, v4, v5),

                v7, normCalc(v7, v5, v8), v5, normCalc(v7, v5, v8), v8, normCalc(v7, v5, v8),
                v7, normCalc(v7, v5, v8), v6, normCalc(v7, v5, v8), v5, normCalc(v7, v5, v8),

                v7, normCalc(v7, v1, v4), v1, normCalc(v7, v1, v4), v4, normCalc(v7, v1, v4),
                v7, normCalc(v7, v1, v4), v4, normCalc(v7, v1, v4), v6, normCalc(v7, v1, v4),

                v2, normCalc(v2, v8, v3), v8, normCalc(v2, v8, v3), v3, normCalc(v2, v8, v3),
                v8, normCalc(v2, v8, v3), v5, normCalc(v2, v8, v3), v3, normCalc(v2, v8, v3),
            );
            return vertices;
        }

        function bcalfV () {
            // vertices information
            var v1 = [0.02, 0.05, 0.1, 1.0, 183/255, 99/255, 24/255,];
            var v2 = [0.0, -0.15, 0.05, 1.0, 183/255, 99/255, 24/255,];
            var v3 = [0.05, -0.15, 0.05, 1.0, 255/255, 239/255, 192/255,];
            var v4 = [0.11, 0.05, 0.1, 1.0, 255/255, 239/255, 192/255,];
            var v5 = [0.05, -0.15, 0.0, 1.0, 255/255, 239/255, 192/255,];
            var v6 = [0.11, 0.05, 0.0, 1.0, 255/255, 239/255, 192/255,];
            var v7 = [0.02, 0.05, 0.0, 1.0, 183/255, 99/255, 24/255,];
            var v8 = [0.05, -0.15, 0.0, 1.0, 183/255, 99/255, 24/255,];
    
            var vertices = Array.prototype.concat.call(
                v1, normCalc(v1, v2, v8), v2, normCalc(v1, v2, v8), v8, normCalc(v1, v2, v8),
                v1, normCalc(v1, v2, v8), v8, normCalc(v1, v2, v8), v7, normCalc(v1, v2, v8),

                v1, normCalc(v1, v2, v3), v2, normCalc(v1, v2, v3), v3, normCalc(v1, v2, v3),
                v1, normCalc(v1, v2, v3), v3, normCalc(v1, v2, v3), v4, normCalc(v1, v2, v3),

                v3, normCalc(v3, v4, v5), v4, normCalc(v3, v4, v5), v5, normCalc(v3, v4, v5),
                v4, normCalc(v3, v4, v5), v5, normCalc(v3, v4, v5), v6, normCalc(v3, v4, v5),

                v7, normCalc(v7, v5, v8), v5, normCalc(v7, v5, v8), v8, normCalc(v7, v5, v8),
                v7, normCalc(v7, v5, v8), v6, normCalc(v7, v5, v8), v5, normCalc(v7, v5, v8),

                v7, normCalc(v7, v1, v4), v1, normCalc(v7, v1, v4), v4, normCalc(v7, v1, v4),
                v7, normCalc(v7, v1, v4), v4, normCalc(v7, v1, v4), v6, normCalc(v7, v1, v4),

                v2, normCalc(v2, v8, v3), v8, normCalc(v2, v8, v3), v3, normCalc(v2, v8, v3),
                v8, normCalc(v2, v8, v3), v5, normCalc(v2, v8, v3), v3, normCalc(v2, v8, v3),
            );
            return vertices;
        }

        function pawV () {
            // vertices information
            var v1 = [0.0, 0.0, 0.05, 1.0, 183/255, 99/255, 24/255,];
            var v2 = [0.0, -0.05, 0.05, 1.0, 183/255, 99/255, 24/255,];
            var v3 = [0.1, -0.05, 0.05, 1.0, 183/255, 99/255, 24/255,];
            var v4 = [0.1, 0.0, 0.05, 1.0, 183/255, 99/255, 24/255,];
            var v5 = [0.1, -0.05, 0.0, 1.0, 183/255, 99/255, 24/255,];
            var v6 = [0.1, 0.0, 0.0, 1.0, 183/255, 99/255, 24/255,];
            var v7 = [0.0, 0.0, 0.0, 1.0, 183/255, 99/255, 24/255,];
            var v8 = [0.0, -0.05, 0.0, 1.0, 183/255, 99/255, 24/255,];

            
            var vertices = Array.prototype.concat.call(
                v1, normCalc(v1, v2, v8), v2, normCalc(v1, v2, v8), v8, normCalc(v1, v2, v8),
                v1, normCalc(v1, v2, v8), v8, normCalc(v1, v2, v8), v7, normCalc(v1, v2, v8),

                v1, normCalc(v1, v2, v3), v2, normCalc(v1, v2, v3), v3, normCalc(v1, v2, v3),
                v1, normCalc(v1, v2, v3), v3, normCalc(v1, v2, v3), v4, normCalc(v1, v2, v3),

                v3, normCalc(v3, v4, v5), v4, normCalc(v3, v4, v5), v5, normCalc(v3, v4, v5),
                v4, normCalc(v3, v4, v5), v5, normCalc(v3, v4, v5), v6, normCalc(v3, v4, v5),

                v7, normCalc(v7, v5, v8), v5, normCalc(v7, v5, v8), v8, normCalc(v7, v5, v8),
                v7, normCalc(v7, v5, v8), v6, normCalc(v7, v5, v8), v5, normCalc(v7, v5, v8),

                v7, normCalc(v7, v1, v4), v1, normCalc(v7, v1, v4), v4, normCalc(v7, v1, v4),
                v7, normCalc(v7, v1, v4), v4, normCalc(v7, v1, v4), v6, normCalc(v7, v1, v4),

                v2, normCalc(v2, v8, v3), v8, normCalc(v2, v8, v3), v3, normCalc(v2, v8, v3),
                v8, normCalc(v2, v8, v3), v5, normCalc(v2, v8, v3), v3, normCalc(v2, v8, v3),
            );
            return vertices;
        }

        function tailV () {
            // vertices information
            var v1 = [0.0, 0.0, 0.05, 1.0, 183/255, 99/255, 24/255,];
            var v2 = [0.0, -0.05, 0.05, 1.0, 183/255, 99/255, 24/255,];
            var v3 = [0.25, -0.05, 0.05, 1.0, 255/255, 239/255, 192/255,];
            var v4 = [0.25, 0.0, 0.05, 1.0, 255/255, 239/255, 192/255,];
            var v5 = [0.25, -0.05, 0.0, 1.0, 255/255, 239/255, 192/255,];
            var v6 = [0.25, 0.0, 0.0, 1.0, 255/255, 239/255, 192/255,];
            var v7 = [0.0, 0.0, 0.0, 1.0, 255/255, 239/255, 192/255,];
            var v8 = [0.0, -0.05, 0.0, 1.0, 255/255, 239/255, 192/255,];

         

            var vertices = Array.prototype.concat.call(
                v1, normCalc(v1, v2, v8), v2, normCalc(v1, v2, v8), v8, normCalc(v1, v2, v8),
                v1, normCalc(v1, v2, v8), v8, normCalc(v1, v2, v8), v7, normCalc(v1, v2, v8),

                v1, normCalc(v1, v2, v3), v2, normCalc(v1, v2, v3), v3, normCalc(v1, v2, v3),
                v1, normCalc(v1, v2, v3), v3, normCalc(v1, v2, v3), v4, normCalc(v1, v2, v3),

                v3, normCalc(v3, v4, v5), v4, normCalc(v3, v4, v5), v5, normCalc(v3, v4, v5),
                v4, normCalc(v3, v4, v5), v5, normCalc(v3, v4, v5), v6, normCalc(v3, v4, v5),

                v7, normCalc(v7, v5, v8), v5, normCalc(v7, v5, v8), v8, normCalc(v7, v5, v8),
                v7, normCalc(v7, v5, v8), v6, normCalc(v7, v5, v8), v5, normCalc(v7, v5, v8),

                v7, normCalc(v7, v1, v4), v1, normCalc(v7, v1, v4), v4, normCalc(v7, v1, v4),
                v7, normCalc(v7, v1, v4), v4, normCalc(v7, v1, v4), v6, normCalc(v7, v1, v4),

                v2, normCalc(v2, v8, v3), v8, normCalc(v2, v8, v3), v3, normCalc(v2, v8, v3),
                v8, normCalc(v2, v8, v3), v5, normCalc(v2, v8, v3), v3, normCalc(v2, v8, v3),
            );

            return vertices;
        }

        function drawDog() {

            matidx = matDog;
            setMatrials();

            pushMatrix(g_modelMatrix);
            {
                // body
                pushMatrix(g_modelMatrix);
                {
                    pushMatrix(mvpMatrix);
                    {
                    g_modelMatrix.rotate(g_anglebody, 0, 0, 1);

                    mvpMatrix.multiply(g_modelMatrix);
                    normalMatrix.setInverseOf(g_modelMatrix);
                    normalMatrix.transpose();
                    gl.uniformMatrix4fv(uLoc_MvpMatrix[shaderIdx], false, mvpMatrix.elements);
                    gl.uniformMatrix4fv(uLoc_NormalMatrix[shaderIdx], false, normalMatrix.elements);
        
                    gl.uniformMatrix4fv(uLoc_modelMatrix[shaderIdx], false, g_modelMatrix.elements);
                    gl.drawArrays(gl.TRIANGLES, body_S, body_C);	// draw all vertices.

                    mvpMatrix = popMatrix();
                    }

                g_modelMatrix = popMatrix();
                }
                // head
                pushMatrix(g_modelMatrix);
                {
                    pushMatrix(mvpMatrix);
                    {
                    g_modelMatrix.translate(g_transheadx, g_transheady, 0);

                    mvpMatrix.multiply(g_modelMatrix);
                    normalMatrix.setInverseOf(g_modelMatrix);
                    normalMatrix.transpose();
                    gl.uniformMatrix4fv(uLoc_MvpMatrix[shaderIdx], false, mvpMatrix.elements);
                    gl.uniformMatrix4fv(uLoc_NormalMatrix[shaderIdx], false, normalMatrix.elements);
        
                    gl.uniformMatrix4fv(uLoc_modelMatrix[shaderIdx], false, g_modelMatrix.elements);
                    gl.drawArrays(gl.TRIANGLES, head_S, head_C);	// draw all vertices.

                    mvpMatrix = popMatrix();
                    }

                g_modelMatrix = popMatrix();
                }

                //legs
                //Thighs
                pushMatrix(g_modelMatrix);
                {    
                    // left front
                    g_modelMatrix.translate(-0.2,  0.0, 0.1);
                    
                    pushMatrix(g_modelMatrix);
                    {
                        // thigh 
                        pushMatrix(mvpMatrix);
                        {
                        g_modelMatrix.translate(0.0, g_frontlegs, 0.0);
                        g_modelMatrix.rotate(g_angle0now, 0, 0, 1);

                        mvpMatrix.multiply(g_modelMatrix);
                        normalMatrix.setInverseOf(g_modelMatrix);
                        normalMatrix.transpose();
                        gl.uniformMatrix4fv(uLoc_MvpMatrix[shaderIdx], false, mvpMatrix.elements);
                        gl.uniformMatrix4fv(uLoc_NormalMatrix[shaderIdx], false, normalMatrix.elements);
            
                        gl.uniformMatrix4fv(uLoc_modelMatrix[shaderIdx], false, g_modelMatrix.elements);
                        gl.drawArrays(gl.TRIANGLES, fthigh_S, fthigh_C);	// draw all vertices.

                        mvpMatrix = popMatrix();
                        }


                        // calf
                        pushMatrix(g_modelMatrix);
                        {
                            pushMatrix(mvpMatrix);
                            {

                            g_modelMatrix.translate(0, -0.15, 0);
                            g_modelMatrix.rotate(g_angle5now, 0, 0, 1);

                            mvpMatrix.multiply(g_modelMatrix);
                            normalMatrix.setInverseOf(g_modelMatrix);
                            normalMatrix.transpose();
                            gl.uniformMatrix4fv(uLoc_MvpMatrix[shaderIdx], false, mvpMatrix.elements);
                            gl.uniformMatrix4fv(uLoc_NormalMatrix[shaderIdx], false, normalMatrix.elements);
                
                            gl.uniformMatrix4fv(uLoc_modelMatrix[shaderIdx], false, g_modelMatrix.elements);
                            gl.drawArrays(gl.TRIANGLES, fcalf_S, fcalf_C);	// draw all vertices.

                            mvpMatrix = popMatrix();
                            }

                            // paw
                            pushMatrix(mvpMatrix);
                            {
                            g_modelMatrix.translate(-0.05, -0.15, 0);
                            g_modelMatrix.rotate(g_angle9now, 0, 0, 1);

                            mvpMatrix.multiply(g_modelMatrix);
                            normalMatrix.setInverseOf(g_modelMatrix);
                            normalMatrix.transpose();
                            gl.uniformMatrix4fv(uLoc_MvpMatrix[shaderIdx], false, mvpMatrix.elements);
                            gl.uniformMatrix4fv(uLoc_NormalMatrix[shaderIdx], false, normalMatrix.elements);
                
                            gl.uniformMatrix4fv(uLoc_modelMatrix[shaderIdx], false, g_modelMatrix.elements);
                            gl.drawArrays(gl.TRIANGLES, paw_S, paw_C);	// draw all vertices.

                            mvpMatrix = popMatrix();
                            }
        
                        g_modelMatrix = popMatrix();
                        }

                    g_modelMatrix = popMatrix();
                    }
                    // right front
                    g_modelMatrix.translate(0, 0.0, -0.25);
                    
                    pushMatrix(g_modelMatrix);
                    {
                        // f thigh
                        pushMatrix(mvpMatrix);
                        {
                        g_modelMatrix.translate(0.0, g_frontlegs, 0.0);
                        g_modelMatrix.rotate(g_angle1now, 0, 0, 1);


                        mvpMatrix.multiply(g_modelMatrix);
                        normalMatrix.setInverseOf(g_modelMatrix);
                        normalMatrix.transpose();
                        gl.uniformMatrix4fv(uLoc_MvpMatrix[shaderIdx], false, mvpMatrix.elements);
                        gl.uniformMatrix4fv(uLoc_NormalMatrix[shaderIdx], false, normalMatrix.elements);
                
                        gl.uniformMatrix4fv(uLoc_modelMatrix[shaderIdx], false, g_modelMatrix.elements);
                        gl.drawArrays(gl.TRIANGLES, fthigh_S, fthigh_C);	// draw all vertices.

                        mvpMatrix = popMatrix();
                        }

                        // f calf
                        pushMatrix(g_modelMatrix);
                      {

                        pushMatrix(mvpMatrix);
                        {
                            g_modelMatrix.translate(0.0, -0.15, 0);
                            g_modelMatrix.rotate(g_angle6now, 0, 0, 1);

                            mvpMatrix.multiply(g_modelMatrix);
                            normalMatrix.setInverseOf(g_modelMatrix);
                            normalMatrix.transpose();
                            gl.uniformMatrix4fv(uLoc_MvpMatrix[shaderIdx], false, mvpMatrix.elements);
                            gl.uniformMatrix4fv(uLoc_NormalMatrix[shaderIdx], false, normalMatrix.elements);
                
                            gl.uniformMatrix4fv(uLoc_modelMatrix[shaderIdx], false, g_modelMatrix.elements);
                            gl.drawArrays(gl.TRIANGLES, fcalf_S, fcalf_C);	// draw all vertices.

                        mvpMatrix = popMatrix();
                        }

                        pushMatrix(mvpMatrix);
                        {
                            // paw
                            g_modelMatrix.translate(-0.05, -0.15, 0);
                            g_modelMatrix.rotate(g_angle9now, 0, 0, 1);

                            mvpMatrix.multiply(g_modelMatrix);
                            normalMatrix.setInverseOf(g_modelMatrix);
                            normalMatrix.transpose();
                            gl.uniformMatrix4fv(uLoc_MvpMatrix[shaderIdx], false, mvpMatrix.elements);
                            gl.uniformMatrix4fv(uLoc_NormalMatrix[shaderIdx], false, normalMatrix.elements);
                
                            gl.uniformMatrix4fv(uLoc_modelMatrix[shaderIdx], false, g_modelMatrix.elements);
                            gl.drawArrays(gl.TRIANGLES, paw_S, paw_C);	// draw all vertices.

                        mvpMatrix = popMatrix();
                        }
        
                        g_modelMatrix = popMatrix();
                      }

                    g_modelMatrix = popMatrix();
                    }
                    
                    //  right back
                    g_modelMatrix.translate(0.3, 0.0, 0.0);
                    
                    pushMatrix(g_modelMatrix);
                    {
                        // bthigh
                        pushMatrix(mvpMatrix);
                        {
                        g_modelMatrix.rotate(g_angle2now, 0, 0, 1);

                        mvpMatrix.multiply(g_modelMatrix);
                        normalMatrix.setInverseOf(g_modelMatrix);
                        normalMatrix.transpose();
                        gl.uniformMatrix4fv(uLoc_MvpMatrix[shaderIdx], false, mvpMatrix.elements);
                        gl.uniformMatrix4fv(uLoc_NormalMatrix[shaderIdx], false, normalMatrix.elements);
                
                        gl.uniformMatrix4fv(uLoc_modelMatrix[shaderIdx], false, g_modelMatrix.elements);

                        gl.drawArrays(gl.TRIANGLES, bthigh_S, bthigh_C);	// draw all vertices.

                        mvpMatrix = popMatrix();
                        }

                        // b calf
                        pushMatrix(g_modelMatrix);
                        {
                            pushMatrix(mvpMatrix);
                            {

                                g_modelMatrix.translate(0.15, -0.14, 0);
                                g_modelMatrix.rotate(g_angle7now, 0, 0, 1);

                                mvpMatrix.multiply(g_modelMatrix);
                                normalMatrix.setInverseOf(g_modelMatrix);
                                normalMatrix.transpose();
                                gl.uniformMatrix4fv(uLoc_MvpMatrix[shaderIdx], false, mvpMatrix.elements);
                                gl.uniformMatrix4fv(uLoc_NormalMatrix[shaderIdx], false, normalMatrix.elements);
                    
                                gl.uniformMatrix4fv(uLoc_modelMatrix[shaderIdx], false, g_modelMatrix.elements);

                                gl.drawArrays(gl.TRIANGLES, bcalf_S, bcalf_C);	// draw all vertices.

                            mvpMatrix = popMatrix();
                            }
                            // paw
                            pushMatrix(mvpMatrix);
                            {

                                g_modelMatrix.translate(-0.05, -0.13, 0);
                                g_modelMatrix.rotate(g_angle10now, 0, 0, 1);
                                
                                mvpMatrix.multiply(g_modelMatrix);
                                normalMatrix.setInverseOf(g_modelMatrix);
                                normalMatrix.transpose();
                                gl.uniformMatrix4fv(uLoc_MvpMatrix[shaderIdx], false, mvpMatrix.elements);
                                gl.uniformMatrix4fv(uLoc_NormalMatrix[shaderIdx], false, normalMatrix.elements);
                    
                                gl.uniformMatrix4fv(uLoc_modelMatrix[shaderIdx], false, g_modelMatrix.elements);

                                gl.drawArrays(gl.TRIANGLES, paw_S, paw_C);	// draw all vertices.

                            mvpMatrix = popMatrix();
                            }
                            
                            g_modelMatrix = popMatrix();
                        }

                    g_modelMatrix = popMatrix();
                    }
                    
                    // left back thigh
                    g_modelMatrix.translate(0, 0.0, 0.25);
                    
                    pushMatrix(g_modelMatrix);
                    {
                        pushMatrix(mvpMatrix);
                        {
                            g_modelMatrix.rotate(g_angle3now, 0, 0, 1);

                            mvpMatrix.multiply(g_modelMatrix);
                            normalMatrix.setInverseOf(g_modelMatrix);
                            normalMatrix.transpose();
                            gl.uniformMatrix4fv(uLoc_MvpMatrix[shaderIdx], false, mvpMatrix.elements);
                            gl.uniformMatrix4fv(uLoc_NormalMatrix[shaderIdx], false, normalMatrix.elements);
                    
                            gl.uniformMatrix4fv(uLoc_modelMatrix[shaderIdx], false, g_modelMatrix.elements);

                            gl.drawArrays(gl.TRIANGLES, bthigh_S, bthigh_C);	// draw all vertices.
                        
                        mvpMatrix = popMatrix();
                        }
                            pushMatrix(g_modelMatrix);
                            {
                                // b calf
                                pushMatrix(mvpMatrix);
                                {
                                    g_modelMatrix.translate(0.15, -0.14, 0);
                                    g_modelMatrix.rotate(g_angle8now, 0, 0, 1);

                                    mvpMatrix.multiply(g_modelMatrix);
                                    normalMatrix.setInverseOf(g_modelMatrix);
                                    normalMatrix.transpose();
                                    gl.uniformMatrix4fv(uLoc_MvpMatrix[shaderIdx], false, mvpMatrix.elements);
                                    gl.uniformMatrix4fv(uLoc_NormalMatrix[shaderIdx], false, normalMatrix.elements);
                        
                                    gl.uniformMatrix4fv(uLoc_modelMatrix[shaderIdx], false, g_modelMatrix.elements);

                                    gl.drawArrays(gl.TRIANGLES, bcalf_S, bcalf_C);	// draw all vertices.

                                mvpMatrix = popMatrix();
                                }
                                // paws
                                pushMatrix(mvpMatrix);
                                {
                                    g_modelMatrix.translate(-0.05, -0.13, 0);
                                    g_modelMatrix.rotate(g_angle10now, 0, 0, 1);

                                    mvpMatrix.multiply(g_modelMatrix);
                                    normalMatrix.setInverseOf(g_modelMatrix);
                                    normalMatrix.transpose();
                                    gl.uniformMatrix4fv(uLoc_MvpMatrix[shaderIdx], false, mvpMatrix.elements);
                                    gl.uniformMatrix4fv(uLoc_NormalMatrix[shaderIdx], false, normalMatrix.elements);
                        
                                    gl.uniformMatrix4fv(uLoc_modelMatrix[shaderIdx], false, g_modelMatrix.elements);

                                    gl.drawArrays(gl.TRIANGLES, paw_S, paw_C);	// draw all vertices.

                                mvpMatrix = popMatrix();
                                }
                            g_modelMatrix = popMatrix();
                            }
                        
            
                        g_modelMatrix = popMatrix();
                    }
                    
                    
                g_modelMatrix = popMatrix();
                }
        
                // tail
                
                pushMatrix(g_modelMatrix);
                {
                    
                    pushMatrix(mvpMatrix);
                    {

                    g_modelMatrix.translate(0.25, 0.05 + g_tail, 0);
                    g_modelMatrix.rotate(30, 0, 0, 1);
                    g_modelMatrix.rotate(g_angle1now*1, 0, 1, 0);
                    g_modelMatrix.rotate(g_angle0now * 1, 0, 0, 1);


                    mvpMatrix.multiply(g_modelMatrix);
                    normalMatrix.setInverseOf(g_modelMatrix);
                    normalMatrix.transpose();
                    gl.uniformMatrix4fv(uLoc_MvpMatrix[shaderIdx], false, mvpMatrix.elements);
                    gl.uniformMatrix4fv(uLoc_NormalMatrix[shaderIdx], false, normalMatrix.elements);
                
                    gl.uniformMatrix4fv(uLoc_modelMatrix[shaderIdx], false, g_modelMatrix.elements);

                    gl.drawArrays(gl.TRIANGLES, tail_S, tail_C);	// draw all vertices.

                    mvpMatrix = popMatrix();
                    }

                    pushMatrix(mvpMatrix);
                    {
                    g_modelMatrix.translate(0.22, -0.01, 0);
                    g_modelMatrix.scale(0.5, 1, 1);
                    g_modelMatrix.rotate(30, 0, 0, 1);

                    mvpMatrix.multiply(g_modelMatrix);
                    normalMatrix.setInverseOf(g_modelMatrix);
                    normalMatrix.transpose();
                    gl.uniformMatrix4fv(uLoc_MvpMatrix[shaderIdx], false, mvpMatrix.elements);
                    gl.uniformMatrix4fv(uLoc_NormalMatrix[shaderIdx], false, normalMatrix.elements);
                
                    gl.uniformMatrix4fv(uLoc_modelMatrix[shaderIdx], false, g_modelMatrix.elements);

                    gl.drawArrays(gl.TRIANGLES, tail_S, tail_C);	// draw all vertices.

                    mvpMatrix = popMatrix();
                    }

                    pushMatrix(mvpMatrix);
                    {
                    g_modelMatrix.translate(0.22, -0.01, 0);
                    g_modelMatrix.scale(0.2, 1, 1);
                    g_modelMatrix.rotate(30, 0, 0, 1);

                    mvpMatrix.multiply(g_modelMatrix);
                    normalMatrix.setInverseOf(g_modelMatrix);
                    normalMatrix.transpose();
                    gl.uniformMatrix4fv(uLoc_MvpMatrix[shaderIdx], false, mvpMatrix.elements);
                    gl.uniformMatrix4fv(uLoc_NormalMatrix[shaderIdx], false, normalMatrix.elements);
                
                    gl.uniformMatrix4fv(uLoc_modelMatrix[shaderIdx], false, g_modelMatrix.elements);

                    gl.drawArrays(gl.TRIANGLES, tail_S, tail_C);	// draw all vertices.

                    mvpMatrix = popMatrix();
                    }
                
                g_modelMatrix = popMatrix();
                }
                
            g_modelMatrix = popMatrix();
            }
            return 0;
        }

        function cloudV() {
            // vertices information
            var v1 = [0.0, 0.1, 0.0, 1.0, 0.0, 0.7, 1.0,];
            var v2 = [0.1, 0.1, 0.0, 1.0, 0.0, 0.7, 1.0,];
            var v3 = [0.1, 0.2, 0.0, 1.0, 1.0, 0.9, 1.0,];
            var v4 = [0.2, 0.2, 0.0, 1.0, 1.0, 0.8, 0.8,];
            var v5 = [0.2, 0.3, 0.0, 1.0, 1.0, 1.0, 1.0,];
            var v6 = [0.3, 0.3, 0.0, 1.0, 1.0, 0.9, 0.9,];
            var v7 = [0.3, 0.2, 0.0, 1.0,  1.0, 0.9, 0.9,];
            var v8 = [0.4, 0.2, 0.0, 1.0, 1.0, 0.8, 0.8,];
            var v9 = [0.4, 0.1, 0.0, 1.0, 1.0, 0.8, 0.8,];
            var v10 = [0.5, 0.1, 0.0, 1.0,  1.0, 0.8, 0.8,];
            var v11 = [0.5, 0.2, 0.0, 1.0,  1.0, 0.9, 0.9,];
            var v12 = [0.6, 0.2, 0.0, 1.0,  1.0, 0.8, 0.8,];
            var v13 = [0.6, 0.1, 0.0, 1.0,  1.0, 1.0, 1.0,];
            var v14 = [0.7, 0.1, 0.0, 1.0,  1.0, 0.8, 0.8,];
            var v15 = [0.7, 0.0, 0.0, 1.0, 0.0, 0.5, 1.0,];
            var v16 = [0.6, 0.0, 0.0, 1.0, 0.0, 0.5, 1.0,];
            var v17 = [0.6, -0.1, 0.0, 1.0, 0.0, 0.5, 1.0,];
            var v18 = [0.5, -0.1, 0.0, 1.0, 0.4, 0.4, 0.8,];
            var v19 = [0.5, 0., 0.0, 1.0, 0.0, 0.5, 1.0,];
            var v20 = [0.4, 0.0, 0.0, 1.0, 0.0, 0.5, 1.0,];
            var v21 = [0.4, -0.1, 0.0, 1.0, 0.4, 0.4, 0.8,];
            var v22 = [0.1, -0.1, 0.0, 1.0, 0.0, 0.5, 1.0,];
            var v23 = [0.1, 0.0, 0.0, 1.0, 0.4, 0.4, 0.8,];
            var v24 = [0.0, 0.0, 0.0, 1.0, 0.4, 0.4, 0.8,];

            var v1_b = [0.0, 0.1, 0.1, 1.0, 0.0, 0.7, 1.0,];
            var v2_b = [0.1, 0.1, 0.1, 1.0, 0.0, 0.7, 1.0,];
            var v3_b = [0.1, 0.2, 0.1, 1.0, 1.0, 0.9, 1.0,];
            var v4_b = [0.2, 0.2, 0.1, 1.0, 1.0, 0.8, 0.8,];
            var v5_b = [0.2, 0.3, 0.1, 1.0, 1.0, 1.0, 1.0,];
            var v6_b = [0.3, 0.3, 0.1, 1.0, 1.0, 0.9, 0.9,];
            var v7_b = [0.3, 0.2, 0.1, 1.0,  1.0, 0.9, 0.9,];
            var v8_b = [0.4, 0.2, 0.1, 1.0, 1.0, 0.8, 0.8,];
            var v9_b = [0.4, 0.1, 0.1, 1.0, 1.0, 0.8, 0.8,];
            var v10_b = [0.5, 0.1, 0.1, 1.0,  1.0, 0.8, 0.8,];
            var v11_b = [0.5, 0.2, 0.1, 1.0,  1.0, 0.9, 0.9,];
            var v12_b = [0.6, 0.2, 0.1, 1.0,  1.0, 0.8, 0.8,];
            var v13_b = [0.6, 0.1, 0.1, 1.0,  1.0, 1.0, 1.0,];
            var v14_b = [0.7, 0.1, 0.1, 1.0,  1.0, 0.8, 0.8,];
            var v15_b = [0.7, 0.0, 0.1, 1.0, 0.0, 0.5, 1.0,];
            var v16_b = [0.6, 0.0, 0.1, 1.0, 0.0, 0.5, 1.0,];
            var v17_b = [0.6, -0.1, 0.1, 1.0, 0.0, 0.5, 1.0,];
            var v18_b = [0.5, -0.1, 0.1, 1.0, 0.4, 0.4, 0.8,];
            var v19_b = [0.5, 0., 0.1, 1.0, 0.0, 0.5, 1.0,];
            var v20_b = [0.4, 0.0, 0.1, 1.0, 0.0, 0.5, 1.0,];
            var v21_b = [0.4, -0.1, 0.1, 1.0, 0.0, 0.5, 1.0,];
            var v22_b = [0.1, -0.1, 0.1, 1.0, 0.4, 0.4, 0.8,];
            var v23_b = [0.1, 0.0, 0.1, 1.0, 0.4, 0.4, 0.8,];
            var v24_b = [0.0, 0.0, 0.1, 1.0, 0.4, 0.4, 0.8,];



            var vertices = Array.prototype.concat.call(

                //side:
                v1, [-1, 0, 0], v1_b, [-1, 0, 0], v24_b, [-1, 0, 0],
                v1, [-1, 0, 0], v24_b, [-1, 0, 0], v24, [-1, 0, 0],

                v2, [0, 1, 0], v2_b, [0, 1, 0], v1_b, [0, 1, 0],
                v2, [0, 1, 0], v1_b, [0, 1, 0], v1, [0, 1, 0],

                v3, [-1, 0, 0], v3_b, [-1, 0, 0], v2_b, [-1, 0, 0],
                v3, [-1, 0, 0], v2_b, [-1, 0, 0], v2, [-1, 0, 0],

                v4, [0, 1, 0], v4_b, [0, 1, 0], v3_b, [0, 1, 0],
                v4, [0, 1, 0], v3_b, [0, 1, 0], v3, [0, 1, 0],

                v5, [-1, 0, 0], v5_b, [-1, 0, 0], v4_b, [-1, 0, 0],
                v5, [-1, 0, 0], v4_b, [-1, 0, 0], v4, [-1, 0, 0],

                v6, [0, 1, 0], v6_b, [0, 1, 0], v5_b, [0, 1, 0],
                v6, [0, 1, 0], v5_b, [0, 1, 0], v5, [0, 1, 0],

                v7, [1, 0, 0], v7_b, [1, 0, 0], v6_b, [1, 0, 0],
                v7, [1, 0, 0], v6_b, [1, 0, 0], v6, [1, 0, 0],

                v8, [0, 1, 0], v8_b, [0, 1, 0], v7_b, [0, 1, 0],
                v8, [0, 1, 0], v7_b, [0, 1, 0], v7, [0, 1, 0],

                v9, [1, 0, 0], v9_b, [1, 0, 0], v8_b, [1, 0, 0],
                v9, [1, 0, 0], v8_b, [1, 0, 0], v8, [1, 0, 0],

                v10, [0, 1, 0], v10_b, [0, 1, 0], v9_b, [0, 1, 0],
                v10, [0, 1, 0], v9_b, [0, 1, 0], v9, [0, 1, 0],

                v11, [-1, 0, 0], v11_b, [-1, 0, 0], v10_b, [-1, 0, 0],
                v11, [-1, 0, 0], v10_b, [-1, 0, 0], v10, [-1, 0, 0],

                v12, [0, 1, 0], v12_b, [0, 1, 0], v11_b, [0, 1, 0],
                v12, [0, 1, 0], v11_b, [0, 1, 0], v11, [0, 1, 0],

                v13, [1, 0, 0], v13_b, [1, 0, 0], v12_b, [1, 0, 0],
                v13, [1, 0, 0], v12_b, [1, 0, 0], v12, [1, 0, 0],

                v14, [0, 1, 0], v14_b, [0, 1, 0], v13_b, [0, 1, 0],
                v14, [0, 1, 0], v13_b, [0, 1, 0], v13, [0, 1, 0],

                v15, [1, 0, 0], v15_b, [1, 0, 0], v14_b, [1, 0, 0],
                v15, [1, 0, 0], v14_b, [1, 0, 0], v14, [1, 0, 0],

                v16, [0, -1, 0], v16_b, [0, -1, 0], v15_b, [0, -1, 0],
                v16, [0, -1, 0], v15_b, [0, -1, 0], v15, [0, -1, 0],

                v17, [1, 0, 0], v17_b, [1, 0, 0], v16_b, [1, 0, 0],
                v17, [1, 0, 0], v16_b, [1, 0, 0], v16, [1, 0, 0],

                v18, [0, -1, 0], v18_b, [0, -1, 0], v17_b, [0, -1, 0],
                v18, [0, -1, 0], v17_b, [0, -1, 0], v17, [0, -1, 0],

                v19, [-1, 0, 0], v19_b, [-1, 0, 0], v18_b, [-1, 0, 0],
                v19, [-1, 0, 0], v18_b, [-1, 0, 0], v18, [-1, 0, 0],

                v20, [0, -1, 0], v20_b, [0, -1, 0], v19_b, [0, -1, 0],
                v20, [0, -1, 0], v19_b, [0, -1, 0], v19, [0, -1, 0],

                v21, [1, 0, 0], v21_b, [1, 0, 0], v20_b, [1, 0, 0],
                v21, [1, 0, 0], v20_b, [1, 0, 0], v20, [1, 0, 0],

                v22, [0, -1, 0], v22_b, [0, -1, 0], v21_b, [0, -1, 0],
                v22, [0, -1, 0], v21_b, [0, -1, 0], v21, [0, -1, 0],

                v23, [-1, 0, 0], v23_b, [-1, 0, 0], v22_b, [-1, 0, 0],
                v23, [-1, 0, 0], v22_b, [-1, 0, 0], v22, [-1, 0, 0],

                v24, [0, -1, 0], v24_b, [0, -1, 0], v23_b, [0, -1, 0],
                v24, [0, -1, 0], v23_b, [0, -1, 0], v23, [0, -1, 0],
                // front:
                v2, [0, 0, 1], v1, [0, 0, 1], v24, [0, 0, 1],
                v2, [0, 0, 1], v24, [0, 0, 1], v23, [0, 0, 1],
                v1_b, [0, 0, -1], v2_b, [0, 0, -1], v24_b, [0, 0, -1],
                v2_b, [0, 0, -1], v23_b, [0, 0, -1], v24_b, [0, 0, -1],

                v4, [0, 0, 1], v3, [0, 0, 1], v22, [0, 0, 1],
                v3_b, [0, 0, -1], v4_b, [0, 0, -1], v22_b, [0, 0, -1],
                v6, [0, 0, 1], v4, [0, 0, 1], v22, [0, 0, 1],
                v4_b, [0, 0, -1], v6_b, [0, 0, -1], v22_b, [0, 0, -1],
                v6, [0, 0, 1], v5, [0, 0, 1], v4, [0, 0, 1],
                v5_b, [0, 0, -1], v6_b, [0, 0, -1], v4_b, [0, 0, -1],
                v7, [0, 0, 1], v6, [0, 0, 1], v22, [0, 0, 1],
                v6_b, [0, 0, -1], v7_b, [0, 0, -1], v22_b, [0, 0, -1],
                v7, [0, 0, 1], v21, [0, 0, 1], v22, [0, 0, 1],
                v21_b, [0, 0, -1], v7_b, [0, 0, -1], v22_b, [0, 0, -1],
                v8, [0, 0, 1], v7, [0, 0, 1], v21, [0, 0, 1],
                v7_b, [0, 0, -1], v8_b, [0, 0, -1], v21_b, [0, 0, -1],

                v10, [0, 0, 1], v9, [0, 0, 1], v20, [0, 0, 1],
                v9_b, [0, 0, -1], v10_b, [0, 0, -1], v20_b, [0, 0, -1],
                v10, [0, 0, 1], v20, [0, 0, 1], v19, [0, 0, 1],
                v20_b, [0, 0, -1], v10_b, [0, 0, -1], v19_b, [0, 0, -1],

                v11, [0, 0, 1], v18, [0, 0, 1], v12, [0, 0, 1],
                v18_b, [0, 0, -1], v11_b, [0, 0, -1], v12_b, [0, 0, -1],
                v12, [0, 0, 1], v18, [0, 0, 1], v17, [0, 0, 1],
                v18_b, [0, 0, -1], v12_b, [0, 0, -1], v17_b, [0, 0, -1],

                v14, [0, 0, 1], v13, [0, 0, 1], v16, [0, 0, 1],
                v13_b, [0, 0, -1], v14_b, [0, 0, -1], v16_b, [0, 0, -1],
                v14, [0, 0, 1], v16, [0, 0, 1], v15, [0, 0, 1],
                v14_b, [0, 0, -1], v15_b, [0, 0, -1], v16_b, [0, 0, -1],
            );
            return vertices;
        }

        function drawCloud() {
            matidx = matCloud;
            setMatrials();

            pushMatrix(g_modelMatrix);
            {
                drawAxis();

                pushMatrix(mvpMatrix);
                {
                mvpMatrix.multiply(g_modelMatrix);
                normalMatrix.setInverseOf(g_modelMatrix);
                normalMatrix.transpose();
                gl.uniformMatrix4fv(uLoc_MvpMatrix[shaderIdx], false, mvpMatrix.elements);
                gl.uniformMatrix4fv(uLoc_NormalMatrix[shaderIdx], false, normalMatrix.elements);
                
                gl.uniformMatrix4fv(uLoc_modelMatrix[shaderIdx], false, g_modelMatrix.elements);

                gl.drawArrays(gl.TRIANGLES, cloud_S, cloud_C);	// draw all vertices.

                mvpMatrix = popMatrix();
                }

                pushMatrix(mvpMatrix);
                {
                    g_modelMatrix.scale(0.6, 0.6, 0.5);
                    g_modelMatrix.translate(0.3, 0.05, 0.2);

                    mvpMatrix.multiply(g_modelMatrix);
                    normalMatrix.setInverseOf(g_modelMatrix);
                    normalMatrix.transpose();
                    gl.uniformMatrix4fv(uLoc_MvpMatrix[shaderIdx], false, mvpMatrix.elements);
                    gl.uniformMatrix4fv(uLoc_NormalMatrix[shaderIdx], false, normalMatrix.elements);
                
                    gl.uniformMatrix4fv(uLoc_modelMatrix[shaderIdx], false, g_modelMatrix.elements);

                    gl.drawArrays(gl.TRIANGLES, cloud_S, cloud_C);	// draw all vertices.
                    
                mvpMatrix = popMatrix();
                }

                
                pushMatrix(mvpMatrix);
                {
                    g_modelMatrix.translate(0, 0, -0.3);
                
                    mvpMatrix.multiply(g_modelMatrix);
                    normalMatrix.setInverseOf(g_modelMatrix);
                    normalMatrix.transpose();
                    gl.uniformMatrix4fv(uLoc_MvpMatrix[shaderIdx], false, mvpMatrix.elements);
                    gl.uniformMatrix4fv(uLoc_NormalMatrix[shaderIdx], false, normalMatrix.elements);
                
                    gl.uniformMatrix4fv(uLoc_modelMatrix[shaderIdx], false, g_modelMatrix.elements);

                    gl.drawArrays(gl.TRIANGLES, cloud_S, cloud_C);	// draw all vertices.

                    mvpMatrix = popMatrix();
                }

            g_modelMatrix = popMatrix();
            }
        }

    }   // =========== end dog parts ============

    function groundgridV() {
        var ans_ver;
        var x_max = 3;

        var x_num = -3;
        var x_gap = 0.1;

        while(x_num <= x_max) {
            
            var p1 = [x_num, -1, -3, 1.0, 204/255, 255/255, 229/255, 0.0, 1.0, 0.0,];
            var p2 = [x_num, -1, 3, 1.0, 204/255, 255/255, 229/255, 0.0, 1.0, 0.0,];

            var p3 = [-3, -1, x_num, 1.0, 255/255, 229/255, 204/255, 0.0, 1.0, 0.0,];
            var p4 = [3, -1, x_num, 1.0, 255/255, 229/255, 204/255, 0.0, 1.0, 0.0,];

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
        {
            pushMatrix(mvpMatrix);
            {
            g_modelMatrix.rotate(-90, 1, 0, 0);

            mvpMatrix.multiply(g_modelMatrix);
            normalMatrix.setInverseOf(g_modelMatrix);
            normalMatrix.transpose();
            gl.uniformMatrix4fv(uLoc_MvpMatrix[shaderIdx], false, mvpMatrix.elements);
            gl.uniformMatrix4fv(uLoc_NormalMatrix[shaderIdx], false, normalMatrix.elements);
            
            gl.uniformMatrix4fv(uLoc_modelMatrix[shaderIdx], false, g_modelMatrix.elements);
            
            gl.drawArrays(gl.LINES, axis_S, axis_C);	// draw all vertices.
            
            mvpMatrix = popMatrix();
            }
        g_modelMatrix = popMatrix();
        }

        return 0;
    }

    function setTarget() {
        target_x = Math.random() * 4 - 2;
        target_y = Math.random() * 4 - 1;
        target_z = Math.random() * 4 - 2;

        a_x = (target_x - cloud_x) / 1000;
        a_y = (target_y - cloud_y) / 1000;
        a_z = (target_z - cloud_z) / 1000;
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
            g_modelMatrix.translate(0.8, -0.5, 0);
            g_modelMatrix.scale(0.5, 0.5, 0.5);
            drawSphere();

            g_modelMatrix.translate(0, 0, -1);

            // loop
            {
            pushMatrix(g_modelMatrix);
                g_modelMatrix.rotate(g_angle4now, 0, 0, 1);
                drawLoop();
            g_modelMatrix = popMatrix();
            }
            // stuffs
            
            
            //g_modelMatrix.translate(0, 0, 1);
            // ---------  Cloud start  ----------
            // ======   Randomly walking   =======
            {
            pushMatrix(g_modelMatrix);
                g_modelMatrix.scale(0.6, 0.6, 0.6);
                g_modelMatrix.rotate(g_angle11now * 2, 1, 0, 0);
                g_modelMatrix.rotate(g_angle11now, 0, 1, 0);
                g_modelMatrix.translate(-0.35, 0, 0);
    
                
                if(Math.abs(cloud_x - target_x) > 0.0001  || Math.abs(cloud_y - target_y) > 0.0001 || Math.abs(cloud_z - target_z) > 0.0001)
                {
                    cloud_x = cloud_x + a_x;
                    cloud_y = cloud_y + a_y;
                    cloud_z = cloud_z + a_z;
                    g_modelMatrix.translate(cloud_x, cloud_y, cloud_z);
                    
                } else {
                    setTarget();
                    g_modelMatrix.translate(cloud_x, cloud_y, cloud_z);
                }
                // console.log(target_x, target_y);
                // console.log(target_y);
                drawCloud();
                
            g_modelMatrix = popMatrix();
            }
            // -------  Cloud end  ------------
    
            
            // -------------  Dog  ----------------
            {
            if(g_yKmove > 0.1 && g_xKmove < 0.4 && SW && !Run)
            {
                Run = true;
                walk();
            }
            if((g_yKmove < 0.1 || g_xKmove > 0.4) && SW && Run)
            {
                Run = false;
                runForBone();
            }
    
            pushMatrix(g_modelMatrix);
                g_modelMatrix.scale(0.5,0.5,0.5);	
                g_modelMatrix.translate(0.0, -1.4, 0);
                drawDog();
            g_modelMatrix = popMatrix();
            }
            // ------------- END Dog ---------------
            
            // ------------- Bone -----------------
            {
            pushMatrix(g_modelMatrix);
                g_modelMatrix.translate(-0.6, -0.2, 0);	
                g_modelMatrix.translate(g_xKmove, g_yKmove, 0);	    
                // g_modelMatrix.rotate(40, 0, 0, 1);
                

                quatMatrix.setFromQuat(qTot.x, qTot.y, qTot.z, qTot.w);	// Quaternion-->Matrix
                g_modelMatrix.concat(quatMatrix);	// apply that matrix.
                
                if(keyPressed == "b" && !boneExist)
                {
                    keyPressed = "";
                    boneExist = true;
                }
                if(keyPressed == "b" && boneExist ) {
                    keyPressed = "";
                    boneExist = false;
                }
                
                if(boneExist)
                {
                    drawBone();
                }
            g_modelMatrix = popMatrix();
            }
        // -------------  END Bone  ---------------

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

    if(!cartoonish)
    {
        var curri = shaderIdx;
        testShader();
        if(curri != shaderIdx)
        {
            switchShader(shaderIdx);
        }
    }
    
    matCtl();
    controlLamps();
    setCamera();
    
    lightsPosCrl(); // update the light's position adjusted by user
    if(lamp0.isLit)
    {
        lightsColorCrl0();
    }
    if(lamp1.isLit)
    {
        lightsColorCrl1();
    }
    
    setLights();

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

    function runForBone() {
        g_angle0now = -20;       // init Current rotation angle, in degrees
        g_angle0rate = -60;       // init Rotation angle rate, in degrees/second.
        g_angle0min = -30;       // init min, max allowed angle, in degrees.
        g_angle0max = 60;
        // right front                                //---------------
        g_angle1now = -20; 			// init Current rotation angle, in degrees > 0
        g_angle1rate = -60;				// init Rotation angle rate, in degrees/second.
        g_angle1min = -30;       // init min, max allowed angle, in degrees
        g_angle1max = 60;
        // left back                                 //---------------
        g_angle2now = 20; 			// init Current rotation angle, in degrees.
        g_angle2rate = 60;				// init Rotation angle rate, in degrees/second.
        g_angle2min = -60;       // init min, max allowed angle, in degrees
        g_angle2max = 30;
        // right back
        g_angle3now = 20; 			// init Current rotation angle, in degrees.
        g_angle3rate = 60;				// init Rotation angle rate, in degrees/second.
        g_angle3min = -60;       // init min, max allowed angle, in degrees
        g_angle3max = 30;
    
        // right back
        g_angle4now = 0; 			// init Current rotation angle, in degrees.
        g_angle4rate = 40;				// init Rotation angle rate, in degrees/second.


        g_anglebody = 0;
        g_transheadx = 0.0;
        g_transheady = 0.0;
        g_frontlegs = 0.0;
        g_tail = 0.0;
    
        g_angle5now = 0;       // init Current rotation angle, in degrees
        g_angle5rate = -20;       // init Rotation angle rate, in degrees/second.
        g_angle5min = 10;       // init min, max allowed angle, in degrees.
        g_angle5max = 10;
        // right front                                //---------------
        g_angle6now = 0; 			// init Current rotation angle, in degrees > 0
        g_angle6rate = -20;				// init Rotation angle rate, in degrees/second.
        g_angle6min = 10;       // init min, max allowed angle, in degrees
        g_angle6max = 10;
        // left back                                 //---------------
        g_angle7now = 10 			// init Current rotation angle, in degrees.
        g_angle7rate = -30;				// init Rotation angle rate, in degrees/second.
        g_angle7min = 0;       // init min, max allowed angle, in degrees
        g_angle7max = 30;
        // right back
        g_angle8now = 10; 			// init Current rotation angle, in degrees.
        g_angle8rate = -30;				// init Rotation angle rate, in degrees/second.
        g_angle8min = 0;       // init min, max allowed angle, in degrees
        g_angle8max = 30;
        //front paws
        g_angle9now = 0 			// init Current rotation angle, in degrees.
        g_angle9rate = 10;				// init Rotation angle rate, in degrees/second.
        g_angle9min = 20;       // init min, max allowed angle, in degrees
        g_angle9max = 30;
        // back paws
        g_angle10now = 0; 			// init Current rotation angle, in degrees.
        g_angle10rate = 10;				// init Rotation angle rate, in degrees/second.
        g_angle10min = 20;       // init min, max allowed angle, in degrees
        g_angle10max = 30;
    
    }
    
    function walk() {
        g_angle0now = 30;       // init Current rotation angle, in degrees
        g_angle0rate = 20;       // init Rotation angle rate, in degrees/second.
        g_angle0min = -10;       // init min, max allowed angle, in degrees.
        g_angle0max = 30;
        // right front                                //---------------
        g_angle1now = -10; 			// init Current rotation angle, in degrees > 0
        g_angle1rate = -20;				// init Rotation angle rate, in degrees/second.
        g_angle1min = -10;       // init min, max allowed angle, in degrees
        g_angle1max = 30;
        // left back                                 //---------------
        g_angle2now = 0; 			// init Current rotation angle, in degrees.
        g_angle2rate = -20;				// init Rotation angle rate, in degrees/second.
        g_angle2min = -40;       // init min, max allowed angle, in degrees
        g_angle2max = 0;
        // right back
        g_angle3now = -40; 			// init Current rotation angle, in degrees.
        g_angle3rate = 20;				// init Rotation angle rate, in degrees/second.
        g_angle3min = -40;       // init min, max allowed angle, in degrees
        g_angle3max = 0;

        g_angle4now = 0; 			// init Current rotation angle, in degrees.
        g_angle4rate = 10;				// init Rotation angle rate, in degrees/second.
    
        g_anglebody = 0;
        g_transheadx = 0.0;
        g_transheady = 0.0;
        g_frontlegs = 0.0;
        g_tail = 0.0;
    
        g_angle5now = -10;       // init Current rotation angle, in degrees
        g_angle5rate = -10;       // init Rotation angle rate, in degrees/second.
        g_angle5min = 10;       // init min, max allowed angle, in degrees.
        g_angle5max = -10;
        // right front                                //---------------
        g_angle6now = 10; 			// init Current rotation angle, in degrees > 0
        g_angle6rate = 10;				// init Rotation angle rate, in degrees/second.
        g_angle6min = 10;       // init min, max allowed angle, in degrees
        g_angle6max = -10;
        // left back                                 //---------------
        g_angle7now = 10 			// init Current rotation angle, in degrees.
        g_angle7rate = 10;				// init Rotation angle rate, in degrees/second.
        g_angle7min = 10;       // init min, max allowed angle, in degrees
        g_angle7max = -10;
        // right back
        g_angle8now = -10; 			// init Current rotation angle, in degrees.
        g_angle8rate = -10;				// init Rotation angle rate, in degrees/second.
        g_angle8min = 10;       // init min, max allowed angle, in degrees
        g_angle8max = -10;
    
        g_angle9now = 0 			// init Current rotation angle, in degrees.
        g_angle9rate = 5;				// init Rotation angle rate, in degrees/second.
        g_angle9min = 0;       // init min, max allowed angle, in degrees
        g_angle9max = 20;
        // right back
        g_angle10now = 20; 			// init Current rotation angle, in degrees.
        g_angle10rate = 2;				// init Rotation angle rate, in degrees/second.
        g_angle10min = 20;       // init min, max allowed angle, in degrees
        g_angle10max = 28;
    }
    
    function sit() {
        g_angle0now = -10.0;
                g_angle1now = -10.0;
                g_angle2now = -60.0;
                g_angle3now = -60.0;
                g_angle5now = 0.0;
                g_angle6now = 0.0;
                g_angle7now = -20.0;
                g_angle8now = -20.0;
                g_angle9now = 10.0;
                g_angle10now = -30.0;
    
                g_anglebody = -50;
                g_transheadx = 0.15;
                g_transheady = 0.25;
                g_frontlegs = 0.1;
                g_tail = -0.2;
    
                g_angle0rate = 0.0;
                g_angle1rate = 0.0;
                g_angle2rate = 0.0;
                g_angle3rate = 0.0;
                g_angle5rate = 0.0;
                g_angle6rate = 0.0;
                g_angle7rate = 0.0;
                g_angle8rate = 0.0;
                g_angle9rate = 0.0;
                g_angle10rate = 0.0;

                g_angle4now = 0;
                g_angle4rate = 0;
    }
    
    function runStop() {
        // Called when user presses the 'Sit/Walk' button
        SW = (SW+1)%2; // !
        console.log("SW", SW);
    
        if(SW == 1)                 // walk
        {
            runForBone();
        } else if (SW == 0) {                   // sit
            sit();
        }
    
    }

    function change() {
        // Called when user presses the 'Sit/Walk' button
        SW = (SW+1)%2; // !
        console.log("SW", SW);
    
        if(SW == 1)                 // walk
        {
            runForBone();
        } else if (SW == 0) {                   // sit
            sit();
        }
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
    
    function myMouseDblClick(ev) {
        console.log("myMouse-DOUBLE-Click() on button: ", ev.button);
    }
    }
    // Key
    {
    function myKeyDown(kev) {

        

        console.log("--kev.code:", kev.code, "\t\t--kev.key:", kev.key,
            "\n--kev.ctrlKey:", kev.ctrlKey, "\t--kev.shiftKey:", kev.shiftKey,
            "\n--kev.altKey:", kev.altKey, "\t--kev.metaKey:", kev.metaKey);
    
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
        la_x = eye_x + direc_x;
        la_y = eye_y + direc_y;
        la_z = eye_z + direc_z;

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

function normByP(p1, p2, p3) {
    return normCalc(p1[0], p1[1], p1[2], p2[0], p2[1], p2[2], p3[0], p3[1], p3[2],);
}

function myInitShaders(VSHADER, FSHADER, name, idx) {
    shaderLoc[idx] = createProgram(gl, VSHADER, FSHADER);
    if (!shaderLoc[idx]) {
        console.log('Failed to create ', name);
        return false;
    }

    gl.useProgram(shaderLoc[idx]);
    gl.program = shaderLoc[idx];	

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

    {
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

        lamp1.u_pos[idx]  = gl.getUniformLocation(gl.program, 'u_LampSet[1].pos');	
        lamp1.u_ambi[idx] = gl.getUniformLocation(gl.program, 'u_LampSet[1].ambi');
        lamp1.u_diff[idx] = gl.getUniformLocation(gl.program, 'u_LampSet[1].diff');
        lamp1.u_spec[idx] = gl.getUniformLocation(gl.program, 'u_LampSet[1].spec');
        if( !lamp1.u_pos[idx] || !lamp1.u_ambi[idx] || !lamp1.u_diff[idx] || !lamp1.u_spec[idx] ) {
            console.log('Failed to get GPUs Lamp1 storage locations for ', name);
            return;
        }
    }

    // For Materials: 
    {
        // ... for Phong material/reflectance:
        matl0.uLoc_Ke[idx] = gl.getUniformLocation(gl.program, 'u_MatlSet[0].emit');
        matl0.uLoc_Ka[idx] = gl.getUniformLocation(gl.program, 'u_MatlSet[0].ambi');
        matl0.uLoc_Kd[idx] = gl.getUniformLocation(gl.program, 'u_MatlSet[0].diff');
        matl0.uLoc_Ks[idx] = gl.getUniformLocation(gl.program, 'u_MatlSet[0].spec');
        matl0.uLoc_Kshiny[idx] = gl.getUniformLocation(gl.program, 'u_MatlSet[0].shiny');

        matl0.uLoc_Kori[idx] = gl.getUniformLocation(gl.program, 'u_MatlSet[0].ori');

        if(!matl0.uLoc_Ke[idx] || !matl0.uLoc_Ka[idx] || !matl0.uLoc_Kd[idx] || !matl0.uLoc_Ks[idx] || !matl0.uLoc_Kshiny[idx] || !matl0.uLoc_Kori[idx]) {
            console.log('Failed to get GPUs Reflectance matl0 storage locationsfor ', name);
            return;
        }
        
    }

    eyePosWorld.set([eye_x, eye_y, eye_z]);
	gl.uniform3fv(uLoc_eyePosWorld[idx], eyePosWorld);// use it to set our uniform

    console.log("Init shader ", name, " Successfully");
}

function setLights() {

    lamp0.I_pos.elements.set(lamp0pos);
    lamp0.I_ambi.elements.set(lamp0ambi);   // color rgb
    lamp0.I_diff.elements.set(lamp0diff);
    lamp0.I_spec.elements.set(lamp0spec);

    gl.uniform3fv(lamp0.u_pos[shaderIdx],  lamp0.I_pos.elements.slice(0,3));
    gl.uniform3fv(lamp0.u_ambi[shaderIdx], lamp0.I_ambi.elements);		// ambient
    gl.uniform3fv(lamp0.u_diff[shaderIdx], lamp0.I_diff.elements);		// diffuse
    gl.uniform3fv(lamp0.u_spec[shaderIdx], lamp0.I_spec.elements);		// Specular

    lamp1.I_pos.elements.set(lamp1pos);
    lamp1.I_ambi.elements.set(lamp1ambi);   // color rgb
    lamp1.I_diff.elements.set(lamp1diff);
    lamp1.I_spec.elements.set(lamp1spec);

    gl.uniform3fv(lamp1.u_pos[shaderIdx],  lamp1.I_pos.elements.slice(0,3));
    gl.uniform3fv(lamp1.u_ambi[shaderIdx], lamp1.I_ambi.elements);		// ambient
    gl.uniform3fv(lamp1.u_diff[shaderIdx], lamp1.I_diff.elements);		// diffuse
    gl.uniform3fv(lamp1.u_spec[shaderIdx], lamp1.I_spec.elements);		// Specular
}

function setMatrials() {
    matl0.setMatl(matlSel[matidx]);	
    //---------------For the Material object(s):
	gl.uniform3fv(matl0.uLoc_Ke[shaderIdx], matl0.K_emit.slice(0,3));				// Ke emissive
	gl.uniform3fv(matl0.uLoc_Ka[shaderIdx], matl0.K_ambi.slice(0,3));				// Ka ambient
    gl.uniform3fv(matl0.uLoc_Kd[shaderIdx], matl0.K_diff.slice(0,3));				// Kd	diffuse
	gl.uniform3fv(matl0.uLoc_Ks[shaderIdx], matl0.K_spec.slice(0,3));				// Ks specular
	gl.uniform1i(matl0.uLoc_Kshiny[shaderIdx], parseInt(matl0.K_shiny, 10));     // Kshiny 

    gl.uniform1f(matl0.uLoc_Kori[shaderIdx], matl0.K_ori);     // Kshiny 
}

// used in every loop of drawAll() since camera is always moving
function setCamera() {
    gl.uniform3fv(uLoc_eyePosWorld[shaderIdx], [eye_x, eye_y, eye_z]);// use it to set our uniform
}

// change shader + init vertexbuffer
function switchShader() {
    gl.useProgram(shaderLoc[shaderIdx]);
    gl.program = shaderLoc[shaderIdx];	
    console.log("Switch shader to ", shaderIdx," successfully!");

    bindVertBuff(vert);
    console.log("Vertecies binded successfully!");
}


/// shader swithcing functions:
{
    // html button function
    function resetDefaultShader() {
        if(!cartoonish)
        {
            shaderIdxBF = shaderIdx;
            shaderIdx = 0;
            switchShader();
            console.log("switch to shader 0 --> Cartoonish shader");
            cartoonish = true;
        } 
        else if(cartoonish) {
            console.log("before", shaderIdx);
            testShader();
            console.log("before", shaderIdx);
            console.log("switch to shader", shaderIdx);
            switchShader();

            cartoonish = false;
        }
    }

    function testShader() {
        
        var vals = shadeM.value;
        var vall = LightM.value;

        if(vals == "p_S" && vall == "bp_L")
        {
            shaderIdx = 1;
        } 
        else if (vals == "p_S" && vall == "p_L") 
        {
            shaderIdx = 3;
        } 
        else if (vals == "g_S" && vall == "bp_L") 
        {
            shaderIdx = 2;
        } 
        else if (vals == "g_S" && vall == "p_L") 
        {
            shaderIdx = 4;
        }
    }
}

// Light setting functions:
{
    function lightsPosCrl() {

        var pos0x = document.getElementById('dMleft').value;
        var pos0y = document.getElementById('dMfwd').value;
        var pos0z = document.getElementById('dMup').value;
        lamp0pos = [pos0x, pos0y, pos0z];

        var pos1x = document.getElementById('pMdown').value;
        var pos1y = document.getElementById('pMfwd').value;
        var pos1z = document.getElementById('pMup').value;
        lamp1pos = [pos1x, pos1y, pos1z];

    }

    function lightsColorCrl0() {

        var a0r = document.getElementById('dRa').value;
        var a0g = document.getElementById('dGa').value;
        var a0b = document.getElementById('dBa').value;

        var d0r = document.getElementById('dRd').value;
        var d0g = document.getElementById('dGd').value;
        var d0b = document.getElementById('dBd').value;

        var s0r = document.getElementById('dRs').value;
        var s0g = document.getElementById('dGs').value;
        var s0b = document.getElementById('dBs').value;

        var a0 = document.getElementById('directA').value;
        var d0 = document.getElementById('directD').value;
        var r0 = document.getElementById('directS').value;

        if( a0 == "dao" )
        {
            lamp0ambi = [ a0r, a0g, a0b];
        } else {
            lamp0ambi = [ 0, 0, 0];
        }

        if( d0 == "ddo" )
        {
            lamp0diff = [ d0r, d0g, d0b];
        } else {
            lamp0diff = [ 0, 0, 0];
        }
        if( r0 == "dso" )
        {
            lamp0spec = [ s0r, s0g, s0b];
        } else {
            lamp0spec = [ 0, 0, 0];
        }
    }

    function lightsColorCrl1() {

        var a1r = document.getElementById('pRa').value;
        var a1g = document.getElementById('pGa').value;
        var a1b = document.getElementById('pBa').value;

        var d1r = document.getElementById('pRd').value;
        var d1g = document.getElementById('pGd').value;
        var d1b = document.getElementById('pBd').value;

        var s1r = document.getElementById('pRs').value;
        var s1g = document.getElementById('pGs').value;
        var s1b = document.getElementById('pBs').value;

        var a1 = document.getElementById('pointA').value;
        var d1 = document.getElementById('pointD').value;
        var r1 = document.getElementById('pointS').value;

        if( a1 == "pao" )
        {
            lamp1ambi = [ a1r, a1g, a1b];
        } else {
            lamp1ambi = [ 0, 0, 0];
        }

        if( d1 == "pdo" )
        {
            lamp1diff = [ d1r, d1g, d1b];
        } else {
            lamp1diff = [ 0, 0, 0];
        }
        if( r1 == "pso" )
        {
            lamp1spec = [ s1r, s1g, s1b];
        } else {
            lamp1spec = [ 0, 0, 0];
        }

    }

    //control on and off
    function controlLamps() {
        var l0on = lamp0L.value;
        var l1on = lamp1L.value;

        if(l0on == "do" && !lamp0.isLit)
        {
            lamp0.isLit = true;
            resetl0 = true;
        } else if(l0on == "dx" && lamp0.isLit) {
            // turn off
            lamp0.isLit = false;
            resetl0 = true;

            lamp0ambi = [ 0, 0, 0];
            lamp0diff = [ 0, 0, 0];
            lamp0spec = [ 0, 0, 0];

            console.log(shaderIdx);
        }

        if(l1on == "po" && !lamp1.isLit)
        {
            lamp1.isLit = true;
            resetl1 = true;
        } else if(l1on == "px" && lamp1.isLit) {
            lamp1.isLit = false;
            resetl1 = true;

            lamp1ambi = [ 0, 0, 0];
            lamp1diff = [ 0, 0, 0];
            lamp1spec = [ 0, 0, 0];
        }

    }


}
// material setting functions:
{
    function matCtl() {
        var sM = document.getElementById('sphereM').value;
        var lM = document.getElementById('loopM').value;
        var bM = document.getElementById('boneM').value;
        var cM = document.getElementById('cloudM').value;
        var dM = document.getElementById('dogM').value;

        if(sM == "1")
        {
            matSphere = 4;
        } else if(sM == "2") {
            matSphere = 3;
        } else if(sM == "3") {
            matSphere = 2;
        } else if(sM == "4") {
            matSphere = 1;
        } else if(sM == "5") {
            matSphere = 0;
        }


        if(lM == "1")
        {
            matLoop = 4;
        } else if(lM == "2") {
            matLoop = 3;
        } else if(lM == "3") {
            matLoop = 2;
        } else if(lM == "4") {
            matLoop = 1;
        } else if(lM == "5") {
            matLoop = 0;
        }

        if(bM == "1")
        {
            matBone = 4;
        } else if(bM == "2") {
            matBone = 3;
        } else if(bM == "3") {
            matBone = 2;
        } else if(bM == "4") {
            matBone = 1;
        } else if(bM == "5") {
            matBone = 0;
        }

        if(cM == "1")
        {
            matCloud = 4;
        } else if(cM == "2") {
            matCloud = 3;
        } else if(cM == "3") {
            matCloud = 2;
        } else if(cM == "4") {
            matCloud = 1;
        } else if(cM == "5") {
            matCloud = 0;
        }

        if(dM == "1")
        {
            matDog = 4;
        } else if(dM == "2") {
            matDog = 3;
        } else if(dM == "3") {
            matDog = 2;
        } else if(dM == "4") {
            matDog = 1;
        } else if(dM == "5") {
            matDog = 0;
        }

    }
}