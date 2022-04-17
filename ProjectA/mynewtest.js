// These is the test js file with newtest.html
// By Sylvia Li in Northwestern U, Mudd lib

// Vertex shader prog
var VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +
    'attribute vec4 a_Color;\n' +
    'varying vec4 v_Color;\n' +
    'uniform mat4 u_modelMatrix;\n' +
    'void main() {\n' +
    '  gl_Position = u_modelMatrix * a_Position;\n' +
    '  v_Color = a_Color;\n' +
    '}\n';

// Fragment shader prog
var FSHADER_SOURCE =
//  '#ifdef GL_ES\n' +					
'precision mediump float;\n' +
//  '#endif GL_ES\n' +
  'varying vec4 v_Color;\n' +
    'void main() {\n' +
    '  gl_FragColor = v_Color;\n' +
    '}\n';

var gl;
var g_modelMatrix;
var g_vertCount;
var uLoc_modelMatrix;

// For animation:---------------------
var g_lastMS = Date.now();			
  // All of our time-dependent params (you can add more!)
                                //---------------
var g_angle0now  =   0.0;       // init Current rotation angle, in degrees
var g_angle0rate = -22.0;       // init Rotation angle rate, in degrees/second.
var g_angle0brake=	 1.0;				// init Speed control; 0=stop, 1=full speed.
var g_angle0min  =-140.0;       // init min, max allowed angle, in degrees.
var g_angle0max  =  40.0;
                                //---------------
var g_angle1now  =   0.0; 			// init Current rotation angle, in degrees > 0
var g_angle1rate =  64.0;				// init Rotation angle rate, in degrees/second.
var g_angle1brake=	 1.0;				// init Rotation start/stop. 0=stop, 1=full speed.
var g_angle1min  = -80.0;       // init min, max allowed angle, in degrees
var g_angle1max  =  80.0;
                                //---------------
var g_angle2now  =   0.0; 			// init Current rotation angle, in degrees.
var g_angle2rate =  89.0;				// init Rotation angle rate, in degrees/second.
var g_angle2brake=	 1.0;				// init Speed control; 0=stop, 1=full speed.
var g_angle2min  = -40.0;       // init min, max allowed angle, in degrees
var g_angle2max  = -20.0;			

var g_angle3now  =   0.0; 			// init Current rotation angle, in degrees.
var g_angle3rate =  31.0;				// init Rotation angle rate, in degrees/second.
var g_angle3brake=	 1.0;				// init Speed control; 0=stop, 1=full speed.
var g_angle3min  = -40.0;       // init min, max allowed angle, in degrees
var g_angle3max  =  40.0;			
// YOU can add more time-varying params of your own here -- try it!
// For example, could you add angle3, have it run without limits, and
// use sin(angle3) to slowly translate the robot-arm base horizontally,
// moving back-and-forth smoothly and sinusoidally?

function main() {
    // Retrieve <canvas> element
    var g_canvasID = document.getElementById('webgl');
    
    // Get the rendering context for WebGL
    gl = g_canvasID.getContext("webgl", { preserveDrawingBuffer: true});
    if(!gl) {
        console.log('Failed to get the rendering context for WebGL. Bye!');
        return;
    }

    //Initialize shaders
    if(!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('Failed to initialize shaders.');
        return;
    }

    // VBO creating
    var myErr = initVertexBuffers();
    if (myErr < 0) {
        console.log('Failed to set the positions of the vertices');
        return;
    }

    gl.clearColor(3,0,2,0.3);   // stored in gl.COLOR_BUFFER_BIT

    g_modelMatrix = new Matrix4();

    uLoc_modelMatrix = gl.getUniformLocation(gl.program, 'u_modelMatrix');
    if (!uLoc_modelMatrix) {
        console.log('Failed to get the storage location of u_modelMatrix');
        return;
    }

    var tick = function() {
        requestAnimationFrame(tick, g_canvasID);
        timerAll();
        drawAll();
    }

    tick();
    // drawAll();
}

