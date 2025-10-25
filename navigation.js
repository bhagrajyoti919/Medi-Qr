// Toggle hamburger menu
const hamburgerBtn = document.getElementById('hamburgerBtn');
const overlayMenu = document.getElementById('overlayMenu');
const closeBtn = document.getElementById('closeBtn');

hamburgerBtn.addEventListener('click', () => {
    overlayMenu.classList.add('active');
});

closeBtn.addEventListener('click', () => {
    overlayMenu.classList.remove('active');
});

// Close menu when clicking outside
overlayMenu.addEventListener('click', (e) => {
    if (e.target === overlayMenu) {
        overlayMenu.classList.remove('active');
    }
});

// Modal functions - Menu stays open
function openUserInfo() {
    document.getElementById('userInfoModal').classList.add('active');
    // Removed the line that closes the menu
}

function openDoctorInfo() {
    document.getElementById('doctorInfoModal').classList.add('active');
    // Removed the line that closes the menu
}

function openPatientHistory() {
    document.getElementById('patientHistoryModal').classList.add('active');
    // Removed the line that closes the menu
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.classList.remove('active');
    }
});

// Prevent body scrolling when modal is open
document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('touchmove', (e) => {
        if (e.target === modal) {
            e.preventDefault();
        }
    }, { passive: false });
});

// Close photo options when clicking outside
document.addEventListener('click', function(e) {
    const modal = document.getElementById('photoOptionsModal');
    const btn = document.getElementById('photoActionBtn');
    const addMoreBtn = document.querySelector('.add-more-btn');
    const inPreview = !!e.target.closest('#imagePreviewModal');
    
    if (modal && modal.classList.contains('active')) {
        const clickedInsideOptions = !!e.target.closest('.photo-options-content');
        const clickedPlusBtn = (e.target === btn) || (!!btn && btn.contains(e.target));
        const clickedAddMore = (e.target === addMoreBtn) || (!!addMoreBtn && addMoreBtn.contains(e.target));
        if (!clickedInsideOptions && !clickedPlusBtn && !clickedAddMore && !inPreview) {
            closePhotoOptions();
        }
    }
});

