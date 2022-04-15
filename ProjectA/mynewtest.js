// These is the test js file with newtest.html
// By Sylvia Li in Northwestern U, Mudd lib

// Vertex shader prog
var VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +
    'uniform mat4 u_modelMatrix;\n' +
    'void main() {\n' +
    '  gl_Position = u_modelMatrix * a_Position;\n' +
    '}\n';

// Fragment shader prog
var FSHADER_SOURCE =
    'void main() {\n' +
    '  gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n' +
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

    gl.clearColor(0,1,1,1);

    g_modelMatrix = new Matrix4();

    uLoc_modelMatrix = gl.getUniformLocation(gl.program, 'u_modelMatrix');
    if (!uLoc_modelMatrix) {
        console.log('Failed to get the storage location of u_modelMatrix');
        return;
    }

    // var tick = function() {
    //     requestAnimationFrame(tick, g_canvasID);
    //     timerAll();
    //     drawAll();
    // }

    // tick();
    drawAll();
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

    var vertices = new Float32Array ([
        0.00, 0.30, 0.00, 1.00,
        -0.50, 0.00, 0.00, 1.00,
        0.50, 0.00, 0.00, 1.00,

        0.00, -0.30, 0.00, 1.00,
        -0.50, 0.00, 0.00, 1.00,
        0.50, 0.00, 0.00, 1.00,

        -0.50, 0.00, 0.00, 1.00,
        -0.50, 0.15, 0.00, 1.00,
        -0.40, 0.20, 0.00, 1.00,

        0.50, 0.00, 0.00, 1.00,
        0.50, 0.15, 0.00, 1.00,
        0.40, 0.20, 0.00, 1.00,
    ]);
    g_vertCount = 12;

    var vertexBufferID = gl.createBuffer();
    if (!vertexBufferID) {
        console.log('Failed to create the buffer object');
        return -1;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBufferID);

    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    var aLoc_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if(aLoc_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return -2;
    }

    gl.vertexAttribPointer(aLoc_Position, 4, gl.FLOAT, false, 0, 0);

    gl.enableVertexAttribArray(aLoc_Position);
    return 0;
}

function drawAll() {
    gl.clear(gl.COLOR_BUFFER_BIT);

    g_modelMatrix.setIdentity();

    pushMatrix(g_modelMatrix);
        gl.uniformMatrix4fv(uLoc_modelMatrix, false, g_modelMatrix.elements);

        gl.drawArrays(gl.TRIANGLES, 0, g_vertCount);
    
        
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
    