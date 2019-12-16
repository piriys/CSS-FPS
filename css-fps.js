//class
class GameObject {
    constructor(xp, yp, zp, xr, yr, zr, element) {
        this.position = {
            x: xp,
            y: yp,
            z: zp
        };
        this.rotation = {
            x: xr,
            y: yr,
            z: zr
        };
        this.element = element;
        element.style.zIndex = -this.position.z;
    }

    update() {
        //Add something
    }
}

class Player {
    constructor() {
        this.mouse = {
            x: 0,
            y: 0
        };
        this.position = {
            x: 0,
            y: 0,
            z: 0
        };
        this.rotation = {
            x: 0,
            y: 0,
            z: 0
        };
        this.pause = false;
    }
    reset() {
        this.mouse.x = 0;
        this.mouse.y = 0;
        this.position.x = 0;
        this.position.y = 0;
        this.position.z = 0;
        this.rotation.x = 0;
        this.rotation.y = 0;
        this.rotation.z = 0;
    }
}

//modify settings here
const settings = {
    updateRate: 10,
    runSpeed: 20,
    turnSpeed: 5,
    enableMouselook: true,
    enableSkybox: true,
    mouselookSpeed: {
        x: 0.5,
        y: 0.5
    },
    playerHeight: document.getElementById('objectLayer').offsetWidth / 2
};

const keyPressInput = (e) => {
    if (e.key === 'p') {
        player.pause = !player.pause;
    }
    // Move in X Axis
    if (e.key === 'a') {
        //move left
        player.position.x +=
            Math.cos(player.rotation.y * Math.PI / 180) * settings.runSpeed;
        player.position.z +=
            Math.sin(player.rotation.y * Math.PI / 180) * settings.runSpeed;
        // player.position.x += settings.runSpeed;
    }
    if (e.key === 'd') {
        //move right
        player.position.x -=
            Math.cos(player.rotation.y * Math.PI / 180) * settings.runSpeed;
        player.position.z -=
            Math.sin(player.rotation.y * Math.PI / 180) * settings.runSpeed;
        // player.position.x -= settings.runSpeed;
    }
    // Move in Z Axis
    if (e.key === 'w') {
        //move forward
        player.position.x -=
            Math.sin(player.rotation.y * Math.PI / 180) * settings.runSpeed;
        player.position.z +=
            Math.cos(player.rotation.y * Math.PI / 180) * settings.runSpeed;
        // player.position.z += settings.runSpeed;
    }
    if (e.key === 's') {
        //move backward
        player.position.x +=
            Math.sin(player.rotation.y * Math.PI / 180) * settings.runSpeed;
        player.position.z -=
            Math.cos(player.rotation.y * Math.PI / 180) * settings.runSpeed;
        // player.position.z -= settings.runSpeed;
    }
    // Turn
    if (e.key === 'q') {
        // Turn CCW
        player.rotation.y -= settings.turnSpeed;
        if (player.rotation.y === -360) player.rotation.y = 0;
    }
    if (e.key === 'e') {
        // Turn CW
        player.rotation.y += settings.turnSpeed;
        if (player.rotation.y === 360) player.rotation.y = 0;
    }
    // Look down
    if (e.key === 'f') {
        if (player.rotation.x > -90) player.rotation.x -= settings.turnSpeed;
    }
    // Look up
    if (e.key === 'r') {
        if (player.rotation.x < 90) player.rotation.x += settings.turnSpeed;
    }
    // Toggle views
    if (e.key === 'o') {
        player.reset();
    }
    if (e.key === 'z') {
        settings.enableSkybox = !settings.enableSkybox;
        if (!settings.enableSkybox)
            skyboxLayer.style.display = 'none';
        else
            skyboxLayer.style.display = 'block';
    }
    // update();
}

const mouseMoveInput = (e) => {
    player.mouse.x = e.movementX;
    player.mouse.y = e.movementY;
    // Turn left/right
    if (e.movementX !== 0) {
        player.rotation.y += settings.mouselookSpeed.x * e.movementX;
        if (player.rotation.y > 360 || player.rotation.y < -360)
            player.rotation.y = player.rotation.y % 360;
    }
    // Look up/down
    if (e.movementY !== 0) {
        player.rotation.x -= settings.mouselookSpeed.y * e.movementY;
        if (player.rotation.x > 90)
            player.rotation.x = 90;
        else if (player.rotation.x < -90)
            player.rotation.x = -90;
    }
}

const update = () => {
    const origin = {
        x: objectLayer.offsetWidth / 2 - player.position.x,
        y: objectLayer.offsetHeight / 2 - player.position.y,
        z: objectLayer.offsetWidth - player.position.z
    };
    objectLayer.style.transformOrigin =
        `${origin.x}px ${origin.y}px ${origin.z}px`;

    let sb = [];
    sb.push('translate3d(');
    sb.push(player.position.x + 'px,');
    sb.push(player.position.y + 'px,');
    sb.push(player.position.z + 'px) ');
    sb.push('rotateX(' + player.rotation.x + 'deg) ');
    sb.push('rotateY(' + player.rotation.y + 'deg) ');
    setVendorCSS(objectLayer, 'transform', sb.join(''));

    updateHUD();
    updateObjectFaces();
    if (settings.enableSkybox) {
        updateSkybox();
    }
    updateSky();
    updateGround();
}

