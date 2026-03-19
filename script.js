// ============================================================
//  RE-KOST — script.js
//  Single source of truth — no duplicate functions
// ============================================================


// ── PAGE NAVIGATION ──────────────────────────────────────────
function showPage(pageId) {
    // Hide every page
    ['splash-screen', 'auth-page', 'home-page', 'sell-page',
     'profile-page', 'all-page', 'category-page'].forEach(function(id) {
        var el = document.getElementById(id);
        if (el) el.classList.add('hidden');
    });

    // Show the requested page
    var target = document.getElementById(pageId);
    if (target) target.classList.remove('hidden');

    // Bottom nav: show on main pages, hide on splash/auth
    var nav = document.querySelector('.bottom-nav');
    var pagesWithNav = ['home-page', 'sell-page', 'profile-page', 'all-page', 'category-page'];

    if (pagesWithNav.includes(pageId)) {
        nav.style.display = 'flex';
        // Update active state
        document.querySelectorAll('.bottom-nav .nav-item').forEach(function(el) {
            el.classList.remove('active');
        });
        var activeBtn = document.querySelector('.bottom-nav .nav-item[data-page="' + pageId + '"]');
        if (activeBtn) activeBtn.classList.add('active');
    } else {
        if (nav) nav.style.display = 'none';
    }
}


// ── REGISTER ─────────────────────────────────────────────────
function registerUser() {
    var name     = document.getElementById('name').value.trim();
    var phone    = document.getElementById('phone').value.trim();
    var campus   = document.getElementById('campus').value.trim();
    var location = document.getElementById('location').value.trim();
    var password = document.getElementById('password').value.trim();

    if (!name || !phone || !campus || !location || !password) {
        alert('Harap isi semua data!');
        return;
    }

    localStorage.setItem('user', JSON.stringify({ name, phone, campus, location, password }));
    alert('Akun berhasil dibuat!');
    showPage('home-page');
    loadUserData();
}


// ── LOAD USER DATA ────────────────────────────────────────────
function loadUserData() {
    var user = JSON.parse(localStorage.getItem('user'));
    if (!user) return;

    var greeting = document.getElementById('greeting');
    if (greeting) greeting.innerText = 'Hai, ' + user.name + ' 👋';

    var nameEl = document.getElementById('profile-name-display');
    var campusEl = document.getElementById('profile-campus-display');
    var locationEl = document.getElementById('profile-location-display');
    if (nameEl)     nameEl.innerText     = user.name;
    if (campusEl)   campusEl.innerText   = user.campus;
    if (locationEl) locationEl.innerText = user.location;

    // Pre-fill edit form fields
    var inputName = document.getElementById('profile-name');
    var inputCampus = document.getElementById('profile-campus');
    var inputLocation = document.getElementById('profile-location');
    if (inputName)     inputName.value     = user.name;
    if (inputCampus)   inputCampus.value   = user.campus;
    if (inputLocation) inputLocation.value = user.location;
}


// ── AUTO LOGIN ────────────────────────────────────────────────
function checkLogin() {
    if (localStorage.getItem('user')) {
        showPage('home-page');
        loadUserData();
    }
}


// ── LOGOUT ────────────────────────────────────────────────────
function logout() {
    localStorage.removeItem('user');
    alert('Kamu sudah logout');
    showPage('splash-screen');
}


// ── CATEGORY FILTER ───────────────────────────────────────────
function showCategory(cat) {
    document.getElementById('category-title').textContent = cat;

    // Clone matching cards from home-page into category-grid
    var grid = document.getElementById('category-grid');
    grid.innerHTML = '';

    document.querySelectorAll('#home-page .product-card').forEach(function(card) {
        if (card.dataset.cat === cat) {
            grid.appendChild(card.cloneNode(true));
        }
    });

    if (grid.children.length === 0) {
        grid.innerHTML = '<p style="padding:20px;color:#7f8c8d;grid-column:span 2;">Tidak ada barang di kategori ini.</p>';
    }

    showPage('category-page');
}


