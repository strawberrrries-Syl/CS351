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
    'precision mediump float;\n' +
    'varying vec4 v_Color;\n' +
    'void main() {\n' +
    '  gl_FragColor = v_Color;\n' +
    '}\n';


//// ------------------------------------
//            global variable
//// ------------------------------------

var gl;
var g_canvasID = document.getElementById('webgl');
var g_modelMatrix;
var g_vertCount;
var uLoc_modelMatrix;

// For animation:---------------------
var g_lastMS = Date.now();
var g_isRun = true;                 // run/stop for animation; used in tick().
var g_lastMS = Date.now();    			// Timestamp for most-recently-drawn image; 
// in milliseconds; used by 'animate()' fcn 
// (now called 'timerAll()' ) to find time
// elapsed since last on-screen image.
// used for turning whole scene.
var g_angle01 = 0;                  // initial rotation angle
var g_angle01Rate = 45.0;           // rotation speed, in degrees/second 
//------------For mouse click-and-drag: -------------------------------
var g_isDrag = false;		// mouse-drag: true when user holds down mouse button
var g_xMclik = 0.0;			// last mouse button-down position (in CVV coords)
var g_yMclik = 0.0;
var g_xMdragTot = 0.0;	// total (accumulated) mouse-drag amounts (in CVV coords).
var g_yMdragTot = 0.0;
var g_digits = 5;			// DIAGNOSTICS: # of digits to print in console.log (

var cloud_x = 0, cloud_y = 0;
var a_X = 0, a_y = 0;
var target_x, target_y;
var bf_target_x, bf_target_y;

//    console.log('xVal:', xVal.toFixed(g_digits)); // print 5 digits
var g_xKmove = 0.0;	// total (accumulated) keyboard-drag amounts (in CVV coords).
var g_yKmove = 0.0;
// All of our time-dependent params (you can add more!)
// flags of movement
var SW = 0;                     // flag of switching dog to sit or walk
var Run = false;                // flag of switchinf dog to walk or run
var boneExist = false;          // flag of whether bone is showing
var keyPressed;                 // 

// ============================
// self-rotating varialbles:
// ============================
// left front leg                                //---------------
var g_angle0now = 0.0;       // init Current rotation angle, in degrees
var g_angle0rate = 0.0;       // init Rotation angle rate, in degrees/second.
var g_angle0brake = 1.0;				// init Speed control; 0=stop, 1=full speed.
var g_angle0min = 0.0;       // init min, max allowed angle, in degrees.
var g_angle0max = 0.0;
// right front leg                                //---------------
var g_angle1now = 0.0; 			// init Current rotation angle, in degrees > 0
var g_angle1rate = 0.0;				// init Rotation angle rate, in degrees/second.
var g_angle1brake = 1.0;				// init Rotation start/stop. 0=stop, 1=full speed.
var g_angle1min = 0.0;       // init min, max allowed angle, in degrees
var g_angle1max = 0.0;
// left back leg                                 //---------------
var g_angle2now = -60; 			// init Current rotation angle, in degrees.
var g_angle2rate = 0.0;				// init Rotation angle rate, in degrees/second.
var g_angle2brake = 1.0;				// init Speed control; 0=stop, 1=full speed.
var g_angle2min = 0.0;       // init min, max allowed angle, in degrees
var g_angle2max = 0.0;
// right back leg
var g_angle3now = -60; 			// init Current rotation angle, in degrees.
var g_angle3rate = 0.0;				// init Rotation angle rate, in degrees/second.
var g_angle3brake = 1.0;				// init Speed control; 0=stop, 1=full speed.
var g_angle3min = 0.0;       // init min, max allowed angle, in degrees
var g_angle3max = 0.0;

// loop                                 //---------------
var g_angle4now = 0.0;       // init Current rotation angle, in degrees
var g_angle4rate = 0.0;       // init Rotation angle rate, in degrees/second.
var g_angle4brake = 1.0;				// init Speed control; 0=stop, 1=full speed.
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


// body position --> for reseting sit/walk dog's gesture
var g_anglebody = -50; 			// init Current rotation angle, in degrees.
var g_transheadx = 0.15;
var g_transheady = 0.25;
var g_frontlegs = 0.1;
var g_tail = -0.2;

// rigid objects' starting position and length.
var loop_S, loop_C, grid_S, grid_C;
var cube_S, cube_C, axis_S, axis_C;
var head_S, head_C;
var body_S, body_C;
var fthigh_S, fthigh_C, bthigh_S, bthigh_C;
var fcalf_S, fcalf_C, bcalf_S, bcalf_C;
var paw_S, paw_C, tail_S, tail_C;
var cloud_C, cloud_S;

//// ------------------------------------
//         global variable end
//// ------------------------------------

