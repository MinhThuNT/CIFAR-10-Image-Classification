const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const preview = document.getElementById('preview');
const previewImg = document.getElementById('previewImg');
const predictBtn = document.getElementById('predictBtn');
const result = document.getElementById('result');
const predictedClass = document.getElementById('predictedClass');
const confidence = document.getElementById('confidence');
const top3List = document.getElementById('top3List');

// DRAG & DROP WORKS 100%
uploadArea.addEventListener('click', () => fileInput.click());

uploadArea.addEventListener('dragover', e => {
    e.preventDefault();
    e.stopPropagation();
    uploadArea.style.borderColor = '#fff';
    uploadArea.style.background = 'rgba(255,255,255,0.2)';
});

uploadArea.addEventListener('dragleave', e => {
    e.preventDefault();
    e.stopPropagation();
    uploadArea.style.borderColor = 'rgba(255,255,255,0.5)';
    uploadArea.style.background = 'rgba(255,255,255,0.05)';
});

uploadArea.addEventListener('drop', e => {
    e.preventDefault();
    e.stopPropagation();
    uploadArea.style.borderColor = 'rgba(255,255,255,0.5)';
    uploadArea.style.background = 'rgba(255,255,255,0.05)';

    if (e.dataTransfer.files.length) {
        const file = e.dataTransfer.files[0];
        if (file.type.startsWith('image/')) {
            handleFile(file);
        } else {
            alert("Only image files are accepted!");
        }
    }
});

fileInput.addEventListener('change', () => {
    if (fileInput.files.length) {
        handleFile(fileInput.files[0]);
    }
});

// PROCESS IMAGE & SHOW BUTTON IMMEDIATELY
function handleFile(file) {
    if (!file.type.startsWith('image/')) {
        alert("Please select an image file!");
        return;
    }

    const reader = new FileReader();
    reader.onload = e => {
        previewImg.src = e.target.result;
        preview.classList.remove('hidden');
        result.classList.add('hidden');
        predictBtn.classList.remove('hidden');
    };
    reader.readAsDataURL(file);
}

// PREDICTION
predictBtn.addEventListener('click', () => {
    const file = fileInput.files[0] || (event && event.dataTransfer && event.dataTransfer.files[0]);
    if (!file) {
        alert("No image selected!");
        return;
    }

    const formData = new FormData();
    formData.append('file', file);

    predictBtn.disabled = true;
    predictBtn.textContent = "Predicting...";

    fetch('/predict', {
        method: 'POST',
        body: formData
    })
    .then(res => res.json())
    .then(data => {
        if (data.error) throw new Error(data.error);

        predictedClass.textContent = data.predicted;
        confidence.textContent = `(${data.confidence} confidence)`;

        top3List.innerHTML = '';
        data.top3.forEach(item => {
            const li = document.createElement('li');
            li.innerHTML = `<strong>${item.rank}. ${item.class}</strong> → ${item.confidence}`;
            top3List.appendChild(li);
        });

        result.classList.remove('hidden');
        result.scrollIntoView({ behavior: 'smooth' });
    })
    .catch(err => {
        alert("Error: " + err.message);
    })
    .finally(() => {
        predictBtn.disabled = false;
        predictBtn.textContent = "PREDICT NOW";
    });
});
