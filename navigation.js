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