(function(){
  const sectionMap = {
    userInfo: { viewId: 'userInfoView', editId: 'userInfoEditForm', iconId: 'userInfoEditIcon' },
    doctorInfo: { viewId: 'doctorInfoView', editId: 'doctorInfoEditForm', iconId: 'doctorInfoEditIcon' },
    patientHistory: { viewId: 'patientHistoryView', editId: 'patientHistoryEdit', iconId: 'patientHistoryEditIcon' }
  };

  function toggleEditMode(section){
    const cfg = sectionMap[section];
    if (!cfg) return;
    const viewEl = document.getElementById(cfg.viewId);
    const editEl = document.getElementById(cfg.editId);
    const iconEl = document.getElementById(cfg.iconId);
    if (!viewEl || !editEl) return;

    const isEditing = editEl.style.display !== 'none';
    if (isEditing) {
      editEl.style.display = 'none';
      viewEl.style.display = '';
      if (iconEl) iconEl.textContent = '✏️';
    } else {
      viewEl.style.display = 'none';
      editEl.style.display = '';
      if (iconEl) iconEl.textContent = '✅';
      prefillSection(section);
    }
  }

  function prefillSection(section){
    try {
      if (section === 'userInfo') {
        const saved = JSON.parse(localStorage.getItem('userProfile') || 'null');
        if (!saved) return;
        const setVal = (id, val) => { const el = document.getElementById(id); if (el) el.value = val || ''; };
        setVal('editUserName', saved.fullName);
        setVal('editUserPatientId', saved.patientId);
        setVal('editUserAge', saved.age);
        const g = document.getElementById('editUserGender'); if (g) g.value = saved.gender || '';
        const b = document.getElementById('editUserBloodGroup'); if (b) b.value = saved.bloodGroup || '';
        setVal('editUserEmail', saved.email);
        setVal('editUserPhone', saved.phone);
        const addr = document.getElementById('editUserAddress'); if (addr) addr.value = saved.address || '';
      } else if (section === 'doctorInfo') {
        const defaultDoctor = {
          name: document.getElementById('doctorName')?.textContent || '',
          spec: document.getElementById('doctorSpec')?.textContent || '',
          exp: document.getElementById('doctorExp')?.textContent || '',
          clinic: document.getElementById('doctorClinic')?.textContent || '',
          phone: document.getElementById('doctorPhone')?.textContent || '',
          avail: document.getElementById('doctorAvail')?.textContent || ''
        };
        const saved = JSON.parse(localStorage.getItem('doctorInfo') || 'null') || defaultDoctor;
        const setVal = (id, val) => { const el = document.getElementById(id); if (el) el.value = val || ''; };
        setVal('editDoctorName', saved.name);
        setVal('editDoctorSpec', saved.spec);
        setVal('editDoctorExp', saved.exp);
        setVal('editDoctorClinic', saved.clinic);
        setVal('editDoctorPhone', saved.phone);
        setVal('editDoctorAvail', saved.avail);
      } else if (section === 'patientHistory') {
        if (typeof renderPatientHistoryEdit === 'function') renderPatientHistoryEdit();
      }
    } catch(_){}
  }

  function renderUserInfoView(){
    const el = document.getElementById('userInfoView');
    if (!el) return;
    try {
      const saved = JSON.parse(localStorage.getItem('userProfile') || 'null');
      if (!saved) { el.innerHTML = '<p>No user info available.</p>'; return; }
      el.innerHTML = `
        <p><strong>Full Name:</strong> ${saved.fullName || ''}</p>
        <p><strong>Patient ID:</strong> ${saved.patientId || ''}</p>
        <p><strong>Age:</strong> ${saved.age || ''}</p>
        <p><strong>Gender:</strong> ${saved.gender || ''}</p>
        <p><strong>Blood Group:</strong> ${saved.bloodGroup || ''}</p>
        <p><strong>Email:</strong> ${saved.email || ''}</p>
        <p><strong>Phone:</strong> ${saved.phone || ''}</p>
        <p><strong>Address:</strong> ${saved.address || ''}</p>
      `;
    } catch(_){}
  }

  function renderDoctorInfoView(){
    const el = document.getElementById('doctorInfoView');
    if (!el) return;
    try {
      const saved = JSON.parse(localStorage.getItem('doctorInfo') || 'null');
      if (!saved) return; // Keep existing static content
      document.getElementById('doctorName') && (document.getElementById('doctorName').textContent = saved.name || '');
      document.getElementById('doctorSpec') && (document.getElementById('doctorSpec').textContent = saved.spec || '');
      document.getElementById('doctorExp') && (document.getElementById('doctorExp').textContent = saved.exp || '');
      document.getElementById('doctorClinic') && (document.getElementById('doctorClinic').textContent = saved.clinic || '');
      document.getElementById('doctorPhone') && (document.getElementById('doctorPhone').textContent = saved.phone || '');
      document.getElementById('doctorAvail') && (document.getElementById('doctorAvail').textContent = saved.avail || '');
    } catch(_){}
  }

  function attachEditFormHandlers(){
    document.addEventListener('DOMContentLoaded', function(){
      try {
        renderUserInfoView();
        renderDoctorInfoView();
        const userForm = document.getElementById('userInfoEditForm');
        if (userForm) {
          userForm.addEventListener('submit', function(e){
            e.preventDefault();
            const current = JSON.parse(localStorage.getItem('userProfile') || '{}');
            const next = {
              ...current,
              fullName: document.getElementById('editUserName')?.value || current.fullName || '',
              patientId: document.getElementById('editUserPatientId')?.value || current.patientId || '',
              age: document.getElementById('editUserAge')?.value || current.age || '',
              gender: document.getElementById('editUserGender')?.value || current.gender || '',
              bloodGroup: document.getElementById('editUserBloodGroup')?.value || current.bloodGroup || '',
              email: document.getElementById('editUserEmail')?.value || current.email || '',
              phone: document.getElementById('editUserPhone')?.value || current.phone || '',
              address: document.getElementById('editUserAddress')?.value || current.address || ''
            };
            if (typeof saveUserProfile === 'function') {
              saveUserProfile(next);
            } else {
              localStorage.setItem('userProfile', JSON.stringify(next));
            }
            renderUserInfoView();
            toggleEditMode('userInfo');
          });
        }
        const docForm = document.getElementById('doctorInfoEditForm');
        if (docForm) {
          docForm.addEventListener('submit', function(e){
            e.preventDefault();
            const next = {
              name: document.getElementById('editDoctorName')?.value || '',
              spec: document.getElementById('editDoctorSpec')?.value || '',
              exp: document.getElementById('editDoctorExp')?.value || '',
              clinic: document.getElementById('editDoctorClinic')?.value || '',
              phone: document.getElementById('editDoctorPhone')?.value || '',
              avail: document.getElementById('editDoctorAvail')?.value || ''
            };
            localStorage.setItem('doctorInfo', JSON.stringify(next));
            renderDoctorInfoView();
            toggleEditMode('doctorInfo');
          });
        }
      } catch(e){ console.warn(e); }
    });
  }

  attachEditFormHandlers();
  window.toggleEditMode = toggleEditMode;
})();

