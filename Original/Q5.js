


//順時鐘手轉


var gl;
var xAxis = 0;
var yAxis = 1;
var zAxis = 2;

var add = 0.3;
var axis = 1;
var theta = [ 0, 0, 0 ];
var paused = 0;
var depthTest = 1;

// event handlers for mouse input (borrowed from "Learning WebGL" lesson 11)
var mouseDown = false;
var lastMouseX = null;
var lastMouseY = null;

var moonRotationMatrix = mat4();
var succeed = 0;

// ModelView and Projection matrices
var modelingLoc, viewingLoc, projectionLoc;
var modeling, viewing, projection;

var numCubeVertices  = 36;
var numFloorVertices = 6;

var pointsArray = [];
var colorsArray = [];
var normalsArray = [];

var eyePosition = vec4( 0.0, 0.0, 3.0, 1.0 );
var lightPosition = vec4( 5.0, 20.0, 10.0, 1.0 );

var materialAmbient = vec4( 0.25, 0.25, 0.25, 1.0 );
var materialDiffuse = vec4( 0.8, 0.8, 0.8, 1.0 );
var materialSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );
var materialShininess = 50.0;

var vBuffer;
var vPosition;
var cBuffer;
var vColor;
var nBuffer;
var vNormal;
var ans = 0;
var clockwise = false;
var vertices = [
                   vec4( -0.5, -0.5,  0.5, 1 ),
                   vec4( -0.5,  0.5,  0.5, 1 ),
                   vec4( 0.5,  0.5,  0.5, 1 ),
                   vec4( 0.5, -0.5,  0.5, 1 ),
                   vec4( -0.5, -0.5, -0.5, 1 ),
                   vec4( -0.5,  0.5, -0.5, 1 ),
                   vec4( 0.5,  0.5, -0.5, 1 ),
                   vec4( 0.5, -0.5, -0.5, 1 )
               ];

// Using off-white cube for testing
var vertexColors = [
                       vec4( 1.0, 1.0, 0.8, 1.0 ),
                       vec4( 1.0, 1.0, 0.8, 1.0 ),
                       vec4( 1.0, 1.0, 0.8, 1.0 ),
                       vec4( 1.0, 1.0, 0.8, 1.0 ),
                       vec4( 1.0, 1.0, 0.8, 1.0 ),
                       vec4( 1.0, 1.0, 0.8, 1.0 ),
                       vec4( 1.0, 1.0, 0.8, 1.0 ),
                       vec4( 1.0, 1.0, 0.8, 1.0 )
                   ];

var count = 0;

function Round( x, y, is_clockwise )
{
    if( is_clockwise == true )
    {
        if( count == 0 && x > 358 && y > 358 )
            count = 1;
        else if( count == 1 && x < 200 && y > 358 )
            count = 2;
        else if( count == 2 && x < 200 && y < 153 )
            count = 3;
        else if( count == 3 && x > 358 && y < 153 )
        {
            count = 0;
            ans += 1;
        }
    }
    else if( is_clockwise == false )
    {
        if( count == 0 && x > 358 && y > 358 )
            count = 1;
        else if( count == 1 && x > 358 && y < 153 )
            count = 2;
        else if( count == 2 && x < 200 && y < 153 )
            count = 3;
        else if( count == 3 && x < 200 && y > 358 )
        {
            count = 0;
            ans += 1;
        }
    }
}
function handleMouseDown( event )
{
    mouseDown = true;
    lastMouseX = event.clientX;
    lastMouseY = event.clientY;
}

function handleMouseUp( event )
{
    mouseDown = false;
}


function handleMouseMove( event )
{
    if( !mouseDown )
    {
        return;
    }

    var newX = event.clientX;
    var newY = event.clientY;
    Round( newX, newY, clockwise);
    var deltaX = newX - lastMouseX;
    var newRotationMatrix = rotate( deltaX/10, 0, 1, 0 );

    var deltaY = newY - lastMouseY;
    newRotationMatrix = mult( rotate( deltaY/10, 1, 0, 0 ), newRotationMatrix );

    moonRotationMatrix = mult( newRotationMatrix, moonRotationMatrix );

    lastMouseX = newX;
    lastMouseY = newY;
}

// event handlers for button clicks
function rotateX()
{
    paused = 0;
    axis = xAxis;
};
function rotateY()
{
    paused = 0;
    axis = yAxis;
};
function rotateZ()
{
    paused = 0;
    axis = zAxis;
};



