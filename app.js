'use strict';

const button = document.querySelector('button');
const input = document.querySelector('input');
const ctx1 = document.getElementById('canvas1').getContext('2d');
const canvas2 = document.getElementById('canvas2');
const ctx2 = canvas2.getContext('2d');
const IMG_WIDTH = 1000;
const IMG_HEIGHT = 200;

button.onclick = async e => {
    button.innerText = 'Generating...'

    const numOfImages = +(input.value || 1);

    const zip = new JSZip();

    button.innerText = 'Getting image...';
    const img = await loadImage('https://picsum.photos/1000/200');
    button.innerText = 'Generating random art...';
    
    ctx2.fillStyle = `rgb(${randomInt(0, 255)}, ${randomInt(0, 255)}, ${randomInt(0, 255)})`;

    for (let i = 0; i < numOfImages; i++) {
        ctx1.drawImage(img, 0, 0);
        ctx2.fillRect(0, 0, IMG_WIDTH, IMG_HEIGHT);
        const pixelData = ctx1.getImageData(0, 0, IMG_WIDTH, IMG_HEIGHT).data;

        for (let j = 0; j < randomInt(3, 150); j++) {
            const randomX = randomInt(0, IMG_WIDTH-1);
            const randomY = randomInt(0, IMG_HEIGHT-1);
            const pixel = getPixelValue(pixelData, randomX, randomY);
            const newWidthHalf = randomInt(10, 50);
            const newHeightHalf = randomInt(10, 50);
            ctx2.fillStyle = `rgb(${pixel.r}, ${pixel.g}, ${pixel.b})`;
            ctx2.fillRect(randomX - newWidthHalf, randomY - newHeightHalf, newWidthHalf*2, newHeightHalf*2);
        }

        const canvas2Blob = await canvasToBlobAsync(canvas2);
        zip.file(`image${i}.png`, canvas2Blob);
    }

    const zipResult = await zip.generateAsync({ type: 'blob' });
    saveAs(zipResult, 'images.zip');

    button.innerText = 'Generate again';
}

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

function getPixelValue (pixelData, x, y, width = IMG_WIDTH, height = IMG_HEIGHT) {
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
