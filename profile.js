// Initialize default profile data
const defaultProfile = {
    fullName: 'John Doe',
    patientId: '#12345',
    age: '35',
    gender: 'Male',
    bloodGroup: 'O+',
    email: 'john.doe@email.com',
    phone: '+91 9876543210',
    address: '123 Main Street, City, State - 110001',
    emergencyContact: '+91 9876543211',
    medicalConditions: 'None',
    allergies: 'None',
    profilePhoto: 'https://i.pravatar.cc/150?img=12'
};

// Load user profile from localStorage
function loadUserProfile() {
    const savedProfile = localStorage.getItem('userProfile');
    const profile = savedProfile ? JSON.parse(savedProfile) : defaultProfile;
    
    // Update navigation
    document.getElementById('navPatientName').textContent = profile.fullName.split(' ')[0];
    document.getElementById('navProfilePic').src = profile.profilePhoto;
    
    // Update display name in edit modal
    if (document.getElementById('displayName')) {
        document.getElementById('displayName').textContent = profile.fullName;
    }
    if (document.getElementById('displayPatientId')) {
        document.getElementById('displayPatientId').textContent = profile.patientId;
    }
    
    // Update edit form
    if (document.getElementById('fullName')) {
        document.getElementById('fullName').value = profile.fullName;
        document.getElementById('patientId').value = profile.patientId;
        document.getElementById('age').value = profile.age;
        document.getElementById('gender').value = profile.gender;
        document.getElementById('bloodGroup').value = profile.bloodGroup;
        document.getElementById('email').value = profile.email;
        document.getElementById('phone').value = profile.phone;
        document.getElementById('address').value = profile.address;
        document.getElementById('emergencyContact').value = profile.emergencyContact;
        document.getElementById('medicalConditions').value = profile.medicalConditions;
        document.getElementById('allergies').value = profile.allergies;
        document.getElementById('editProfilePic').src = profile.profilePhoto;
    }
}

// Save user profile to localStorage
function saveUserProfile(profileData) {
    localStorage.setItem('userProfile', JSON.stringify(profileData));
    loadUserProfile();
}

// Open edit profile modal
function openEditProfile() {
    document.getElementById('editProfileModal').classList.add('active');
}

// Handle photo upload for edit profile modal
document.addEventListener('DOMContentLoaded', function() {
    const photoUploadInput = document.getElementById('photoUpload');
    if (photoUploadInput) {
        photoUploadInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    const photoData = event.target.result;
                    document.getElementById('editProfilePic').src = photoData;
                    document.getElementById('navProfilePic').src = photoData;
                    
                    // Auto-save photo
                    const savedProfile = localStorage.getItem('userProfile');
                    const profile = savedProfile ? JSON.parse(savedProfile) : defaultProfile;
                    profile.profilePhoto = photoData;
                    localStorage.setItem('userProfile', JSON.stringify(profile));
                    showNotification('Photo updated and saved!');
                };
                reader.readAsDataURL(file);
            }
        });
    }
});

// Handle form submission
document.addEventListener('DOMContentLoaded', function() {
    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
        profileForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const profileData = {
                fullName: document.getElementById('fullName').value,
                patientId: document.getElementById('patientId').value,
                age: document.getElementById('age').value,
                gender: document.getElementById('gender').value,
                bloodGroup: document.getElementById('bloodGroup').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                address: document.getElementById('address').value,
                emergencyContact: document.getElementById('emergencyContact').value,
                medicalConditions: document.getElementById('medicalConditions').value,
                allergies: document.getElementById('allergies').value,
                profilePhoto: document.getElementById('editProfilePic').src
            };
            
            saveUserProfile(profileData);
            closeModal('editProfileModal');
            showNotification('Profile saved successfully!');
        });
    }
});

// Auto-save on input change for main profile form
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        const mainFormInputs = document.querySelectorAll('#profileForm input, #profileForm select, #profileForm textarea');
        mainFormInputs.forEach(input => {
            input.addEventListener('change', function() {
                if (this.value) {
                    const savedProfile = localStorage.getItem('userProfile');
                    const profile = savedProfile ? JSON.parse(savedProfile) : defaultProfile;
                    profile[this.id] = this.value;
                    localStorage.setItem('userProfile', JSON.stringify(profile));
                    showNotification('Auto-saved!', 1000);
                    loadUserProfile();
                }
            });
        });
    }, 500);
});

