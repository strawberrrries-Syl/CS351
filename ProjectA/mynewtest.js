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
var g_canvasID = document.getElementById('webgl');
var g_modelMatrix;
var g_vertCount;
var uLoc_modelMatrix;

// For animation:---------------------
var g_lastMS = Date.now();
// All of our time-dependent params (you can add more!)

// flags
var SW = 0;                     // switch of sit and walk
var Run = false;                    // switch of walk and run
var boneExist = false;
var keyPressed;

// array of moving infomation (now, rate, brake, min, max);


// left front                                //---------------
var g_angle0now = 0.0;       // init Current rotation angle, in degrees
var g_angle0rate = 0.0;       // init Rotation angle rate, in degrees/second.
var g_angle0brake = 1.0;				// init Speed control; 0=stop, 1=full speed.
var g_angle0min = 0.0;       // init min, max allowed angle, in degrees.
var g_angle0max = 0.0;
// right front                                //---------------
var g_angle1now = 0.0; 			// init Current rotation angle, in degrees > 0
var g_angle1rate = 0.0;				// init Rotation angle rate, in degrees/second.
var g_angle1brake = 1.0;				// init Rotation start/stop. 0=stop, 1=full speed.
var g_angle1min = 0.0;       // init min, max allowed angle, in degrees
var g_angle1max = 0.0;
// left back                                 //---------------
var g_angle2now = -60; 			// init Current rotation angle, in degrees.
var g_angle2rate = 0.0;				// init Rotation angle rate, in degrees/second.
var g_angle2brake = 1.0;				// init Speed control; 0=stop, 1=full speed.
var g_angle2min = 0.0;       // init min, max allowed angle, in degrees
var g_angle2max = 0.0;
// right back
var g_angle3now = -60; 			// init Current rotation angle, in degrees.
var g_angle3rate = 0.0;				// init Rotation angle rate, in degrees/second.
var g_angle3brake = 1.0;				// init Speed control; 0=stop, 1=full speed.
var g_angle3min = 0.0;       // init min, max allowed angle, in degrees
var g_angle3max = 0.0;

// tail                                //---------------
var g_angle4now = 0.0;       // init Current rotation angle, in degrees
var g_angle4rate = -10.0;       // init Rotation angle rate, in degrees/second.
var g_angle4brake = 1.0;				// init Speed control; 0=stop, 1=full speed.
var g_angle4min = -360.0;       // init min, max allowed angle, in degrees.
var g_angle4max = 360.0;
// YOU can add more time-varying params of your own here -- try it!
// For example, could you add angle3, have it run without limits, and
// use sin(angle3) to slowly translate the robot-arm base horizontally,
// moving back-and-forth smoothly and sinusoidally?

// calves:
// left calf
var g_angle5now = 0.0; 			// init Current rotation angle, in degrees.
var g_angle5rate = 0.0;				// init Rotation angle rate, in degrees/second.
var g_angle5min = 0.0;       // init min, max allowed angle, in degrees
var g_angle5max = 0.0;

var g_angle6now = 0.0; 			// init Current rotation angle, in degrees.
var g_angle6rate = 0.0;				// init Rotation angle rate, in degrees/second.
var g_angle6min = 0.0;       // init min, max allowed angle, in degrees
var g_angle6max = 0.0;

var g_angle7now = -10; 			// init Current rotation angle, in degrees.
var g_angle7rate = 0.0;				// init Rotation angle rate, in degrees/second.
var g_angle7min = 0.0;       // init min, max allowed angle, in degrees
var g_angle7max = 0.0;

var g_angle8now = -10; 			// init Current rotation angle, in degrees.
var g_angle8rate = 0.0;				// init Rotation angle rate, in degrees/second.
var g_angle8min = 0.0;       // init min, max allowed angle, in degrees
var g_angle8max = 0.0;

// paws
var g_angle9now = 0; 			// init Current rotation angle, in degrees.
var g_angle9rate = 0.0;				// init Rotation angle rate, in degrees/second.
var g_angle9min = 0.0;       // init min, max allowed angle, in degrees
var g_angle9max = 0.0;

var g_angle10now = 30; 			// init Current rotation angle, in degrees.
var g_angle10rate = 0.0;				// init Rotation angle rate, in degrees/second.
var g_angle10min = 0.0;       // init min, max allowed angle, in degrees
var g_angle10max = 0.0;

// body
var g_anglebody = -50; 			// init Current rotation angle, in degrees.
var g_transheadx = 0.15;
var g_transheady = 0.25;
var g_frontlegs = 0.1;
var g_tail = -0.2;



// ---- For Animation -----
var g_isRun = true;                 // run/stop for animation; used in tick().
var g_lastMS = Date.now();    			// Timestamp for most-recently-drawn image; 
// in milliseconds; used by 'animate()' fcn 
// (now called 'timerAll()' ) to find time
// elapsed since last on-screen image.
var g_angle01 = 0;                  // initial rotation angle
var g_angle01Rate = 45.0;           // rotation speed, in degrees/second 

var g_angle02 = 0;                  // initial rotation angle
var g_angle02Rate = 40.0;           // rotation speed, in degrees/second 

//------------For mouse click-and-drag: -------------------------------
var g_isDrag = false;		// mouse-drag: true when user holds down mouse button
var g_xMclik = 0.0;			// last mouse button-down position (in CVV coords)
var g_yMclik = 0.0;
var g_xMdragTot = 0.0;	// total (accumulated) mouse-drag amounts (in CVV coords).
var g_yMdragTot = 0.0;
var g_digits = 5;			// DIAGNOSTICS: # of digits to print in console.log (
//    console.log('xVal:', xVal.toFixed(g_digits)); // print 5 digits

var g_xKmove = 0.0;	// total (accumulated) keyboard-drag amounts (in CVV coords).
var g_yKmove = 0.0;


