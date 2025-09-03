// Patient Pain Management System JavaScript

class PainEpisode {
    constructor(painLevel, cause = null, cure = null, preInjectionPain = null, postInjectionPain = null, injectionTime = null) {
        this.painLevel = painLevel;
        this.timestamp = new Date();
        this.cause = cause;
        this.cure = cure;
        this.preInjectionPain = preInjectionPain;
        this.postInjectionPain = postInjectionPain;
        this.injectionTime = injectionTime;
    }
}

class Patient {
    constructor(name) {
        this.name = name;
        this.painLog = [];
        this.exerciseCompleted = false;
    }
}

// Global variables
let currentPatient = null;
let generatedPassword = null;
let currentActiveSection = 'recordPainSection';

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing app...');
    initializeApp();
});

function initializeApp() {
    // Get DOM elements
    const loginScreen = document.getElementById('loginScreen');
    const mainDashboard = document.getElementById('mainDashboard');
    const nameForm = document.getElementById('nameForm');
    const nameInput = document.getElementById('nameInput');
    const passwordSection = document.getElementById('passwordSection');
    const generatedPasswordDiv = document.getElementById('generatedPassword');
    const loginForm = document.getElementById('loginForm');
    const passwordInput = document.getElementById('passwordInput');
    const errorMessage = document.getElementById('errorMessage');
    const patientNameSpan = document.getElementById('patientName');
    const logoutBtn = document.getElementById('logoutBtn');

    // Ensure login screen is visible
    loginScreen.classList.remove('hidden');
    mainDashboard.classList.add('hidden');

    // Initialize event listeners
    initializeEventListeners();
    console.log('App initialized successfully');
}

function initializeEventListeners() {
    console.log('Setting up event listeners...');
    
    // Login form events
    const nameForm = document.getElementById('nameForm');
    const loginForm = document.getElementById('loginForm');
    const logoutBtn = document.getElementById('logoutBtn');
    
    if (nameForm) {
        nameForm.addEventListener('submit', handleNameSubmit);
        console.log('Name form event listener added');
    }
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
        console.log('Login form event listener added');
    }
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }

    // Navigation events
    const navButtons = {
        'recordPainBtn': 'recordPainSection',
        'doctorNotesBtn': 'doctorNotesSection',
        'analyzePainBtn': 'analysisSection',
        'exerciseBtn': 'exerciseSection'
    };

    Object.keys(navButtons).forEach(btnId => {
        const btn = document.getElementById(btnId);
        if (btn) {
            btn.addEventListener('click', () => {
                showSection(navButtons[btnId]);
                setActiveNavButton(btnId);
            });
        }
    });

    // Feature form events
    const painForm = document.getElementById('painForm');
    const notesForm = document.getElementById('notesForm');
    const exerciseForm = document.getElementById('exerciseForm');
    const exportBtn = document.getElementById('exportBtn');

    if (painForm) {
        painForm.addEventListener('submit', handlePainEpisode);
    }
    
    if (notesForm) {
        notesForm.addEventListener('submit', handleDoctorNotes);
    }
    
    if (exerciseForm) {
        exerciseForm.addEventListener('submit', handleExerciseTracking);
    }
    
    if (exportBtn) {
        exportBtn.addEventListener('click', handleDataExport);
    }

    // Injection radio button change
    const injectionRadios = document.querySelectorAll('input[name="injection"]');
    injectionRadios.forEach(radio => {
        radio.addEventListener('change', handleInjectionToggle);
    });

    // Notification close
    const closeNotificationBtn = document.getElementById('closeNotification');
    if (closeNotificationBtn) {
        closeNotificationBtn.addEventListener('click', hideNotification);
    }

    console.log('All event listeners initialized');
}