var s = 1e2;
var floorPointsArray = [
                           // vec4( -0.7, -0.6,  -0.7, 1 ),
                           // vec4( -0.7, -0.6,   0.7, 1 ),
                           // vec4(  0.7, -0.6,   0.7, 1 ),
                           // vec4( -0.7, -0.6,  -0.7, 1 ),
                           // vec4(  0.7, -0.6,   0.7, 1 ),
                           // vec4(  0.7, -0.6,  -0.7, 1 )
                           vec4( -s, -1,  -s, 1 ),
                           vec4( -s, -1,   s, 1 ),
                           vec4( s, -1,   s, 1 ),
                           vec4( -s, -1,  -s, 1 ),
                           vec4( s, -1,   s, 1 ),
                           vec4( s, -1,  -s, 1 )
                       ];

var floorColorsArray = [
                           vec4( 0.3, 0.7, 0.0, 1 ),
                           vec4( 0.3, 0.7, 0.0, 1 ),
                           vec4( 0.3, 0.7, 0.0, 1 ),
                           vec4( 0.3, 0.7, 0.0, 1 ),
                           vec4( 0.3, 0.7, 0.0, 1 ),
                           vec4( 0.3, 0.7, 0.0, 1 )
                       ];

var floorNormalsArray = [
                            vec4( 0, 1.0, 0, 0 ),
                            vec4( 0, 1.0, 0, 0 ),
                            vec4( 0, 1.0, 0, 0 ),
                            vec4( 0, 1.0, 0, 0 ),
                            vec4( 0, 1.0, 0, 0 ),
                            vec4( 0, 1.0, 0, 0 )
                        ];

function floor()
{
    for( var i=0; i < floorPointsArray.length; ++i )
    {
        pointsArray.push( floorPointsArray[i] );
        colorsArray.push( floorColorsArray[i] );
        normalsArray.push( floorNormalsArray[i] );
    }
}


var numsphereVertices = 0;

var num1 = Randomrange( 5, 10 );
var num2 = Randomrange( 5, 10 );
var num3 = Randomrange( 5, 10 );
var colorR = Randomrange( 1,10 );
var colorG = Randomrange( 1,10 );
var colorB = Randomrange( 1,10 );

spherePoint = function( theta, phi, mode, pos )
{
    var V = vec4( Math.cos( theta )*Math.cos( phi )*num1/10 + pos[0], Math.sin( phi )*num2/10 + pos[1], Math.sin( theta )*Math.cos( phi )*num3/10+ pos[2], 1 );
    var smallV = scalev( 0.3, V ); // scale the sphere to the range of [-0.5, 0.5]
    pointsArray.push( smallV );
    V[3]=0.1; // convert point to vector
    normalize( V, 1 );
    normalsArray.push( V );
    colorsArray.push( vec4( colorR/10, colorG/10, colorB/10 ) );
}

function sphere( mode )
{

    var step = 10;
    var rP1, rP2, rT1, rT2;
    var phi, theta, lastPhi=-90, lastTheta=0;
    var pos = vec3( 0,0,1 );

    for( phi=-90+step; phi<=90; phi+=step )
    {
        rP1 = lastPhi / 180.0 * Math.PI;
        rP2 = phi / 180.0 * Math.PI;

        for( theta=step; theta<=360; theta+=step )
        {
            rT1 = lastTheta / 180.0 * ( Math.PI );
            rT2 = theta / 180.0 * ( Math.PI );

            // first triangle, may be skipped for the south pole
            if( lastPhi != -90 )
            {
                spherePoint( rT1, rP1, mode, pos );
                spherePoint( rT2, rP1, mode, pos );
                spherePoint( rT1, rP2, mode, pos );
                numsphereVertices += 3;
            }

            // second triangle, may be skipped for the north pole
            if( phi != 90 )
            {
                spherePoint( rT2, rP2, mode, pos );
                spherePoint( rT1, rP2, mode, pos );
                spherePoint( rT2, rP1, mode, pos );
                numsphereVertices += 3;
            }
            lastTheta = theta;
        }
        lastPhi = phi;
    }
}

function SetBuffer( program )
{


    vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten( pointsArray ), gl.STATIC_DRAW );

    vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    // color array atrribute buffer
    cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten( colorsArray ), gl.STATIC_DRAW );
    //gl.bufferData( gl.ARRAY_BUFFER, flatten(ball.colorsArray), gl.STATIC_DRAW );

    vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    // normal array atrribute buffer

    nBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten( normalsArray ), gl.STATIC_DRAW );
    //gl.bufferData( gl.ARRAY_BUFFER, flatten(ball.normalsArray), gl.STATIC_DRAW );

    vNormal = gl.getAttribLocation( program, "vNormal" );
    gl.vertexAttribPointer( vNormal, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vNormal );



}

