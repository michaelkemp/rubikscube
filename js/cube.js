$(document).ready(function(){
    var textureLoader = new THREE.TextureLoader();
    var KTex = textureLoader.load("images/black.png"); 
    var RTex = textureLoader.load("images/red.png"); 
    var OTex = textureLoader.load("images/orange.png"); 
    var YTex = textureLoader.load("images/yellow.png"); 
    var GTex = textureLoader.load("images/green.png"); 
    var BTex = textureLoader.load("images/blue.png"); 
    var WTex = textureLoader.load("images/white.png"); 
    
    var K = new THREE.MeshBasicMaterial({ map:KTex, side:THREE.DoubleSide });
    var R = new THREE.MeshBasicMaterial({ map:RTex, side:THREE.DoubleSide });
    var O = new THREE.MeshBasicMaterial({ map:OTex, side:THREE.DoubleSide });
    var Y = new THREE.MeshBasicMaterial({ map:YTex, side:THREE.DoubleSide });
    var G = new THREE.MeshBasicMaterial({ map:GTex, side:THREE.DoubleSide });
    var B = new THREE.MeshBasicMaterial({ map:BTex, side:THREE.DoubleSide });
    var W = new THREE.MeshBasicMaterial({ map:WTex, side:THREE.DoubleSide });
     
    var cubieSize = 64;
    var cubies = new Array(), cube = new Array(), pivot = new Array();

    var qtrTurn = Math.PI/2;
    var SPEED = qtrTurn/10;
    var NEWSPEED = qtrTurn/10;

    var WIDTH = 500, HEIGHT = 500;
    var VIEW_ANGLE = 30, ASPECT = WIDTH / HEIGHT,  NEAR = 0.1,  FAR = 10000;
    var CANVAS = $('#cube-canvas');
    var CANVASID = 'rubikscube';
    var renderer, camera, scene, material, geometry, controls;
    var startTime = Date.now();
    var moveArray = new Array();
    var moving=false;

    var RT=0, LT=1, UP=2, DN=3, FT=4, BK=5;
    
    $("#cube-canvas").css({"width":WIDTH+"px","height":HEIGHT+"px",});

    function setCubies() {
        // ================================ DOTS ================================ 
        cubies.push( {name:"R",    dot:true,edg:false,cnr:false, xTrn:0,yTrn:0,zTrn:0, xOff:0,yOff:0,zOff:0, U:false,E: true,D:false, F:false,S: true,B:false, L:false,M:false,R: true, color: [R,K,K,K,K,K], coldir: ["R","K","K","K","K","K"], xPos: cubieSize,   yPos: 0,            zPos: 0         } );
        cubies.push( {name:"O",    dot:true,edg:false,cnr:false, xTrn:0,yTrn:0,zTrn:0, xOff:0,yOff:0,zOff:0, U:false,E: true,D:false, F:false,S: true,B:false, L: true,M:false,R:false, color: [K,O,K,K,K,K], coldir: ["K","O","K","K","K","K"], xPos:-cubieSize,   yPos: 0,            zPos: 0         } );
        cubies.push( {name:"Y",    dot:true,edg:false,cnr:false, xTrn:0,yTrn:0,zTrn:0, xOff:0,yOff:0,zOff:0, U: true,E:false,D:false, F:false,S: true,B:false, L:false,M: true,R:false, color: [K,K,Y,K,K,K], coldir: ["K","K","Y","K","K","K"], xPos: 0,           yPos: cubieSize,    zPos: 0         } );
        cubies.push( {name:"W",    dot:true,edg:false,cnr:false, xTrn:0,yTrn:0,zTrn:0, xOff:0,yOff:0,zOff:0, U:false,E:false,D: true, F:false,S: true,B:false, L:false,M: true,R:false, color: [K,K,K,W,K,K], coldir: ["K","K","K","W","K","K"], xPos: 0,           yPos:-cubieSize,    zPos: 0         } );
        cubies.push( {name:"B",    dot:true,edg:false,cnr:false, xTrn:0,yTrn:0,zTrn:0, xOff:0,yOff:0,zOff:0, U:false,E: true,D:false, F: true,S:false,B:false, L:false,M: true,R:false, color: [K,K,K,K,B,K], coldir: ["K","K","K","K","B","K"], xPos: 0,           yPos: 0,            zPos: cubieSize } );
        cubies.push( {name:"G",    dot:true,edg:false,cnr:false, xTrn:0,yTrn:0,zTrn:0, xOff:0,yOff:0,zOff:0, U:false,E: true,D:false, F:false,S:false,B: true, L:false,M: true,R:false, color: [K,K,K,K,K,G], coldir: ["K","K","K","K","K","G"], xPos: 0,           yPos: 0,            zPos:-cubieSize } );
        
        // ================================ EDGES ================================ 
        cubies.push( {name:"RB",   dot:false,edg:true,cnr:false, xTrn:0,yTrn:0,zTrn:0, xOff:0,yOff:0,zOff:0, U:false,E: true,D:false, F: true,S:false,B:false, L:false,M:false,R: true, color: [R,K,K,K,B,K], coldir: ["R","K","K","K","B","K"], xPos: cubieSize,   yPos: 0,            zPos: cubieSize } );
        cubies.push( {name:"RY",   dot:false,edg:true,cnr:false, xTrn:0,yTrn:0,zTrn:0, xOff:0,yOff:0,zOff:0, U: true,E:false,D:false, F:false,S: true,B:false, L:false,M:false,R: true, color: [R,K,Y,K,K,K], coldir: ["R","K","Y","K","K","K"], xPos: cubieSize,   yPos: cubieSize,    zPos: 0         } );
        cubies.push( {name:"RG",   dot:false,edg:true,cnr:false, xTrn:0,yTrn:0,zTrn:0, xOff:0,yOff:0,zOff:0, U:false,E: true,D:false, F:false,S:false,B: true, L:false,M:false,R: true, color: [R,K,K,K,K,G], coldir: ["R","K","K","K","K","G"], xPos: cubieSize,   yPos: 0,            zPos:-cubieSize } );
        cubies.push( {name:"RW",   dot:false,edg:true,cnr:false, xTrn:0,yTrn:0,zTrn:0, xOff:0,yOff:0,zOff:0, U:false,E:false,D: true, F:false,S: true,B:false, L:false,M:false,R: true, color: [R,K,K,W,K,K], coldir: ["R","K","K","W","K","K"], xPos: cubieSize,   yPos:-cubieSize,    zPos: 0         } );

        cubies.push( {name:"OB",   dot:false,edg:true,cnr:false, xTrn:0,yTrn:0,zTrn:0, xOff:0,yOff:0,zOff:0, U:false,E: true,D:false, F: true,S:false,B:false, L: true,M:false,R:false, color: [K,O,K,K,B,K], coldir: ["K","O","K","K","B","K"], xPos:-cubieSize,   yPos: 0,            zPos: cubieSize } );
        cubies.push( {name:"OY",   dot:false,edg:true,cnr:false, xTrn:0,yTrn:0,zTrn:0, xOff:0,yOff:0,zOff:0, U: true,E:false,D:false, F:false,S: true,B:false, L: true,M:false,R:false, color: [K,O,Y,K,K,K], coldir: ["K","O","Y","K","K","K"], xPos:-cubieSize,   yPos: cubieSize,    zPos: 0         } );
        cubies.push( {name:"OG",   dot:false,edg:true,cnr:false, xTrn:0,yTrn:0,zTrn:0, xOff:0,yOff:0,zOff:0, U:false,E: true,D:false, F:false,S:false,B: true, L: true,M:false,R:false, color: [K,O,K,K,K,G], coldir: ["K","O","K","K","K","G"], xPos:-cubieSize,   yPos: 0,            zPos:-cubieSize } );
        cubies.push( {name:"OW",   dot:false,edg:true,cnr:false, xTrn:0,yTrn:0,zTrn:0, xOff:0,yOff:0,zOff:0, U:false,E:false,D: true, F:false,S: true,B:false, L: true,M:false,R:false, color: [K,O,K,W,K,K], coldir: ["K","O","K","W","K","K"], xPos:-cubieSize,   yPos:-cubieSize,    zPos: 0         } );
        
        cubies.push( {name:"WB",   dot:false,edg:true,cnr:false, xTrn:0,yTrn:0,zTrn:0, xOff:0,yOff:0,zOff:0, U:false,E:false,D: true, F: true,S:false,B:false, L:false,M: true,R:false, color: [K,K,K,W,B,K], coldir: ["K","K","K","W","B","K"], xPos: 0,           yPos:-cubieSize,    zPos: cubieSize } );
        cubies.push( {name:"YB",   dot:false,edg:true,cnr:false, xTrn:0,yTrn:0,zTrn:0, xOff:0,yOff:0,zOff:0, U: true,E:false,D:false, F: true,S:false,B:false, L:false,M: true,R:false, color: [K,K,Y,K,B,K], coldir: ["K","K","Y","K","B","K"], xPos: 0,           yPos: cubieSize,    zPos: cubieSize } );
        cubies.push( {name:"YG",   dot:false,edg:true,cnr:false, xTrn:0,yTrn:0,zTrn:0, xOff:0,yOff:0,zOff:0, U: true,E:false,D:false, F:false,S:false,B: true, L:false,M: true,R:false, color: [K,K,Y,K,K,G], coldir: ["K","K","Y","K","K","G"], xPos: 0,           yPos: cubieSize,    zPos:-cubieSize } );
        cubies.push( {name:"WG",   dot:false,edg:true,cnr:false, xTrn:0,yTrn:0,zTrn:0, xOff:0,yOff:0,zOff:0, U:false,E:false,D: true, F:false,S:false,B: true, L:false,M: true,R:false, color: [K,K,K,W,K,G], coldir: ["K","K","K","W","K","G"], xPos: 0,           yPos:-cubieSize,    zPos:-cubieSize } );
        
        // ================================ CORNERS ================================ 
        cubies.push( {name:"RYB",  dot:false,edg:false,cnr:true, xTrn:0,yTrn:0,zTrn:0, xOff:0,yOff:0,zOff:0, U: true,E:false,D:false, F: true,S:false,B:false, L:false,M:false,R: true, color: [R,K,Y,K,B,K], coldir: ["R","K","Y","K","B","K"], xPos: cubieSize,   yPos: cubieSize,    zPos: cubieSize } );
        cubies.push( {name:"RYG",  dot:false,edg:false,cnr:true, xTrn:0,yTrn:0,zTrn:0, xOff:0,yOff:0,zOff:0, U: true,E:false,D:false, F:false,S:false,B: true, L:false,M:false,R: true, color: [R,K,Y,K,K,G], coldir: ["R","K","Y","K","K","G"], xPos: cubieSize,   yPos: cubieSize,    zPos:-cubieSize } );
        cubies.push( {name:"OYG",  dot:false,edg:false,cnr:true, xTrn:0,yTrn:0,zTrn:0, xOff:0,yOff:0,zOff:0, U: true,E:false,D:false, F:false,S:false,B: true, L: true,M:false,R:false, color: [K,O,Y,K,K,G], coldir: ["K","O","Y","K","K","G"], xPos:-cubieSize,   yPos: cubieSize,    zPos:-cubieSize } );
        cubies.push( {name:"OYB",  dot:false,edg:false,cnr:true, xTrn:0,yTrn:0,zTrn:0, xOff:0,yOff:0,zOff:0, U: true,E:false,D:false, F: true,S:false,B:false, L: true,M:false,R:false, color: [K,O,Y,K,B,K], coldir: ["K","O","Y","K","B","K"], xPos:-cubieSize,   yPos: cubieSize,    zPos: cubieSize } );
        cubies.push( {name:"RWB",  dot:false,edg:false,cnr:true, xTrn:0,yTrn:0,zTrn:0, xOff:0,yOff:0,zOff:0, U:false,E:false,D: true, F: true,S:false,B:false, L:false,M:false,R: true, color: [R,K,K,W,B,K], coldir: ["R","K","K","W","B","K"], xPos: cubieSize,   yPos:-cubieSize,    zPos: cubieSize } );
        cubies.push( {name:"RWG",  dot:false,edg:false,cnr:true, xTrn:0,yTrn:0,zTrn:0, xOff:0,yOff:0,zOff:0, U:false,E:false,D: true, F:false,S:false,B: true, L:false,M:false,R: true, color: [R,K,K,W,K,G], coldir: ["R","K","K","W","K","G"], xPos: cubieSize,   yPos:-cubieSize,    zPos:-cubieSize } );
        cubies.push( {name:"OWG",  dot:false,edg:false,cnr:true, xTrn:0,yTrn:0,zTrn:0, xOff:0,yOff:0,zOff:0, U:false,E:false,D: true, F:false,S:false,B: true, L: true,M:false,R:false, color: [K,O,K,W,K,G], coldir: ["K","O","K","W","K","G"], xPos:-cubieSize,   yPos:-cubieSize,    zPos:-cubieSize } );
        cubies.push( {name:"OWB",  dot:false,edg:false,cnr:true, xTrn:0,yTrn:0,zTrn:0, xOff:0,yOff:0,zOff:0, U:false,E:false,D: true, F: true,S:false,B:false, L: true,M:false,R:false, color: [K,O,K,W,B,K], coldir: ["K","O","K","W","B","K"], xPos:-cubieSize,   yPos:-cubieSize,    zPos: cubieSize } );
    }
    
    init();
    animate();

    function reset() {
        moveArray = [];
        // =============== UNDO ROTATIONS ===============
        for(var i=0; i<pivot.length; ++i) {
            rotateAroundWorldAxis(pivot[i], new THREE.Vector3(1,0,0), -cubies[i].xOff);
            rotateAroundWorldAxis(pivot[i], new THREE.Vector3(0,1,0), -cubies[i].yOff);
            rotateAroundWorldAxis(pivot[i], new THREE.Vector3(0,0,1), -cubies[i].zOff);
            pivot[i].rotation.x=0;
            pivot[i].rotation.y=0;
            pivot[i].rotation.z=0;
        }        
        // =============== RESET CUBIES ===============
        cubies = [];
        setCubies();
        // =============== RE-ALIGN CAMERA ===============
        controls.reset();
    }
    
    function init() {
        moveArray = [];
        cubies = [];
        cube = [];
        pivot = [];
        cubies = [];
        setCubies();
        
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(VIEW_ANGLE, WIDTH/HEIGHT, NEAR, FAR);
        camera.position.x = 292;     
        camera.position.y = 224;     
        camera.position.z = 520;   
        camera.lookAt(new THREE.Vector3(0,0,0));        
       
        for(var i=0; i<cubies.length; ++i) {
            
            geometry = new THREE.BoxGeometry( cubieSize, cubieSize, cubieSize );
            material = new THREE.MeshFaceMaterial( cubies[i].color ) ;

            cube[i] = new THREE.Mesh(geometry, material);
            cube[i].position.x = cubies[i].xPos;
            cube[i].position.y = cubies[i].yPos;
            cube[i].position.z = cubies[i].zPos;
            pivot[i] = new THREE.Object3D();
            pivot[i].rotation.x = 0;
            pivot[i].rotation.y = 0;
            pivot[i].rotation.z = 0;
            pivot[i].add(cube[i]);
            scene.add(pivot[i]);

        }
        
        renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, preserveDrawingBuffer: true });
        renderer.setClearColor( 0xffffff, 0);
        renderer.setSize(WIDTH, HEIGHT);
        CANVAS.append(renderer.domElement);
        renderer.domElement.id = CANVASID;
        controls = new THREE.OrbitControls(camera, renderer.domElement);
    }

    function animate() {
        render();
        requestAnimationFrame( animate );
    }
    
    
    
    function render() {
        moving=false;

        for(var i=0; i<pivot.length; ++i) {
        
            if ((cubies[i].xTrn > 0) && (cubies[i].xTrn > SPEED)) {
                rotateAroundWorldAxis(pivot[i], new THREE.Vector3(1,0,0), SPEED);
                cubies[i].xTrn -= SPEED;
                moving=true;
            } else if ((cubies[i].xTrn < 0) && (Math.abs(cubies[i].xTrn) > SPEED)) {
                rotateAroundWorldAxis(pivot[i], new THREE.Vector3(1,0,0), -SPEED);
                cubies[i].xTrn += SPEED;
                moving=true;
            } else if (cubies[i].xTrn != 0) {
                rotateAroundWorldAxis(pivot[i], new THREE.Vector3(1,0,0), cubies[i].xTrn);
                cubies[i].xTrn = 0;
                moving=true;
            }
            
            if ((cubies[i].yTrn > 0) && (cubies[i].yTrn > SPEED)) {
                rotateAroundWorldAxis(pivot[i], new THREE.Vector3(0,1,0), SPEED);
                cubies[i].yTrn -= SPEED;
                moving=true;
            } else if ((cubies[i].yTrn < 0) && (Math.abs(cubies[i].yTrn) > SPEED)) {
                rotateAroundWorldAxis(pivot[i], new THREE.Vector3(0,1,0), -SPEED);
                cubies[i].yTrn += SPEED;
                moving=true;
            } else if (cubies[i].yTrn != 0) {
                rotateAroundWorldAxis(pivot[i], new THREE.Vector3(0,1,0), cubies[i].yTrn);
                cubies[i].yTrn = 0;
                moving=true;
            }
            
            if ((cubies[i].zTrn > 0) && (cubies[i].zTrn > SPEED)) {
                rotateAroundWorldAxis(pivot[i], new THREE.Vector3(0,0,1), SPEED);
                cubies[i].zTrn -= SPEED;
                moving=true;
            } else if ((cubies[i].zTrn < 0) && (Math.abs(cubies[i].zTrn) > SPEED)) {
                rotateAroundWorldAxis(pivot[i], new THREE.Vector3(0,0,1), -SPEED);
                cubies[i].zTrn += SPEED;
                moving=true;
            } else if (cubies[i].zTrn != 0) {
                rotateAroundWorldAxis(pivot[i], new THREE.Vector3(0,0,1), cubies[i].zTrn);
                cubies[i].zTrn = 0;
                moving=true;
            }

        }

        if ((!moving) && (moveArray.length > 0)) {
            var dir = moveArray.shift();
            if (SPEED != NEWSPEED) { SPEED = NEWSPEED; }
            nextMove(dir);
        }
        
        renderer.render( scene, camera );
        controls.update();
        
    }
    
    var rotWorldMatrix;
    function rotateAroundWorldAxis(object, axis, radians) {
        rotWorldMatrix = new THREE.Matrix4();
        rotWorldMatrix.makeRotationAxis(axis.normalize(), radians);
        rotWorldMatrix.multiply(object.matrix);
        object.matrix = rotWorldMatrix;
        object.rotation.setFromRotationMatrix(object.matrix);
    }    

    $(".rotate").click(function(){
        var dir = $(this).data("direction");
        moveArray.push(dir);
    });

    function nextMove(dir) {
        for(var i=0; i<pivot.length; ++i) {
            switch (dir) {
                case 'l-upper':     if (cubies[i].L) { xMove(i,  qtrTurn); }; break;
                case 'lp-upper':    if (cubies[i].L) { xMove(i, -qtrTurn); }; break;
                case 'm-upper':     if (cubies[i].M) { xMove(i,  qtrTurn); }; break;
                case 'mp-upper':    if (cubies[i].M) { xMove(i, -qtrTurn); }; break;
                case 'r-upper':     if (cubies[i].R) { xMove(i, -qtrTurn); }; break;
                case 'rp-upper':    if (cubies[i].R) { xMove(i,  qtrTurn); }; break;
                
                case 'u-upper':     if (cubies[i].U) { yMove(i, -qtrTurn); }; break;
                case 'up-upper':    if (cubies[i].U) { yMove(i,  qtrTurn); }; break;
                case 'e-upper':     if (cubies[i].E) { yMove(i,  qtrTurn); }; break;
                case 'ep-upper':    if (cubies[i].E) { yMove(i, -qtrTurn); }; break;
                case 'd-upper':     if (cubies[i].D) { yMove(i,  qtrTurn); }; break;
                case 'dp-upper':    if (cubies[i].D) { yMove(i, -qtrTurn); }; break;
                
                case 'f-upper':     if (cubies[i].F) { zMove(i, -qtrTurn); }; break;
                case 'fp-upper':    if (cubies[i].F) { zMove(i,  qtrTurn); }; break;
                case 's-upper':     if (cubies[i].S) { zMove(i, -qtrTurn); }; break;
                case 'sp-upper':    if (cubies[i].S) { zMove(i,  qtrTurn); }; break;
                case 'b-upper':     if (cubies[i].B) { zMove(i,  qtrTurn); }; break;
                case 'bp-upper':    if (cubies[i].B) { zMove(i, -qtrTurn); }; break;
                
                case 'x-upper':     if ((cubies[i].L) || (cubies[i].M) || (cubies[i].R)) { xMove(i, -qtrTurn); }; break;
                case 'xp-upper':    if ((cubies[i].L) || (cubies[i].M) || (cubies[i].R)) { xMove(i, qtrTurn); }; break;
                
                case 'y-upper':     if ((cubies[i].U) || (cubies[i].E) || (cubies[i].D)) { yMove(i, -qtrTurn); }; break;
                case 'yp-upper':    if ((cubies[i].U) || (cubies[i].E) || (cubies[i].D)) { yMove(i, qtrTurn); }; break;
                
                case 'z-upper':     if ((cubies[i].F) || (cubies[i].S) || (cubies[i].B)) { zMove(i, -qtrTurn); }; break;
                case 'zp-upper':    if ((cubies[i].F) || (cubies[i].S) || (cubies[i].B)) { zMove(i, qtrTurn); }; break;
 
                case 'l-lower':     if ((cubies[i].L) || (cubies[i].M)) { xMove(i,  qtrTurn); }; break;
                case 'lp-lower':    if ((cubies[i].L) || (cubies[i].M)) { xMove(i, -qtrTurn); }; break;
                case 'r-lower':     if ((cubies[i].R) || (cubies[i].M)) { xMove(i, -qtrTurn); }; break;
                case 'rp-lower':    if ((cubies[i].R) || (cubies[i].M)) { xMove(i,  qtrTurn); }; break;
                
                case 'u-lower':     if ((cubies[i].U) || (cubies[i].E)) { yMove(i, -qtrTurn); }; break;
                case 'up-lower':    if ((cubies[i].U) || (cubies[i].E)) { yMove(i,  qtrTurn); }; break;
                case 'd-lower':     if ((cubies[i].D) || (cubies[i].E)) { yMove(i,  qtrTurn); }; break;
                case 'dp-lower':    if ((cubies[i].D) || (cubies[i].E)) { yMove(i, -qtrTurn); }; break;
                
                case 'f-lower':     if ((cubies[i].F) || (cubies[i].S)) { zMove(i, -qtrTurn); }; break;
                case 'fp-lower':    if ((cubies[i].F) || (cubies[i].S)) { zMove(i,  qtrTurn); }; break;
                case 'b-lower':     if ((cubies[i].B) || (cubies[i].S)) { zMove(i,  qtrTurn); }; break;
                case 'bp-lower':    if ((cubies[i].B) || (cubies[i].S)) { zMove(i, -qtrTurn); }; break;
 
            }
        }
    }


    function xMove(block, turn) {
        var cR = cubies[block].coldir[RT];
        var cL = cubies[block].coldir[LT];
        var cU = cubies[block].coldir[UP];
        var cD = cubies[block].coldir[DN];
        var cF = cubies[block].coldir[FT];
        var cB = cubies[block].coldir[BK];
        
        cubies[block].xTrn = turn;
        cubies[block].xOff+= turn;
        if (turn<0) {
            if        (cubies[block].cnr) { // ================= MOVE CORNER =================
                if      (cubies[block].U && cubies[block].B) { cubies[block].U=false; cubies[block].D=true; } 
                else if (cubies[block].B && cubies[block].D) { cubies[block].B=false; cubies[block].F=true; } 
                else if (cubies[block].D && cubies[block].F) { cubies[block].D=false; cubies[block].U=true; } 
                else if (cubies[block].F && cubies[block].U) { cubies[block].F=false; cubies[block].B=true; } 
            } else if (cubies[block].edg) { // ================= MOVE EDGE =================
                // LEFT/RIGHT LAYERS
                if      (cubies[block].U && cubies[block].S) { cubies[block].U=false; cubies[block].S=false; cubies[block].B=true; cubies[block].E=true; } 
                else if (cubies[block].B && cubies[block].E) { cubies[block].B=false; cubies[block].E=false; cubies[block].D=true; cubies[block].S=true; } 
                else if (cubies[block].D && cubies[block].S) { cubies[block].D=false; cubies[block].S=false; cubies[block].F=true; cubies[block].E=true; } 
                else if (cubies[block].F && cubies[block].E) { cubies[block].F=false; cubies[block].E=false; cubies[block].U=true; cubies[block].S=true; }
                // MIDDLE LAYER
                else if (cubies[block].U && cubies[block].B) { cubies[block].U=false; cubies[block].D=true; } 
                else if (cubies[block].B && cubies[block].D) { cubies[block].B=false; cubies[block].F=true; } 
                else if (cubies[block].D && cubies[block].F) { cubies[block].D=false; cubies[block].U=true; } 
                else if (cubies[block].F && cubies[block].U) { cubies[block].F=false; cubies[block].B=true; } 
            } else if (cubies[block].dot) { // ================= MOVE DOT =================
                if      (cubies[block].U) { cubies[block].U=false; cubies[block].B=true; cubies[block].S=false; cubies[block].E=true; } 
                else if (cubies[block].B) { cubies[block].B=false; cubies[block].D=true; cubies[block].E=false; cubies[block].S=true; } 
                else if (cubies[block].D) { cubies[block].D=false; cubies[block].F=true; cubies[block].S=false; cubies[block].E=true; } 
                else if (cubies[block].F) { cubies[block].F=false; cubies[block].U=true; cubies[block].E=false; cubies[block].S=true; } 
            }
            cubies[block].coldir[FT] = cD;
            cubies[block].coldir[DN] = cB;
            cubies[block].coldir[BK] = cU;
            cubies[block].coldir[UP] = cF;
        } else {
            if        (cubies[block].cnr) { // ================= MOVE CORNER =================
                if      (cubies[block].U && cubies[block].B) { cubies[block].B=false; cubies[block].F=true; } 
                else if (cubies[block].B && cubies[block].D) { cubies[block].D=false; cubies[block].U=true; } 
                else if (cubies[block].D && cubies[block].F) { cubies[block].F=false; cubies[block].B=true; } 
                else if (cubies[block].F && cubies[block].U) { cubies[block].U=false; cubies[block].D=true; } 
            } else if (cubies[block].edg) { // ================= MOVE EDGE =================
                // LEFT/RIGHT LAYERS
                if      (cubies[block].U && cubies[block].S) { cubies[block].U=false; cubies[block].S=false; cubies[block].F=true; cubies[block].E=true; } 
                else if (cubies[block].B && cubies[block].E) { cubies[block].B=false; cubies[block].E=false; cubies[block].U=true; cubies[block].S=true; } 
                else if (cubies[block].D && cubies[block].S) { cubies[block].D=false; cubies[block].S=false; cubies[block].B=true; cubies[block].E=true; } 
                else if (cubies[block].F && cubies[block].E) { cubies[block].F=false; cubies[block].E=false; cubies[block].D=true; cubies[block].S=true; }
                // MIDDLE LAYER
                else if (cubies[block].U && cubies[block].B) { cubies[block].B=false; cubies[block].F=true; } 
                else if (cubies[block].B && cubies[block].D) { cubies[block].D=false; cubies[block].U=true; } 
                else if (cubies[block].D && cubies[block].F) { cubies[block].F=false; cubies[block].B=true; } 
                else if (cubies[block].F && cubies[block].U) { cubies[block].U=false; cubies[block].D=true; } 
            } else if (cubies[block].dot) { // ================= MOVE DOT =================
                if      (cubies[block].U) { cubies[block].U=false; cubies[block].F=true; cubies[block].S=false; cubies[block].E=true; } 
                else if (cubies[block].B) { cubies[block].B=false; cubies[block].U=true; cubies[block].E=false; cubies[block].S=true; } 
                else if (cubies[block].D) { cubies[block].D=false; cubies[block].B=true; cubies[block].S=false; cubies[block].E=true; } 
                else if (cubies[block].F) { cubies[block].F=false; cubies[block].D=true; cubies[block].E=false; cubies[block].S=true; } 
            }
            cubies[block].coldir[FT] = cU;
            cubies[block].coldir[UP] = cB;
            cubies[block].coldir[BK] = cD;
            cubies[block].coldir[DN] = cF;
        }
    }
    
    function yMove(block, turn) {
        var cR = cubies[block].coldir[RT];
        var cL = cubies[block].coldir[LT];
        var cU = cubies[block].coldir[UP];
        var cD = cubies[block].coldir[DN];
        var cF = cubies[block].coldir[FT];
        var cB = cubies[block].coldir[BK];
        
        cubies[block].yTrn = turn;
        cubies[block].yOff+= turn;
        if (turn<0) {
            if        (cubies[block].cnr) { // ================= MOVE CORNER =================
                if      (cubies[block].R && cubies[block].B) { cubies[block].B=false; cubies[block].F=true; } 
                else if (cubies[block].F && cubies[block].R) { cubies[block].R=false; cubies[block].L=true; } 
                else if (cubies[block].L && cubies[block].F) { cubies[block].F=false; cubies[block].B=true; } 
                else if (cubies[block].B && cubies[block].L) { cubies[block].L=false; cubies[block].R=true; } 
            } else if (cubies[block].edg) { // ================= MOVE EDGE =================
                // TOP/BOTTOM LAYERS
                if      (cubies[block].R && cubies[block].S) { cubies[block].R=false; cubies[block].S=false; cubies[block].F=true; cubies[block].M=true; } 
                else if (cubies[block].F && cubies[block].M) { cubies[block].F=false; cubies[block].M=false; cubies[block].L=true; cubies[block].S=true; } 
                else if (cubies[block].L && cubies[block].S) { cubies[block].L=false; cubies[block].S=false; cubies[block].B=true; cubies[block].M=true; } 
                else if (cubies[block].B && cubies[block].M) { cubies[block].B=false; cubies[block].M=false; cubies[block].R=true; cubies[block].S=true; }
                // MIDDLE LAYER
                else if (cubies[block].R && cubies[block].B) { cubies[block].B=false; cubies[block].F=true; } 
                else if (cubies[block].F && cubies[block].R) { cubies[block].R=false; cubies[block].L=true; } 
                else if (cubies[block].L && cubies[block].F) { cubies[block].F=false; cubies[block].B=true; } 
                else if (cubies[block].B && cubies[block].L) { cubies[block].L=false; cubies[block].R=true; } 
            } else if (cubies[block].dot) { // ================= MOVE DOT =================
                if      (cubies[block].R) { cubies[block].R=false; cubies[block].F=true; cubies[block].S=false; cubies[block].M=true; } 
                else if (cubies[block].F) { cubies[block].F=false; cubies[block].L=true; cubies[block].M=false; cubies[block].S=true; } 
                else if (cubies[block].B) { cubies[block].B=false; cubies[block].R=true; cubies[block].M=false; cubies[block].S=true; } 
                else if (cubies[block].L) { cubies[block].L=false; cubies[block].B=true; cubies[block].S=false; cubies[block].M=true; } 
            }
            cubies[block].coldir[FT] = cR;
            cubies[block].coldir[RT] = cB;
            cubies[block].coldir[BK] = cL;
            cubies[block].coldir[LT] = cF;
        } else {
            if        (cubies[block].cnr) { // ================= MOVE CORNER =================
                if      (cubies[block].R && cubies[block].B) { cubies[block].R=false; cubies[block].L=true; } 
                else if (cubies[block].F && cubies[block].R) { cubies[block].F=false; cubies[block].B=true; } 
                else if (cubies[block].L && cubies[block].F) { cubies[block].L=false; cubies[block].R=true; } 
                else if (cubies[block].B && cubies[block].L) { cubies[block].B=false; cubies[block].F=true; } 
            } else if (cubies[block].edg) { // ================= MOVE EDGE =================
                // TOP/BOTTOM LAYERS
                if      (cubies[block].R && cubies[block].S) { cubies[block].R=false; cubies[block].S=false; cubies[block].B=true; cubies[block].M=true; } 
                else if (cubies[block].F && cubies[block].M) { cubies[block].F=false; cubies[block].M=false; cubies[block].R=true; cubies[block].S=true; } 
                else if (cubies[block].L && cubies[block].S) { cubies[block].L=false; cubies[block].S=false; cubies[block].F=true; cubies[block].M=true; } 
                else if (cubies[block].B && cubies[block].M) { cubies[block].B=false; cubies[block].M=false; cubies[block].L=true; cubies[block].S=true; } 
                // MIDDLE LAYER
                else if (cubies[block].R && cubies[block].B) { cubies[block].R=false; cubies[block].L=true; } 
                else if (cubies[block].F && cubies[block].R) { cubies[block].F=false; cubies[block].B=true; } 
                else if (cubies[block].L && cubies[block].F) { cubies[block].L=false; cubies[block].R=true; } 
                else if (cubies[block].B && cubies[block].L) { cubies[block].B=false; cubies[block].F=true; } 
            } else if (cubies[block].dot) { // ================= MOVE DOT =================
                if      (cubies[block].R) { cubies[block].R=false; cubies[block].B=true; cubies[block].S=false; cubies[block].M=true;  } 
                else if (cubies[block].F) { cubies[block].F=false; cubies[block].R=true; cubies[block].M=false; cubies[block].S=true;  } 
                else if (cubies[block].L) { cubies[block].L=false; cubies[block].F=true; cubies[block].S=false; cubies[block].M=true;  } 
                else if (cubies[block].B) { cubies[block].B=false; cubies[block].L=true; cubies[block].M=false; cubies[block].S=true;  } 
            }
            cubies[block].coldir[FT] = cL;
            cubies[block].coldir[LT] = cB;
            cubies[block].coldir[BK] = cR;
            cubies[block].coldir[RT] = cF;
        }
    }
    
    function zMove(block, turn) {
        var cR = cubies[block].coldir[RT];
        var cL = cubies[block].coldir[LT];
        var cU = cubies[block].coldir[UP];
        var cD = cubies[block].coldir[DN];
        var cF = cubies[block].coldir[FT];
        var cB = cubies[block].coldir[BK];
        
        cubies[block].zTrn = turn;
        cubies[block].zOff+= turn;
        if (turn<0) {
            if        (cubies[block].cnr) { // ================= MOVE CORNER =================
                if      (cubies[block].U && cubies[block].R) { cubies[block].U=false; cubies[block].D=true; } 
                else if (cubies[block].R && cubies[block].D) { cubies[block].R=false; cubies[block].L=true; } 
                else if (cubies[block].D && cubies[block].L) { cubies[block].D=false; cubies[block].U=true; } 
                else if (cubies[block].L && cubies[block].U) { cubies[block].L=false; cubies[block].R=true; } 
            } else if (cubies[block].edg) { // ================= MOVE EDGE =================
                // FRONT/BACK LAYERS
                if      (cubies[block].U && cubies[block].M) { cubies[block].U=false; cubies[block].M=false; cubies[block].R=true; cubies[block].E=true; } 
                else if (cubies[block].R && cubies[block].E) { cubies[block].R=false; cubies[block].E=false; cubies[block].D=true; cubies[block].M=true; } 
                else if (cubies[block].D && cubies[block].M) { cubies[block].D=false; cubies[block].M=false; cubies[block].L=true; cubies[block].E=true; } 
                else if (cubies[block].L && cubies[block].E) { cubies[block].L=false; cubies[block].E=false; cubies[block].U=true; cubies[block].M=true; }
                // MIDDLE LAYER
                else if (cubies[block].U && cubies[block].R) { cubies[block].U=false; cubies[block].D=true; } 
                else if (cubies[block].R && cubies[block].D) { cubies[block].R=false; cubies[block].L=true; } 
                else if (cubies[block].D && cubies[block].L) { cubies[block].D=false; cubies[block].U=true; } 
                else if (cubies[block].L && cubies[block].U) { cubies[block].L=false; cubies[block].R=true; } 
            } else if (cubies[block].dot) { // ================= MOVE DOT =================
                if      (cubies[block].U) { cubies[block].U=false; cubies[block].R=true; cubies[block].M=false; cubies[block].E=true; } 
                else if (cubies[block].R) { cubies[block].R=false; cubies[block].D=true; cubies[block].E=false; cubies[block].M=true; } 
                else if (cubies[block].D) { cubies[block].D=false; cubies[block].L=true; cubies[block].M=false; cubies[block].E=true; } 
                else if (cubies[block].L) { cubies[block].L=false; cubies[block].U=true; cubies[block].E=false; cubies[block].M=true; } 
            }
            cubies[block].coldir[UP] = cL;
            cubies[block].coldir[LT] = cD;
            cubies[block].coldir[DN] = cR;
            cubies[block].coldir[RT] = cU;
        } else {
            if        (cubies[block].cnr) { // ================= MOVE CORNER =================
                if      (cubies[block].U && cubies[block].R) { cubies[block].R=false; cubies[block].L=true; } 
                else if (cubies[block].R && cubies[block].D) { cubies[block].D=false; cubies[block].U=true; } 
                else if (cubies[block].D && cubies[block].L) { cubies[block].L=false; cubies[block].R=true; } 
                else if (cubies[block].L && cubies[block].U) { cubies[block].U=false; cubies[block].D=true; } 
            } else if (cubies[block].edg) { // ================= MOVE EDGE =================
                // FRONT/BACK LAYERS
                if      (cubies[block].U && cubies[block].M) { cubies[block].U=false; cubies[block].M=false; cubies[block].L=true; cubies[block].E=true; } 
                else if (cubies[block].R && cubies[block].E) { cubies[block].R=false; cubies[block].E=false; cubies[block].U=true; cubies[block].M=true; } 
                else if (cubies[block].D && cubies[block].M) { cubies[block].D=false; cubies[block].M=false; cubies[block].R=true; cubies[block].E=true; } 
                else if (cubies[block].L && cubies[block].E) { cubies[block].L=false; cubies[block].E=false; cubies[block].D=true; cubies[block].M=true; }
                // MIDDLE LAYER
                else if (cubies[block].U && cubies[block].R) { cubies[block].R=false; cubies[block].L=true; } 
                else if (cubies[block].R && cubies[block].D) { cubies[block].D=false; cubies[block].U=true; } 
                else if (cubies[block].D && cubies[block].L) { cubies[block].L=false; cubies[block].R=true; } 
                else if (cubies[block].L && cubies[block].U) { cubies[block].U=false; cubies[block].D=true; } 
            } else if (cubies[block].dot) { // ================= MOVE DOT =================
                if      (cubies[block].U) { cubies[block].U=false; cubies[block].L=true; cubies[block].M=false; cubies[block].E=true; } 
                else if (cubies[block].R) { cubies[block].R=false; cubies[block].U=true; cubies[block].E=false; cubies[block].M=true; } 
                else if (cubies[block].D) { cubies[block].D=false; cubies[block].R=true; cubies[block].M=false; cubies[block].E=true; } 
                else if (cubies[block].L) { cubies[block].L=false; cubies[block].D=true; cubies[block].E=false; cubies[block].M=true; } 
            }
            cubies[block].coldir[UP] = cR;
            cubies[block].coldir[RT] = cD;
            cubies[block].coldir[DN] = cL;
            cubies[block].coldir[LT] = cU;
        }
    }
    
    function readIntoMoveArray(reverse) {
        var alg=$("#algorithm").val();
        // =============== REMOVE ODD UNICODE APOSTROPHE ===============
        var tmp = "";
        for (var i=0; i<alg.length; i++) {
            if (alg.charCodeAt(i) == 8217) {
                tmp+="'";
            } else {
                tmp+=alg.charAt(i);    
            }
        }
        alg = tmp; 
        // =============== REMOVE ODD UNICODE APOSTROPHE ===============

        alg = alg.replace(/\s+/g, " ");
        alg = alg.replace(/[^UDLRFBMSEudlrfbXYZxyz2\']/g, " ");
        alg = alg.replace(/([UDLRFBMSEudlrfbXYZxyz])2/g, "$1 $1 ");
        alg = alg.replace(/([UDLRFBMSEudlrfbXYZxyz])2'/g, "$1' $1' ");
        alg = alg.replace(/\s+/g, " ");

        var moves = alg.split(" ");
        if (reverse) { 
            for(var i=0; i<moves.length; ++i) {
                if (moves[i].indexOf("'") == -1) {
                    moves[i] = moves[i] + "'";
                } else {
                    moves[i] = moves[i].replace("'","");
                }
            }
            moves = moves.reverse();
        }
        var move;
        for(var i=0; i<moves.length; ++i) {
            move = moves[i];
            switch(move) {
                case "X"  : case "x"  :  moveArray.push('x-upper'); break;
                case "X'" : case "x'" :  moveArray.push('xp-upper'); break;
                case "Y"  : case "y"  :  moveArray.push('y-upper'); break;
                case "Y'" : case "y'" :  moveArray.push('yp-upper'); break;
                case "Z"  : case "z"  :  moveArray.push('z-upper'); break;
                case "Z'" : case "z'" :  moveArray.push('zp-upper'); break;

                case "L"  : moveArray.push('l-upper'); break;
                case "L'" : moveArray.push('lp-upper'); break;
                case "M"  : moveArray.push('m-upper'); break;
                case "M'" : moveArray.push('mp-upper'); break;
                case "R"  : moveArray.push('r-upper'); break;
                case "R'" : moveArray.push('rp-upper'); break;

                case "U"  : moveArray.push('u-upper'); break;
                case "U'" : moveArray.push('up-upper'); break;
                case "E"  : moveArray.push('e-upper'); break;
                case "E'" : moveArray.push('ep-upper'); break;
                case "D"  : moveArray.push('d-upper'); break;
                case "D'" : moveArray.push('dp-upper'); break;

                case "F"  : moveArray.push('f-upper'); break;
                case "F'" : moveArray.push('fp-upper'); break;
                case "S"  : moveArray.push('s-upper'); break;
                case "S'" : moveArray.push('sp-upper'); break;
                case "B"  : moveArray.push('b-upper'); break;
                case "B'" : moveArray.push('bp-upper'); break;

                case "l"  : moveArray.push('l-lower'); break;
                case "l'" : moveArray.push('lp-lower'); break;
                case "r"  : moveArray.push('r-lower'); break;
                case "r'" : moveArray.push('rp-lower'); break;
                case "u"  : moveArray.push('u-lower'); break;
                case "u'" : moveArray.push('up-lower'); break;
                case "d"  : moveArray.push('d-lower'); break;
                case "d'" : moveArray.push('dp-lower'); break;
                case "f"  : moveArray.push('f-lower'); break;
                case "f'" : moveArray.push('fp-lower'); break;
                case "b"  : moveArray.push('b-lower'); break;
                case "b'" : moveArray.push('bp-lower'); break;
            }
        }
    }

	$(document).keydown(function(e) {
        if($("#algorithm").is(":focus")) {
            e.stopPropagation();
            return;
        }
        if (e.shiftKey) {
            switch(e.which) {
                case 107: moveArray.push('dp-lower'); break;
                default: return;
            }
        } else if (e.altKey) {
            switch(e.which) {
                case 103: moveArray.push('m-upper'); break;
                case 104: moveArray.push('e-upper'); break;
                case 105: moveArray.push('s-upper'); break;
                case 100: moveArray.push('mp-upper'); break;
                case 101: moveArray.push('ep-upper'); break;
                case 102: moveArray.push('sp-upper'); break;

                case 97: moveArray.push('x-upper'); break;
                case 98: moveArray.push('y-upper'); break;
                case 99: moveArray.push('z-upper'); break;
                case 96: moveArray.push('xp-upper'); break;
                case 110: moveArray.push('yp-upper'); break;
                case 13: moveArray.push('zp-upper'); break;

                default: return;
            }
        } else {
            switch(e.which) {
                case 101:  moveArray.push('u-upper'); break;
                case 105:  moveArray.push('d-upper'); break;
                case 100:  moveArray.push('l-upper'); break;
                case 102:  moveArray.push('r-upper'); break;
                case 103:  moveArray.push('f-upper'); break;
                case 96:   moveArray.push('b-upper'); break;

                case 98: moveArray.push('up-upper'); break;
                case 107: moveArray.push('dp-upper'); break;
                case 97: moveArray.push('lp-upper'); break;
                case 99: moveArray.push('rp-upper'); break;
                case 104: moveArray.push('fp-upper'); break;
                case 110: moveArray.push('bp-upper'); break;
                
                case 12: moveArray.push('u-lower'); break;
                case 33: moveArray.push('d-lower'); break;
                case 37: moveArray.push('l-lower'); break;
                case 39: moveArray.push('r-lower'); break;
                case 36: moveArray.push('f-lower'); break;
                case 45: moveArray.push('b-lower'); break;
                
                case 40: moveArray.push('up-lower'); break;

                case 35: moveArray.push('lp-lower'); break;
                case 34: moveArray.push('rp-lower'); break;
                case 38: moveArray.push('fp-lower'); break;
                case 46: moveArray.push('bp-lower'); break;
                
                default: return;
            }
        }

        e.preventDefault();
        return false;
	});
    
    $("#read-in").click(function(){
        readIntoMoveArray(false);
    });

    $("#read-in-rev").click(function(){
        readIntoMoveArray(true);
    });

    $("#read-in-clear").click(function(){
        $("#algorithm").val("");
    });

    $("#mats-mix").click(function(){
        $("#algorithm").val("X2 B2 F2 D F2 L2 U R2 B2 F2 U2 L2 B' L2 R2 D' U2 L2 U' R' F R Y' Z");
        readIntoMoveArray(false);
    });
    
    $("#mats-solution").click(function(){
        $("#algorithm").val("L' D R2 R U' R' U' L' U' L U2 R U R' U' d' R U R' y U2 R U' R' L U' L' y' U2 R' U2 R U2 R' U R' F R F' U R U");
        readIntoMoveArray(false);
    });

    $("#reset").click(function(){
        reset();
    });
    
    $("#reset-camera").click(function(){
        // =============== RE-ALIGN CAMERA ===============
        controls.reset();
    });
    
    $("#random-mix").click(function(){
        var validMoves = ["L","M","R","U","E","D","F","S","B","l","r","u","d","f","b","x","y","z"];
        var mix="", move="", tmp="", add="";
        for(var i=0; i<20; ++i) {
            while (tmp == move) {
                move = validMoves[Math.floor(Math.random()*validMoves.length)];
            }
            tmp = move;
            if (Math.floor(Math.random()*10) == 5) {
                add = "2";
            } else if (Math.floor(Math.random()*10) > 5) {
                add = "'";
            } else {
                add = "";
            }
            
            mix += move + add + " ";
        }
        $("#algorithm").val(mix);
        readIntoMoveArray(false);
    });
    
    $("#speed-slider").on("change", function() {
        var notch = 50 - parseInt($(this).val());
        NEWSPEED = qtrTurn/notch;
    });

    
    $(".alg-image").click(function(){
        var alg = $(this).data("alg");
        $("#algorithm").val(alg);
    });   

    var f2lScr = [];
    var f2lTo = 0;
    $("#f2l-algs").children().each(function(){
        f2lScr.push($(this).position().top-10);
    });
    var canScroll = true;
    $("#f2l-algs").bind('mousewheel', function(event, delta) {
        event.preventDefault();
        if (canScroll) {
            canScroll = false;
            f2lTo += (delta < 0) ? 1: -1;
            if (f2lTo < 0) { f2lTo = 0; }
            if (f2lTo > (f2lScr.length -1)) { f2lTo = f2lScr.length -1; }
            $("#f2l-algs").animate({
                scrollTop:f2lScr[f2lTo]
            },200, function(){ canScroll = true; });
        }
    });
    
    var f2lScrollStop; 
    $("#f2l-algs").bind('scroll', function() {
        clearTimeout(f2lScrollStop);
        f2lScrollStop = setTimeout(function(){ 
            var scrolled = $("#f2l-algs").scrollTop();
            var shouldBe = f2lScr[f2lTo];
            var pre = 0, post = 0;
            if (scrolled != shouldBe) {
                canScroll = false;
                for(var i=0; i<f2lScr.length; ++i) {
                    if (f2lScr[i] < scrolled) { pre = i; post = (i<f2lScr.length-1) ? i+1 : f2lScr.length; }
                }
                f2lTo = (shouldBe < scrolled) ? post : pre;
                $("#f2l-algs").animate({
                    scrollTop:f2lScr[f2lTo]
                },200, function(){ canScroll = true; });
            }
        },50);
    });

    var ollScr = [];
    var ollTo = 0;
    $("#oll-algs").children().each(function(){
        ollScr.push($(this).position().top-10);
    });
    $("#oll-algs").bind('mousewheel', function(event, delta) {
        event.preventDefault();
        if (canScroll) {
            canScroll = false;
            ollTo += (delta < 0) ? 1: -1;
            if (ollTo < 0) { ollTo = 0; }
            if (ollTo > (ollScr.length -1)) { ollTo = ollScr.length -1; }
            //$("#oll-algs").scrollTop(ollScr[ollTo]);
            $("#oll-algs").animate({
                scrollTop:ollScr[ollTo]
            },200, function(){ canScroll = true; });
        }
    });
    
    var ollScrollStop; 
    $("#oll-algs").bind('scroll', function() {
        clearTimeout(ollScrollStop);
        ollScrollStop = setTimeout(function(){ 
            var scrolled = $("#oll-algs").scrollTop();
            var shouldBe = ollScr[ollTo];
            var pre = 0, post = 0;
            if (scrolled != shouldBe) {
                canScroll = false;
                for(var i=0; i<ollScr.length; ++i) {
                    if (ollScr[i] < scrolled) { pre = i; post = (i<ollScr.length-1) ? i+1 : ollScr.length; }
                }
                ollTo = (shouldBe < scrolled) ? post : pre;
                $("#oll-algs").animate({
                    scrollTop:ollScr[ollTo]
                },200, function(){ canScroll = true; });
            }
        },50);
    });
    
    var pllScr = [];
    var pllTo = 0;
    $("#pll-algs").children().each(function(){
        pllScr.push($(this).position().top-10);
    });
    $("#pll-algs").bind('mousewheel', function(event, delta) {
        event.preventDefault();
        if (canScroll) {
            canScroll = false;
            pllTo += (delta < 0) ? 1: -1;
            if (pllTo < 0) { pllTo = 0; }
            if (pllTo > (pllScr.length -1)) { pllTo = pllScr.length -1; }
            //$("#pll-algs").scrollTop(pllScr[pllTo]);
            $("#pll-algs").animate({
                scrollTop:pllScr[pllTo]
            },200, function(){ canScroll = true; });
        }
    });
    
    var pllScrollStop; 
    $("#pll-algs").bind('scroll', function() {
        clearTimeout(pllScrollStop);
        pllScrollStop = setTimeout(function(){ 
            var scrolled = $("#pll-algs").scrollTop();
            var shouldBe = pllScr[pllTo];
            var pre = 0, post = 0;
            if (scrolled != shouldBe) {
                canScroll = false;
                for(var i=0; i<pllScr.length; ++i) {
                    if (pllScr[i] < scrolled) { pre = i; post = (i<pllScr.length-1) ? i+1 : pllScr.length; }
                }
                pllTo = (shouldBe < scrolled) ? post : pre;
                $("#pll-algs").animate({
                    scrollTop:pllScr[pllTo]
                },200, function(){ canScroll = true; });
            }
        },50);
    });


   
    

    
});