(function(){
  let patientHistoryDraft = null;

  function getPatientHistory(){
    try { return JSON.parse(localStorage.getItem('patientHistory') || '[]'); }
    catch(_) { return []; }
  }
  function setPatientHistory(arr){
    try { localStorage.setItem('patientHistory', JSON.stringify(arr || [])); }
    catch(_) {}
  }
  function escapeHTML(str){
    return String(str || '').replace(/[&<>"]/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[s]));
  }

  function renderPatientHistoryView(){
    const viewEl = document.getElementById('patientHistoryView');
    if (!viewEl) return;
    const items = getPatientHistory();
    if (!items.length) { viewEl.innerHTML = '<p>No history entries yet.</p>'; return; }
    viewEl.innerHTML = items.map(it => `
      <div class="history-item">
        <p><strong>${escapeHTML(it.date)}</strong> ${escapeHTML(it.title)}</p>
        <p>${escapeHTML(it.notes)}</p>
      </div>
    `).join('');
  }

  function renderPatientHistoryEdit(){
    const container = document.getElementById('historyEntriesEdit');
    if (!container) return;
    patientHistoryDraft = Array.isArray(patientHistoryDraft) ? patientHistoryDraft : getPatientHistory().slice();
    if (!patientHistoryDraft.length) patientHistoryDraft = [{ date: '', title: '', notes: '' }];
    container.innerHTML = patientHistoryDraft.map((it, idx) => `
      <div class="history-edit-row" data-idx="${idx}">
        <div class="form-group"><label>Date</label><input type="date" value="${escapeHTML(it.date)}"></div>
        <div class="form-group"><label>Title</label><input type="text" value="${escapeHTML(it.title)}"></div>
        <div class="form-group"><label>Notes</label><textarea rows="2">${escapeHTML(it.notes)}</textarea></div>
      </div>
    `).join('');
    container.querySelectorAll('.history-edit-row').forEach(row => {
      const idx = parseInt(row.dataset.idx, 10);
      const dateInput = row.querySelector('input[type="date"]');
      const titleInput = row.querySelector('input[type="text"]');
      const notesInput = row.querySelector('textarea');
      if (dateInput) dateInput.addEventListener('input', () => { patientHistoryDraft[idx].date = dateInput.value; });
      if (titleInput) titleInput.addEventListener('input', () => { patientHistoryDraft[idx].title = titleInput.value; });
      if (notesInput) notesInput.addEventListener('input', () => { patientHistoryDraft[idx].notes = notesInput.value; });
    });
  }

  function addNewHistoryEntry(){
    patientHistoryDraft = Array.isArray(patientHistoryDraft) ? patientHistoryDraft : getPatientHistory().slice();
    patientHistoryDraft.push({ date: '', title: '', notes: '' });
    renderPatientHistoryEdit();
  }

  function savePatientHistory(){
    const next = Array.isArray(patientHistoryDraft) ? patientHistoryDraft : getPatientHistory();
    setPatientHistory(next);
    patientHistoryDraft = null;
    renderPatientHistoryView();
    if (typeof window.toggleEditMode === 'function') window.toggleEditMode('patientHistory');
    if (typeof showNotification === 'function') showNotification('Patient history saved');
  }

  document.addEventListener('DOMContentLoaded', function(){
    try { renderPatientHistoryView(); } catch(_){}
  });

  window.addNewHistoryEntry = addNewHistoryEntry;
  window.savePatientHistory = savePatientHistory;
  window.renderPatientHistoryView = renderPatientHistoryView;
  window.renderPatientHistoryEdit = renderPatientHistoryEdit;
})();

(function(){
  function ensureAiModal(){
    let modal = document.getElementById('aiAssistantModal');
    if (modal) return modal;
    modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'aiAssistantModal';
    modal.innerHTML = `
      <div class="modal-content">
        <span class="modal-close" onclick="closeModal('aiAssistantModal')">&times;</span>
        <h2>AI Assistant</h2>
        <div class="modal-body">
          <p>This assistant will help analyze your reports.</p>
          <p>Feature coming soon. For now, this is a preview.</p>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    return modal;
  }
  function openAiAssistant(){
    const modal = ensureAiModal();
    modal.classList.add('active');
  }
  window.openAiAssistant = openAiAssistant;
})();
