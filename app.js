'use strict';

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const canvas2 = document.getElementById('canvas2');
const ctx2 = canvas2.getContext('2d');
const bgDiv = document.getElementById('bg-div');
const DARK_THEME = !!(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);

let imageWidth;
let imageHeight;

async function onUploaded(image) {
    // img base64 = image.src

    imageWidth = image.width;
    imageHeight = image.height;
    canvas.width = imageWidth;
    canvas.height = imageHeight;
    canvas2.width = imageWidth;
    canvas2.height = imageHeight;
    ctx.drawImage(image, 0, 0);
    ctx2.drawImage(image, 0, 0);
    loadFromCanvas2ToImage();

    document.getElementById('drop-area').classList.add('hidden');
    bgDiv.classList.remove('hidden');
}

async function nextImage() {
    bgDiv.classList.add('updating');
    ctx2.fillStyle = DARK_THEME ? 'black' : 'white';
    ctx2.fillRect(0, 0, imageWidth, imageHeight);
    document.getElementById('uploading-div').classList.remove('hidden');
    const pixelData = ctx.getImageData(0, 0, imageHeight, imageHeight).data;

    //todo all numbers from CONFIG, use percentage instead of px values
    for (let j = 0; j < randomInt(CONFIG.rects.count.min, CONFIG.rects.count.max); j++) {
        const randomX = randomInt(0, imageWidth-1);
        const randomY = randomInt(0, imageHeight-1);
        const pixel = getPixelValue(pixelData, randomX, randomY);
        const newWidthHalf = randomInt(CONFIG.rects.size.min * imageWidth / 2, CONFIG.rects.size.max * imageWidth / 2);
        const newHeightHalf = randomInt(CONFIG.rects.size.min * imageHeight / 2, CONFIG.rects.size.max * imageHeight / 2);
        ctx2.fillStyle = `rgb(${pixel.r}, ${pixel.g}, ${pixel.b})`;
        ctx2.fillRect(randomX - newWidthHalf, randomY - newHeightHalf, newWidthHalf*2, newHeightHalf*2);
    }
    loadFromCanvas2ToImage();
    bgDiv.classList.remove('updating');
}

document.getElementById('next').onclick = nextImage;
bgDiv.onclick = nextImage;

function getPixelValue (pixelData, x, y, width = imageHeight, height = imageHeight) {
    const pixelStart = (y * width + x) * 4;
    return {
        r: pixelData[pixelStart + 0],
        g: pixelData[pixelStart + 1],
        b: pixelData[pixelStart + 2],
    }
}

function randomInt(from, to) {
    const rnd = Math.random(); // [0..1)
    const delta = to + 1 - from;
    const res = from + Math.floor(delta * rnd);
    return Math.round(res);
}


function loadFromCanvas2ToImage() {
    document.getElementById('bg-div').style.backgroundImage = `url(${canvas2.toDataURL()})`;
}
