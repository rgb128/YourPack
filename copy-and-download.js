'use strict';
let currentImageNum = 1;
function getFileName() {
    return `rgb128_yourpack_${getCurrentDate()}_${currentImageNum++}.png`;
}

function getCurrentDate() {
    const today = new Date();
    const yyyy = today.getFullYear();
    let mm = today.getMonth() + 1; // Months start at 0!
    let dd = today.getDate();
    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;

    return '' + yyyy + mm + dd;
}

const copyBtn = document.getElementById('copy');
copyBtn.onclick = async e => {
    e.stopPropagation();
    navigator.permissions.query({ name: "write-on-clipboard" }).then((result) => {
        if (result.state == "granted" || result.state == "prompt") {
            // alert("Write access granted!");
        } else {
            alert('Grand permission to copy image!');
        }
    });
      
    copyBtn.innerText = 'copying';
    canvas2.toBlob(async blob =>{
        try {
            await navigator.clipboard.write([
                new ClipboardItem({
                    'image/png': blob
                })
            ]);
            copyBtn.innerText = 'copied';
        } catch (ex) {
            console.error(ex);
            alert(ex);
            copyBtn.innerText = 'failed';
        }
        setTimeout(() => {
            copyBtn.innerText = 'Copy';
        }, 2000);
    })   
};

const downloadBtn = document.getElementById('download');
downloadBtn.onclick = e => {
    e.stopPropagation();
    const myImageDataUrl = canvas2.toDataURL('image/png').replace('image/png', 'image/octet-stream');
    const link = document.createElement('a');
    link.style.display = 'none';
    link.href = myImageDataUrl;
    link.download = getFileName();
    link.click();
    link.remove();
}