// Authentication Functions
function handleNameSubmit(e) {
    console.log('Name form submitted');
    e.preventDefault();
    
    const nameInput = document.getElementById('nameInput');
    const name = nameInput.value.trim();
    
    console.log('Patient name entered:', name);
    
    if (!name) {
        showError('Please enter a patient name');
        return;
    }

    // Create patient and generate password
    currentPatient = new Patient(name);
    generatedPassword = Math.floor(100000 + Math.random() * 900000);
    
    console.log('Generated password:', generatedPassword);
    
    // Show password section
    const passwordSection = document.getElementById('passwordSection');
    const generatedPasswordDiv = document.getElementById('generatedPassword');
    
    generatedPasswordDiv.textContent = generatedPassword.toString();
    passwordSection.classList.remove('hidden');
    hideError();
    
    showNotification(`Access code generated for ${name}`, 'success');
}

function handleLogin(e) {
    console.log('Login form submitted');
    e.preventDefault();
    
    const passwordInput = document.getElementById('passwordInput');
    const enteredPassword = parseInt(passwordInput.value);
    
    console.log('Entered password:', enteredPassword);
    console.log('Expected password:', generatedPassword);
    
    if (enteredPassword === generatedPassword && currentPatient) {
        const loginScreen = document.getElementById('loginScreen');
        const mainDashboard = document.getElementById('mainDashboard');
        const patientNameSpan = document.getElementById('patientName');
        
        loginScreen.classList.add('hidden');
        mainDashboard.classList.remove('hidden');
        patientNameSpan.textContent = currentPatient.name;
        
        showNotification('Successfully logged in!', 'success');
        updatePainLogTable();
        
        // Set initial active nav button
        setActiveNavButton('recordPainBtn');
        
        console.log('Login successful');
    } else {
        showError('Invalid credentials. Please check your name and access code.');
        console.log('Login failed');
    }
}

function handleLogout() {
    const loginScreen = document.getElementById('loginScreen');
    const mainDashboard = document.getElementById('mainDashboard');
    const nameForm = document.getElementById('nameForm');
    const loginForm = document.getElementById('loginForm');
    const passwordSection = document.getElementById('passwordSection');
    
    loginScreen.classList.remove('hidden');
    mainDashboard.classList.add('hidden');
    
    // Reset forms
    nameForm.reset();
    loginForm.reset();
    passwordSection.classList.add('hidden');
    hideError();
    
    // Reset data
    currentPatient = null;
    generatedPassword = null;
    currentActiveSection = 'recordPainSection';
    
    showNotification('Successfully logged out!', 'info');
}

// Navigation Functions
function showSection(sectionId) {
    console.log('Showing section:', sectionId);
    
    // Hide all sections
    const contentSections = {
        'recordPainSection': document.getElementById('recordPainSection'),
        'doctorNotesSection': document.getElementById('doctorNotesSection'),
        'analysisSection': document.getElementById('analysisSection'),
        'exerciseSection': document.getElementById('exerciseSection')
    };

    Object.values(contentSections).forEach(section => {
        if (section) {
            section.classList.add('hidden');
        }
    });
    
    // Show selected section
    const targetSection = contentSections[sectionId];
    if (targetSection) {
        targetSection.classList.remove('hidden');
        currentActiveSection = sectionId;
        
        // Special handling for analysis section
        if (sectionId === 'analysisSection') {
            analyzePatientPain();
        }
        
        // Check for doctor notes availability
        if (sectionId === 'doctorNotesSection') {
            checkDoctorNotesAvailability();
        }
    }
}

function setActiveNavButton(activeButtonId) {
    // Remove active class from all nav buttons
    const navButtons = ['recordPainBtn', 'doctorNotesBtn', 'analyzePainBtn', 'exerciseBtn'];
    navButtons.forEach(btnId => {
        const btn = document.getElementById(btnId);
        if (btn) {
            btn.classList.remove('active');
        }
    });
    
    // Add active class to current button
    const activeBtn = document.getElementById(activeButtonId);
    if (activeBtn) {
        activeBtn.classList.add('active');
    }
}

