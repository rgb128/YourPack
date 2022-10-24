const dropDiv = document.getElementById('drop-area');
const input = dropDiv.querySelector('input');



input.oninput = () => {
    console.log('oninput');
    //todo check file type
    onUploaded(input.files[0]);
}
dropDiv.onclick = () => {
    input.click();
}
dropDiv.ondrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('ondrop');
    dropDiv.classList.remove('active');
    const dt = e.dataTransfer;
    const files = dt.files;
    const file = files[0];
    //todo check file type
    onUploaded(file);
}
// dropDiv.addEventListener('drop', async (e) => {
//     console.log('ondrop');
//     e.preventDefault();
//     e.stopPropagation();
//     dropDiv.classList.remove('active');
//     const dt = e.dataTransfer;
//     const files = dt.files;
//     const file = files[0];
//     //todo check file type
//     onUploaded(file);
// });
dropDiv.ondragover = (e) => {
    e.preventDefault();
    dropDiv.classList.add('active');
}
dropDiv.ondragleave = () => {
    dropDiv.classList.remove('active');
}