function timerAll() {
    //=============================================================================
    // Find new values for all time-varying parameters used for on-screen drawing.
    // HINT: this is ugly, repetive code!  Could you write a better version?
    // 			 would it make sense to create a 'timer' or 'animator' class? Hmmmm...
    //
      // use local variables to find the elapsed time:
      var nowMS = Date.now();             // current time (in milliseconds)
      var elapsedMS = nowMS - g_lastMS;   // 
      g_lastMS = nowMS;                   // update for next webGL drawing.
      if(elapsedMS > 1000.0) {            
        // Browsers won't re-draw 'canvas' element that isn't visible on-screen 
        // (user chose a different browser tab, etc.); when users make the browser
        // window visible again our resulting 'elapsedMS' value has gotten HUGE.
        // Instead of allowing a HUGE change in all our time-dependent parameters,
        // let's pretend that only a nominal 1/30th second passed:
        elapsedMS = 1000.0/30.0;
        }
      // Find new time-dependent parameters using the current or elapsed time:
      g_angle0now += g_angle0rate * g_angle0brake * (elapsedMS * 0.001);	// update.
      g_angle1now += g_angle1rate * g_angle1brake * (elapsedMS * 0.001);
      g_angle2now += g_angle2rate * g_angle2brake * (elapsedMS * 0.001);
      // apply angle limits:  going above max, or below min? reverse direction!
      // (!CAUTION! if max < min, then these limits do nothing...)
      if((g_angle0now >= g_angle0max && g_angle0rate > 0) || // going over max, or
           (g_angle0now <= g_angle0min && g_angle0rate < 0)  ) // going under min ?
           g_angle0rate *= -1;	// YES: reverse direction.
      if((g_angle1now >= g_angle1max && g_angle1rate > 0) || // going over max, or
           (g_angle1now <= g_angle1min && g_angle1rate < 0) )	 // going under min ?
           g_angle1rate *= -1;	// YES: reverse direction.
      if((g_angle2now >= g_angle2max && g_angle2rate > 0) || // going over max, or
           (g_angle2now <= g_angle2min && g_angle2rate < 0) )	 // going under min ?
           g_angle2rate *= -1;	// YES: reverse direction.
      if((g_angle3now >= g_angle3max && g_angle3rate > 0) || // going over max, or
           (g_angle3now <= g_angle3min && g_angle3rate < 0) )	 // going under min ?
           g_angle3rate *= -1;	// YES: reverse direction.
        // *NO* limits? Don't let angles go to infinity! cycle within -180 to +180.
        if(g_angle0min > g_angle0max)	
        {// if min and max don't limit the angle, then
            if(     g_angle0now < -180.0) g_angle0now += 360.0;	// go to >= -180.0 or
            else if(g_angle0now >  180.0) g_angle0now -= 360.0;	// go to <= +180.0
        }
        if(g_angle1min > g_angle1max)
        {
            if(     g_angle1now < -180.0) g_angle1now += 360.0;	// go to >= -180.0 or
            else if(g_angle1now >  180.0) g_angle1now -= 360.0;	// go to <= +180.0
        }
        if(g_angle2min > g_angle2max)
        {
            if(     g_angle2now < -180.0) g_angle2now += 360.0;	// go to >= -180.0 or
            else if(g_angle2now >  180.0) g_angle2now -= 360.0;	// go to <= +180.0
        }
        if(g_angle3min > g_angle3max)
        {
            if(     g_angle3now < -180.0) g_angle3now += 360.0;	// go to >= -180.0 or
            else if(g_angle3now >  180.0) g_angle3now -= 360.0;	// go to <= +180.0
        }
    }

function initVertexBuffers() {

    // vertices information
    var vertices = new Float32Array ([
        0.00, 0.30, 0.00, 1.00, 1.0, 0.0, 0.0,
        -0.50, 0.00, 0.00, 1.00, 1.0, 0.0, 0.0,
        0.50, 0.00, 0.00, 1.00, 1.0, 0.0, 0.0,

        0.00, -0.30, 0.00, 1.00, 1.0, 1.0, 0.0,
        -0.50, 0.00, 0.00, 1.00, 1.0, 1.0, 0.0,
        0.50, 0.00, 0.00, 1.00, 1.0, 1.0, 0.0

        -0.50, 0.00, 0.00, 1.00, 0.0, 0.0, 1.0,
        -0.50, 0.15, 0.00, 1.00, 0.0, 0.0, 1.0,
        -0.40, 0.20, 0.00, 1.00, 0.0, 0.0, 1.0,

        0.50, 0.00, 0.00, 1.00, 0.0, 1.0, 0.0,
        0.50, 0.15, 0.00, 1.00, 0.0, 1.0, 0.0,
        0.40, 0.20, 0.00, 1.00, 0.0, 1.0, 0.0,
    ]);
    g_vertCount = 12;

    // create a buffer in GPU, its ID is vertexBufferID
    var vertexBufferID = gl.createBuffer();
    if (!vertexBufferID) {
        console.log('Failed to create the buffer object');
        return -1;
    }
    

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBufferID);     // bind the buffer with gl

    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);   // store the vertices' information in buffer from gl

    var FSIZE = vertices.BYTES_PER_ELEMENT;
    var aLoc_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if(aLoc_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return -2;
    }

    gl.vertexAttribPointer(aLoc_Position, 4, gl.FLOAT, false, FSIZE * 7, 0);

    gl.enableVertexAttribArray(aLoc_Position);

    var a_Color = gl.getAttribLocation(gl.program, 'a_Color');

    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 7, FSIZE * 4);
    gl.enableVertexAttribArray(a_Color);


 

    return 0;
}