function main() {
    // Retrieve <canvas> element
    sit();

    // Get the rendering context for WebGL
    gl = g_canvasID.getContext("webgl", { preserveDrawingBuffer: true });
    if (!gl) {
        console.log('Failed to get the rendering context for WebGL. Bye!');
        return;
    }

    // THE 'REVERSED DEPTH' PROBLEM:=======================================
    // IF we don't transform our vertices by a 3D Camera Projection Matrix
    // (and we don't -- not until Project B) then the GPU will compute reversed 
    // depth values: depth==0 for vertex z == -1; depth==1 for vertex z==-1.
    // To correct the 'REVERSED DEPTH' problem, we will
    // reverse the depth-buffer's usage of computed depth values, like this:
    gl.enable(gl.DEPTH_TEST); // enabled by default, but let's be SURE.
    gl.clearDepth(0.0); // each time we 'clear' our depth buffer, set all
    // pixel depths to 0.0 (1.0 is DEFAULT)
    gl.depthFunc(gl.GREATER); // (gl.LESS is DEFAULT; reverse it!)
    // draw a pixel only if its depth value is GREATER
    // than the depth buffer's stored value.
    //=====================================================================

    //Initialize shaders
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('Failed to initialize shaders.');
        return;
    }

    // VBO creating
    var myErr = initVertexBuffers();
    if (myErr < 0) {
        console.log('Failed to set the positions of the vertices');
        return;
    }

    gl.clearColor(3, 0, 2, 0.3);   // stored in gl.COLOR_BUFFER_BIT

    g_modelMatrix = new Matrix4();

    uLoc_modelMatrix = gl.getUniformLocation(gl.program, 'u_modelMatrix');
    if (!uLoc_modelMatrix) {
        console.log('Failed to get the storage location of u_modelMatrix');
        return;
    }

    // Register the Keyboard & Mouse Event-handlers------------------------------
    // When users move, click or drag the mouse and when they press a key on the 
    // keyboard the operating system create a simple text-based 'event' message.
    // Your Javascript program can respond to 'events' if you:
    // a) tell JavaScript to 'listen' for each event that should trigger an
    //   action within your program: call the 'addEventListener()' function, and 
    // b) write your own 'event-handler' function for each of the user-triggered 
    //    actions; Javascript's 'event-listener' will call your 'event-handler'
    //		function each time it 'hears' the triggering event from users.
    //
    // KEYBOARD:
    // The 'keyDown' and 'keyUp' events respond to ALL keys on the keyboard,
    //      including shift,alt,ctrl,arrow, pgUp, pgDn,f1,f2...f12 etc. 
    window.addEventListener("keydown", myKeyDown, false);
    // After each 'keydown' event, call the 'myKeyDown()' function.  The 'false' 
    // arg (default) ensures myKeyDown() call in 'bubbling', not 'capture' stage)
    // ( https://www.w3schools.com/jsref/met_document_addeventlistener.asp )
    window.addEventListener("keyup", myKeyUp, false);
    // Called when user RELEASES the key.  Now rarely used...
    //window.addEventListener("keypress", myKeypress, false);

    // MOUSE:
    // Create 'event listeners' for a few vital mouse events 
    // (others events are available too... google it!).  
    window.addEventListener("mousedown", myMouseDown);
    // (After each 'mousedown' event, browser calls the myMouseDown() fcn.)
    window.addEventListener("mousemove", myMouseMove);
    window.addEventListener("mouseup", myMouseUp);
    window.addEventListener("click", myMouseClick);
    window.addEventListener("dblclick", myMouseDblClick);


    var tick = function () {
        requestAnimationFrame(tick, g_canvasID);
        timerAll();
        drawAll();

        //console.log(moveInfoLFT);
        //console.log(moveInfoRFT);
        //console.log(moveInfoLBT);
        //console.log(moveInfoRBT);

        document.getElementById('CurAngleDisplay').innerHTML =
            'g_angle01= ' + g_angle01.toFixed(g_digits);
        // Also display our current mouse-dragging state:
        document.getElementById('Mouse').innerHTML =
            'Mouse Drag totals (CVV coords):\t' +
            g_xMdragTot.toFixed(5) + ', \t' + g_yMdragTot.toFixed(g_digits);
    }

    tick();
    //drawAll();
}

function rotateNow(anglenow, anglerate, anglebreak, elapsedtime, min, max) {
    anglenow += anglerate * anglebreak * elapsedtime * 0.001;
    if ((anglenow >= max && anglerate > 0) || (anglenow <= min && anglerate < 0)) {
        anglerate *= -1;
    }
    //console.log("before: ", anglenow);
    if (min > max) {// if min and max don't limit the angle, then
        if (anglenow < -180.0) anglenow += 360.0;	// go to >= -180.0 or
        else if (anglenow > 180.0) anglenow -= 360.0;	// go to <= +180.0
    }
    //console.log("after: ",anglenow);
    return [anglenow, anglerate];
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
    if (elapsedMS > 1000.0) {
        // Browsers won't re-draw 'canvas' element that isn't visible on-screen 
        // (user chose a different browser tab, etc.); when users make the browser
        // window visible again our resulting 'elapsedMS' value has gotten HUGE.
        // Instead of allowing a HUGE change in all our time-dependent parameters,
        // let's pretend that only a nominal 1/30th second passed:
        elapsedMS = 1000.0 / 30.0;
    }

    [g_angle0now, g_angle0rate] = rotateNow(g_angle0now, g_angle0rate, g_angle0brake, elapsedMS, g_angle0min, g_angle0max);
    [g_angle1now, g_angle1rate] = rotateNow(g_angle1now, g_angle1rate, g_angle1brake, elapsedMS, g_angle1min, g_angle1max);
    [g_angle2now, g_angle2rate] = rotateNow(g_angle2now, g_angle2rate, g_angle2brake, elapsedMS, g_angle2min, g_angle2max);
    [g_angle3now, g_angle3rate] = rotateNow(g_angle3now, g_angle3rate, g_angle3brake, elapsedMS, g_angle3min, g_angle3max);
    [g_angle4now, g_angle4rate] = rotateNow(g_angle4now, g_angle4rate, g_angle4brake, elapsedMS, g_angle4min, g_angle4max);

    [g_angle5now, g_angle5rate] = rotateNow(g_angle5now, g_angle5rate, 1, elapsedMS, g_angle5min, g_angle5max);
    [g_angle6now, g_angle6rate] = rotateNow(g_angle6now, g_angle6rate, 1, elapsedMS, g_angle6min, g_angle6max);
    [g_angle7now, g_angle7rate] = rotateNow(g_angle7now, g_angle7rate, 1, elapsedMS, g_angle7min, g_angle7max);
    [g_angle8now, g_angle8rate] = rotateNow(g_angle8now, g_angle8rate, 1, elapsedMS, g_angle8min, g_angle8max);
    [g_angle9now, g_angle9rate] = rotateNow(g_angle9now, g_angle9rate, 1, elapsedMS, g_angle9min, g_angle9max);
    [g_angle10now, g_angle10rate] = rotateNow(g_angle10now, g_angle10rate, 1, elapsedMS, g_angle10min, g_angle10max);

}

function SetVBO(vertices_here) {
    // create a buffer in GPU, its ID is vertexBufferID
    var vertexBufferID = gl.createBuffer();
    if (!vertexBufferID) {
        console.log('Failed to create the buffer object');
        return -1;
    }


    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBufferID);     // bind the buffer with gl

    gl.bufferData(gl.ARRAY_BUFFER, vertices_here, gl.STATIC_DRAW);   // store the vertices' information in buffer from gl

    var FSIZE = vertices_here.BYTES_PER_ELEMENT;
    var aLoc_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (aLoc_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return -2;
    }

    gl.vertexAttribPointer(aLoc_Position, 4, gl.FLOAT, false, FSIZE * 7, 0);

    gl.enableVertexAttribArray(aLoc_Position);

    var a_Color = gl.getAttribLocation(gl.program, 'a_Color');

    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 7, FSIZE * 4);
    gl.enableVertexAttribArray(a_Color);

}