function main() {
    // set sitting parameters (global variables)
    sit();
    // Retrieve <canvas> element
    // Get the rendering context for WebGL
    gl = g_canvasID.getContext("webgl", { preserveDrawingBuffer: true });
    if (!gl) {
        console.log('Failed to get the rendering context for WebGL. Bye!');
        return;
    }

    gl.enable(gl.DEPTH_TEST); 
    /*//
    gl.clearDepth(0.0); 
    gl.depthFunc(gl.GREATER);
    //===================================================================== */

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

    // setting background color
    gl.clearColor(0.4, 0.2, 0.8, 0.5);   // stored in gl.COLOR_BUFFER_BIT

    g_modelMatrix = new Matrix4();

    uLoc_modelMatrix = gl.getUniformLocation(gl.program, 'u_modelMatrix');  // = u_ModelMatrix in starter code BasicShapesCam
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
        drawResize()
        //drawAll();
        document.getElementById('CurAngleDisplay').innerHTML =
            'g_angle01= ' + g_angle01.toFixed(g_digits);
        // Also display our current mouse-dragging state:
        document.getElementById('Mouse').innerHTML =
            'Mouse Drag totals (CVV coords):\t' +
            g_xMdragTot.toFixed(5) + ', \t' + g_yMdragTot.toFixed(g_digits);
    }

    //drawResize();   
    tick();
    //drawAll();
}

function drawResize() {
    //==============================================================================
    // Called when user re-sizes their browser window , because our HTML file
    // contains:  <body onload="main()" onresize="winResize()">
    
        //Report our current browser-window contents:
    
        console.log('g_canvasID width,height=', g_canvasID.width, g_canvasID.height);		
        console.log('Browser window: innerWidth,innerHeight=', 
                                                                    innerWidth, innerHeight);	
                                                                    // http://www.w3schools.com/jsref/obj_window.asp
        //Make canvas fill the top 3/4 of our browser window:
        var xtraMargin = 16;    // keep a margin (otherwise, browser adds scroll-bars)
        g_canvasID.width = innerWidth - xtraMargin;
        g_canvasID.height = (innerHeight*2/3) - xtraMargin;
        //g_canvasID.width = g_canvasID.height;

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
    // thighs
    [g_angle0now, g_angle0rate] = rotateNow(g_angle0now, g_angle0rate, 1, elapsedMS, g_angle0min, g_angle0max);
    [g_angle1now, g_angle1rate] = rotateNow(g_angle1now, g_angle1rate, 1, elapsedMS, g_angle1min, g_angle1max);
    [g_angle2now, g_angle2rate] = rotateNow(g_angle2now, g_angle2rate, 1, elapsedMS, g_angle2min, g_angle2max);
    [g_angle3now, g_angle3rate] = rotateNow(g_angle3now, g_angle3rate, 1, elapsedMS, g_angle3min, g_angle3max);
    // loop
    //[g_angle4now, g_angle4rate] = rotateNow(g_angle4now, g_angle4rate, g_angle4brake, elapsedMS, g_angle4min, g_angle4max);
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
}