function drawBody() {
    
    // vertices information
    var v1 = [-0.3, 0.15, 0.05, 1.0, 1.0, 0.0, 0.0,];
    var v2 = [-0.3, 0.0, 0.05, 1.0, 1.0, 1.0, 0.0,];
    var v3 = [-0.3, 0.1, -0.1, 1.0, 1.0, 1.0, 1.0,];
    var v4 = [-0.2, -0.1, 0.1, 1.0, 0.0, 1.0, 0.0,];
    var v5 = [0.3, 0.1, 0.1, 1.0, 0.0, 1.0, 1.0,];
    var v6 = [0.3, -0.1, 0.1, 1.0, 0.0, 0.0, 1.0,];
    var v7 = [0.3, 0.1, -0.1, 1.0, 0.0, 0.0, 0.0,];
    var v8 = [0.3, -0.1, -0.1, 1.0, 1.0, 0.0, 0.0,];
    var v9 = [-0.2, 0.1, -0.1, 1.0, 1.0, 1.0, 0.0,];
    var v10 = [-0.2, -0.1, -0.1, 1.0, 1.0, 1.0, 1.0,];
    var v11 = [-0.3, 0.15, -0.05, 1.0, 0.0, 1.0, 0.0,];
    var v12 = [-0.3, 0.0, -0.05, 1.0, 0.0, 0.0, 1.0,];

    var vertices = new Float32Array ( Array.prototype.concat.call(
        v1, v2, v4,
        v1, v4, v3,

        v3, v4, v6,
        v3, v6, v5,

        v5, v6, v8,
        v5, v8, v7,

        v7, v8, v9,
        v9, v8, v10,

        v9, v10, v11,
        v10, v11, v12,

        v11, v12, v1,
        v1, v12, v2,

        v11, v1, v3,
        v11, v3, v9,

        v9, v3, v5,
        v9, v5, v7,

        v12, v2, v4,
        v12, v4, v10,

        v10, v4, v6,
        v10, v6, v8,
        ));

    g_vertCount = 60;

    // create a buffer in GPU, its ID is vertexBufferID
    var vertexBufferID = gl.createBuffer();
    if (!vertexBufferID) {
        console.log('Failed to create the buffer object');
        return -1;
    }
    

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBufferID);     // bind the buffer with gl

    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);   // store the vertices' information in buffer from gl

    var FSIZE = vertices.BYTES_PER_ELEMENT;
    var aLoc_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if(aLoc_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return -2;
    }

    gl.vertexAttribPointer(aLoc_Position, 4, gl.FLOAT, false, FSIZE * 7, 0);

    gl.enableVertexAttribArray(aLoc_Position);

    var a_Color = gl.getAttribLocation(gl.program, 'a_Color');

    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 7, FSIZE * 4);
    gl.enableVertexAttribArray(a_Color);

    return 0;
}

function drawHead() {
    // vertices information
    var v1 = [-0.6, 0.05, 0.05, 1.0, 1.0, 0.0, 0.0,];
    var v2 = [-0.6, 0.05, -0.05, 1.0, 1.0, 0.0, 0.0,];
    var v3 = [-0.6, -0.03, 0.05, 1.0, 1.0, 0.0, 0.0,];
    var v4 = [-0.6, -0.03, -0.05, 1.0, 1.0, 0.0, 0.0,];

    var v5 = [-0.5, 0.05, 0.05, 1.0, 0.0, 1.0, 0.0,];
    var v6 = [-0.5, 0.05, -0.05, 1.0, 0.0, 1.0, 0.0,];
    
    var v7 = [-0.45, 0.2, 0.15, 1.0, 0.0, 1.0, 0.0,];
    var v8 = [-0.45, -0.05, 0.15, 1.0, 0.0, 1.0, 0.0,];
    var v9 = [-0.3, -0.05, 0.15, 1.0, 0.0, 0.0, 1.0,];
    var v10 = [-0.3, 0.2, 0.15, 1.0, 0.0, 0.0, 1.0,];

    var v11 = [-0.3, -0.05, -0.15, 1.0, 0.0, 0.0, 1.0,];
    var v12 = [-0.3, 0.2, -0.15, 1.0, 0.0, 0.0, 1.0,];
    var v13 = [-0.45, 0.2, -0.15, 1.0, 0.0, 1.0, 0.0,];
    var v14 = [-0.45, -0.05, -0.15, 1.0, 0.0, 1.0, 0.0,];

    var v15 = [-0.4, 0.3, 0.1, 1.0,  1.0, 1.0, 0.0,];
    var v16 = [-0.4, 0.3, -0.1, 1.0, 1.0, 1.0, 0.0,];

    var v17 = [-0.4, 0.2, 0.05, 1.0, 1.0, 1.0, 0.0,];
    var v18 = [-0.4, 0.2, -0.05, 1.0,  1.0, 1.0, 0.0,];

    var vertices = new Float32Array ( Array.prototype.concat.call(
        //face
        v1, v3, v5,
        v3, v5, v8,
        v5, v7, v8,
        v5, v7, v6,
        v7, v6, v13,
        v6, v13, v14,
        v4, v6, v14,
        v2, v4, v6,
        v1, v3, v4,
        v1, v2, v4,
        //head
        v7, v8, v10,
        v8, v10, v9,
        v10, v9, v11,
        v10, v11, v12,
        v13, v12, v14,
        v12, v14, v11,
        v14, v9, v11,
        v8, v9, v14,
        v7, v10, v12,
        v7, v12, v13,
        // ears
        v7, v15, v17,
        v10, v15, v17,

        v13, v16, v18,
        v12, v16, v18,
        ));

    g_vertCount = 72;

    // create a buffer in GPU, its ID is vertexBufferID
    var vertexBufferID = gl.createBuffer();
    if (!vertexBufferID) {
        console.log('Failed to create the buffer object');
        return -1;
    }
    

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBufferID);     // bind the buffer with gl

    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);   // store the vertices' information in buffer from gl

    var FSIZE = vertices.BYTES_PER_ELEMENT;
    var aLoc_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if(aLoc_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return -2;
    }

    gl.vertexAttribPointer(aLoc_Position, 4, gl.FLOAT, false, FSIZE * 7, 0);

    gl.enableVertexAttribArray(aLoc_Position);

    var a_Color = gl.getAttribLocation(gl.program, 'a_Color');

    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 7, FSIZE * 4);
    gl.enableVertexAttribArray(a_Color);

    return 0;
}

