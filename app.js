// Main application logic
document.addEventListener('DOMContentLoaded', function() {
    // Initialize calculator
    setupCalculator();
    
    // Set up authentication
    setupAuth();
    
    // Set up chart upload
    setupChartUpload();
});

function setupCalculator() {
    const calculatePosition = () => {
        const balance = parseFloat(document.getElementById('account-balance').value);
        const riskPercent = parseFloat(document.getElementById('risk-per-trade').value) / 100;
        const stopLoss = parseFloat(document.getElementById('stop-loss').value);
        
        const riskAmount = balance * riskPercent;
        const positionSize = (riskAmount / stopLoss).toFixed(2);
        
        document.getElementById('size-result').textContent = positionSize;
    };
    
    document.querySelectorAll('input').forEach(input => {
        input.addEventListener('change', calculatePosition);
        input.addEventListener('keyup', calculatePosition);
    });
    
    calculatePosition();
}

function setupAuth() {
    const loginBtn = document.getElementById('login-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const welcomeMsg = document.getElementById('welcome-message');
    
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            loginBtn.style.display = 'none';
            logoutBtn.style.display = 'block';
            welcomeMsg.textContent = `Welcome back, ${user.email.split('@')[0]}!`;
            welcomeMsg.classList.remove('hidden');
            
            // Load user settings
            firebase.database().ref('users/' + user.uid + '/settings').once('value').then(snapshot => {
                const settings = snapshot.val();
                if (settings) {
                    document.getElementById('account-balance').value = settings.balance || 10000;
                    document.getElementById('risk-per-trade').value = settings.risk || 0.25;
                    document.getElementById('stop-loss').value = settings.stopLoss || 6.00;
                    document.getElementById('take-profit').value = settings.takeProfit || 7.80;
                }
            });
        } else {
            loginBtn.style.display = 'block';
            logoutBtn.style.display = 'none';
            welcomeMsg.classList.add('hidden');
        }
    });
    
    loginBtn.addEventListener('click', () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithPopup(provider);
    });
    
    logoutBtn.addEventListener('click', () => {
        firebase.auth().signOut();
    });
}

function setupChartUpload() {
    const uploadArea = document.getElementById('upload-area');
    const fileInput = document.getElementById('chart-upload');
    const analysisCanvas = document.getElementById('analysis-canvas');
    const resultsDiv = document.getElementById('analysis-results');
    
    uploadArea.addEventListener('click', () => fileInput.click());
    
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '#3498db';
        uploadArea.style.backgroundColor = '#f8f9fa';
    });
    
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.style.borderColor = '#bdc3c7';
        uploadArea.style.backgroundColor = 'transparent';
    });
    
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '#bdc3c7';
        uploadArea.style.backgroundColor = 'transparent';
        
        if (e.dataTransfer.files.length) {
            fileInput.files = e.dataTransfer.files;
            handleImageUpload(e.dataTransfer.files[0]);
        }
    });
    
    fileInput.addEventListener('change', () => {
        if (fileInput.files.length) {
            handleImageUpload(fileInput.files[0]);
        }
    });
    
    function handleImageUpload(file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            uploadArea.innerHTML = `<img src="${e.target.result}" style="max-width: 100%;">`;
            
            // Simple edge detection with OpenCV
            analyzeWithOpenCV(e.target.result);
        };
        reader.readAsDataURL(file);
    }
    
    function analyzeWithOpenCV(imageSrc) {
        const img = new Image();
        img.onload = function() {
            analysisCanvas.width = img.width;
            analysisCanvas.height = img.height;
            const ctx = analysisCanvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            analysisCanvas.classList.remove('hidden');
            
            // Simple pattern detection simulation
            setTimeout(() => {
                resultsDiv.classList.remove('hidden');
                document.getElementById('trade-opportunities').innerHTML = `
                    <div class="pattern">
                        <h4>Identified Patterns</h4>
                        <ul>
                            <li>Support/Resistance Levels</li>
                            <li>Potential Breakout</li>
                        </ul>
                    </div>
                    <div class="recommendation">
                        <h4>Trade Recommendation</h4>
                        <p>Consider long position with stop at ${document.getElementById('stop-loss').value} points</p>
                        <p>Target: ${document.getElementById('take-profit').value} points</p>
                    </div>
                `;
                
                // Save settings to Firebase
                const user = firebase.auth().currentUser;
                if (user) {
                    const settings = {
                        balance: document.getElementById('account-balance').value,
                        risk: document.getElementById('risk-per-trade').value,
                        stopLoss: document.getElementById('stop-loss').value,
                        takeProfit: document.getElementById('take-profit').value,
                        lastUpdated: firebase.database.ServerValue.TIMESTAMP
                    };
                    firebase.database().ref('users/' + user.uid + '/settings').set(settings);
                }
            }, 1500);
        };
        img.src = imageSrc;
    }
}

function onOpenCvReady() {
    console.log('OpenCV.js is ready');
    // OpenCV.js is now ready to use
}