// Profile photo upload functions for profile section
function showPhotoOptions() {
    const modal = document.getElementById('photoOptionsModal');
    if (modal) {
        modal.classList.add('active');
    }
}

function closePhotoOptions() {
    const modal = document.getElementById('photoOptionsModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

function openCamera() {
    // Close the options sheet first
    closePhotoOptions();

    // Prefer in-app camera via MediaDevices; fallback to file input
    const supportsMedia = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);

    if (supportsMedia) {
        // Build a lightweight camera modal dynamically
        const modal = document.createElement('div');
        modal.id = 'cameraModal';
        modal.className = 'camera-modal';
        modal.innerHTML = `
            <div class="camera-container">
                <video id="cameraVideo" class="camera-video" autoplay playsinline></video>
                <div class="camera-controls">
                    <button id="captureBtn" class="camera-btn capture">Capture</button>
                    <button id="cancelBtn" class="camera-btn cancel">Cancel</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        const videoEl = modal.querySelector('#cameraVideo');
        const captureBtn = modal.querySelector('#captureBtn');
        const cancelBtn = modal.querySelector('#cancelBtn');

        navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } })
            .then(stream => {
                videoEl.srcObject = stream;
                videoEl.play();
            })
            .catch(err => {
                // Fallback: open native file input with camera hint
                const cameraInput = document.getElementById('cameraInput');
                if (cameraInput) {
                    cameraInput.setAttribute('accept', 'image/*;capture=camera');
                    cameraInput.setAttribute('capture', 'user');
                    cameraInput.click();
                }
                // Remove modal if camera cannot start
                modal.remove();
            });

        captureBtn.addEventListener('click', () => {
            const canvas = document.createElement('canvas');
            canvas.width = videoEl.videoWidth || 640;
            canvas.height = videoEl.videoHeight || 480;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(videoEl, 0, 0, canvas.width, canvas.height);
            const dataUrl = canvas.toDataURL('image/jpeg', 0.92);

            // Stop stream and remove modal
            stopCameraStream(videoEl);
            modal.remove();

            // Save photo to profile
            saveCapturedPhoto(dataUrl);
        });

        cancelBtn.addEventListener('click', () => {
            stopCameraStream(videoEl);
            modal.remove();
        });
    } else {
        // Hard fallback for very old browsers: native file input
        const cameraInput = document.getElementById('cameraInput');
        if (cameraInput) {
            cameraInput.setAttribute('accept', 'image/*;capture=camera');
            cameraInput.setAttribute('capture', 'user');
            cameraInput.click();
        }
    }
}

function stopCameraStream(videoEl) {
  try {
    if (!videoEl) return;
    const stream = videoEl.srcObject;
    if (stream && typeof stream.getTracks === 'function') {
      stream.getTracks().forEach(track => {
        try { track.stop(); } catch (_) {}
      });
    }
    // Clear video element
    videoEl.pause && videoEl.pause();
    videoEl.srcObject = null;
    try { videoEl.removeAttribute('src'); } catch (_) {}
  } catch (_) {
    // no-op
  }
}

function saveCapturedPhoto(dataUrl) {
  try {
    const images = JSON.parse(localStorage.getItem('sectionImages') || '[]');
    images.push(dataUrl);
    localStorage.setItem('sectionImages', JSON.stringify(images));

    if (typeof renderReportsGallery === 'function') {
      renderReportsGallery();
    }
    if (typeof showNotification === 'function') {
      showNotification('Image captured and added to reports!');
    }
    if (typeof openImagePreview === 'function') {
      openImagePreview([dataUrl]);
    }
  } catch (_) {
    if (typeof showNotification === 'function') {
      showNotification('Failed to save captured image');
    }
  }
}

function openGallery() {
    const galleryInput = document.getElementById('galleryInput');
    if (galleryInput) {
        galleryInput.click();
    }
    closePhotoOptions();
}

function setupPhotoInputs() {
    const cameraInput = document.getElementById('cameraInput');
    const galleryInput = document.getElementById('galleryInput');
    
    if (cameraInput) {
        cameraInput.addEventListener('change', handlePhotoUpload);
    }
    
    if (galleryInput) {
        galleryInput.addEventListener('change', handlePhotoUpload);
    }
}

let previewImages = [];
let previewIndex = 0;

function setPreviewImages(images) {
  previewImages = Array.isArray(images) ? images.slice() : [images];
  previewIndex = 0;
  renderPreviewImage();
}

function renderPreviewImage() {
  const img = document.getElementById('previewUploadedImage');
  if (!img || !previewImages.length) return;
  img.src = previewImages[previewIndex];
}

function openImagePreview(srcOrArray) {
  const modal = document.getElementById('imagePreviewModal');
  if (!modal) return;
  // Normalize incoming batch
  const arr = Array.isArray(srcOrArray) ? srcOrArray : [srcOrArray];
  // If preview already open, accumulate batches; otherwise start fresh
  const isActive = modal.classList.contains('active');
  if (isActive && Array.isArray(previewImages)) {
    previewImages = previewImages.concat(arr);
    // Jump to the most recently added image
    previewIndex = previewImages.length - 1;
    renderPreviewImage();
  } else {
    setPreviewImages(arr);
    // Start at the last in the new batch
    if (arr.length > 0) {
      previewIndex = arr.length - 1;
      renderPreviewImage();
    }
  }
  modal.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');
}

function prevPreviewImage() {
  if (!previewImages.length) return;
  previewIndex = (previewIndex - 1 + previewImages.length) % previewImages.length;
  renderPreviewImage();
}

function nextPreviewImage() {
  if (!previewImages.length) return;
  previewIndex = (previewIndex + 1) % previewImages.length;
  renderPreviewImage();
}

function addMoreFromPreview() {
  // Keep preview open; open photo options above it
  // Defer to next tick to avoid outside-click handler closing it immediately
  setTimeout(() => {
    if (typeof showPhotoOptions === 'function') {
      showPhotoOptions();
    }
  }, 0);
}

function closeImagePreview() {
  const modal = document.getElementById('imagePreviewModal');
  if (!modal) return;
  modal.classList.remove('active');
  modal.setAttribute('aria-hidden', 'true');
  // Refresh gallery so the selected images reflect immediately
  if (typeof renderReportsGallery === 'function') {
    renderReportsGallery();
  }
}

// Replace single-file handler with multi-file batch processing
function handlePhotoUpload(event) {
  const files = Array.from(event.target.files || []);
  if (!files.length) return;

  Promise.all(files.map(file => new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = e => resolve(e.target.result);
    reader.readAsDataURL(file);
  }))).then(batch => {
    const images = JSON.parse(localStorage.getItem('sectionImages') || '[]');
    batch.forEach(src => images.push(src));
    localStorage.setItem('sectionImages', JSON.stringify(images));

    if (typeof renderReportsGallery === 'function') {
      renderReportsGallery();
    }
    if (typeof showNotification === 'function') {
      showNotification(batch.length > 1 ? 'Images added to reports!' : 'Image added to reports!');
    }
    if (typeof openImagePreview === 'function') {
      openImagePreview(batch);
    }
  }).catch(() => {
    if (typeof showNotification === 'function') {
      showNotification('Failed to read selected image(s)');
    }
  }).finally(() => {
    event.target.value = '';
    if (typeof closePhotoOptions === 'function') {
      closePhotoOptions();
    }
  });
}

function renderReportsGallery() {
  const container = document.getElementById('reportsGallery');
  if (!container) return;
  const images = JSON.parse(localStorage.getItem('sectionImages') || '[]');
  if (!Array.isArray(images) || images.length === 0) {
    container.innerHTML = '<div class="section-image-display"><em>No reports yet. Use + to add.</em></div>';
    return;
  }
  const items = images.map((src, idx) => (
    `<div class="report-item">` +
      `<img src="${src}" alt="Report ${idx+1}">` +
      `<button class="report-delete-btn" onclick="deleteReportImage(${idx})" title="Delete">🗑️</button>` +
    `</div>`
  )).join('');
  container.innerHTML = `<div class="report-grid">${items}</div>`;
}

function deleteReportImage(index) {
  const images = JSON.parse(localStorage.getItem('sectionImages') || '[]');
  if (!Array.isArray(images)) return;
  const i = Number(index);
  if (Number.isNaN(i) || i < 0 || i >= images.length) return;
  images.splice(i, 1);
  localStorage.setItem('sectionImages', JSON.stringify(images));
  if (typeof renderReportsGallery === 'function') {
    renderReportsGallery();
  }
  if (typeof showNotification === 'function') {
    showNotification('Image deleted');
  }
}

// Expose navigation functions
window.prevPreviewImage = prevPreviewImage;
window.nextPreviewImage = nextPreviewImage;
window.addMoreFromPreview = addMoreFromPreview;
window.openImagePreview = openImagePreview;
window.closeImagePreview = closeImagePreview;
window.renderReportsGallery = renderReportsGallery;
window.deleteReportImage = deleteReportImage;

async function listGeminiModels(apiKey) {
    const url = 'https://generativelanguage.googleapis.com/v1beta/models?key=' + encodeURIComponent(apiKey);
    const res = await fetch(url);
    if (!res.ok) {
        throw new Error('ListModels error: ' + res.status + ' ' + res.statusText);
    }
    const data = await res.json();
    return Array.isArray(data.models) ? data.models : [];
}

function chooseModel(models) {
    // Prefer flash latest, then flash, then pro latest, then pro
    const order = ['gemini-1.5-flash-latest', 'gemini-1.5-flash', 'gemini-1.5-pro-latest', 'gemini-1.5-pro'];
    const byName = m => (m.name || '').replace('models/', '');
    const supportsGenerate = m => Array.isArray(m.supportedGenerationMethods) ? m.supportedGenerationMethods.includes('generateContent') : true;
    const names = models.filter(supportsGenerate).map(byName);
    for (const preferred of order) {
        if (names.includes(preferred)) return preferred;
    }
    // Fallback: first model that supports generate
    return names[0] || null;
}

async function detectAvailableModel() {
    if (GEMINI_MODEL_SELECTED) return GEMINI_MODEL_SELECTED;
    const apiKey = await loadGeminiApiKey();
    const models = await listGeminiModels(apiKey);
    const chosen = chooseModel(models);
    GEMINI_MODEL_SELECTED = chosen;
    return GEMINI_MODEL_SELECTED;
}

async function checkAiModels() {
    try {
        const apiKey = await loadGeminiApiKey();
        const models = await listGeminiModels(apiKey);
        if (!models.length) {
            appendAiMessage('assistant', 'No models visible to this API key. Enable Generative Language API and access to Gemini models.');
            return;
        }
        const names = models.map(m => (m.displayName || m.name || '').replace('models/', ''));
        appendAiMessage('assistant', 'Available models: ' + names.join(', '));
        const chosen = chooseModel(models);
        if (chosen) {
            GEMINI_MODEL_SELECTED = chosen;
            appendAiMessage('assistant', 'Selected model: ' + chosen);
        } else {
            appendAiMessage('assistant', 'No compatible model found; will use fallback.');
        }
    } catch (err) {
        appendAiMessage('assistant', 'Model list error: ' + (err?.message || 'unknown'));
    }
}

async function generateWithFallback(apiKey, payload, preferredModels) {
    const candidates = (preferredModels && preferredModels.length) ? preferredModels : GEMINI_MODEL_CANDIDATES;
    for (const model of candidates) {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`;
        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (res.ok) {
            const data = await res.json();
            return { ok: true, data, model };
        }
        if (res.status === 404) {
            continue;
        }
        let details = '';
        try {
            const bodyText = await res.text();
            try {
                const j = JSON.parse(bodyText);
                details = j.error?.message || bodyText;
            } catch {
                details = bodyText;
            }
        } catch {}
        return { ok: false, status: res.status, statusText: res.statusText, details, model };
    }
    return { ok: false, status: 404, statusText: 'Not Found', details: 'No compatible model found in API project.' };
}

async function sendAiMessage() {
    const input = document.getElementById('aiInput');
    const text = input && input.value ? input.value.trim() : '';
    if (!text) return;
    appendAiMessage('user', text);
    input.value = '';
    
    let apiKey;
    try {
        apiKey = await loadGeminiApiKey();
    } catch (err) {
        appendAiMessage('assistant', 'No API key. Tap 🔑 to set it.');
        return;
    }

    try {
        const preferred = [];
        try {
            const selected = await detectAvailableModel();
            if (selected) preferred.push(selected);
        } catch {}
        const payload = {
            contents: aiConversation.concat([{ role: 'user', parts: [{ text }] }])
        };
        const result = await generateWithFallback(apiKey, payload, preferred);
        if (!result.ok) {
            appendAiMessage('assistant', `AI error (${result.model || 'unknown'}): ${result.status} ${result.statusText}${result.details ? ' - ' + result.details : ''}`);
            return;
        }
        const data = result.data;
        let reply = 'Sorry, no response.';
        if (data && Array.isArray(data.candidates) && data.candidates[0]) {
            const parts = data.candidates[0].content?.parts || [];
            reply = parts.map(p => p.text || '').join('').trim() || reply;
        }
        appendAiMessage('assistant', reply);
        aiConversation = payload.contents.concat([{ role: 'model', parts: [{ text: reply }] }]);
    } catch (err) {
        appendAiMessage('assistant', `Network error contacting AI${err?.message ? ': ' + err.message : ''}.`);
    }
}

// (duplicate preview functions removed; unified carousel-based preview is defined earlier)
// Hook: after photo upload, show preview modal
// In handlePhotoUpload -> reader.onload, after saving, open preview

(function(){
  let _idleCleanup = null;
  function setupIdleActionButtons(){
    try {
      const plusBtn = document.getElementById('photoActionBtn');
      const aiBtn = document.getElementById('aiActionBtn');
      if (!plusBtn || !aiBtn) return;

      // Remove previous listeners if any
      if (window._actionButtonsOnActivity && Array.isArray(window._actionButtonsEvents)) {
        window._actionButtonsEvents.forEach(evt => {
          window.removeEventListener(evt, window._actionButtonsOnActivity);
        });
      }
      if (window._actionButtonsIdleTimer) {
        clearTimeout(window._actionButtonsIdleTimer);
      }

      const hide = () => {
        plusBtn.classList.add('action-btn-hidden');
        aiBtn.classList.add('action-btn-hidden');
      };
      const show = () => {
        plusBtn.classList.remove('action-btn-hidden');
        aiBtn.classList.remove('action-btn-hidden');
        reset();
      };
      const reset = () => {
        if (window._actionButtonsIdleTimer) clearTimeout(window._actionButtonsIdleTimer);
        window._actionButtonsIdleTimer = setTimeout(hide, 2000);
      };

      const onActivity = () => {
        show();
      };
      const events = ['mousemove','mousedown','keydown','touchstart','wheel','scroll'];
      events.forEach(evt => window.addEventListener(evt, onActivity, { passive: true }));

      // Expose and remember for cleanup on re-render
      window._actionButtonsOnActivity = onActivity;
      window._actionButtonsEvents = events;

      // Show now, then schedule hide
      show();

      // Provide cleanup function (optional)
      _idleCleanup = () => {
        try {
          if (window._actionButtonsOnActivity && Array.isArray(window._actionButtonsEvents)) {
            window._actionButtonsEvents.forEach(evt => {
              window.removeEventListener(evt, window._actionButtonsOnActivity);
            });
          }
          if (window._actionButtonsIdleTimer) {
            clearTimeout(window._actionButtonsIdleTimer);
            window._actionButtonsIdleTimer = null;
          }
        } catch(e) {}
      };
    } catch (e) {
      console.warn('setupIdleActionButtons error', e);
    }
  }

  // expose globally
  window.setupIdleActionButtons = setupIdleActionButtons;
})();
// Hook: after photo upload, show preview modal
// In handlePhotoUpload -> reader.onload, after saving, open preview