// ── PROFILE: TOGGLE EDIT FORM ─────────────────────────────────
function toggleEditForm() {
    var form = document.getElementById('profile-inline-form');
    form.classList.toggle('hidden');
    // Close item panels when edit opens
    document.getElementById('selling-list').classList.add('hidden');
    document.getElementById('favorite-list').classList.add('hidden');
}


// ── PROFILE: TOGGLE ITEM PANELS ──────────────────────────────
function toggleItemPanel(type) {
    var selling  = document.getElementById('selling-list');
    var favorite = document.getElementById('favorite-list');
    // Close edit form
    document.getElementById('profile-inline-form').classList.add('hidden');

    if (type === 'selling') {
        var isOpen = !selling.classList.contains('hidden');
        selling.classList.toggle('hidden', isOpen);
        favorite.classList.add('hidden');
    } else {
        var isOpen = !favorite.classList.contains('hidden');
        favorite.classList.toggle('hidden', isOpen);
        selling.classList.add('hidden');
    }
}


// ── INIT ──────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function () {

    // Auto login
    checkLogin();

    // ── Save profile ──
    var saveBtn = document.getElementById('save-profile-btn');
    if (saveBtn) {
        saveBtn.addEventListener('click', function () {
            var n = document.getElementById('profile-name').value;
            var c = document.getElementById('profile-campus').value;
            var l = document.getElementById('profile-location').value;

            document.getElementById('profile-name-display').textContent     = n;
            document.getElementById('profile-campus-display').textContent   = c;
            document.getElementById('profile-location-display').textContent = l;

            var user = JSON.parse(localStorage.getItem('user')) || {};
            user.name = n; user.campus = c; user.location = l;
            localStorage.setItem('user', JSON.stringify(user));

            document.getElementById('profile-inline-form').classList.add('hidden');
        });
    }

    // ── Profile photo ──
    var photoInput = document.getElementById('profile-photo-input');
    var photoImg   = document.getElementById('profile-image');
    if (photoInput && photoImg) {
        photoInput.addEventListener('change', function () {
            if (this.files && this.files[0]) {
                var reader = new FileReader();
                reader.onload = function (e) {
                    photoImg.src = e.target.result;
                    localStorage.setItem('profilePhoto', e.target.result);
                };
                reader.readAsDataURL(this.files[0]);
            }
        });
        var savedPhoto = localStorage.getItem('profilePhoto');
        if (savedPhoto) photoImg.src = savedPhoto;
    }

    // ── Sell page photo preview ──
    var itemPhoto = document.getElementById('item-photo');
    var photoBox  = document.getElementById('photo-box');
    if (itemPhoto && photoBox) {
        itemPhoto.addEventListener('change', function () {
            if (this.files && this.files[0]) {
                var reader = new FileReader();
                reader.onload = function (e) {
                    photoBox.innerHTML = '<img src="' + e.target.result + '" style="max-width:100%;border-radius:8px;">';
                };
                reader.readAsDataURL(this.files[0]);
            }
        });
    }

    // ── Notification popup ──
    var notifBtn   = document.getElementById('notif-button');
    var notifPopup = document.getElementById('notif-popup');
    if (notifBtn && notifPopup) {
        notifBtn.addEventListener('click', function () {
            notifPopup.classList.toggle('hidden');
            if (!notifPopup.classList.contains('hidden')) {
                setTimeout(function () { notifPopup.classList.add('hidden'); }, 3000);
            }
        });
    }

    // ── Theme radios ──
    var app    = document.querySelector('.app-container');
    var radios = document.querySelectorAll('input[name="theme"]');

    // Restore saved theme
    var savedTheme = localStorage.getItem('theme') || 'light';
    app.classList.toggle('dark-mode', savedTheme === 'dark');
    var savedRadio = document.querySelector('input[name="theme"][value="' + savedTheme + '"]');
    if (savedRadio) savedRadio.checked = true;

    radios.forEach(function (radio) {
        radio.addEventListener('change', function () {
            app.classList.toggle('dark-mode', this.value === 'dark');
            localStorage.setItem('theme', this.value);
        });
    });

});