function initVertexBuffers() {
    // vertices information
    var v_ans = loopV();
    loop_S = 0;
    loop_C = v_ans.length / 7;

    var curr_v = cubeV();
    v_ans = Array.prototype.concat.call(
        v_ans, curr_v,
    );
    cube_S = loop_C;
    cube_C = curr_v.length / 7;
    curr_v.clear;

    curr_v = bodyV();
    body_S = v_ans.length/7;
    body_C = curr_v.length/7;
    v_ans = Array.prototype.concat.call(
        v_ans, curr_v,
    );
    curr_v.clear;

    curr_v = headV();
    head_S = v_ans.length / 7;
    head_C = curr_v.length / 7;
    v_ans = Array.prototype.concat.call(
        v_ans, curr_v,
    );
    curr_v.clear;

    curr_v = fthighV();
    fthigh_S = v_ans.length / 7;
    fthigh_C = curr_v.length / 7;
    v_ans = Array.prototype.concat.call(
        v_ans, curr_v,
    );
    curr_v.clear;

    curr_v = bthighV();
    bthigh_S = v_ans.length / 7;
    bthigh_C = curr_v.length / 7;
    v_ans = Array.prototype.concat.call(
        v_ans, curr_v,
    );
    curr_v.clear;

    curr_v = fcalfV();
    fcalf_S = v_ans.length / 7;
    fcalf_C = curr_v.length / 7;
    v_ans = Array.prototype.concat.call(
        v_ans, curr_v,
    );
    curr_v.clear;

    curr_v = bcalfV();
    bcalf_S = v_ans.length / 7;
    bcalf_C = curr_v.length / 7;
    v_ans = Array.prototype.concat.call(
        v_ans, curr_v,
    );
    curr_v.clear;
    
    curr_v = pawV();
    paw_S = v_ans.length / 7;
    paw_C = curr_v.length / 7;
    v_ans = Array.prototype.concat.call(
        v_ans, curr_v,
    );
    curr_v.clear;

    curr_v = tailV();
    tail_S = v_ans.length / 7;
    tail_C = curr_v.length / 7;
    v_ans = Array.prototype.concat.call(
        v_ans, curr_v,
    );
    curr_v.clear;

    curr_v = cloudV();
    cloud_S = v_ans.length / 7;
    cloud_C = curr_v.length / 7;
    v_ans = Array.prototype.concat.call(
        v_ans, curr_v,
    );
    curr_v.clear;

    curr_v = groundgridV();
    grid_S = v_ans.length / 7;
    grid_C = curr_v.length / 7;
    v_ans = Array.prototype.concat.call(
        v_ans, curr_v,
    );
    curr_v.clear;

    curr_v = axisV();
    axis_S = v_ans.length / 7;
    axis_C = curr_v.length / 7;
    v_ans = Array.prototype.concat.call(
        v_ans, curr_v,
    );
    curr_v.clear;


    var vertices = new Float32Array(v_ans);
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

{
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
        }
        return ans_ver;
    }

    function drawLoop() {
        pushMatrix(g_modelMatrix);
            gl.uniformMatrix4fv(uLoc_modelMatrix, false, g_modelMatrix.elements);
            gl.drawArrays(gl.TRIANGLES, loop_S, loop_C);	// draw all vertices.
        g_modelMatrix = popMatrix();
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

        var vertices = Array.prototype.concat.call(
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
        );
        
        return vertices;
    }

    function drawBone() {
        pushMatrix(g_modelMatrix);
            pushMatrix(g_modelMatrix);
            gl.uniformMatrix4fv(uLoc_modelMatrix, false, g_modelMatrix.elements);
            gl.drawArrays(gl.LINES, axis_S, axis_C);	// draw all vertices.
            popMatrix(g_modelMatrix);

        //drawSquare();
            pushMatrix(g_modelMatrix);
            //g_modelMatrix.translate(-0.1, 0.2, 0.0);	
            g_modelMatrix.scale(0.1, 0.1, 0.1);				// Make new drawing axes that
            gl.uniformMatrix4fv(uLoc_modelMatrix, false, g_modelMatrix.elements);
            gl.drawArrays(gl.TRIANGLES, cube_S, cube_C);	// draw all vertices.
            
            g_modelMatrix.translate(0.8, 0.0, 0.0);
            gl.uniformMatrix4fv(uLoc_modelMatrix, false, g_modelMatrix.elements);
            gl.drawArrays(gl.TRIANGLES, cube_S, cube_C);	// draw all vertices.

            g_modelMatrix.translate(0.0, -2, 0.0);
            gl.uniformMatrix4fv(uLoc_modelMatrix, false, g_modelMatrix.elements);
            gl.drawArrays(gl.TRIANGLES, cube_S, cube_C);	// draw all vertices.

            g_modelMatrix.translate(-0.8, 0.0, 0.0);
            gl.uniformMatrix4fv(uLoc_modelMatrix, false, g_modelMatrix.elements);
            gl.drawArrays(gl.TRIANGLES, cube_S, cube_C);	// draw all vertices.
            popMatrix(g_modelMatrix);

        g_modelMatrix.scale(0.8, 3.5, 0.8);				// Make new drawing axes that
        g_modelMatrix.translate(0.5, 0.465, 0.0);
        gl.uniformMatrix4fv(uLoc_modelMatrix, false, g_modelMatrix.elements);
        gl.drawArrays(gl.TRIANGLES, cube_S, cube_C);	// draw all vertices.

        popMatrix(g_modelMatrix);
    }

    // dog's part
    {
        function bodyV () {
            // vertices information
            var v1 = [-0.3, 0.15, 0.05, 1.0, 0.6, 0.3, 0.2,];
            var v2 = [-0.3, 0.0, 0.05, 1.0, 0.6, 0.3, 0.2,];
            var v3 = [-0.2, 0.1, 0.1, 1.0, 1.0, 1.0, 1.0,];
            var v4 = [-0.2, -0.1, 0.1, 1.0,  0.6, 0.4, 0.2,];
            var v5 = [0.3, 0.1, 0.1, 1.0,  0.6, 0.4, 0.2,];
            var v6 = [0.3, -0.1, 0.1, 1.0,  0.3, 0.1, 0.2,];
            var v7 = [0.3, 0.1, -0.1, 1.0, 0.0, 0.0, 0.0,];
            var v8 = [0.3, -0.1, -0.1, 1.0,  0.6, 0.3, 0.2,];
            var v9 = [-0.2, 0.1, -0.1, 1.0,  0.6, 0.3, 0.2,];
            var v10 = [-0.2, -0.1, -0.1, 1.0, 1.0, 1.0, 1.0,];
            var v11 = [-0.3, 0.15, -0.05, 1.0, 0.3, 0.1, 0.2,];
            var v12 = [-0.3, 0.0, -0.05, 1.0, 0.3, 0.1, 0.2,];

            var vertices = Array.prototype.concat.call(
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
            );
            return vertices;
        }

        function headV () {
            // vertices information
            var v1 = [-0.6, 0.05, 0.05, 1.0, 0.8, 0.0, 0.0,];
            var v2 = [-0.6, 0.05, -0.05, 1.0, 0.8, 0.0, 0.0,];
            var v3 = [-0.6, -0.03, 0.05, 1.0, 0.8, 0.0, 0.0,];
            var v4 = [-0.6, -0.03, -0.05, 1.0, 0.8, 0.0, 0.0,];

            var v5 = [-0.5, 0.05, 0.05, 1.0, 1.0, 1.0, 1.0,];
            var v6 = [-0.5, 0.05, -0.05, 1.0, 1.0, 1.0, 1.0,];

            var v7 = [-0.45, 0.2, 0.15, 1.0,  0.8, 0.5, 0.2,];
            var v8 = [-0.45, -0.05, 0.15, 1.0,  0.8, 0.5, 0.20,];
            var v9 = [-0.3, -0.05, 0.15, 1.0, 0.8, 0.5, 0.2,];
            var v10 = [-0.3, 0.2, 0.15, 1.0, 0.8, 0.5, 0.2,];

            var v11 = [-0.3, -0.05, -0.15, 1.0,  0.8, 0.5, 0.4,];
            var v12 = [-0.3, 0.2, -0.15, 1.0,0.8, 0.5, 0.4,];
            var v13 = [-0.45, 0.2, -0.15, 1.0, 1.0, 1.0, 1.0,];
            var v14 = [-0.45, -0.05, -0.15, 1.0, 1.0, 1.0, 1.0,];

            var v15 = [-0.4, 0.3, 0.1, 1.0, 1.0, 0.8, 0.6,];
            var v16 = [-0.4, 0.3, -0.1, 1.0, 1.0, 0.8, 0.6,];

            var v17 = [-0.4, 0.2, 0.05, 1.0, 1.0, 0.8, 0.6,];
            var v18 = [-0.4, 0.2, -0.05, 1.0, 1.0, 0.8, 0.6,];

            var vertices = Array.prototype.concat.call(
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
            );
            return vertices;
        }

        function fthighV () {
            // vertices information
            var v1 = [0.0, 0.02, 0.05, 1.0, 0.8, 0.5, 0.2,];
            var v2 = [0.0, -0.18, 0.05, 1.0,0.8, 0.5, 0.2,];
            var v3 = [0.05, -0.18, 0.05, 1.0, 1.0, 1.0, 1.0,];
            var v4 = [0.1, 0.02, 0.05, 1.0, 1.0, 1.0, 1.0,];
            var v5 = [0.05, -0.18, 0.0, 1.0, 1.0, 1.0, 1.0,];
            var v6 = [0.1, 0.02, 0.0, 1.0, 1.0, 1.0, 1.0,];
            var v7 = [0.0, 0.02, 0.0, 1.0, 0.0, 0.0, 0.0,];
            var v8 = [0.0, -0.18, 0.0, 1.0, 0.0, 0.0, 0.0,];

            var vertices = Array.prototype.concat.call(
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
            );
            return vertices;
        }

        function bthighV () {
            // vertices information
            var v1 = [0.0, 0.0, 0.1, 1.0, 0.8, 0.5, 0.2,];
            var v2 = [0.2, -0.15, 0.1, 1.0, 0.8, 0.5, 0.2,];
            var v3 = [0.25, -0.15, 0.1, 1.0, 1.0, 1.0, 1.0,];
            var v4 = [0.22, 0.0, 0.1, 1.0, 1.0, 1.0, 1.0,];
            var v5 = [0.25, -0.15, 0.0, 1.0, 1.0, 1.0, 1.0,];
            var v6 = [0.22, 0.0, 0.0, 1.0, 1.0, 1.0, 1.0,];
            var v7 = [0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0,];
            var v8 = [0.2, -0.15, 0.0, 1.0, 0.0, 0.0, 0.0,];

            var vertices = Array.prototype.concat.call(
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
            );
            return vertices;
        }

        function fcalfV () {
            // vertices information
            var v1 = [0.0, 0.0, 0.05, 1.0, 0.8, 0.5, 0.2,];
            var v2 = [0.0, -0.15, 0.05, 1.0, 0.8, 0.5, 0.2,];
            var v3 = [0.025, -0.15, 0.05, 1.0, 1.0, 1.0, 1.0,];
            var v4 = [0.05, 0.0, 0.05, 1.0, 1.0, 1.0, 1.0,];
            var v5 = [0.025, -0.15, 0.0, 1.0, 1.0, 1.0, 1.0,];
            var v6 = [0.05, 0.0, 0.0, 1.0, 1.0, 1.0, 1.0,];
            var v7 = [0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0,];
            var v8 = [0.0, -0.15, 0.0, 1.0, 0.0, 0.0, 0.0,];

            var vertices = Array.prototype.concat.call(
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
            );
            return vertices;
        }

        function bcalfV () {
            // vertices information
            var v1 = [0.02, 0.05, 0.1, 1.0, 0.8, 0.5, 0.2,];
            var v2 = [0.0, -0.15, 0.05, 1.0, 0.8, 0.5, 0.2,];
            var v3 = [0.05, -0.15, 0.05, 1.0, 1.0, 1.0, 1.0,];
            var v4 = [0.11, 0.05, 0.1, 1.0, 1.0, 1.0, 1.0,];
            var v5 = [0.05, -0.15, 0.0, 1.0, 1.0, 1.0, 1.0,];
            var v6 = [0.11, 0.05, 0.0, 1.0, 1.0, 1.0, 1.0,];
            var v7 = [0.02, 0.05, 0.0, 1.0, 0.0, 0.0, 0.0,];
            var v8 = [0.05, -0.15, 0.0, 1.0, 0.0, 0.0, 0.0,];
    
            var vertices = Array.prototype.concat.call(
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
            );
            return vertices;
        }

        function pawV () {
            // vertices information
            var v1 = [0.0, 0.0, 0.05, 1.0, 0.8, 0.5, 0.2,];
            var v2 = [0.0, -0.05, 0.05, 1.0, 0.8, 0.5, 0.2,];
            var v3 = [0.1, -0.05, 0.05, 1.0, 0.7, 0.4, 0.2,];
            var v4 = [0.1, 0.0, 0.05, 1.0, 0.7, 0.4, 0.2,];
            var v5 = [0.1, -0.05, 0.0, 1.0, 1.0, 1.0, 1.0,];
            var v6 = [0.1, 0.0, 0.0, 1.0, 1.0, 1.0, 1.0,];
            var v7 = [0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0,];
            var v8 = [0.0, -0.05, 0.0, 1.0, 0.0, 0.0, 0.0,];

            var vertices = Array.prototype.concat.call(
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
            );
            return vertices;
        }

        function tailV () {
            // vertices information
            var v1 = [0.0, 0.0, 0.05, 1.0, 0.6, 0.4, 0.2,];
            var v2 = [0.0, -0.05, 0.05, 1.0, 1.0, 1.0, 0.0,];
            var v3 = [0.25, -0.05, 0.05, 1.0, 1.0, 1.0, 0.0,];
            var v4 = [0.25, 0.0, 0.05, 1.0, 0.9, 0.7, 0.2,];
            var v5 = [0.25, -0.05, 0.0, 1.0, 0.9, 0.7, 0.2,];
            var v6 = [0.25, 0.0, 0.0, 1.0, 0.6, 0.4, 0.2,];
            var v7 = [0.0, 0.0, 0.0, 1.0, 1.0, 1.0, 0.0,];
            var v8 = [0.0, -0.05, 0.0, 1.0, 0.6, 0.4, 0.2,];

            var vertices = Array.prototype.concat.call(
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
            );

            return vertices;
        }

        function drawDog() {
            pushMatrix(g_modelMatrix);
                // body
                pushMatrix(g_modelMatrix);
                    g_modelMatrix.rotate(g_anglebody, 0, 0, 1);
                    gl.uniformMatrix4fv(uLoc_modelMatrix, false, g_modelMatrix.elements);
                    gl.drawArrays(gl.TRIANGLES, body_S, body_C);	// draw all vertices.
                g_modelMatrix = popMatrix();
                // head
                pushMatrix(g_modelMatrix);
                    g_modelMatrix.translate(g_transheadx, g_transheady, 0);
                    gl.uniformMatrix4fv(uLoc_modelMatrix, false, g_modelMatrix.elements);
                    gl.drawArrays(gl.TRIANGLES, head_S, head_C);	// draw all vertices.
                g_modelMatrix = popMatrix();
        
                //legs
                // front Thighs
                {
                pushMatrix(g_modelMatrix);
                    // left front
                    g_modelMatrix.translate(-0.2,  0.0, 0.1);
                    {
                    pushMatrix(g_modelMatrix);
                        // thigh 
                        g_modelMatrix.translate(0.0, g_frontlegs, 0.0);
                        g_modelMatrix.rotate(g_angle0now, 0, 0, 1);
                        gl.uniformMatrix4fv(uLoc_modelMatrix, false, g_modelMatrix.elements);
                        gl.drawArrays(gl.TRIANGLES, fthigh_S, fthigh_C);	// draw all vertices.
                        // calf
                        pushMatrix(g_modelMatrix);

                            g_modelMatrix.translate(0, -0.15, 0);
                            g_modelMatrix.rotate(g_angle5now, 0, 0, 1);
                            gl.uniformMatrix4fv(uLoc_modelMatrix, false, g_modelMatrix.elements);
                            gl.drawArrays(gl.TRIANGLES, fcalf_S, fcalf_C);	// draw all vertices.
                            // paw
                            g_modelMatrix.translate(-0.05, -0.15, 0);
                            g_modelMatrix.rotate(g_angle9now, 0, 0, 1);
                            gl.uniformMatrix4fv(uLoc_modelMatrix, false, g_modelMatrix.elements);
                            gl.drawArrays(gl.TRIANGLES, paw_S, paw_C);	// draw all vertices.
        
                        g_modelMatrix = popMatrix();
        
                    g_modelMatrix = popMatrix();
                    }
                    // right front
                    g_modelMatrix.translate(0, 0.0, -0.25);
                    
                    pushMatrix(g_modelMatrix);
                        // f thigh
                        g_modelMatrix.translate(0.0, g_frontlegs, 0.0);
                        g_modelMatrix.rotate(g_angle1now, 0, 0, 1);
                        gl.uniformMatrix4fv(uLoc_modelMatrix, false, g_modelMatrix.elements);
                        gl.drawArrays(gl.TRIANGLES, fthigh_S, fthigh_C);	// draw all vertices.
                        // f calf
                        pushMatrix(g_modelMatrix);
                            g_modelMatrix.translate(0.0, -0.15, 0);
                            g_modelMatrix.rotate(g_angle6now, 0, 0, 1);
                            gl.uniformMatrix4fv(uLoc_modelMatrix, false, g_modelMatrix.elements);
                            gl.drawArrays(gl.TRIANGLES, fcalf_S, fcalf_C);	// draw all vertices.
                            // paw
                            g_modelMatrix.translate(-0.05, -0.15, 0);
                            g_modelMatrix.rotate(g_angle9now, 0, 0, 1);
                            gl.uniformMatrix4fv(uLoc_modelMatrix, false, g_modelMatrix.elements);
                            gl.drawArrays(gl.TRIANGLES, paw_S, paw_C);	// draw all vertices.
        
                        g_modelMatrix = popMatrix();
                    g_modelMatrix = popMatrix();
                    
                    //  right back
                    g_modelMatrix.translate(0.3, 0.0, 0.0);
                    
                    pushMatrix(g_modelMatrix);
                        // bthigh
                        g_modelMatrix.rotate(g_angle2now, 0, 0, 1);
                        gl.uniformMatrix4fv(uLoc_modelMatrix, false, g_modelMatrix.elements);
                        gl.drawArrays(gl.TRIANGLES, bthigh_S, bthigh_C);	// draw all vertices.
                        // b calf
                        pushMatrix(g_modelMatrix);
                            g_modelMatrix.translate(0.15, -0.14, 0);
                            g_modelMatrix.rotate(g_angle7now, 0, 0, 1);
                            gl.uniformMatrix4fv(uLoc_modelMatrix, false, g_modelMatrix.elements);
                            gl.drawArrays(gl.TRIANGLES, bcalf_S, bcalf_C);	// draw all vertices.
                            // paw
                            g_modelMatrix.translate(-0.05, -0.13, 0);
                            g_modelMatrix.rotate(g_angle10now, 0, 0, 1);
                            gl.uniformMatrix4fv(uLoc_modelMatrix, false, g_modelMatrix.elements);
                            gl.drawArrays(gl.TRIANGLES, paw_S, paw_C);	// draw all vertices.
                        
                        g_modelMatrix = popMatrix();

                    g_modelMatrix = popMatrix();
                    
                    // left back thigh
                    g_modelMatrix.translate(0, 0.0, 0.25);
                    
                    pushMatrix(g_modelMatrix);
                        g_modelMatrix.rotate(g_angle3now, 0, 0, 1);
                        gl.uniformMatrix4fv(uLoc_modelMatrix, false, g_modelMatrix.elements);
                        gl.drawArrays(gl.TRIANGLES, bthigh_S, bthigh_C);	// draw all vertices.
                        pushMatrix(g_modelMatrix);
                            // b calf
                            g_modelMatrix.translate(0.15, -0.14, 0);
                            g_modelMatrix.rotate(g_angle8now, 0, 0, 1);
                            gl.uniformMatrix4fv(uLoc_modelMatrix, false, g_modelMatrix.elements);
                            gl.drawArrays(gl.TRIANGLES, bcalf_S, bcalf_C);	// draw all vertices.
                            // paws
                            g_modelMatrix.translate(-0.05, -0.13, 0);
                            g_modelMatrix.rotate(g_angle10now, 0, 0, 1);
                            gl.uniformMatrix4fv(uLoc_modelMatrix, false, g_modelMatrix.elements);
                            gl.drawArrays(gl.TRIANGLES, paw_S, paw_C);	// draw all vertices.
                        g_modelMatrix = popMatrix();
        
                    g_modelMatrix = popMatrix();
                    
                g_modelMatrix = popMatrix();
                }
        
                // tail
                
                pushMatrix(g_modelMatrix);
                    
                    g_modelMatrix.translate(0.25, 0.05 + g_tail, 0);
                    g_modelMatrix.rotate(30, 0, 0, 1);
                    g_modelMatrix.rotate(g_angle1now*1, 0, 1, 0);
                    g_modelMatrix.rotate(g_angle0now * 1, 0, 0, 1);
                    gl.uniformMatrix4fv(uLoc_modelMatrix, false, g_modelMatrix.elements);
                    gl.drawArrays(gl.TRIANGLES, tail_S, tail_C);	// draw all vertices.
        
                    g_modelMatrix.translate(0.22, -0.01, 0);
                    g_modelMatrix.scale(0.5, 1, 1);
                    g_modelMatrix.rotate(30, 0, 0, 1);
                    gl.uniformMatrix4fv(uLoc_modelMatrix, false, g_modelMatrix.elements);
                    gl.drawArrays(gl.TRIANGLES, tail_S, tail_C);	// draw all vertices.
        
                    g_modelMatrix.translate(0.22, -0.01, 0);
                    g_modelMatrix.scale(0.2, 1, 1);
                    g_modelMatrix.rotate(30, 0, 0, 1);
                    gl.uniformMatrix4fv(uLoc_modelMatrix, false, g_modelMatrix.elements);
                    gl.drawArrays(gl.TRIANGLES, tail_S, tail_C);	// draw all vertices.
                
                g_modelMatrix = popMatrix();
                
            g_modelMatrix = popMatrix();
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
                v1, v1_b, v24_b,
                v1, v24_b, v24,

                v2, v2_b, v1_b,
                v2, v1_b, v1,

                v3, v3_b, v2_b,
                v3, v2_b, v2,

                v4, v4_b, v3_b,
                v4, v3_b, v3,

                v5, v5_b, v4_b,
                v5, v4_b, v4,

                v6, v6_b, v5_b,
                v6, v5_b, v5,

                v7, v7_b, v6_b,
                v7, v6_b, v6,

                v8, v8_b, v7_b,
                v8, v7_b, v7,

                v9, v9_b, v8_b,
                v9, v8_b, v8,

                v10, v10_b, v9_b,
                v10, v9_b, v9,

                v11, v11_b, v10_b,
                v11, v10_b, v10,

                v12, v12_b, v11_b,
                v12, v11_b, v11,

                v13, v13_b, v12_b,
                v13, v12_b, v12,

                v14, v14_b, v13_b,
                v14, v13_b, v13,

                v15, v15_b, v14_b,
                v15, v14_b, v14,

                v16, v16_b, v15_b,
                v16, v15_b, v15,

                v17, v17_b, v16_b,
                v17, v16_b, v16,

                v18, v18_b, v17_b,
                v18, v17_b, v17,

                v19, v19_b, v18_b,
                v19, v18_b, v18,

                v20, v20_b, v19_b,
                v20, v19_b, v19,

                v21, v21_b, v20_b,
                v21, v20_b, v20,

                v22, v22_b, v21_b,
                v22, v21_b, v21,

                v23, v23_b, v22_b,
                v23, v22_b, v22,

                v24, v24_b, v23_b,
                v24, v23_b, v23,
                // front:
                v2, v1, v24,
                v2, v24, v23,
                v1_b, v2_b, v24_b, 
                v2_b, v23_b, v24_b,

                v4, v3, v22,
                v3_b, v4_b, v22_b,
                v6, v4, v22,
                v4_b, v6_b, v22_b,
                v6, v5, v4,
                v5_b, v6_b, v4_b,
                v7, v6, v22,
                v6_b, v7_b, v22_b,
                v7, v21, v22,
                v21_b, v7_b, v22_b,
                v8, v7, v21,
                v7_b, v8_b, v21_b,

                v10, v9, v20,
                v9_b, v10_b, v20_b,
                v10, v20, v19,
                v20_b, v10_b, v19_b,

                v11, v18, v12,
                v18_b, v11_b, v12_b,
                v12, v18, v17,
                v18_b, v12_b, v17_b,

                v14, v13, v16,
                v13_b, v14_b, v16_b,
                v14, v16, v15,
                v14_b, v15_b, v16_b,
            );
            return vertices;
        }

        function drawCloud() {
            pushMatrix(g_modelMatrix);
                drawAxis();
                gl.uniformMatrix4fv(uLoc_modelMatrix, false, g_modelMatrix.elements);
                gl.drawArrays(gl.TRIANGLES, cloud_S, cloud_C);	// draw all vertices.
                g_modelMatrix.scale(0.6, 0.6, 0.5);
                g_modelMatrix.translate(0.3, 0.05, 0.2);
                gl.uniformMatrix4fv(uLoc_modelMatrix, false, g_modelMatrix.elements);
                gl.drawArrays(gl.TRIANGLES, cloud_S, cloud_C);	// draw all vertices.
                g_modelMatrix.translate(0, 0, -0.3);
                gl.uniformMatrix4fv(uLoc_modelMatrix, false, g_modelMatrix.elements);
                gl.drawArrays(gl.TRIANGLES, cloud_S, cloud_C);	// draw all vertices.
            g_modelMatrix = popMatrix();
        }

    }   // =========== end dog parts ============

    function groundgridV() {
        var ans_ver;
        var x_max = 100;

        var x_num = -100;
        var x_gap = 1;

        while(x_num < x_max) {
            x_num = x_num + x_gap;
            var p1 = [x_num, -1, -100, 1.0, 204/255, 255/255, 229/255,];
            var p2 = [x_num, -1, 3, 1.0, 204/255, 255/255, 229/255,];

            var p3 = [-100, -1, x_num, 1.0, 255/255, 229/255, 204/255,];
            var p4 = [100, -1, x_num, 1.0, 255/255, 229/255, 204/255,];

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
        }
        return ans_ver;
    }

    function drawGrid() {
        pushMatrix(g_modelMatrix);
            gl.uniformMatrix4fv(uLoc_modelMatrix, false, g_modelMatrix.elements);
            //console.log("before draw-----");
            gl.drawArrays(gl.LINES, grid_S, grid_C);	// draw all vertices.
            //console.log("end draw-----");
        g_modelMatrix = popMatrix();
        return 0;
    }

    function axisV() {
        var v1 = [-0.3, 0.0, 0.0, 1.0, 1.0, 0.0, 0.0,];
        var v2 = [0.3, 0.0, 0.0, 1.0, 1.0, 0.0, 0.0,];
        var v3 = [0.0, -0.3, 0.0, 1.0, 0.0, 1.0, 0.0,];
        var v4 = [0.0, 0.3, 0.0, 1.0, 0.0, 1.0, 0.0,];
        var v5 = [0.0, 0.0, -0.3, 1.0, 0.0, 0.0, 1.0,];
        var v6 = [0.0, 0.0, 0.3, 1.0, 0.0, 0.0, 1.0,];

        var vertices = Array.prototype.concat.call(
            v1, v2,
            v3, v4,
            v5, v6,
        );
        
        return vertices;
    }

    function drawAxis() {
        pushMatrix(g_modelMatrix);
            gl.uniformMatrix4fv(uLoc_modelMatrix, false, g_modelMatrix.elements);
            //console.log("before draw-----");
            gl.drawArrays(gl.LINES, axis_S, axis_C);	// draw all vertices.
            //console.log("end draw-----");
        g_modelMatrix = popMatrix();
        return 0;
    }

    function setTarget() {
        target_x = Math.random() * 2 - 1;
        target_y = Math.random() * 2 - 1;

        a_x = (target_x - cloud_x) / 600;
        a_y = (target_y - cloud_y) / 600;
        return 0;
    }

    function drawThings() {
        pushMatrix(g_modelMatrix);


        
        g_modelMatrix.rotate(g_angle01, 1, 1, 1);

        pushMatrix(g_modelMatrix);
            g_modelMatrix.translate(0, -1, 0);
            g_modelMatrix.scale(4, 4, 4);
            drawAxis();
        g_modelMatrix = popMatrix();
        
        drawGrid();

        pushMatrix(g_modelMatrix);
            g_modelMatrix.rotate(g_angle4now, 0, 0, 1);
            drawLoop();
        g_modelMatrix = popMatrix();

        // cloud
        pushMatrix(g_modelMatrix);
            g_modelMatrix.scale(0.6, 0.6, 0.6);
            g_modelMatrix.rotate(g_angle11now * 2, 1, 0, 0);
            g_modelMatrix.rotate(g_angle11now, 0, 1, 0);
            g_modelMatrix.translate(-0.35, 0, 0);

            
            if(Math.abs(cloud_x - target_x) > 0.0001  || Math.abs(cloud_y - target_y) > 0.0001)
            {
                cloud_x = cloud_x + a_x;
                cloud_y = cloud_y + a_y;
                g_modelMatrix.translate(cloud_x, cloud_y, 0);
                
            } else {
                setTarget();
                g_modelMatrix.translate(cloud_x, cloud_y, 0);
            }
            // console.log(target_x, target_y);
            // console.log(target_y);
            drawCloud();
            
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

        pushMatrix(g_modelMatrix);
            g_modelMatrix.translate(-0.6, -0.2, 0);	
            g_modelMatrix.translate(g_xKmove, g_yKmove, 0);	
            g_modelMatrix.rotate(40, 0, 0, 1);

            var dist = Math.sqrt(g_xMdragTot*g_xMdragTot + g_yMdragTot*g_yMdragTot);
            g_modelMatrix.rotate(dist*120.0, -g_yMdragTot+0.0001, g_xMdragTot+0.0001, 0.0);
            
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

        g_modelMatrix = popMatrix();
        return 0;
    }

}


