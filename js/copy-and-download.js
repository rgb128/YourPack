'use strict';

function* getFileName(currentImageNum = 1) {
    function getCurrentDate() {
        const today = new Date();
        const yyyy = today.getFullYear();
        let mm = today.getMonth() + 1; // Months start at 0!
        let dd = today.getDate();
        if (dd < 10) dd = '0' + dd;
        if (mm < 10) mm = '0' + mm;

        return '' + yyyy + mm + dd;
    }

    while (true) {
        yield `rgb128_yourpack_${getCurrentDate()}_${currentImageNum++}.png`;
    }
}
const newFileNameGenerator = getFileName();


const copyBtn = document.getElementById('copy');
copyBtn.onclick = e => {
    e.stopPropagation();

    copyBtn.innerText = 'copying';

    // 1. Create a Promise that resolves with the blob data from the canvas.
    //    We pass the promise's 'resolve' function directly as the callback to toBlob.
    const blobPromise = new Promise(resolve => canvas2.toBlob(resolve, 'image/png'));

    // 2. Immediately and synchronously call clipboard.write().
    //    We pass the PROMISE of the blob to the ClipboardItem. Safari is happy with this
    //    because the intent to write happens directly within the user-triggered event.
    navigator.clipboard.write([
        new ClipboardItem({
            'image/png': blobPromise
        })
    ]).then(() => {
        // SUCCESS: This runs after the blob has been generated and successfully copied.
        copyBtn.innerText = 'copied';
    }).catch(ex => {
        // FAILURE: This runs if the user denies permission or another error occurs.
        console.error('Failed to copy image:', ex);
        alert('Could not copy image: ' + ex.message);
        copyBtn.innerText = 'failed';
    }).finally(() => {
        // ALWAYS RUNS: This resets the button text after a delay, regardless of outcome.
        setTimeout(() => {
            copyBtn.innerText = 'Copy';
        }, 2000);
    });
};

const downloadBtn = document.getElementById('download');
downloadBtn.onclick = e => {
    e.stopPropagation();
    const myImageDataUrl = canvas2.toDataURL('image/png').replace('image/png', 'image/octet-stream');
    const link = document.createElement('a');
    link.style.display = 'none';
    link.href = myImageDataUrl;
    link.download = newFileNameGenerator.next().value;
    link.click();
    link.remove();
}
