const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const preview = document.getElementById('preview');
const previewImg = document.getElementById('previewImg');

const result = document.getElementById('result');
const predictBtn = document.getElementById('predictBtn');
const predictedClass = document.getElementById('predictedClass');
const confidence = document.getElementById('confidence');
const top3List = document.getElementById('top3List');

let currentObjectURL = null;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB limit

// Utility Functions
// Reset UI before loading new image
function resetUI() {
    result.classList.add('hidden');
    predictedClass.textContent = '';
    confidence.textContent = '';
    top3List.innerHTML = '';
}

// Validate selected file
function validateImage(file) {
    if (!file) return { ok: false, msg: "No file selected." };
    if (!file.type.startsWith("image/")) return { ok: false, msg: "Please select an image file." };
    if (file.size > MAX_FILE_SIZE) return { ok: false, msg: "Image too large (max 5MB)." };
    return { ok: true };
}

// Assign selected file to file input (for POST later)
function setFileToInput(file) {
    const dt = new DataTransfer();
    dt.items.add(file);
    fileInput.files = dt.files;
}

// Cleanup old object URL
function clearObjectURL() {
    if (currentObjectURL) {
        URL.revokeObjectURL(currentObjectURL);
        currentObjectURL = null;
    }
}

// Display preview image
function showPreview(file) {
    clearObjectURL();
    currentObjectURL = URL.createObjectURL(file);
    previewImg.src = currentObjectURL;

    preview.classList.remove("hidden");
    predictBtn.classList.remove("hidden");
    predictBtn.disabled = false;
    predictBtn.textContent = "PREDICT NOW";
}

// Handle File Input or Drop Event

function handleFile(file) {
    resetUI();

    const check = validateImage(file);
    if (!check.ok) {
        alert(check.msg);
        return;
    }

    setFileToInput(file);
    showPreview(file);
}

// Click -> Open File Dialog

uploadArea.addEventListener("click", e => {
    if (e.target === fileInput) return;
    fileInput.click();
});


fileInput.addEventListener("change", () => {
    if (fileInput.files.length > 0) {
        handleFile(fileInput.files[0]);
    }
});

// Drag & Drop Area (Stable, no flicker)

let dragDepth = 0;

function setDragStyle(active) {
    uploadArea.style.borderColor = active ? "#fff" : "rgba(255,255,255,0.5)";
    uploadArea.style.background = active ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.05)";
}

uploadArea.addEventListener("dragenter", e => {
    e.preventDefault();
    dragDepth++;
    setDragStyle(true);
});

uploadArea.addEventListener("dragover", e => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
});

uploadArea.addEventListener("dragleave", e => {
    e.preventDefault();
    dragDepth--;
    if (dragDepth <= 0) setDragStyle(false);
});

uploadArea.addEventListener("drop", e => {
    e.preventDefault();
    dragDepth = 0;
    setDragStyle(false);

    const files = e.dataTransfer.files;
    if (!files.length) return;

    const file = [...files].find(f => f.type.startsWith("image/")) || files[0];

    if (!file.type.startsWith("image/")) {
        alert("Only image files are allowed.");
        return;
    }

    handleFile(file);
});

// Prediction Function

async function doPredict() {
    const file = fileInput.files[0];
    if (!file) {
        alert("No image selected!");
        return;
    }

    predictBtn.disabled = true;
    const previousText = predictBtn.textContent;
    predictBtn.textContent = "Predicting...";

    const formData = new FormData();
    formData.append("file", file);

    try {
        const res = await fetch("/predict", {
            method: "POST",
            body: formData
        });

        if (!res.ok) {
            const errText = await res.text();
            throw new Error(`Server Error ${res.status}: ${errText}`);
        }

        const data = await res.json();

        if (data.error) throw new Error(data.error);

        predictedClass.textContent = data.predicted || "";
        confidence.textContent = data.confidence ? `(${data.confidence} confidence)` : "";

        top3List.innerHTML = '';
        (data.top3 || []).forEach(item => {
            const li = document.createElement("li");
            li.innerHTML = `<strong>${item.rank}. ${item.class}</strong> → ${item.confidence}`;
            top3List.appendChild(li);
        });

        result.classList.remove("hidden");
        result.scrollIntoView({ behavior: "smooth", block: "center" });

    } catch (err) {
        alert(err.message || "Prediction failed.");
        console.error("Predict Error:", err);

    } finally {
        predictBtn.disabled = false;
        predictBtn.textContent = previousText;
    }
}

predictBtn.addEventListener("click", () => {
    if (!predictBtn.disabled) doPredict();
});

// Final Cleanup (Prevent memory leak)
window.addEventListener("beforeunload", clearObjectURL);