function drawfrontThighs() {
    
    // vertices information
    var v1 = [0.0, 0.0, 0.05, 1.0, 1.0, 0.0, 0.0,];
    var v2 = [0.0, -0.15, 0.05, 1.0, 1.0, 1.0, 0.0,];
    var v3 = [0.05, -0.15, 0.05, 1.0, 1.0, 1.0, 1.0,];
    var v4 = [0.1, 0.0, 0.05, 1.0, 0.0, 1.0, 0.0,];
    var v5 = [0.05, -0.15, 0.0, 1.0, 0.0, 1.0, 1.0,];
    var v6 = [0.1, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0,];
    var v7 = [0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0,];
    var v8 = [0.0, -0.15, 0.0, 1.0, 1.0, 0.0, 0.0,];
    

    var vertices = new Float32Array ( Array.prototype.concat.call(
        v1, v2, v8,
        v1, v8, v7,

        v1, v2, v3,
        v1, v3, v4,

        v3, v4, v5,
        v4, v5, v6,

        v7, v5, v8,
        v7, v6, v5,

        v7, v1, v4,
        v7, v4, v6,

        v2, v8, v3,
        v8, v5, v3,
        ));

    g_vertCount = 36;

    // create a buffer in GPU, its ID is vertexBufferID
    var vertexBufferID = gl.createBuffer();
    if (!vertexBufferID) {
        console.log('Failed to create the buffer object');
        return -1;
    }
    

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBufferID);     // bind the buffer with gl

    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);   // store the vertices' information in buffer from gl

    var FSIZE = vertices.BYTES_PER_ELEMENT;
    var aLoc_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if(aLoc_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return -2;
    }

    gl.vertexAttribPointer(aLoc_Position, 4, gl.FLOAT, false, FSIZE * 7, 0);

    gl.enableVertexAttribArray(aLoc_Position);

    var a_Color = gl.getAttribLocation(gl.program, 'a_Color');

    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 7, FSIZE * 4);
    gl.enableVertexAttribArray(a_Color);

    return 0;
}

function drawfrontcalves() {
    
    // vertices information
    var v1 = [0.0, 0.0, 0.05, 1.0, 1.0, 0.0, 0.0,];
    var v2 = [0.0, -0.15, 0.05, 1.0, 1.0, 1.0, 0.0,];
    var v3 = [0.025, -0.15, 0.05, 1.0, 1.0, 1.0, 1.0,];
    var v4 = [0.05, 0.0, 0.05, 1.0, 0.0, 1.0, 0.0,];
    var v5 = [0.025, -0.15, 0.0, 1.0, 0.0, 1.0, 1.0,];
    var v6 = [0.05, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0,];
    var v7 = [0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0,];
    var v8 = [0.0, -0.15, 0.0, 1.0, 1.0, 0.0, 0.0,];
    

    var vertices = new Float32Array ( Array.prototype.concat.call(
        v1, v2, v8,
        v1, v8, v7,

        v1, v2, v3,
        v1, v3, v4,

        v3, v4, v5,
        v4, v5, v6,

        v7, v5, v8,
        v7, v6, v5,

        v7, v1, v4,
        v7, v4, v6,

        v2, v8, v3,
        v8, v5, v3,
        ));

    g_vertCount = 36;

    // create a buffer in GPU, its ID is vertexBufferID
    var vertexBufferID = gl.createBuffer();
    if (!vertexBufferID) {
        console.log('Failed to create the buffer object');
        return -1;
    }
    

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBufferID);     // bind the buffer with gl

    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);   // store the vertices' information in buffer from gl

    var FSIZE = vertices.BYTES_PER_ELEMENT;
    var aLoc_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if(aLoc_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return -2;
    }

    gl.vertexAttribPointer(aLoc_Position, 4, gl.FLOAT, false, FSIZE * 7, 0);

    gl.enableVertexAttribArray(aLoc_Position);

    var a_Color = gl.getAttribLocation(gl.program, 'a_Color');

    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 7, FSIZE * 4);
    gl.enableVertexAttribArray(a_Color);

    return 0;
}