// Pain Episode Functions
function handlePainEpisode(e) {
    e.preventDefault();
    const painLevel = parseInt(document.getElementById('painLevel').value);
    
    if (isNaN(painLevel) || painLevel < 0 || painLevel > 10) {
        showNotification('Pain level must be between 0 and 10', 'error');
        return;
    }
    
    const episode = new PainEpisode(painLevel);
    currentPatient.painLog.push(episode);
    
    showNotification('Pain episode recorded successfully!', 'success');
    document.getElementById('painForm').reset();
    updatePainLogTable();
}

// Doctor Notes Functions
function checkDoctorNotesAvailability() {
    const noEpisodesMessage = document.getElementById('noEpisodesMessage');
    const notesForm = document.getElementById('notesForm');
    
    if (currentPatient.painLog.length === 0) {
        noEpisodesMessage.classList.remove('hidden');
        notesForm.style.display = 'none';
    } else {
        noEpisodesMessage.classList.add('hidden');
        notesForm.style.display = 'block';
    }
}

function handleInjectionToggle(e) {
    const injectionDetails = document.getElementById('injectionDetails');
    if (e.target.value === 'yes') {
        injectionDetails.classList.remove('hidden');
    } else {
        injectionDetails.classList.add('hidden');
    }
}

function handleDoctorNotes(e) {
    e.preventDefault();
    
    if (currentPatient.painLog.length === 0) {
        showNotification('No pain episodes to add notes to', 'error');
        return;
    }
    
    const lastEpisode = currentPatient.painLog[currentPatient.painLog.length - 1];
    const cause = document.getElementById('causeInput').value.trim();
    const cure = document.getElementById('cureInput').value.trim();
    const injectionGiven = document.querySelector('input[name="injection"]:checked')?.value;
    
    lastEpisode.cause = cause || 'N/A';
    lastEpisode.cure = cure || 'N/A';
    
    if (injectionGiven === 'yes') {
        const prePain = parseInt(document.getElementById('prePain').value);
        const postPain = parseInt(document.getElementById('postPain').value);
        
        if (!isNaN(prePain) && !isNaN(postPain) && prePain >= 0 && prePain <= 10 && postPain >= 0 && postPain <= 10) {
            lastEpisode.preInjectionPain = prePain;
            lastEpisode.postInjectionPain = postPain;
            lastEpisode.injectionTime = new Date();
            
            // Check injection effectiveness
            if (prePain <= postPain) {
                showNotification('⚠️ Alert: Injection may not be effective - pain did not decrease', 'warning');
            }
            
            // Check if pain lasted more than an hour
            const timeDiff = (lastEpisode.injectionTime - lastEpisode.timestamp) / (1000 * 60 * 60);
            if (timeDiff > 1) {
                showNotification('🚨 ALERT: Pain lasted more than an hour after medication. Alerting doctors!', 'error');
            }
        } else {
            showNotification('Invalid pain levels for injection notes. Please enter values between 0-10', 'error');
            return;
        }
    }
    
    showNotification('Doctor notes saved successfully!', 'success');
    document.getElementById('notesForm').reset();
    document.getElementById('injectionDetails').classList.add('hidden');
    updatePainLogTable();
}