{
function initVertexBuffers() {

    // vertices information
    var vertices = new Float32Array([
        0.00, 0.30, 0.00, 1.00, 1.0, 0.0, 0.0,
        -0.50, 0.00, 0.00, 1.00, 1.0, 0.0, 0.0,
        0.50, 0.00, 0.00, 1.00, 1.0, 0.0, 0.0,

        0.00, -0.30, 0.00, 1.00, 1.0, 1.0, 0.0,
        -0.50, 0.00, 0.00, 1.00, 1.0, 1.0, 0.0,
        0.50, 0.00, 0.00, 1.00, 1.0, 1.0, 0.0

        - 0.50, 0.00, 0.00, 1.00, 0.0, 0.0, 1.0,
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
    if (aLoc_Position < 0) {
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
    var v2 = [-0.3, 0.0, 0.05, 1.0, 1.0, 0.0, 0.0,];
    var v3 = [-0.2, 0.1, 0.1, 1.0, 1.0, 1.0, 1.0,];
    var v4 = [-0.2, -0.1, 0.1, 1.0, 0.0, 1.0, 0.0,];
    var v5 = [0.3, 0.1, 0.1, 1.0, 0.0, 1.0, 1.0,];
    var v6 = [0.3, -0.1, 0.1, 1.0, 0.0, 0.0, 1.0,];
    var v7 = [0.3, 0.1, -0.1, 1.0, 0.0, 0.0, 0.0,];
    var v8 = [0.3, -0.1, -0.1, 1.0, 1.0, 0.0, 0.0,];
    var v9 = [-0.2, 0.1, -0.1, 1.0, 1.0, 1.0, 0.0,];
    var v10 = [-0.2, -0.1, -0.1, 1.0, 1.0, 1.0, 1.0,];
    var v11 = [-0.3, 0.15, -0.05, 1.0, 1.0, 0.0, 0.0,];
    var v12 = [-0.3, 0.0, -0.05, 1.0, 1.0, 0.0, 0.0,];

    var vertices = new Float32Array(Array.prototype.concat.call(
        v1, v2, v4,
        v3, v1, v4,

        v3, v4, v6,
        v5, v3, v6,

        v5, v6, v8,
        v5, v8, v7,

        v7, v8, v9,
        v9, v8, v10,

        v9, v10, v11,
        v11, v10, v12,

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

    SetVBO(vertices);

    return 0;
}

function drawHead() {
    // vertices information
    var v1 = [-0.6, 0.05, 0.05, 1.0, 1.0, 0.0, 0.0,];
    var v2 = [-0.6, 0.05, -0.05, 1.0, 1.0, 0.0, 0.0,];
    var v3 = [-0.6, -0.03, 0.05, 1.0, 1.0, 0.0, 0.0,];
    var v4 = [-0.6, -0.03, -0.05, 1.0, 1.0, 0.0, 0.0,];

    var v5 = [-0.5, 0.05, 0.05, 1.0, 1.0, 1.0, 1.0,];
    var v6 = [-0.5, 0.05, -0.05, 1.0, 1.0, 1.0, 1.0,];

    var v7 = [-0.45, 0.2, 0.15, 1.0, 1.0, 1.0, 1.0,];
    var v8 = [-0.45, -0.05, 0.15, 1.0, 1.0, 1.0, 1.0,];
    var v9 = [-0.3, -0.05, 0.15, 1.0, 0.0, 0.0, 1.0,];
    var v10 = [-0.3, 0.2, 0.15, 1.0, 0.0, 0.0, 1.0,];

    var v11 = [-0.3, -0.05, -0.15, 1.0, 0.0, 0.0, 1.0,];
    var v12 = [-0.3, 0.2, -0.15, 1.0, 0.0, 0.0, 1.0,];
    var v13 = [-0.45, 0.2, -0.15, 1.0, 1.0, 1.0, 1.0,];
    var v14 = [-0.45, -0.05, -0.15, 1.0, 1.0, 1.0, 1.0,];

    var v15 = [-0.4, 0.3, 0.1, 1.0, 1.0, 1.0, 0.0,];
    var v16 = [-0.4, 0.3, -0.1, 1.0, 1.0, 1.0, 0.0,];

    var v17 = [-0.4, 0.2, 0.05, 1.0, 1.0, 1.0, 0.0,];
    var v18 = [-0.4, 0.2, -0.05, 1.0, 1.0, 1.0, 0.0,];

    var vertices = new Float32Array(Array.prototype.concat.call(
        //face
        v1, v3, v5,
        v5, v3, v8,
        v7, v5, v8,
        v5, v7, v6,
        v6, v7, v13,
        v6, v13, v14,
        v4, v6, v14,
        v2, v4, v6,
        v1, v3, v4,
        v1, v2, v4,
        //head
        v7, v8, v10,
        v8, v9, v10,
        v10, v9, v11,
        v10, v11, v12,
        v13, v12, v14,
        v12, v11, v14,
        v14, v9, v11,
        v8, v9, v14,
        v7, v10, v12,
        v7, v12, v13,
        // ears
        v7, v15, v17,
        v15, v10, v17,

        v16, v13, v18,
        v12, v16, v18,
    ));

    g_vertCount = 72;

    SetVBO(vertices);

    return 0;
}

function drawfrontThighs() {

    // vertices information
    var v1 = [0.0, 0.02, 0.05, 1.0, 0.0, 0.0, 0.0,];
    var v2 = [0.0, -0.18, 0.05, 1.0, 0.0, 0.0, 0.0,];
    var v3 = [0.05, -0.18, 0.05, 1.0, 1.0, 1.0, 1.0,];
    var v4 = [0.1, 0.02, 0.05, 1.0, 1.0, 1.0, 1.0,];
    var v5 = [0.05, -0.18, 0.0, 1.0, 1.0, 1.0, 1.0,];
    var v6 = [0.1, 0.02, 0.0, 1.0, 1.0, 1.0, 1.0,];
    var v7 = [0.0, 0.02, 0.0, 1.0, 0.0, 0.0, 0.0,];
    var v8 = [0.0, -0.18, 0.0, 1.0, 0.0, 0.0, 0.0,];


    var vertices = new Float32Array(Array.prototype.concat.call(
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

    SetVBO(vertices);

    return 0;
}

function drawfrontcalves() {

    // vertices information
    var v1 = [0.0, 0.0, 0.05, 1.0, 0.0, 0.0, 0.0,];
    var v2 = [0.0, -0.15, 0.05, 1.0, 0.0, 0.0, 0.0,];
    var v3 = [0.025, -0.15, 0.05, 1.0, 1.0, 1.0, 1.0,];
    var v4 = [0.05, 0.0, 0.05, 1.0, 1.0, 1.0, 1.0,];
    var v5 = [0.025, -0.15, 0.0, 1.0, 1.0, 1.0, 1.0,];
    var v6 = [0.05, 0.0, 0.0, 1.0, 1.0, 1.0, 1.0,];
    var v7 = [0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0,];
    var v8 = [0.0, -0.15, 0.0, 1.0, 0.0, 0.0, 0.0,];


    var vertices = new Float32Array(Array.prototype.concat.call(
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

    SetVBO(vertices);
    return 0;
}

function drawbackThighs() {

    // vertices information
    var v1 = [0.0, 0.0, 0.1, 1.0, 0.0, 0.0, 0.0,];
    var v2 = [0.2, -0.15, 0.1, 1.0, 0.0, 0.0, 0.0,];
    var v3 = [0.25, -0.15, 0.1, 1.0, 1.0, 1.0, 1.0,];
    var v4 = [0.22, 0.0, 0.1, 1.0, 1.0, 1.0, 1.0,];
    var v5 = [0.25, -0.15, 0.0, 1.0, 1.0, 1.0, 1.0,];
    var v6 = [0.22, 0.0, 0.0, 1.0, 1.0, 1.0, 1.0,];
    var v7 = [0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0,];
    var v8 = [0.2, -0.15, 0.0, 1.0, 0.0, 0.0, 0.0,];


    var vertices = new Float32Array(Array.prototype.concat.call(
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

    SetVBO(vertices);

    return 0;
}

function drawbackcalves() {

    // vertices information
    var v1 = [0.02, 0.05, 0.1, 1.0, 0.0, 0.0, 0.0,];
    var v2 = [0.0, -0.15, 0.05, 1.0, 0.0, 0.0, 0.0,];
    var v3 = [0.05, -0.15, 0.05, 1.0, 1.0, 1.0, 1.0,];
    var v4 = [0.11, 0.05, 0.1, 1.0, 1.0, 1.0, 1.0,];
    var v5 = [0.05, -0.15, 0.0, 1.0, 1.0, 1.0, 1.0,];
    var v6 = [0.11, 0.05, 0.0, 1.0, 1.0, 1.0, 1.0,];
    var v7 = [0.02, 0.05, 0.0, 1.0, 0.0, 0.0, 0.0,];
    var v8 = [0.05, -0.15, 0.0, 1.0, 0.0, 0.0, 0.0,];


    var vertices = new Float32Array(Array.prototype.concat.call(
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

    SetVBO(vertices);

    return 0;
}

function drawPaws() {

    // vertices information
    var v1 = [0.0, 0.0, 0.05, 1.0, 0.0, 0.0, 0.0,];
    var v2 = [0.0, -0.05, 0.05, 1.0, 0.0, 0.0, 0.0,];
    var v3 = [0.1, -0.05, 0.05, 1.0, 1.0, 1.0, 1.0,];
    var v4 = [0.1, 0.0, 0.05, 1.0, 1.0, 1.0, 1.0,];
    var v5 = [0.1, -0.05, 0.0, 1.0, 1.0, 1.0, 1.0,];
    var v6 = [0.1, 0.0, 0.0, 1.0, 1.0, 1.0, 1.0,];
    var v7 = [0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0,];
    var v8 = [0.0, -0.05, 0.0, 1.0, 0.0, 0.0, 0.0,];


    var vertices = new Float32Array(Array.prototype.concat.call(
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

    SetVBO(vertices);

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


    var vertices = new Float32Array(Array.prototype.concat.call(
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
    SetVBO(vertices);
    return 0;
}

function drawDisk() {

    var cP = [0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0,];
    var cP_b = [0.0, 0.0, -0.1, 1.0, 0.0, 1.0, 0.0,];
    var ans_ver;
    var i = 0;
    var step = 12;
    while (i < 360) {
        var p1 = [Math.cos((i + step) * 0.0175), Math.sin((i + step) * 0.0175), 0.0, 1.0, 1.0, 1.0, 1.0,];

        var p2 = [Math.cos(i * 0.0175), Math.sin(i * 0.0175), 0.0, 1.0, 1.0, 1.0, 1.0,];

        var p1_b = [Math.cos((i + step) * 0.0175), Math.sin((i + step) * 0.0175), -0.1, 1.0, 1.0, 1.0, 1.0,];
        var p2_b = [Math.cos(i * 0.0175), Math.sin(i * 0.0175), -0.1, 1.0, 1.0, 1.0, 1.0,];

        var curr_ver = Array.prototype.concat.call(p1, cP, p2, p1_b, p1, p2_b, p1_b, p2, p2_b, cP_b, p1_b, p2_b,);

        if (ans_ver == null) {
            ans_ver = curr_ver;
        }
        else {
            ans_ver = Array.prototype.concat.call(ans_ver, curr_ver);
        }

        i = i + step;
        //console.log(i);

    }
    var vertices = new Float32Array(ans_ver);

    console.log(vertices);

    g_vertCount = 360;

    SetVBO(vertices);

    return 0;
}

function drawLoop() {

    var ans_ver;
    var i = 0;
    var step = 12;
    var dim = 0.9;
    while (i < 360) {
        var p1 = [Math.cos((i + step) * 0.0175), Math.sin((i + step) * 0.0175), 0.2, 1.0, 1.0, 1.0, 1.0,];

        var p2 = [Math.cos(i * 0.0175), Math.sin(i * 0.0175), 0.2, 1.0, 1.0, 1.0, 1.0,];

        var p3 = [dim * Math.cos((i + step) * 0.0175), dim * Math.sin((i + step) * 0.0175), 0.2, 1.0, 0.0, 1.0, 1.0,];

        var p4 = [dim * Math.cos(i * 0.0175), dim * Math.sin(i * 0.0175), 0.2, 1.0, 0.0, 1.0, 1.0,];

        var p1_b = [Math.cos((i + step) * 0.0175), Math.sin((i + step) * 0.0175), -0.2, 1.0, 1.0, 1.0, 1.0,];
        var p2_b = [Math.cos(i * 0.0175), Math.sin(i * 0.0175), -0.2, 1.0, 1.0, 1.0, 1.0,];

        var p3_b = [dim * Math.cos((i + step) * 0.0175), dim * Math.sin((i + step) * 0.0175), -0.2, 1.0, 0.0, 1.0, 1.0,];
        var p4_b = [dim * Math.cos(i * 0.0175), dim * Math.sin(i * 0.0175), -0.2, 1.0, 0.0, 1.0, 1.0,];

        var curr_ver = Array.prototype.concat.call(
            p1, p3, p2,
            p3, p4, p2,

            p1, p2, p2_b,
            p1, p2_b, p1_b,

            p1_b, p2_b, p4_b,
            p3_b, p2_b, p4_b,

            p3, p3_b, p4_b,
            p3, p4_b, p4,

            p1, p1_b, p3_b,
            p1, p3_b, p3,

            p4, p4_b, p2_b,
            p4, p2_b, p2,
        );

        if (ans_ver == null) {
            ans_ver = curr_ver;
        }
        else {
            ans_ver = Array.prototype.concat.call(ans_ver, curr_ver);
        }

        i = i + step;
        //console.log(i);

    }
    var vertices = new Float32Array(ans_ver);

    g_vertCount = 360 * 36 / step;

    SetVBO(vertices);

    return 0;
}


function drawSquare() {
    // vertices information
    var v1 = [0.0, 0.5, 0.5, 1.0, 0.0, 1.0, 0.0,];
    var v2 = [0.5, 0.5, 0.5, 1.0, 0.0, 1.0, 0.0,];
    var v3 = [0.5, 0.0, 0.5, 1.0, 1.0, 1.0, 1.0,];
    var v4 = [0.0, 0.0, 0.5, 1.0, 1.0, 0.0, 1.0,];
    var v5 = [0.0, 0.5, 0.0, 1.0, 1.0, 0.0, 0.0,];
    var v6 = [0.5, 0.5, 0.0, 1.0, 1.0, 1.0, 0.0,];
    var v7 = [0.5, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0,];
    var v8 = [0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0,];


    var vertices = new Float32Array(Array.prototype.concat.call(
        v1, v4, v2,
        v1, v3, v2,

        v2, v3, v7,
        v2, v7, v6,

        v5, v6, v7,
        v5, v7, v8,

        v1, v5, v8,
        v1, v8, v4,

        v5, v1, v2,
        v5, v2, v6,

        v8, v7, v3,
        v4, v8, v3,
    ));

    g_vertCount = 36;

    SetVBO(vertices);

    return 0;
}

function drawBone() {
    pushMatrix(g_modelMatrix);

    drawSquare();

    pushMatrix(g_modelMatrix);
    //g_modelMatrix.translate(-0.1, 0.2, 0.0);	
    g_modelMatrix.scale(0.1, 0.1, 0.1);				// Make new drawing axes that
    //g_modelMatrix.rotate(g_angle4now, 0, 0, 0);
    gl.uniformMatrix4fv(uLoc_modelMatrix, false, g_modelMatrix.elements);
    gl.drawArrays(gl.TRIANGLES, 0, g_vertCount);	// draw all vertices.

    //  .scale(1,4,1);				// Make new drawing axes that
    g_modelMatrix.translate(0.8, 0.0, 0.0);
    //g_modelMatrix.scale(1,4,1);				// Make new drawing axes that
    //g_modelMatrix.rotate(g_angle4now, 0, 0, 0);
    gl.uniformMatrix4fv(uLoc_modelMatrix, false, g_modelMatrix.elements);
    gl.drawArrays(gl.TRIANGLES, 0, g_vertCount);	// draw all vertices.

    g_modelMatrix.translate(0.0, -2, 0.0);
    //g_modelMatrix.scale(1,4,1);				// Make new drawing axes that
    //g_modelMatrix.rotate(g_angle4now, 0, 0, 0);
    gl.uniformMatrix4fv(uLoc_modelMatrix, false, g_modelMatrix.elements);
    gl.drawArrays(gl.TRIANGLES, 0, g_vertCount);	// draw all vertices.

    g_modelMatrix.translate(-0.8, 0.0, 0.0);
    //g_modelMatrix.scale(1,4,1);				// Make new drawing axes that
    //g_modelMatrix.rotate(g_angle4now, 0, 0, 0);
    gl.uniformMatrix4fv(uLoc_modelMatrix, false, g_modelMatrix.elements);
    gl.drawArrays(gl.TRIANGLES, 0, g_vertCount);	// draw all vertices.
    popMatrix(g_modelMatrix);

    drawSquare();
    g_modelMatrix.scale(0.8, 3.5, 0.8);				// Make new drawing axes that
    g_modelMatrix.translate(0.5, 0.1, 0.0);
    //g_modelMatrix.rotate(g_angle4now, 0, 0, 0);
    gl.uniformMatrix4fv(uLoc_modelMatrix, false, g_modelMatrix.elements);
    gl.drawArrays(gl.TRIANGLES, 0, g_vertCount);	// draw all vertices.

    popMatrix(g_modelMatrix);
}
}

function drawDog() {
    drawBody();
    pushMatrix(g_modelMatrix);
        // body
        {
        pushMatrix(g_modelMatrix);
            g_modelMatrix.rotate(g_anglebody, 0, 0, 1);
            gl.uniformMatrix4fv(uLoc_modelMatrix, false, g_modelMatrix.elements);
            gl.drawArrays(gl.TRIANGLES, 0, g_vertCount);	// draw all vertices.
        g_modelMatrix = popMatrix();
        }
        // head
        {
        drawHead();
        pushMatrix(g_modelMatrix);
            g_modelMatrix.translate(g_transheadx, g_transheady, 0);
            gl.uniformMatrix4fv(uLoc_modelMatrix, false, g_modelMatrix.elements);
            gl.drawArrays(gl.TRIANGLES, 0, g_vertCount);	// draw all vertices.
        g_modelMatrix = popMatrix();
        }

        //legs
        // front Thighs
        drawfrontThighs();
        {
        pushMatrix(g_modelMatrix);
            // left front
            g_modelMatrix.translate(-0.2,  0.0, 0.1);
            {
            pushMatrix(g_modelMatrix);
                g_modelMatrix.translate(0.0, g_frontlegs, 0.0);
                g_modelMatrix.rotate(g_angle0now, 0, 0, 1);
                gl.uniformMatrix4fv(uLoc_modelMatrix, false, g_modelMatrix.elements);
                gl.drawArrays(gl.TRIANGLES, 0, g_vertCount);	// draw all vertices.
                // calf
                pushMatrix(g_modelMatrix);
                    drawfrontcalves();
                    g_modelMatrix.translate(0, -0.15, 0);
                    g_modelMatrix.rotate(g_angle5now, 0, 0, 1);
                    gl.uniformMatrix4fv(uLoc_modelMatrix, false, g_modelMatrix.elements);
                    gl.drawArrays(gl.TRIANGLES, 0, g_vertCount);	// draw all vertices.
                    // paw
                    drawPaws();
                    g_modelMatrix.translate(-0.05, -0.15, 0);
                    g_modelMatrix.rotate(g_angle9now, 0, 0, 1);
                    gl.uniformMatrix4fv(uLoc_modelMatrix, false, g_modelMatrix.elements);
                    gl.drawArrays(gl.TRIANGLES, 0, g_vertCount);	// draw all vertices.

                g_modelMatrix = popMatrix();

            g_modelMatrix = popMatrix();
            }
            // right front
            drawfrontThighs();
            g_modelMatrix.translate(0, 0.0, -0.25);
            {
            pushMatrix(g_modelMatrix);
                g_modelMatrix.translate(0.0, g_frontlegs, 0.0);
                // angle setting


                g_modelMatrix.rotate(g_angle1now, 0, 0, 1);
                gl.uniformMatrix4fv(uLoc_modelMatrix, false, g_modelMatrix.elements);
                gl.drawArrays(gl.TRIANGLES, 0, g_vertCount);	// draw all vertices.
                // calf
                pushMatrix(g_modelMatrix);
                    drawfrontcalves();
                    g_modelMatrix.translate(0.0, -0.15, 0);
                    g_modelMatrix.rotate(g_angle6now, 0, 0, 1);
                    gl.uniformMatrix4fv(uLoc_modelMatrix, false, g_modelMatrix.elements);
                    gl.drawArrays(gl.TRIANGLES, 0, g_vertCount);	// draw all vertices.
                    // paw
                    drawPaws();
                    g_modelMatrix.translate(-0.05, -0.15, 0);
                    g_modelMatrix.rotate(g_angle9now, 0, 0, 1);
                    gl.uniformMatrix4fv(uLoc_modelMatrix, false, g_modelMatrix.elements);
                    gl.drawArrays(gl.TRIANGLES, 0, g_vertCount);	// draw all vertices.

                g_modelMatrix = popMatrix();
            g_modelMatrix = popMatrix();
            }
            //  right back
            drawbackThighs();
            g_modelMatrix.translate(0.3, 0.0, 0.0);
            {
            pushMatrix(g_modelMatrix);
                g_modelMatrix.rotate(g_angle2now, 0, 0, 1);
                gl.uniformMatrix4fv(uLoc_modelMatrix, false, g_modelMatrix.elements);
                gl.drawArrays(gl.TRIANGLES, 0, g_vertCount);	// draw all vertices.

                pushMatrix(g_modelMatrix);
                    drawbackcalves();
                    g_modelMatrix.translate(0.15, -0.14, 0);
                    g_modelMatrix.rotate(g_angle7now, 0, 0, 1);
                    gl.uniformMatrix4fv(uLoc_modelMatrix, false, g_modelMatrix.elements);
                    gl.drawArrays(gl.TRIANGLES, 0, g_vertCount);	// draw all vertices.

                    drawPaws();
                    g_modelMatrix.translate(-0.05, -0.13, 0);
                    g_modelMatrix.rotate(g_angle10now, 0, 0, 1);
                    gl.uniformMatrix4fv(uLoc_modelMatrix, false, g_modelMatrix.elements);
                    gl.drawArrays(gl.TRIANGLES, 0, g_vertCount);	// draw all vertices.
                g_modelMatrix = popMatrix();
            g_modelMatrix = popMatrix();
            }
            // left back
            drawbackThighs();
            g_modelMatrix.translate(0, 0.0, 0.25);
            {
            pushMatrix(g_modelMatrix);
                g_modelMatrix.rotate(g_angle3now, 0, 0, 1);
                gl.uniformMatrix4fv(uLoc_modelMatrix, false, g_modelMatrix.elements);
                gl.drawArrays(gl.TRIANGLES, 0, g_vertCount);	// draw all vertices.
                pushMatrix(g_modelMatrix);
                    drawbackcalves();
                    g_modelMatrix.translate(0.15, -0.14, 0);
                    g_modelMatrix.rotate(g_angle8now, 0, 0, 1);
                    gl.uniformMatrix4fv(uLoc_modelMatrix, false, g_modelMatrix.elements);
                    gl.drawArrays(gl.TRIANGLES, 0, g_vertCount);	// draw all vertices.

                    drawPaws();
                    g_modelMatrix.translate(-0.05, -0.13, 0);
                    g_modelMatrix.rotate(g_angle10now, 0, 0, 1);
                    gl.uniformMatrix4fv(uLoc_modelMatrix, false, g_modelMatrix.elements);
                    gl.drawArrays(gl.TRIANGLES, 0, g_vertCount);	// draw all vertices.
                g_modelMatrix = popMatrix();

            g_modelMatrix = popMatrix();
            }
        g_modelMatrix = popMatrix();
        }

        // tail
        {
        pushMatrix(g_modelMatrix);
            
            drawTail();
            g_modelMatrix.translate(0.25, 0.05 + g_tail, 0);
            g_modelMatrix.rotate(30, 0, 0, 1);
            g_modelMatrix.rotate(g_angle1now*1.5, 0, 1, 0);
            g_modelMatrix.rotate(g_angle0now * 2, 0, 0, 1);
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
    g_modelMatrix = popMatrix();
    
    return 0;
}


function drawAll() {

    initVertexBuffers();
    // clear <canvas>
    gl.clear(gl.CLEAR_COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    // CLEAR BOTH the color AND the depth buffers before you draw stuff!!
    gl.clear(gl.COLOR_BUFFER_BIT);
    g_modelMatrix.setIdentity();
    // ---------------------------------
    g_modelMatrix.rotate(g_angle01, 1, 1, 1);

    pushMatrix(g_modelMatrix);
        drawLoop();
        //g_modelMatrix.translate(0.0, 0.0, 0.0);	
        gl.uniformMatrix4fv(uLoc_modelMatrix, false, g_modelMatrix.elements);
        gl.drawArrays(gl.TRIANGLES, 0, g_vertCount);	// draw all vertices.
    g_modelMatrix = popMatrix();

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
    

    g_modelMatrix.translate(-0.6, -0.2, 0);	
    g_modelMatrix.translate(g_xKmove, g_yKmove, 0);	
    g_modelMatrix.rotate(40, 0, 0, 1);


    var dist = Math.sqrt(g_xMdragTot*g_xMdragTot + g_yMdragTot*g_yMdragTot);
    						// why add 0.001? avoids divide-by-zero in next statement
    						// in cases where user didn't drag the mouse.)
    g_modelMatrix.rotate(dist*120.0, -g_yMdragTot+0.0001, g_xMdragTot+0.0001, 0.0);
    
    if(keyPressed == "b" && !boneExist)
    {
        console.log(keyPressed);
        keyPressed = "";
        boneExist = true;
        
        console.log(keyPressed);
    }
    if(keyPressed == "b" && boneExist ) {
        console.log(keyPressed);
        keyPressed = "";
        boneExist = false;
        console.log(keyPressed);
    }

    if(boneExist)
    {
        drawBone();
    }

    
}

// function A0_runStop() {
//     //==============================================================================
//     if (g_angle0brake > 0.5)	// if running,
//     {
//         g_angle0brake = 0.0;	// stop, and change button label:
//         document.getElementById("A0button").value = "Angle 0 OFF";
//     }
//     else {
//         g_angle0brake = 1.0;	// Otherwise, go.
//         document.getElementById("A0button").value = "Angle 0 ON-";
//     }
// }
// function A1_runStop() {
//     //==============================================================================
//     if (g_angle1brake > 0.5)	// if running,
//     {
//         g_angle1brake = 0.0;	// stop, and change button label:
//         document.getElementById("A1button").value = "Angle 1 OFF";
//     }
//     else {
//         g_angle1brake = 1.0;	// Otherwise, go.
//         document.getElementById("A1button").value = "Angle 1 ON-";
//     }
// }
// function A2_runStop() {
//     //==============================================================================
//     if (g_angle2brake > 0.5)	// if running,
//     {
//         g_angle2brake = 0.0;	// stop, and change button label:
//         document.getElementById("A2button").value = "Angle 2 OFF";
//     }
//     else {
//         g_angle2brake = 1.0;	// Otherwise, go.
//         document.getElementById("A2button").value = "Angle 2 ON-";
//     }
// }
// function A3_runStop() {
//     //==============================================================================
//     if (g_angle3brake > 0.5)	// if running,
//     {
//         g_angle3brake = 0.0;	// stop, and change button label:
//         document.getElementById("A3button").value = "Angle 3 OFF";
//     }
//     else {
//         g_angle3brake = 1.0;	// Otherwise, go.
//         document.getElementById("A3button").value = "Angle 3 ON-";
//     }
// }



//==================HTML Button Callbacks======================
function angleSubmit() {
    // Called when user presses 'Submit' button on our webpage
    //		HOW? Look in HTML file (e.g. ControlMulti.html) to find
    //	the HTML 'input' element with id='usrAngle'.  Within that
    //	element you'll find a 'button' element that calls this fcn.

    // Read HTML edit-box contents:
    var UsrTxt = document.getElementById('usrAngle').value;
    // Display what we read from the edit-box: use it to fill up
    // the HTML 'div' element with id='editBoxOut':
    document.getElementById('EditBoxOut').innerHTML = 'You Typed: ' + UsrTxt;
    console.log('angleSubmit: UsrTxt:', UsrTxt); // print in console, and
    g_angle01 = parseFloat(UsrTxt);     // convert string to float number 
};

function clearDrag() {
    // Called when user presses 'Clear' button in our webpage
    g_xMdragTot = 0.0;
    g_yMdragTot = 0.0;

    g_xKmove = 0.0;
    g_yKmove = 0.0;
}

function spinUp() {
    // Called when user presses the 'Spin >>' button on our webpage.
    // ?HOW? Look in the HTML file (e.g. ControlMulti.html) to find
    // the HTML 'button' element with onclick='spinUp()'.
    g_angle01Rate += 25;
}

function spinDown() {
    // Called when user presses the 'Spin <<' button
    g_angle01Rate -= 25;
}

function runForBone() {
    g_angle0now = -20;       // init Current rotation angle, in degrees
    g_angle0rate = -40;       // init Rotation angle rate, in degrees/second.
    g_angle0min = -40;       // init min, max allowed angle, in degrees.
    g_angle0max = 50;
    // right front                                //---------------
    g_angle1now = -20; 			// init Current rotation angle, in degrees > 0
    g_angle1rate = -40;				// init Rotation angle rate, in degrees/second.
    g_angle1min = -40;       // init min, max allowed angle, in degrees
    g_angle1max = 50;
    // left back                                 //---------------
    g_angle2now = 20; 			// init Current rotation angle, in degrees.
    g_angle2rate = 40;				// init Rotation angle rate, in degrees/second.
    g_angle2min = -60;       // init min, max allowed angle, in degrees
    g_angle2max = 30;
    // right back
    g_angle3now = 20; 			// init Current rotation angle, in degrees.
    g_angle3rate = 40;				// init Rotation angle rate, in degrees/second.
    g_angle3min = -60;       // init min, max allowed angle, in degrees
    g_angle3max = 30;

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
    g_angle0now = 15;       // init Current rotation angle, in degrees
    g_angle0rate = 10;       // init Rotation angle rate, in degrees/second.
    g_angle0min = -30;       // init min, max allowed angle, in degrees.
    g_angle0max = 30;
    // right front                                //---------------
    g_angle1now = 40; 			// init Current rotation angle, in degrees > 0
    g_angle1rate = -10;				// init Rotation angle rate, in degrees/second.
    g_angle1min = -30;       // init min, max allowed angle, in degrees
    g_angle1max = 30;
    // left back                                 //---------------
    g_angle2now = -15; 			// init Current rotation angle, in degrees.
    g_angle2rate = 10;				// init Rotation angle rate, in degrees/second.
    g_angle2min = -60;       // init min, max allowed angle, in degrees
    g_angle2max = 10;
    // right back
    g_angle3now = -40; 			// init Current rotation angle, in degrees.
    g_angle3rate = -10;				// init Rotation angle rate, in degrees/second.
    g_angle3min = -60;       // init min, max allowed angle, in degrees
    g_angle3max = 10;

    g_anglebody = 0;
    g_transheadx = 0.0;
    g_transheady = 0.0;
    g_frontlegs = 0.0;
    g_tail = 0.0;

    g_angle5now = 0;       // init Current rotation angle, in degrees
    g_angle5rate = 20;       // init Rotation angle rate, in degrees/second.
    g_angle5min = 0;       // init min, max allowed angle, in degrees.
    g_angle5max = 10;
    // right front                                //---------------
    g_angle6now = 0; 			// init Current rotation angle, in degrees > 0
    g_angle6rate = 20;				// init Rotation angle rate, in degrees/second.
    g_angle6min = 0;       // init min, max allowed angle, in degrees
    g_angle6max = 10;
    // left back                                 //---------------
    g_angle7now = 30 			// init Current rotation angle, in degrees.
    g_angle7rate = 40;				// init Rotation angle rate, in degrees/second.
    g_angle7min = 0;       // init min, max allowed angle, in degrees
    g_angle7max = 30;
    // right back
    g_angle8now = 30; 			// init Current rotation angle, in degrees.
    g_angle8rate = 40;				// init Rotation angle rate, in degrees/second.
    g_angle8min = 10;       // init min, max allowed angle, in degrees
    g_angle8max = 30;

    g_angle9now = 0 			// init Current rotation angle, in degrees.
    g_angle9rate = 10;				// init Rotation angle rate, in degrees/second.
    g_angle9min = -20;       // init min, max allowed angle, in degrees
    g_angle9max = 30;
    // right back
    g_angle10now = 0; 			// init Current rotation angle, in degrees.
    g_angle10rate = 10;				// init Rotation angle rate, in degrees/second.
    g_angle10min = 20;       // init min, max allowed angle, in degrees
    g_angle10max = 30;
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


    if (g_angle01Rate * g_angle01Rate > 1) {  // if nonzero rate,
        myTmp = g_angle01Rate;  // store the current rate,
        g_angle01Rate = 0;      // and set to zero.
    }
    else {    // but if rate is zero,
        g_angle01Rate = myTmp;  // use the stored rate.
    }
}

//===================Mouse and Keyboard event-handling Callbacks

function myMouseDown(ev) {
    //==============================================================================
    // Called when user PRESSES down any mouse button;
    // 									(Which button?    console.log('ev.button='+ev.button);   )
    // 		ev.clientX, ev.clientY == mouse pointer location, but measured in webpage 
    //		pixels: left-handed coords; UPPER left origin; Y increases DOWNWARDS (!)  

    // Create right-handed 'pixel' coords with origin at WebGL canvas LOWER left;
    var rect = ev.target.getBoundingClientRect();	// get canvas corners in pixels
    var xp = ev.clientX - rect.left;									// x==0 at canvas left edge
    var yp = g_canvasID.height - (ev.clientY - rect.top);	// y==0 at canvas bottom edge
    //  console.log('myMouseDown(pixel coords): xp,yp=\t',xp,',\t',yp);

    // Convert to Canonical View Volume (CVV) coordinates too:
    var x = (xp - g_canvasID.width / 2) / 		// move origin to center of canvas and
        (g_canvasID.width / 2);			// normalize canvas to -1 <= x < +1,
    var y = (yp - g_canvasID.height / 2) /		//										 -1 <= y < +1.
        (g_canvasID.height / 2);
    //	console.log('myMouseDown(CVV coords  ):  x, y=\t',x,',\t',y);

    g_isDrag = true;											// set our mouse-dragging flag
    g_xMclik = x;													// record where mouse-dragging began
    g_yMclik = y;
    // report on webpage
    document.getElementById('MouseAtResult').innerHTML =
        'Mouse At: ' + x.toFixed(g_digits) + ', ' + y.toFixed(g_digits);
};


function myMouseMove(ev) {
    //==============================================================================
    // Called when user MOVES the mouse with a button already pressed down.
    // 									(Which button?   console.log('ev.button='+ev.button);    )
    // 		ev.clientX, ev.clientY == mouse pointer location, but measured in webpage 
    //		pixels: left-handed coords; UPPER left origin; Y increases DOWNWARDS (!)  

    if (g_isDrag == false) return;				// IGNORE all mouse-moves except 'dragging'

    // Create right-handed 'pixel' coords with origin at WebGL canvas LOWER left;
    var rect = ev.target.getBoundingClientRect();	// get canvas corners in pixels
    var xp = ev.clientX - rect.left;									// x==0 at canvas left edge
    var yp = g_canvasID.height - (ev.clientY - rect.top);	// y==0 at canvas bottom edge
    //  console.log('myMouseMove(pixel coords): xp,yp=\t',xp,',\t',yp);

    // Convert to Canonical View Volume (CVV) coordinates too:
    var x = (xp - g_canvasID.width / 2) / 		// move origin to center of canvas and
        (g_canvasID.width / 2);		// normalize canvas to -1 <= x < +1,
    var y = (yp - g_canvasID.height / 2) /		//									-1 <= y < +1.
        (g_canvasID.height / 2);
    //	console.log('myMouseMove(CVV coords  ):  x, y=\t',x,',\t',y);

    // find how far we dragged the mouse:
    g_xMdragTot += (x - g_xMclik);			// Accumulate change-in-mouse-position,&
    g_yMdragTot += (y - g_yMclik);
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
    //==============================================================================
    // Called when user RELEASES mouse button pressed previously.
    // 									(Which button?   console.log('ev.button='+ev.button);    )
    // 		ev.clientX, ev.clientY == mouse pointer location, but measured in webpage 
    //		pixels: left-handed coords; UPPER left origin; Y increases DOWNWARDS (!)  

    // Create right-handed 'pixel' coords with origin at WebGL canvas LOWER left;
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
    // Report new mouse position:
    document.getElementById('MouseAtResult').innerHTML =
        'Mouse At: ' + x.toFixed(g_digits) + ', ' + y.toFixed(g_digits);
    console.log('myMouseUp: g_xMdragTot,g_yMdragTot =',
        g_xMdragTot.toFixed(g_digits), ',\t', g_yMdragTot.toFixed(g_digits));
};

function myMouseClick(ev) {
    //=============================================================================
    // Called when user completes a mouse-button single-click event 
    // (e.g. mouse-button pressed down, then released)
    // 									   
    //    WHICH button? try:  console.log('ev.button='+ev.button); 
    // 		ev.clientX, ev.clientY == mouse pointer location, but measured in webpage 
    //		pixels: left-handed coords; UPPER left origin; Y increases DOWNWARDS (!) 
    //    See myMouseUp(), myMouseDown() for conversions to  CVV coordinates.

    // STUB
    console.log("myMouseClick() on button: ", ev.button);
}

function myMouseDblClick(ev) {
    //=============================================================================
    // Called when user completes a mouse-button double-click event 
    // 									   
    //    WHICH button? try:  console.log('ev.button='+ev.button); 
    // 		ev.clientX, ev.clientY == mouse pointer location, but measured in webpage 
    //		pixels: left-handed coords; UPPER left origin; Y increases DOWNWARDS (!) 
    //    See myMouseUp(), myMouseDown() for conversions to  CVV coordinates.

    // STUB
    console.log("myMouse-DOUBLE-Click() on button: ", ev.button);
}

function myKeyDown(kev) {
    //===============================================================================
    // Called when user presses down ANY key on the keyboard;
    //
    // For a light, easy explanation of keyboard events in JavaScript,
    // see:    http://www.kirupa.com/html5/keyboard_events_in_javascript.htm
    // For a thorough explanation of a mess of JavaScript keyboard event handling,
    // see:    http://javascript.info/tutorial/keyboard-events
    //
    // NOTE: Mozilla deprecated the 'keypress' event entirely, and in the
    //        'keydown' event deprecated several read-only properties I used
    //        previously, including kev.charCode, kev.keyCode. 
    //        Revised 2/2019:  use kev.key and kev.code instead.
    //
    // Report EVERYTHING in console:


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
        //----------------Arrow keys------------------------
        case "ArrowLeft":
            console.log(' left-arrow.');
            // and print on webpage in the <div> element with id='Result':
            document.getElementById('KeyDownResult').innerHTML =
                'myKeyDown(): Left Arrow=' + kev.keyCode;
            break;
        case "ArrowRight":
            console.log('right-arrow.');
            document.getElementById('KeyDownResult').innerHTML =
                'myKeyDown():Right Arrow:keyCode=' + kev.keyCode;
            break;
        case "ArrowUp":
            console.log('   up-arrow.');
            document.getElementById('KeyDownResult').innerHTML =
                'myKeyDown():   Up Arrow:keyCode=' + kev.keyCode;
            break;
        case "ArrowDown":
            console.log(' down-arrow.');
            document.getElementById('KeyDownResult').innerHTML =
                'myKeyDown(): Down Arrow:keyCode=' + kev.keyCode;
            break;
        default:
            console.log("UNUSED!");
            document.getElementById('KeyDownResult').innerHTML =
                'myKeyDown(): UNUSED!';
            break;
    }
}

function myKeyUp(kev) {
    //===============================================================================
    // Called when user releases ANY key on the keyboard; captures scancodes well

    console.log('myKeyUp()--keyCode=' + kev.keyCode + ' released.');
}