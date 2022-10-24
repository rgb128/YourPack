'use strict';

const canvases = document.getElementById('canvases');
const ctx1 = document.getElementById('canvas1').getContext('2d');
const IMG_SIZE = 200;

(async e => {
    canvases.innerText = 'Generating...'

    canvases.innerText = 'Getting image...';
    const img = await loadImage('https://picsum.photos/200');
    canvases.innerHTML = '';


    const bgColor = `rgb(${randomInt(0, 255)}, ${randomInt(0, 255)}, ${randomInt(0, 255)})`;
    for (let i = 0; i < 100; i++) {
        
        const currentCanvas = document.createElement('canvas');
        currentCanvas.width = IMG_SIZE;
        currentCanvas.height = IMG_SIZE;
        const currentCanvasCtx = currentCanvas.getContext('2d');
        currentCanvasCtx.fillStyle = bgColor;

        ctx1.drawImage(img, 0, 0);
        currentCanvasCtx.fillRect(0, 0, IMG_SIZE, IMG_SIZE);
        const pixelData = ctx1.getImageData(0, 0, IMG_SIZE, IMG_SIZE).data;

        for (let j = 0; j < randomInt(3, 150); j++) {
            const randomX = randomInt(0, IMG_SIZE - 1);
            const randomY = randomInt(0, IMG_SIZE - 1);
            const pixel = getPixelValue(pixelData, randomX, randomY);
            const newWidthHalf = randomInt(10, 50);
            const newHeightHalf = randomInt(10, 50);
            currentCanvasCtx.fillStyle = `rgb(${pixel.r}, ${pixel.g}, ${pixel.b})`;
            currentCanvasCtx.fillRect(randomX - newWidthHalf, randomY - newHeightHalf, newWidthHalf*2, newHeightHalf*2);
        }
        canvases.appendChild(currentCanvas);
    }
})();

function loadImage(url) {
    return new Promise((resolve, reject) => { 
        const i = new Image();
        i.crossOrigin = '';
        i.onload = (() => resolve(i)); 
        i.src = url;
        i.onerror = ex => {
            alert(`Coudn't load image, reason: ${ex}.`);
            reject(ex);
        }
    });
}

function getPixelValue (pixelData, x, y, width = IMG_SIZE, height = IMG_SIZE) {
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

function canvasToBlobAsync(canvas) {
    return new Promise((resolve, reject) => {
        canvas2.toBlob((result) => {
            resolve(result);
        })
    })
}