// Analysis Functions
function analyzePatientPain() {
    const analysisResults = document.getElementById('analysisResults');
    
    if (!currentPatient || currentPatient.painLog.length === 0) {
        analysisResults.innerHTML = '<p class="text-secondary">No data to analyze. Please record some pain episodes first.</p>';
        return;
    }
    
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));
    
    const recentEpisodes = currentPatient.painLog.filter(episode => 
        episode.timestamp >= sevenDaysAgo
    );
    
    if (recentEpisodes.length === 0) {
        analysisResults.innerHTML = '<p class="text-secondary">Not enough data in the last 7 days for analysis.</p>';
        return;
    }
    
    let analysisHTML = '';
    
    // Check for sudden pain spikes
    if (recentEpisodes.length >= 4) {
        const lastEpisode = recentEpisodes[recentEpisodes.length - 1];
        const previousThree = recentEpisodes.slice(-4, -1);
        const previousAvg = previousThree.reduce((sum, e) => sum + e.painLevel, 0) / 3;
        
        if (lastEpisode.painLevel > previousAvg + 3) {
            analysisHTML += `
                <div class="alert-box severe">
                    <span class="alert-icon">🚨</span>
                    <div>
                        <strong>ALERT: Sudden spike in pain levels detected!</strong>
                        <br>Latest pain level (${lastEpisode.painLevel}) is significantly higher than recent average (${previousAvg.toFixed(1)})
                    </div>
                </div>
            `;
        }
    }
    
    // Check for recurring episode times
    const hourlyCount = {};
    recentEpisodes.forEach(episode => {
        const hour = episode.timestamp.getHours();
        hourlyCount[hour] = (hourlyCount[hour] || 0) + 1;
    });
    
    const sortedHours = Object.entries(hourlyCount)
        .sort(([,a], [,b]) => b - a)
        .filter(([,count]) => count >= 3);
    
    if (sortedHours.length > 0) {
        const [peakHour, count] = sortedHours[0];
        analysisHTML += `
            <div class="alert-box warning">
                <span class="alert-icon">⚠️</span>
                <div>
                    <strong>Recurring Pain Pattern Detected</strong>
                    <br>Pain episodes frequently occur around ${peakHour}:00 (${count} times). 
                    Staff should take extra care during this period.
                </div>
            </div>
        `;
    }
    
    // Calculate average pain and categorize patient
    const totalPain = recentEpisodes.reduce((sum, e) => sum + e.painLevel, 0);
    const avgPain = totalPain / recentEpisodes.length;
    
    // Patient categorization
    if (avgPain >= 7) {
        analysisHTML += `
            <div class="alert-box severe">
                <span class="alert-icon">🔥</span>
                <div>
                    <strong>Patient categorized as SEVERE</strong>
                    <br>Average pain level: ${avgPain.toFixed(2)}/10 - Immediate special care is advised.
                </div>
            </div>
        `;
    } else {
        analysisHTML += `
            <div class="alert-box success">
                <span class="alert-icon">✅</span>
                <div>
                    <strong>Patient's condition is stable</strong>
                    <br>Average pain level: ${avgPain.toFixed(2)}/10 - Condition appears stable or improving.
                </div>
            </div>
        `;
    }
    
    // Summary statistics
    const maxPain = Math.max(...recentEpisodes.map(e => e.painLevel));
    const minPain = Math.min(...recentEpisodes.map(e => e.painLevel));
    
    analysisHTML += `
        <div class="stat-summary">
            <h3>7-Day Summary Statistics</h3>
            <div class="stat-item">
                <span>Total Episodes:</span>
                <span class="stat-value">${recentEpisodes.length}</span>
            </div>
            <div class="stat-item">
                <span>Average Pain Level:</span>
                <span class="stat-value">${avgPain.toFixed(2)}/10</span>
            </div>
            <div class="stat-item">
                <span>Highest Pain Level:</span>
                <span class="stat-value">${maxPain}/10</span>
            </div>
            <div class="stat-item">
                <span>Lowest Pain Level:</span>
                <span class="stat-value">${minPain}/10</span>
            </div>
        </div>
    `;
    
    analysisResults.innerHTML = analysisHTML;
}

// Exercise Tracking Functions
function handleExerciseTracking(e) {
    e.preventDefault();
    
    const exerciseComplete = document.querySelector('input[name="exerciseComplete"]:checked')?.value;
    const exerciseStatus = document.getElementById('exerciseStatus');
    
    if (!exerciseComplete) {
        showNotification('Please select whether exercises were completed', 'error');
        return;
    }
    
    currentPatient.exerciseCompleted = exerciseComplete === 'yes';
    
    if (currentPatient.exerciseCompleted) {
        exerciseStatus.innerHTML = '<div class="exercise-status-complete">✅ Exercise completion recorded</div>';
        showNotification('Exercise completion recorded!', 'success');
    } else {
        exerciseStatus.innerHTML = '<div class="exercise-status-incomplete">⚠️ REMINDER: The patient has not yet completed their exercises</div>';
        showNotification('Exercise reminder noted', 'warning');
    }
    
    document.getElementById('exerciseForm').reset();
}

