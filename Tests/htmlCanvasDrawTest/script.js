let canvas = document.querySelector("canvas");
canvas.width = 1900;
canvas.height = 900;
let ctx = canvas.getContext("2d");

let img = new Image();

fetch("https://m.media-amazon.com/images/M/MV5BYTViNzMxZjEtZGEwNy00MDNiLWIzNGQtZDY2MjQ1OWViZjFmXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg")
.then(data => {
    return data.blob();
})
.then(image => {
    console.log(URL.createObjectURL(image));

    img.onload = function(){
        start();
    }
    img.src = URL.createObjectURL(image);
});

let offsetX = 0;
let offsetY = 0;

let prevX = undefined;
let prevY = undefined;
let down = false;

let cols = 750;
let rows = 100;

let spaceX = 15;
let spaceY = 20;

function start() {
    canvas.addEventListener("mousemove", handlePan);
    canvas.addEventListener("mousedown", handlePan);
    canvas.addEventListener("mouseup", handlePan);

    canvas.addEventListener("wheel", scale);

    render();
}

let scaleStep = 1.1;
let actScale = 1;
function scale(e) {
    if (e.deltaY < 0) {
        ctx.scale(1/scaleStep, 1/scaleStep);
        actScale /= scaleStep;
    }
    else {
        ctx.scale(scaleStep, scaleStep);
        actScale *= scaleStep;
    }

    e.preventDefault();
}

function handlePan(e) {
    if (e.type === "mousedown" ) {

        down = true;
        prevX = e.clientX;
        prevY = e.clientY;
        return;
    }
    else if (e.type === "mouseup") {
        down = false;
        return;
    }

    if (down) {
        offsetX += (e.clientX - prevX) * 1/actScale;
        offsetY += (e.clientY - prevY) * 1/actScale;
        prevX = e.clientX;
        prevY = e.clientY;
    }
}

function render() {
    let drawWidth = canvas.width * 1/actScale;
    let drawHeight = canvas.height * 1/actScale;

    ctx.clearRect(0, 0, drawWidth, drawHeight);
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            let xPos = offsetX + spaceX * x;
            let yPos = offsetY + spaceY * y;
            if (xPos > -spaceX && xPos < drawWidth && yPos > -spaceY && yPos < drawHeight)
                ctx.drawImage(img, xPos, yPos, spaceX, spaceY);
        }
    }

    window.requestAnimationFrame(render);
}