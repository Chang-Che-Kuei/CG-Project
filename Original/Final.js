

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
var numsphereVertices = 0;
var snd;
var colorR = Randomrange( 1,10 );
var colorG = Randomrange( 1,10 );
var colorB = Randomrange( 1,10 );
var tmp1 = Randomrange( 10, 12)/ 10;
var tmp2 = Randomrange( 10, 12)/ 10;
var tmp3 = Randomrange( 10, 12)/ 10;
var tmp_array  = new Array();

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
                           vec4( -s, 0,  -s, 1 ),
                           vec4( -s, 0,   s, 1 ),
                           vec4( s, 0,   s, 1 ),
                           vec4( -s, 0,  -s, 1 ),
                           vec4( s, 0,   s, 1 ),
                           vec4( s, 0,  -s, 1 )
                       ];

var floorColorsArray = [
                           vec4( colorR/10, colorG/10, colorB/10, 1 ),
                           vec4( colorR/10, colorG/10, colorB/10, 1 ),
                           vec4( colorR/10, colorG/10, colorB/10, 1 ),
                           
                           vec4( colorR/10, colorG/10, colorB/10, 1 ),
                           vec4( colorR/10, colorG/10, colorB/10, 1 ),
                           vec4( colorR/10, colorG/10, colorB/10, 1 ),
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



spherePoint = function( theta, phi)
{
    var V = vec4( Math.cos( theta )*Math.cos( phi*tmp1), Math.sin( phi*tmp2 ), Math.sin( theta )*Math.cos( phi*tmp3 ), 1);
    var smallV = scalev( 0.3, V ); // scale the sphere to the range of [-0.5, 0.5]
    pointsArray.push( smallV );
    V[3]=0.1; // convert point to vector
    normalize( V, 1 );
    normalsArray.push( V );
    colorsArray.push( vec4( colorR/10, colorG/10, colorB/10 ) );
    colorR = Randomrange(1,10);
    colorG = Randomrange(1,10);
    colorB = Randomrange(1,10);
    
}

function sphere( mode )
{
    for(var i = 0; i<4 ; ++i )
    {
        tmp_array[i] = Randomrange(1,10)/10;
    }
    var step = 5;
    var rP1, rP2, rT1, rT2;
    var phi, theta, lastPhi=-90, lastTheta=0;
    for (phi=-90+step; phi<=90; phi+=step) {
        rP1 = (lastPhi / 180.0 * Math.PI ) + tmp_array[0];
        rP2 = phi / 180.0 * Math.PI + tmp_array[1];

        for (theta=step; theta<=360; theta+=step) {
            rT1 = lastTheta / 180.0 * (Math.PI) + tmp_array[2];
            rT2 = theta / 180.0 * (Math.PI) + tmp_array[3];
            
            // first triangle, may be skipped for the south pole
            if (lastPhi != -90) {
                spherePoint(rT1, rP1);
                spherePoint(rT2, rP1);
                spherePoint(rT1, rP2);
                numsphereVertices += 3;
            }
            
            // second triangle, may be skipped for the north pole
            if (phi != 90) {
                spherePoint(rT2, rP2);
                spherePoint(rT1, rP2);
                spherePoint(rT2, rP1);
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

var program;
window.onload = function init()
{

    var canvas = document.getElementById( "gl-canvas" );

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

var rotate_speed = 0;
var increase_to_rotate_speed = 1;
var place_you_look_at = [0,0,0];
var move_speed = 0.01;


function Dorolling( mode, xis )
{
    if( mode == 1 ) 
    {
            rotate_speed -= 0.1;
    }
    else if( mode == 2 )
    {

            rotate_speed += 0.1;

    }
    axis = xis;

}
var first_time_role = true;
function Musicdown()
{
    snd = new Audio( "./Music/11 people.mp3" );
    snd.loop = true;
    snd.play();
    first_time_role = false;
}
function DoABarrelRoll( char )
{
    if( first_time_role )
    {
        Musicdown();
    }
    switch( char )
    {
        case 'w': { if(rotate_speed > 0 ) rotate_speed = -rotate_speed; Dorolling(1, xAxis); break; }
        case 's': { if(rotate_speed < 0 ) rotate_speed = -rotate_speed; Dorolling(2, xAxis); break; }
        case 'a': { if(rotate_speed > 0 ) rotate_speed = -rotate_speed; Dorolling(1, yAxis); break; }
        case 'd': { if(rotate_speed < 0 ) rotate_speed = -rotate_speed; Dorolling(2, yAxis); break; }
        case 'e': { if(rotate_speed > 0 ) rotate_speed = -rotate_speed; Dorolling(1, zAxis); break; } 
        case 'q': { if(rotate_speed < 0 ) rotate_speed = -rotate_speed; Dorolling(2, zAxis); break; }
    }


}
var gohereyet = [0,0,0];
var renderfloor = false;

function render()
{
    //if( paused ) modeling = moonRotationMatrix;
    document.onkeydown = function(){
        var keycode = event.which || event.keyCode;
        if( keycode == 87 || keycode == 129 )
            DoABarrelRoll('w');
        else if( keycode == 83 || keycode == 115 )
            DoABarrelRoll('s');
        else if( keycode == 65 || keycode == 98 )
            DoABarrelRoll('a');
        else if( keycode == 68 || keycode == 100 )
            DoABarrelRoll('d');
        else if( keycode == 69 || keycode == 101 )
            DoABarrelRoll('e');
        else if( keycode == 81 || keycode == 113 )
            DoABarrelRoll('q');

    }
    var t = Math.abs(rotate_speed);

    if( (t >= 80 && t < 140) && gohereyet[0]==0 )
    {
        alert("Faster");
        gohereyet[0] = 1;
    }
    else if( t >= 140 && t < 180 && gohereyet[1]==0 )
    {
        alert("even faster");
        gohereyet[1] = 1;
    }
    else if( t >= 180 && gohereyet[2]==0  )
    {
        snd.pause();
        snd = new Audio("./Music/kirby.mp3");
        snd.play();

        gohereyet[2] = 1;
        /*
        floor();
        SetBuffer(program);
        */
        renderfloor = true;
        rotate_speed = 1000;

        snd.onended = function(){ alert( "Game set.\nGood Bye ~~~"); window.location.href = '/closekiosk'; }
    }
    if( renderfloor == true )
    {
        axis = Randomrange(0,2);
    }


    modeling = mult(rotate(theta[xAxis], 1, 0, 0),
                 mult(rotate(theta[yAxis], 0, 1, 0),rotate(theta[zAxis], 0, 0, 1)));

    viewing = lookAt( vec3( eyePosition ), place_you_look_at, [0,1,0] );

    projection = perspective( 45, 1, 0.55, 3.0 );

    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );

    if( !paused ) theta[axis] += rotate_speed;
    if( depthTest ) gl.enable( gl.DEPTH_TEST );
    else gl.disable( gl.DEPTH_TEST );

    gl.uniformMatrix4fv( modelingLoc,   0, flatten( modeling ) );
    gl.uniformMatrix4fv( viewingLoc,    0, flatten( viewing ) );
    gl.uniformMatrix4fv( projectionLoc, 0, flatten( projection ) );

    //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    //*** Q5 Hint: You may need to call drawArrays() more than once with proper setting of
    //    transformation matrices in each call.
    //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    //gl.drawArrays( gl.TRIANGLES, 0, numCubeVertices);


    gl.uniformMatrix4fv( modelingLoc,   0, flatten( modeling ) );
    gl.drawArrays( gl.TRIANGLES, 0, numsphereVertices );
    gl.uniform1f( thetaLoc, add );



    requestAnimFrame( render );
}