// Data Export Function
function handleDataExport() {
    if (!currentPatient || currentPatient.painLog.length === 0) {
        showNotification('No data to export', 'info');
        return;
    }
    
    let csvContent = 'Date,Time,Pain Level,Cause,Cure,Pre-Injection Pain,Post-Injection Pain,Injection Time\n';
    
    currentPatient.painLog.forEach(episode => {
        const date = episode.timestamp.toLocaleDateString();
        const time = episode.timestamp.toLocaleTimeString();
        const cause = episode.cause || 'N/A';
        const cure = episode.cure || 'N/A';
        const prePain = episode.preInjectionPain !== null ? episode.preInjectionPain : 'N/A';
        const postPain = episode.postInjectionPain !== null ? episode.postInjectionPain : 'N/A';
        const injectionTime = episode.injectionTime ? episode.injectionTime.toLocaleTimeString() : 'N/A';
        
        csvContent += `"${date}","${time}",${episode.painLevel},"${cause}","${cure}","${prePain}","${postPain}","${injectionTime}"\n`;
    });
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Patient_Pain_Log_${new Date().toLocaleDateString().replace(/\//g, '-')}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    showNotification('Data exported successfully!', 'success');
}

// UI Update Functions
function updatePainLogTable() {
    const tableContainer = document.getElementById('painLogTable');
    
    if (!currentPatient || currentPatient.painLog.length === 0) {
        tableContainer.innerHTML = '<p class="text-secondary">No episodes recorded yet.</p>';
        return;
    }
    
    let tableHTML = `
        <table class="pain-log-table">
            <thead>
                <tr>
                    <th>Date/Time</th>
                    <th>Pain Level</th>
                    <th>Cause</th>
                    <th>Treatment</th>
                    <th>Injection</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    currentPatient.painLog.slice().reverse().forEach(episode => {
        const dateTime = episode.timestamp.toLocaleString();
        const painClass = episode.painLevel <= 3 ? 'pain-level-low' : 
                         episode.painLevel <= 6 ? 'pain-level-medium' : 'pain-level-high';
        const injectionInfo = episode.preInjectionPain !== null ? 
            `${episode.preInjectionPain} → ${episode.postInjectionPain}` : 'No';
        
        tableHTML += `
            <tr>
                <td>${dateTime}</td>
                <td class="pain-level-cell ${painClass}">${episode.painLevel}/10</td>
                <td>${episode.cause || 'N/A'}</td>
                <td>${episode.cure || 'N/A'}</td>
                <td>${injectionInfo}</td>
            </tr>
        `;
    });
    
    tableHTML += '</tbody></table>';
    tableContainer.innerHTML = tableHTML;
}

// Notification Functions
function showNotification(message, type = 'info') {
    const notification = document.getElementById('notification');
    const content = document.getElementById('notificationContent');
    
    if (notification && content) {
        content.textContent = message;
        notification.className = `notification ${type}`;
        notification.classList.remove('hidden');
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            hideNotification();
        }, 5000);
    }
}

function hideNotification() {
    const notification = document.getElementById('notification');
    if (notification) {
        notification.classList.add('hidden');
    }
}

function showError(message) {
    const errorMessage = document.getElementById('errorMessage');
    if (errorMessage) {
        errorMessage.textContent = message;
        errorMessage.classList.remove('hidden');
    }
}

function hideError() {
    const errorMessage = document.getElementById('errorMessage');
    if (errorMessage) {
        errorMessage.classList.add('hidden');
    }
}