function drawbackThighs() {
    
    // vertices information
    var v1 = [0.0, 0.0, 0.05, 1.0, 1.0, 0.0, 0.0,];
    var v2 = [0.2, -0.15, 0.05, 1.0, 1.0, 1.0, 0.0,];
    var v3 = [0.3, -0.15, 0.05, 1.0, 1.0, 1.0, 1.0,];
    var v4 = [0.2, 0.0, 0.05, 1.0, 0.0, 1.0, 0.0,];
    var v5 = [0.3, -0.15, 0.0, 1.0, 0.0, 1.0, 1.0,];
    var v6 = [0.2, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0,];
    var v7 = [0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0,];
    var v8 = [0.2, -0.15, 0.0, 1.0, 1.0, 0.0, 0.0,];
    

    var vertices = new Float32Array ( Array.prototype.concat.call(
        v1, v2, v8,
        v1, v8, v7,

        v1, v2, v3,
        v1, v3, v4,

        v3, v4, v5,
        v4, v5, v6,

        v7, v5, v8,
        v7, v6, v5,

        v7, v1, v4,
        v7, v4, v6,

        v2, v8, v3,
        v8, v5, v3,
        ));

    g_vertCount = 36;

    // create a buffer in GPU, its ID is vertexBufferID
    var vertexBufferID = gl.createBuffer();
    if (!vertexBufferID) {
        console.log('Failed to create the buffer object');
        return -1;
    }
    

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBufferID);     // bind the buffer with gl

    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);   // store the vertices' information in buffer from gl

    var FSIZE = vertices.BYTES_PER_ELEMENT;
    var aLoc_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if(aLoc_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return -2;
    }

    gl.vertexAttribPointer(aLoc_Position, 4, gl.FLOAT, false, FSIZE * 7, 0);

    gl.enableVertexAttribArray(aLoc_Position);

    var a_Color = gl.getAttribLocation(gl.program, 'a_Color');

    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 7, FSIZE * 4);
    gl.enableVertexAttribArray(a_Color);

    return 0;
}

function drawbackcalves() {
    
    // vertices information
    var v1 = [0.05, 0.0, 0.05, 1.0, 1.0, 0.0, 0.0,];
    var v2 = [0.0, -0.15, 0.05, 1.0, 1.0, 1.0, 0.0,];
    var v3 = [0.05, -0.15, 0.05, 1.0, 1.0, 1.0, 1.0,];
    var v4 = [0.15, 0.0, 0.05, 1.0, 0.0, 1.0, 0.0,];
    var v5 = [0.05, -0.15, 0.0, 1.0, 0.0, 1.0, 1.0,];
    var v6 = [0.15, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0,];
    var v7 = [0.05, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0,];
    var v8 = [0.05, -0.15, 0.0, 1.0, 1.0, 0.0, 0.0,];
    

    var vertices = new Float32Array ( Array.prototype.concat.call(
        v1, v2, v8,
        v1, v8, v7,

        v1, v2, v3,
        v1, v3, v4,

        v3, v4, v5,
        v4, v5, v6,

        v7, v5, v8,
        v7, v6, v5,

        v7, v1, v4,
        v7, v4, v6,

        v2, v8, v3,
        v8, v5, v3,
        ));

    g_vertCount = 36;

    // create a buffer in GPU, its ID is vertexBufferID
    var vertexBufferID = gl.createBuffer();
    if (!vertexBufferID) {
        console.log('Failed to create the buffer object');
        return -1;
    }
    

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBufferID);     // bind the buffer with gl

    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);   // store the vertices' information in buffer from gl

    var FSIZE = vertices.BYTES_PER_ELEMENT;
    var aLoc_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if(aLoc_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return -2;
    }

    gl.vertexAttribPointer(aLoc_Position, 4, gl.FLOAT, false, FSIZE * 7, 0);

    gl.enableVertexAttribArray(aLoc_Position);

    var a_Color = gl.getAttribLocation(gl.program, 'a_Color');

    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 7, FSIZE * 4);
    gl.enableVertexAttribArray(a_Color);

    return 0;
}

function drawPaws() {
    
    // vertices information
    var v1 = [0.0, 0.0, 0.05, 1.0, 1.0, 0.0, 0.0,];
    var v2 = [0.0, -0.05, 0.05, 1.0, 1.0, 1.0, 0.0,];
    var v3 = [0.1, -0.05, 0.05, 1.0, 1.0, 1.0, 1.0,];
    var v4 = [0.1, 0.0, 0.05, 1.0, 0.0, 1.0, 0.0,];
    var v5 = [0.1, -0.05, 0.0, 1.0, 0.0, 1.0, 1.0,];
    var v6 = [0.1, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0,];
    var v7 = [0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0,];
    var v8 = [0.0, -0.05, 0.0, 1.0, 1.0, 0.0, 0.0,];
    

    var vertices = new Float32Array ( Array.prototype.concat.call(
        v1, v2, v8,
        v1, v8, v7,

        v1, v2, v3,
        v1, v3, v4,

        v3, v4, v5,
        v4, v5, v6,

        v7, v5, v8,
        v7, v6, v5,

        v7, v1, v4,
        v7, v4, v6,

        v2, v8, v3,
        v8, v5, v3,
        ));

    g_vertCount = 36;

    // create a buffer in GPU, its ID is vertexBufferID
    var vertexBufferID = gl.createBuffer();
    if (!vertexBufferID) {
        console.log('Failed to create the buffer object');
        return -1;
    }
    

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBufferID);     // bind the buffer with gl

    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);   // store the vertices' information in buffer from gl

    var FSIZE = vertices.BYTES_PER_ELEMENT;
    var aLoc_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if(aLoc_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return -2;
    }

    gl.vertexAttribPointer(aLoc_Position, 4, gl.FLOAT, false, FSIZE * 7, 0);

    gl.enableVertexAttribArray(aLoc_Position);

    var a_Color = gl.getAttribLocation(gl.program, 'a_Color');

    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 7, FSIZE * 4);
    gl.enableVertexAttribArray(a_Color);

    return 0;
}