function drawAll() {
    initVertexBuffers();
    // clear <canvas>
    gl.clear(gl.CLEAR_COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    // CLEAR BOTH the color AND the depth buffers before you draw stuff!!
    gl.clear(gl.COLOR_BUFFER_BIT);
    g_modelMatrix.setIdentity();
    // ---------------------------------
    //
    // set perspective:


    gl.viewport(0,											// Viewport lower-left corner
				0, 			// location(in pixels)
                g_canvasID.width/2, 				// viewport width,
                g_canvasID.height);			// viewport height in pixels.

    var vpAspect = g_canvasID.width/2 /			// On-screen aspect ratio for
                    (g_canvasID.height);	// this camera: width/height.

    pushMatrix(g_modelMatrix);
                   
    g_modelMatrix.perspective(  35.0,
                                vpAspect,
                                1,
                                1000.0);

    g_modelMatrix.lookAt(   0, 0, 5,	// center of projection
                            0, 0, 0,	// look-at point 
                            0.0, 1.0, 0.0);	// View UP vector.

                            // orth (left, right, bottom, top, near, far). A square
                            // perspective (fov, aspect, near, far)
    
    // g_modelMatrix.rotate(g_angle01, 1, 1, 1);
    // ---------------------------------
    drawThings();
    g_modelMatrix = popMatrix();



    gl.viewport(g_canvasID.width/2,											// Viewport lower-left corner
				0, 			// location(in pixels)
                g_canvasID.width/2, 				// viewport width,
                g_canvasID.height);			// viewport height in pixels.


    pushMatrix(g_modelMatrix);
    g_modelMatrix.perspective(  35.0,
                                vpAspect,
                                1,
                                1000.0);

    g_modelMatrix.lookAt(   0, 0, 5,	// center of projection
                            0, 0, 0,	// look-at point 
                            0.0, 1.0, 0.0);	// View UP vector.


    //g_modelMatrix.rotate(g_angle01, 1, 1, 1);
    // ---------------------------------
    drawThings();
    
    g_modelMatrix = popMatrix();



    return 0;
}

// input handling
{
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
        console.log("myMouse-DOUBLE-Click() on button: ", ev.button);
    }
    
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
    }