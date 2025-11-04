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

    // Check for clipboard write permission.
    navigator.permissions.query({ name: "clipboard-write" }).then(result => {
        if (result.state === "granted" || result.state === "prompt") {
            // Permission is granted or can be requested.
            
            copyBtn.innerText = 'copying';

            // Convert canvas to blob.
            canvas2.toBlob(blob => {
                // The Clipboard API is promise-based, so we use .then() and .catch().
                navigator.clipboard.write([
                    new ClipboardItem({
                        'image/png': blob
                    })
                ]).then(() => {
                    // This block executes if the write operation is successful.
                    copyBtn.innerText = 'copied';
                }).catch(ex => {
                    // This block executes if the write operation fails.
                    console.error(ex);
                    alert(ex);
                    copyBtn.innerText = 'failed';
                }).finally(() => {
                    // This will always execute after the promise settles (either success or failure).
                    setTimeout(() => {
                        copyBtn.innerText = 'Copy';
                    }, 2000);
                });
            });
        } else {
            // Inform the user that permission is needed.
            alert('Please grant permission to copy the image!');
        }
    }).catch(err => {
        // Handle potential errors with the permissions query itself.
        console.error('Permission query failed:', err);
        alert('Could not verify clipboard permissions.');
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