function drawTail() {
    
    // vertices information
    var v1 = [0.0, 0.0, 0.05, 1.0, 1.0, 0.0, 0.0,];
    var v2 = [0.0, -0.05, 0.05, 1.0, 1.0, 1.0, 0.0,];
    var v3 = [0.25, -0.05, 0.05, 1.0, 1.0, 1.0, 1.0,];
    var v4 = [0.25, 0.0, 0.05, 1.0, 0.0, 1.0, 0.0,];
    var v5 = [0.25, -0.05, 0.0, 1.0, 0.0, 1.0, 1.0,];
    var v6 = [0.25, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0,];
    var v7 = [0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0,];
    var v8 = [0.0, -0.05, 0.0, 1.0, 1.0, 0.0, 0.0,];
    

    var vertices = new Float32Array ( Array.prototype.concat.call(
        v1, v2, v8,
        v1, v8, v7,

        v1, v2, v3,
        v1, v3, v4,

        v3, v4, v5,
        v4, v5, v6,

        v7, v5, v8,
        v7, v6, v5,

        v7, v1, v4,
        v7, v4, v6,

        v2, v8, v3,
        v8, v5, v3,
        ));

    g_vertCount = 36;

    // create a buffer in GPU, its ID is vertexBufferID
    var vertexBufferID = gl.createBuffer();
    if (!vertexBufferID) {
        console.log('Failed to create the buffer object');
        return -1;
    }
    

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBufferID);     // bind the buffer with gl

    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);   // store the vertices' information in buffer from gl

    var FSIZE = vertices.BYTES_PER_ELEMENT;
    var aLoc_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if(aLoc_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return -2;
    }

    gl.vertexAttribPointer(aLoc_Position, 4, gl.FLOAT, false, FSIZE * 7, 0);

    gl.enableVertexAttribArray(aLoc_Position);

    var a_Color = gl.getAttribLocation(gl.program, 'a_Color');

    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 7, FSIZE * 4);
    gl.enableVertexAttribArray(a_Color);

    return 0;
}


