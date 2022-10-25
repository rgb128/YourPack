const dropDiv = document.querySelector('#drop-area > div');
const input = dropDiv.querySelector('input');


input.oninput = async () => {
    if (!input.files.length) return;
    document.getElementById('uploading-div').classList.add('hidden');
    const image = await getImageFromFile(input.files[0]);
    onUploaded(image);
}
dropDiv.onclick = () => {
    input.click();
}
dropDiv.ondrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropDiv.classList.remove('active');
    const dt = e.dataTransfer;
    const files = dt.files;
    if (!files.length) return;
    const file = files[0];
    document.getElementById('uploading-div').classList.add('hidden');
    if (checkFileIsImage(file)) {
        const image = await getImageFromFile(file);
        onUploaded(image);
    }
}
dropDiv.ondragover = (e) => {
    e.preventDefault();
    dropDiv.classList.add('active');
}
dropDiv.ondragleave = () => {
    dropDiv.classList.remove('active');
}

function checkFileIsImage(file) {
    const imageType = /image.*/;
    return !!file.type.match(imageType);
}

function getImageFromFile(file) {
    return new Promise((resolve, reject) => {
        const fr = new FileReader;
        fr.onload = function() {
            const img = new Image;
            img.onload = function() {
                resolve(img);
            };
            img.src = fr.result;
        };
        fr.readAsDataURL(file);
    })
}
