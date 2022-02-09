// Elements
const fileInput = document.getElementById("img-input");
const canvas = document.getElementById("canvas");
const downloadButton = document.getElementById("download-button");
const root = document.getRootNode();

// Get canvas ready
const ctx = canvas.getContext("2d");
ctx.fillRect(0, 0, canvas.width, canvas.height);

// Images
let selectedFileName = null;
const circle = new Image(1080, 1080);
circle.crossOrigin = "anonymous";
circle.src = "https://i.ibb.co/gT3NyL3/888-Inner-Circle-Maalavidaa-1.png";
circle.onload = function (){
    rebuildCanvas()
}

inputImg = new Image();
inputImg.width = 1080;
inputImg.height = 1080;
inputImg.src = circle.src

const handleNewFile = (file) => {
    const reader = new FileReader();

    reader.readAsDataURL(file);
    reader.onloadend = (event) => {
        inputImg = new Image();
        inputImg.src = event.target.result;
        inputImg.onload = function(){
            selectedFileName = file.name;
            rebuildCanvas();
        };
    };
};

rebuildCanvas = function () {
    console.log("Building canvas...");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const width = (canvas.width = Math.min(inputImg.width, circle.width));
    const height = (canvas.height = Math.min(inputImg.height, circle.height));
    if(selectedFileName) {
        ctx.drawImage(inputImg, 0, 0, width, height);
    }
    ctx.drawImage(circle, 0, 0, width, height);
    ctx.globalCompositeOperation = "destination-in";
    ctx.beginPath();
    ctx.arc(width / 2, height / 2, height / 2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
    console.log("Finished building canvas");
};

// Handle new image selection
fileInput.onchange = function (e) {
    console.log("Received", e.target.files[0], "from file input");
    handleNewFile(e.target.files[0]);
};

// Handle drag-and-drop
const preventDefault = (e) => {
    e.preventDefault();
    e.stopPropagation();
};

root.addEventListener("dragenter", preventDefault, false);
root.addEventListener("dragleave", preventDefault, false);
root.addEventListener("dragover", preventDefault, false);
root.addEventListener("drop", preventDefault, false);

root.addEventListener(
    "drop",
    (e) => {
        const file = e.dataTransfer?.files[0];

        if (file) {
            handleNewFile(file);
        }
    },
    false
);

// Handle download
downloadButton.onclick = function () {
    console.log("Attempting to download canvas");
    if (!selectedFileName) return console.log("No selected image!");

    const linkElement = document.createElement("a");

    const fileName = selectedFileName.substring(0, selectedFileName.lastIndexOf(".")) + ".png";

    console.log("Preparing", fileName, "for download");
    linkElement.download = fileName;
    linkElement.href = canvas.toDataURL("image/png");

    linkElement.click();
};

$(".grid-item").on("click",
    function () {
        $(".grid-item").removeClass("grid-item-active");
        $(this).toggleClass("grid-item-active");
        circle.src = $(this).attr('src');
        rebuildCanvas();
    });