function drawAll() {
    initVertexBuffers();
    // clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);

    g_modelMatrix.setIdentity();
    // ---------------------------------


    // pushMatrix(g_modelMatrix);
    // // ---------------------------------
    //         g_modelMatrix.translate(-0.6,-0.6, 0.0);  // 'set' means DISCARD old matrix,
				  					
	// 		//-------Draw Lower Arm---------------
	// 		g_modelMatrix.rotate(g_angle0now, 0, 0, 1);  // Make new drawing axes that
	// 	  	g_modelMatrix.translate(-0.1, 0,0);						// Move box so that we pivot
	// 	  gl.uniformMatrix4fv(uLoc_modelMatrix, false, g_modelMatrix.elements);
	// 	  gl.drawArrays(gl.TRIANGLES, 0, g_vertCount);	// draw all vertices.
		  
	// 	  //-------Draw Upper Arm----------------
	// 	  g_modelMatrix.translate(0.1, 0.5, 0); 			// Make new drawing axes that
	// 	  g_modelMatrix.scale(0.6,0.6,0.6);				// Make new drawing axes that
	// 	  g_modelMatrix.rotate(g_angle1now, 0,0,1);	// Make new drawing axes that
	// 	  g_modelMatrix.translate(-0.1, 0, 0);			// Make new drawing axes that
		  
    //       gl.uniformMatrix4fv(uLoc_modelMatrix, false, g_modelMatrix.elements);
	// 	  gl.drawArrays(gl.TRIANGLES, 0, g_vertCount);	// draw all vertices.

    //       g_modelMatrix.translate(0.1, 0.5, 0.0);	

    //       pushMatrix(g_modelMatrix);
    //             g_modelMatrix.rotate(g_angle2now, 0,0,1);		
    //             g_modelMatrix.scale(0.4, 0.4, 0.4);		// DRAW BOX: Use this matrix to transform & draw our VBO's contents:
    //             gl.uniformMatrix4fv(uLoc_modelMatrix, false, g_modelMatrix.elements);
    //             gl.drawArrays(gl.TRIANGLES, 0, g_vertCount);	// draw all vertices.
    //             // Now move drawing axes to the centered end of that lower-jaw segment:
    //             g_modelMatrix.translate(0.1, 0.5, 0.0);
    //             g_modelMatrix.rotate(40.0, 0,0,1);		// make bend in the lower jaw
    //             g_modelMatrix.translate(-0.1, 0.0, 0.0);	// re-center the outer segment,
    //             // Draw outer lower jaw segment:				
    //             // DRAW BOX: Use this matrix to transform & draw our VBO's contents:
    //             gl.uniformMatrix4fv(uLoc_modelMatrix, false, g_modelMatrix.elements);
    //             gl.drawArrays(gl.TRIANGLES, 0, g_vertCount);	// draw all vertices.

    //             // RETURN to the saved drawing axes at the 'wrist':
    //             // RETRIEVE PREVIOUSLY-SAVED DRAWING AXES HERE:
    //             //---------------------
	// 	g_modelMatrix = popMatrix();

    //     g_modelMatrix.rotate(g_angle2now, 0,0,1);		
    //     g_modelMatrix.scale(0.4, 0.4, 0.4);		// DRAW BOX: Use this matrix to transform & draw our VBO's contents:
    //     g_modelMatrix.translate(-0.2, 0, 0);

    //     gl.uniformMatrix4fv(uLoc_modelMatrix, false, g_modelMatrix.elements);
    //     gl.drawArrays(gl.TRIANGLES, 0, g_vertCount);	// draw all vertices.
    //     // Now move drawing axes to the centered end of that lower-jaw segment:
    //     g_modelMatrix.translate(0.1, 0.5, 0.0);
    //      g_modelMatrix.rotate(-40.0, 0,0,1);		// make bend in the lower jaw
    //     g_modelMatrix.translate(-0.1, 0.0, 0.0);	// re-center the outer segment,
    //     // Draw outer lower jaw segment:				
    //     // DRAW BOX: Use this matrix to transform & draw our VBO's contents:
    //     gl.uniformMatrix4fv(uLoc_modelMatrix, false, g_modelMatrix.elements);
    //     gl.drawArrays(gl.TRIANGLES, 0, g_vertCount);
         
        
    // g_modelMatrix = popMatrix();



    drawBody();

    //g_modelMatrix.translate(0.3, 0.0, 0.0);	
    //g_modelMatrix.rotate(g_angle0now, 0, 1, 0);
    gl.uniformMatrix4fv(uLoc_modelMatrix, false, g_modelMatrix.elements);
	gl.drawArrays(gl.TRIANGLES, 0, g_vertCount);	// draw all vertices.

    drawHead();
    //g_modelMatrix.translate(0.3, 0.0, 0.0);	
    //g_modelMatrix.rotate(g_angle0now, 0, 1, 0);
    gl.uniformMatrix4fv(uLoc_modelMatrix, false, g_modelMatrix.elements);
	gl.drawArrays(gl.TRIANGLES, 0, g_vertCount);	// draw all vertices.

    drawfrontThighs();

    pushMatrix(g_modelMatrix);

    g_modelMatrix.translate(-0.2, 0.0, 0.1);	
    //g_modelMatrix.rotate(g_angle0now, 0, 1, 0);
    gl.uniformMatrix4fv(uLoc_modelMatrix, false, g_modelMatrix.elements);
	gl.drawArrays(gl.TRIANGLES, 0, g_vertCount);	// draw all vertices.

        pushMatrix(g_modelMatrix);
            drawfrontcalves();
            g_modelMatrix.translate(0, -0.15, 0);	
            //g_modelMatrix.rotate(g_angle0now, 0, 1, 0);
            gl.uniformMatrix4fv(uLoc_modelMatrix, false, g_modelMatrix.elements);
            gl.drawArrays(gl.TRIANGLES, 0, g_vertCount);	// draw all vertices.

            drawPaws();
            g_modelMatrix.translate(-0.05, -0.15, 0);	
            //g_modelMatrix.rotate(g_angle0now, 0, 1, 0);
            gl.uniformMatrix4fv(uLoc_modelMatrix, false, g_modelMatrix.elements);
            gl.drawArrays(gl.TRIANGLES, 0, g_vertCount);	// draw all vertices.

        g_modelMatrix = popMatrix();

    drawfrontThighs();
    g_modelMatrix.translate(0, 0.0, -0.25);	
    //g_modelMatrix.rotate(g_angle0now, 0, 1, 0);
    gl.uniformMatrix4fv(uLoc_modelMatrix, false, g_modelMatrix.elements);
	gl.drawArrays(gl.TRIANGLES, 0, g_vertCount);	// draw all vertices.

        pushMatrix(g_modelMatrix);
        drawfrontcalves();
            g_modelMatrix.translate(0.0, -0.15, 0);	
            //g_modelMatrix.rotate(g_angle0now, 0, 1, 0);
            gl.uniformMatrix4fv(uLoc_modelMatrix, false, g_modelMatrix.elements);
            gl.drawArrays(gl.TRIANGLES, 0, g_vertCount);	// draw all vertices.

            drawPaws();
            g_modelMatrix.translate(-0.05, -0.15, 0);	
            //g_modelMatrix.rotate(g_angle0now, 0, 1, 0);
            gl.uniformMatrix4fv(uLoc_modelMatrix, false, g_modelMatrix.elements);
            gl.drawArrays(gl.TRIANGLES, 0, g_vertCount);	// draw all vertices.

        g_modelMatrix = popMatrix();

    drawbackThighs();
    g_modelMatrix.translate(0.3, 0.0, 0.0);	
    gl.uniformMatrix4fv(uLoc_modelMatrix, false, g_modelMatrix.elements);
	gl.drawArrays(gl.TRIANGLES, 0, g_vertCount);	// draw all vertices.
        pushMatrix(g_modelMatrix);
            drawbackcalves();
                g_modelMatrix.translate(0.15, -0.15, 0);	
                //g_modelMatrix.rotate(g_angle0now, 0, 1, 0);
                gl.uniformMatrix4fv(uLoc_modelMatrix, false, g_modelMatrix.elements);
                gl.drawArrays(gl.TRIANGLES, 0, g_vertCount);	// draw all vertices.

                drawPaws();
                g_modelMatrix.translate(-0.05, -0.15, 0);	
                //g_modelMatrix.rotate(g_angle0now, 0, 1, 0);
                gl.uniformMatrix4fv(uLoc_modelMatrix, false, g_modelMatrix.elements);
                gl.drawArrays(gl.TRIANGLES, 0, g_vertCount);	// draw all vertices.
        g_modelMatrix = popMatrix();

    drawbackThighs();
    g_modelMatrix.translate(0, 0.0, 0.25);	
    gl.uniformMatrix4fv(uLoc_modelMatrix, false, g_modelMatrix.elements);
	gl.drawArrays(gl.TRIANGLES, 0, g_vertCount);	// draw all vertices.
        pushMatrix(g_modelMatrix);
            drawbackcalves();
                g_modelMatrix.translate(0.15, -0.15, 0);	
                //g_modelMatrix.rotate(g_angle0now, 0, 1, 0);
                gl.uniformMatrix4fv(uLoc_modelMatrix, false, g_modelMatrix.elements);
                gl.drawArrays(gl.TRIANGLES, 0, g_vertCount);	// draw all vertices.

                drawPaws();
                g_modelMatrix.translate(-0.05, -0.15, 0);	
                //g_modelMatrix.rotate(g_angle0now, 0, 1, 0);
                gl.uniformMatrix4fv(uLoc_modelMatrix, false, g_modelMatrix.elements);
                gl.drawArrays(gl.TRIANGLES, 0, g_vertCount);	// draw all vertices.
        g_modelMatrix = popMatrix();
    
    g_modelMatrix = popMatrix();
    
    pushMatrix(g_modelMatrix);
        // tail
        drawTail();
        g_modelMatrix.translate(0.25, 0.05, 0);	
        g_modelMatrix.rotate(30, 0, 0, 1);
        gl.uniformMatrix4fv(uLoc_modelMatrix, false, g_modelMatrix.elements);
        gl.drawArrays(gl.TRIANGLES, 0, g_vertCount);	// draw all vertices.

        g_modelMatrix.translate(0.22, -0.01, 0);	
        g_modelMatrix.scale(0.5, 1, 1);
        g_modelMatrix.rotate(30, 0, 0, 1);
        gl.uniformMatrix4fv(uLoc_modelMatrix, false, g_modelMatrix.elements);
        gl.drawArrays(gl.TRIANGLES, 0, g_vertCount);	// draw all vertices.

        g_modelMatrix.translate(0.22, -0.01, 0);	
        g_modelMatrix.scale(0.2, 1, 1);
        g_modelMatrix.rotate(30, 0, 0, 1);
        gl.uniformMatrix4fv(uLoc_modelMatrix, false, g_modelMatrix.elements);
        gl.drawArrays(gl.TRIANGLES, 0, g_vertCount);	// draw all vertices.
    g_modelMatrix = popMatrix();
}

