**CIFAR-10 Image Classification**

A clean and production-ready pipeline for training, evaluating, and deploying a deep Convolutional Neural Network (CNN) on the CIFAR-10 dataset.
The project includes a full training workflow, robust checkpointing, and a modern web interface built with Flask.

***1. Overview***

This project implements a custom VGG-style convolutional neural network trained from scratch on CIFAR-10 (10-class image dataset).
The system includes:

* A deep CNN achieving 90.70% test accuracy

* Stable training with checkpoint resume

* Image prediction for real-world photos

* A lightweight Flask web app with a clean UI

* Real-time inference (top-3 predictions)

***2. Model Architecture***

Custom VGG-inspired CNN:

* 8 convolutional blocks (32 → 256 filters)

* Kernel size: 3×3, padding: same

* Batch Normalization + ReLU

* Dropout 0.2 → 0.5

* L2 regularization (1e-4)

* Adam optimizer (lr=5e-4)

* EarlyStopping + ReduceLROnPlateau

Total parameters: 1,186,346

Trainable parameters: 1,184,426

***3. Training Performance***

*Loss & Accuracy Curves*

![loss_accuracy_curve](/images/loss_accuracy_curve.png)


***4. Inference Results***

*Real-World Prediction Example*

![Truck Prediction](/images/truck_prediction.png)

*Web App Demo*

![demo1](/images/web_demo_1.png)
![demo2](/images/web_demo_2.png)
![demo3](/images/web_demo_3.png)
![demo3](/images/web_demo_4.png)

**5. Web Application**

A minimal, clean Flask application supporting:

* Drag-and-drop image upload

* Real-time prediction (<1s)

* Top-3 inference output

* Modern UI (glassmorphism)

* Fully client-side responsive

*Tech stack:*

```bash
Flask · HTML5 · CSS3 · JavaScript
```

**6. Installation**

*Clone the repository*
```bash
git clone https://github.com/MinhThuNT/cifar10-cnn-classifier.git
cd cifar10-cnn-classifier
```

**7. Environment Setup**

*Install required packages*

```nginx
pip install -r requirements.txt
```

*Start the Flask server*

```bash
python app.py
```

*Open in browser:*

```cpp
http://127.0.0.1:5000
```

**8. Project Structure**
```php
.
├── checkpoints/
│
├── cifar10_final_model/
│   ├── saved_model_format/
│   ├── cifar10_cnn_90plus.h5
│   ├── cifar10_cnn_90plus.keras
│   ├── class_names.pkl
│   ├── INFO.txt
│   ├── norm_stats.pkl
│   ├── training_history.pkl
│
├── env/
│
├── images/
│   ├── loss_accuracy_curve.png
│   └── truck_prediction.png
│
├── sample/
│
├── static/
│   ├── script.js
│   └── style.css
│
├── templates/
│   └── index.html
│
├── uploads/
│
├── .gitignore
├── AI_OJT_Project.ipynb
├── flask_app.py
├── Procfile
├── README.md
└── requirements.txt
```

**9. Key Features**

* End-to-end ML pipeline

* Robust model checkpointing

* Resume training on interruption

* Predict any real-world image

* Clean UI web interface

* High accuracy for custom-built CNN

**10. Future Improvements**

* Integrate EfficientNet-B0 / ResNet-50 for >94%

* Convert to TensorFlow Lite for mobile deployment

* Add real-time webcam inference

* Expand dataset for Vietnam-specific classes

* Docker & cloud-based deployment (AWS / GCP)

**11. License**

MIT License © 2025

Created by Nguyễn Thị Minh Thư – SE185043


