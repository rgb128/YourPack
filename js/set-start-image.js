'use strict';

(async () => {
    const img = await loadImage('https://picsum.photos/' + imageWidth + '/' + imageHeight);
    ctx.drawImage(img, 0, 0);
    
    ctx2.fillStyle = DARK_THEME ? 'black' : 'white';
    ctx2.fillRect(0, 0, imageWidth, imageHeight);
    
    const pixelData = ctx.getImageData(0, 0, imageHeight, imageHeight).data;

    for (let j = 0; j < randomInt(CONFIG.rects.count.min, CONFIG.rects.count.max); j++) {
        const randomX = randomInt(0, imageWidth-1);
        const randomY = randomInt(0, imageHeight-1);
        const pixel = getPixelValue(pixelData, randomX, randomY);
        const newWidthHalf = randomInt(CONFIG.rects.size.min * imageWidth / 2, CONFIG.rects.size.max * imageWidth / 2);
        const newHeightHalf = randomInt(CONFIG.rects.size.min * imageHeight / 2, CONFIG.rects.size.max * imageHeight / 2);
        ctx2.fillStyle = `rgb(${pixel.r}, ${pixel.g}, ${pixel.b})`;
        ctx2.fillRect(randomX - newWidthHalf, randomY - newHeightHalf, newWidthHalf*2, newHeightHalf*2);
    }
    
    const base64 = canvas2.toDataURL();
    document.querySelector('#drop-area > div').style.backgroundImage = `url(${base64})`;
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