var time=13000;//設定倒數10秒
function DisableEnable( objid )
{


    if( time<=0 )
    {
        document.getElementById( objid ).value='Time out!';
        document.getElementById( objid ).disabled= true;
        //alert( ans );
        if( ans >= 15 )
        {
            alert( "Because of your gentle touch, your egg has transformed into a wonderful thing." );
            var r = confirm( "Want to see that?" );
            if( r == true )
            {
                document.location.href="Final.html";
            }
            else
            {
                alert( "Good Bye" );
                window.close();
            }
        }
        else
        {
            alert( "I'm sorry, you seems to be not trying hard." );
            alert( "Please try again" );
            window.location.reload();
        }
    }
    else
    {
        document.getElementById( objid ).disabled = true;
        if( time > 7000 )
        {
            document.getElementById( objid ).value = ( time-7000 )/1000;
        }
        else if( time == 7000 )
        {
            document.getElementById( objid ).value = "GO";
            paused = !paused;
            moonRotationMatrix = mat4();
        }
        else
        {
            document.getElementById( objid ).value = "You still have " + ( time/1000 ) + " s";
        }
        setTimeout( "DisableEnable('" + objid + "')",1000 );

    }

    time-=1000;
}


var program;
window.onload = function init()
{
    var canvas = document.getElementById( "gl-canvas" );
    var snd = new Audio( "./Music/Mii Channel Music.mp3" );
    snd.loop = true;
    snd.play();
    gl = WebGLUtils.setupWebGL( canvas );
    if( !gl )
    {
        alert( "WebGL isn't available" );
    }
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );


    sphere( 0 );
    SetBuffer( program );



    // uniform variables in shaders
    modelingLoc   = gl.getUniformLocation( program, "modelingMatrix" );
    viewingLoc    = gl.getUniformLocation( program, "viewingMatrix" );
    projectionLoc = gl.getUniformLocation( program, "projectionMatrix" );
    thetaLoc = gl.getUniformLocation( program, "add" );

    gl.uniform4fv( gl.getUniformLocation( program, "eyePosition" ),
                   flatten( eyePosition ) );
    gl.uniform4fv( gl.getUniformLocation( program, "lightPosition" ),
                   flatten( lightPosition ) );
    gl.uniform4fv( gl.getUniformLocation( program, "materialAmbient" ),
                   flatten( materialAmbient ) );
    gl.uniform4fv( gl.getUniformLocation( program, "materialDiffuse" ),
                   flatten( materialDiffuse ) );
    gl.uniform4fv( gl.getUniformLocation( program, "materialSpecular" ),
                   flatten( materialSpecular ) );
    gl.uniform1f( gl.getUniformLocation( program, "shininess" ), materialShininess );

    //event listeners for buttons
    document.getElementById( "CounterButton" ).onclick = function()
    { 
        clockwise = !clockwise;
        if( clockwise )
            document.getElementById( this.id ).value = "clockwise";
        else
            document.getElementById( this.id ).value = "counter clockwise";

     };
    document.getElementById( "button1" ).onclick = function()
    {
        snd.pause();

        snd = new Audio( "./Music/Rolling music.mp3" );
        snd.play();

        DisableEnable( this.id );
    };

    // event handlers for mouse input (borrowed from "Learning WebGL" lesson 11)
    canvas.onmousedown = handleMouseDown;
    document.onmouseup = handleMouseUp;
    document.onmousemove = handleMouseMove;

    render();
};
var go = 1;
function Randomrange( a, b )
{
    return Math.floor( ( Math.random() * b ) + a );
}

var rotate_speed = 2;
var increase_to_rotate_speed = 1;
var place_you_look_at = [0,0,0];
var move_speed = 0.01;




function render()
{
    if( paused ) modeling = moonRotationMatrix;

    else
        modeling = rotate( 0, 1, 0, 0 );
    viewing = lookAt( vec3( eyePosition ), place_you_look_at, [0,1,0] );

    projection = perspective( 60, 1.0, 0.25, 3.0 );

    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );

    if( !paused ) theta[axis] += rotate_speed;
    if( depthTest ) gl.enable( gl.DEPTH_TEST );
    else gl.disable( gl.DEPTH_TEST );

    gl.uniformMatrix4fv( modelingLoc,   0, flatten( modeling ) );
    gl.uniformMatrix4fv( viewingLoc,    0, flatten( viewing ) );
    gl.uniformMatrix4fv( projectionLoc, 0, flatten( projection ) );



    gl.uniformMatrix4fv( modelingLoc,   0, flatten( modeling ) );
    gl.drawArrays( gl.TRIANGLES, 0, numsphereVertices );
    gl.uniform1f( thetaLoc, add );


    requestAnimFrame( render );
}