function A0_runStop() {
    //==============================================================================
      if(g_angle0brake > 0.5)	// if running,
      {
          g_angle0brake = 0.0;	// stop, and change button label:
          document.getElementById("A0button").value="Angle 0 OFF";
        }
      else 
      {
          g_angle0brake = 1.0;	// Otherwise, go.
          document.getElementById("A0button").value="Angle 0 ON-";
        }
    }
    
    function A1_runStop() {
    //==============================================================================
      if(g_angle1brake > 0.5)	// if running,
      {
          g_angle1brake = 0.0;	// stop, and change button label:
          document.getElementById("A1button").value="Angle 1 OFF";
        }
      else 
      {
          g_angle1brake = 1.0;	// Otherwise, go.
          document.getElementById("A1button").value="Angle 1 ON-";
        }
    }
    function A2_runStop() {
    //==============================================================================
      if(g_angle2brake > 0.5)	// if running,
      {
          g_angle2brake = 0.0;	// stop, and change button label:
          document.getElementById("A2button").value="Angle 2 OFF";
        }
      else 
      {
          g_angle2brake = 1.0;	// Otherwise, go.
          document.getElementById("A2button").value="Angle 2 ON-";
        }
    }
    
    function A3_runStop() {
    //==============================================================================
      if(g_angle3brake > 0.5)	// if running,
      {
          g_angle3brake = 0.0;	// stop, and change button label:
          document.getElementById("A3button").value="Angle 3 OFF";
        }
      else 
      {
          g_angle3brake = 1.0;	// Otherwise, go.
          document.getElementById("A3button").value="Angle 3 ON-";
        }
    }
    