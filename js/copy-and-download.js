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
    
    // Convert the canvas content to a Blob.
    // The callback function receives the 'blob' object.
    canvas2.toBlob(blob => {
        // navigator.clipboard.write() returns a Promise.
        // Instead of 'await', we handle it with .then() for success and .catch() for failure.
        navigator.clipboard.write([
            new ClipboardItem({
                'image/png': blob
            })
        ])
        .then(() => {
            // This block runs if the copy operation is successful.
            copyBtn.innerText = 'copied';
        })
        .catch(err => {
            // This block runs if the copy operation fails.
            console.error('Failed to copy image: ', err);
            alert('Failed to copy image.');
            copyBtn.innerText = 'failed';
        })
        .finally(() => {
            // This block runs after the operation completes (either success or failure).
            // It resets the button text after a 2-second delay.
            setTimeout(() => {
                copyBtn.innerText = 'Copy';
            }, 2000);
        });
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