const updateHUD = () => {
    document.getElementById('mx').innerHTML = player.mouse.x.toFixed(2);
    document.getElementById('my').innerHTML = player.mouse.y.toFixed(2);
    document.getElementById('origin').innerHTML = objectLayer.style.transformOrigin;
    document.getElementById('px').innerHTML = player.position.x.toFixed(2);
    document.getElementById('py').innerHTML = player.position.y.toFixed(2);
    document.getElementById('pz').innerHTML = player.position.z.toFixed(2);
    document.getElementById('rx').innerHTML = player.rotation.x.toFixed(2);
    document.getElementById('ry').innerHTML = player.rotation.y.toFixed(2);
    document.getElementById('rz').innerHTML = player.rotation.z.toFixed(2);
    document.getElementById('objectCount').innerHTML = gameObjects.length;
}

const updateObjectFaces = () => {
    // variables for trig form y = A sin(B(x + C)) + D and y = y = A cos(B(x + C))
    let x = ((player.rotation.y + 360) % 360) * Math.PI / 180; //convert degrees to radians
    let A = 25; //amplitude
    let B = 1; //period = (2 * PI) / B , therefore B = period / (2 * PI)
    let C = Math.PI / 2; //phase shift
    let D = 50; //vertical shift

    let front = objectLayer.getElementsByClassName('front');
    for (let f = 0; f < front.length; f++) {
        setVendorCSS(front[f], 'filter', 'brightness(' + (A * Math.sin(B * (x + C)) + D) + '%)');
    }

    let back = objectLayer.getElementsByClassName('back');
    for (let bk = 0; bk < back.length; bk++) {
        setVendorCSS(back[bk], 'filter', 'brightness(' + (A * Math.sin(B * (x + C)) + D) + '%)');
    }

    let left = objectLayer.getElementsByClassName('left');
    for (let l = 0; l < left.length; l++) {
        setVendorCSS(left[l], 'filter', 'brightness(' + (A * Math.sin(B * x) + D) + '%)');
    }

    let right = objectLayer.getElementsByClassName('right');
    for (let r = 0; r < right.length; r++) {
        setVendorCSS(right[r], 'filter', 'brightness(' + (A * Math.sin(B * x) + D) + '%)');
    }
}

const updateSkybox = () => {
    let skybox = document.getElementsByClassName('skybox')[0];
    let sb = [];
    sb.push('rotateX(' + player.rotation.x + 'deg) ');
    sb.push('rotateY(' + player.rotation.y + 'deg) ');
    setVendorCSS(skybox, 'transform', sb.join(''));
}

const updateSky = () => {
    let sky = document.getElementById('sky');
    let hueDegree = Math.sin(player.position.x / settings.speed / 10) * 45;
    setVendorCSS(sky, 'filter', 'hue-rotate(' + hueDegree + 'deg)');
    sky.style.height = player.rotation.x / 90 * 100 + 50 + 'vh';
}

const updateGround = () => {
    let ground = document.getElementById('ground');
    let hueDegree = Math.sin(player.position.z / settings.speed / 10) * 20;
    setVendorCSS(ground, 'filter', 'hue-rotate(' + hueDegree + 'deg)');
    ground.style.height = player.rotation.x / -90 * 100 + 50 + 'vh';
}

/*
* Helper functions
*/
const setVendorCSS = (DOM, attribute, value) => {
    let webkit = '-webkit-' + attribute;
    let moz = '-moz-' + attribute;
    let o = '-o-' + attribute;
    let ms = '-ms-' + attribute;
    DOM.style[attribute] = value;
    DOM.style[webkit] = value;
    DOM.style[moz] = value;
    DOM.style[o] = value;
    DOM.style[ms] = value;
}

//initialize
const objectLayer = document.getElementById('objectLayer');
const hudLayer = document.getElementById('hudLayer');
const skyboxLayer = document.getElementById('skyboxLayer');
const player = new Player();
let keyPressListener = document.addEventListener('keypress', keyPressInput);
if (settings.enableMouselook) {
    let mouseMoveListener = document.addEventListener('mousemove', mouseMoveInput);
    document.body.onclick = document.body.requestPointerLock;
}
const gameObjects = [];
const chestDOM = document.getElementsByClassName('chest')[0];
gameObjects.push(new GameObject(0, 0, 0, 0, 0, 0, chestDOM));

let updateInterval = setInterval(function () {
    if (!player.pause) {
        update();
    }
}, settings.updateRate);
