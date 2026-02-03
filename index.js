document.addEventListener('DOMContentLoaded', () => {
    try {
        const [navEntry] = performance.getEntriesByType("navigation");
        if (navEntry && navEntry.type === 'reload') {
            const isHomePage = window.location.pathname.endsWith('index.html') || window.location.pathname === '/' || window.location.pathname.endsWith('/');
            const isAdminPage = window.location.pathname.includes('admin.html');
            const hasHash = window.location.hash !== "";

            if ((!isHomePage && !isAdminPage) || hasHash) {
                window.location.href = 'index.html';
                return;
            }
        }
    } catch (err) {
        console.log('Refresh redirect not supported');
    }

    // Helper: Toast Notifications
    function showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = message;

        // Basic Toast Styles (injected if not present in CSS)
        Object.assign(toast.style, {
            position: 'fixed',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: type === 'success' ? '#276f7a' : (type === 'error' ? '#ff6b6b' : '#333'),
            color: '#fff',
            padding: '12px 24px',
            borderRadius: '50px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            zIndex: '10000',
            opacity: '0',
            transition: 'opacity 0.3s ease, transform 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.95rem'
        });

        document.body.appendChild(toast);

        // Animate In
        requestAnimationFrame(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateX(-50%) translateY(-10px)';
        });

        // Remove after 3 seconds
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(-50%) translateY(0)';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
    const navToggle = document.querySelector('.nav-toggle');
    const navClose = document.querySelector('.nav-close');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.add('show');
        });
    }
    if (navClose) {
        navClose.addEventListener('click', () => {
            navMenu.classList.remove('show');
        });
    }
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('show');
        });
    });
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY >= 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    const sections = document.querySelectorAll('section[id]');
    function scrollActive() {
        const scrollY = window.pageYOffset;
        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 100;
            const sectionId = current.getAttribute('id');
            const navLink = document.querySelector('.nav-menu a[href*=' + sectionId + ']');
            if (navLink) {
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    navLink.classList.add('active');
                } else {
                    navLink.classList.remove('active');
                }
            }
        });
    }
    window.addEventListener('scroll', scrollActive);
    const themeButton = document.getElementById('theme-button');
    const darkTheme = 'dark-theme';
    const iconTheme = 'fa-sun';
    const selectedTheme = localStorage.getItem('selected-theme');
    const selectedIcon = localStorage.getItem('selected-icon');
    const getCurrentTheme = () => document.body.classList.contains(darkTheme) ? 'dark' : 'light';
    const getCurrentIcon = () => themeButton.classList.contains(iconTheme) ? 'fa-moon' : 'fa-sun';
    if (selectedTheme) {
        document.body.classList[selectedTheme === 'dark' ? 'add' : 'remove'](darkTheme);
        themeButton.classList[selectedIcon === 'fa-moon' ? 'add' : 'remove'](iconTheme);
    }
    if (themeButton) {
        themeButton.addEventListener('click', () => {
            document.body.classList.toggle(darkTheme);
            themeButton.classList.toggle(iconTheme);
            localStorage.setItem('selected-theme', getCurrentTheme());
            localStorage.setItem('selected-icon', getCurrentIcon());
        });
    }
    const bookingForm = document.getElementById('booking-form');
    const adminLoginForm = document.getElementById('admin-login-form');
    const adminLoginView = document.getElementById('admin-login-view');
    const adminDashboardView = document.getElementById('admin-dashboard-view');
    const appointmentsList = document.getElementById('appointments-list');
    const logoutButton = document.getElementById('admin-logout');
    const ADMIN_EMAIL_HASH = '787f1e32c747c78c5d739ad49d03194fc1ff0d44336cb379bcc741998ce4020e';
    const ADMIN_PASS_HASH = 'fee2b2b92591d13a75a31fec58c4b76081f34aa80e524281329e498262164b95';
    async function sha256(message) {
        const msgBuffer = new TextEncoder().encode(message);
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        return hashHex;
    }
    let appointments = JSON.parse(localStorage.getItem('myAppointments')) || [];
    const phoneInput = document.getElementById('phone');
    let iti;
    if (phoneInput) {
        iti = window.intlTelInput(phoneInput, {
            utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.19/js/utils.js",
            initialCountry: "ke",
            preferredCountries: ["ke", "tr", "es", "ca"],
            separateDialCode: true,
            responsiveDropdown: true,
            autoPlaceholder: "aggressive"
        });
    }
    if (bookingForm) {
        const appointmentDate = document.getElementById('date');
        const appointmentTime = document.getElementById('time');

        if (appointmentDate) {
            const today = new Date();

            const formatDate = (date) => {
                const y = date.getFullYear();
                const m = String(date.getMonth() + 1).padStart(2, '0');
                const d = String(date.getDate()).padStart(2, '0');
                return `${y}-${m}-${d}`;
            };

            const minDate = formatDate(today);
            appointmentDate.setAttribute('min', minDate);
            appointmentDate.removeAttribute('max'); // Remove the tomorrow limit

            appointmentDate.addEventListener('input', () => {
                const selectedDate = new Date(appointmentDate.value);
                const dayOfWeek = selectedDate.getDay(); // 0 is Sunday

                if (appointmentDate.value && appointmentDate.value < minDate) {
                    appointmentDate.value = "";
                    alert('You cannot book a date in the past.');
                } else if (dayOfWeek === 0) { // If it's Sunday
                    appointmentDate.value = "";
                    alert('The hospital is closed on Sundays. Please select a day between Monday and Saturday.');
                }
            });
        }

        if (appointmentTime) {
            appointmentTime.setAttribute('max', '16:00');
            appointmentTime.addEventListener('change', () => {
                if (appointmentTime.value > '16:00') {
                    alert('Note: The latest appointment slot is 4:00 PM.');
                    appointmentTime.value = '16:00';
                }
            });
        }

        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const service = document.getElementById('service').value;
            const date = document.getElementById('date').value;
            const time = document.getElementById('time').value;
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Please enter a valid email address.');
                return;
            }

            const todayStr = new Date().toISOString().split('T')[0];
            if (date < todayStr) {
                alert('This date has passed. Please select today or tomorrow.');
                return;
            }

            if (time > "16:00") {
                alert('Appointments must be scheduled before 4:00 PM as the hospital closes at 5:30 PM.');
                return;
            }
            let finalPhone = phone;
            if (iti) {
                if (!iti.isValidNumber()) {
                    alert('Please enter a valid phone number for the selected country.');
                    return;
                }
                finalPhone = iti.getNumber();
            } else {
                const phoneRegex = /^\+?[0-9\s\-()]{7,20}$/;
                if (!phoneRegex.test(phone)) {
                    alert('Please enter a valid phone number.');
                    return;
                }
            }
            const newAppointment = {
                id: Date.now(),
                name: name,
                email: email,
                phone: finalPhone,
                service: service,
                date: date,
                time: time,
                createdAt: new Date().toISOString()
            };
            appointments.push(newAppointment);
            saveAppointments();
            bookingForm.reset();

            // Simulating a backend success for the user
            setTimeout(() => {
                showToast('<i class="fas fa-check-circle"></i> Appointment Booked Successfully!', 'success');
            }, 500);

            alert('Appointment Booked Successfully! Our team will contact you shortly.');
        });
    }
    if (adminLoginForm) {
        if (sessionStorage.getItem('isAdminLoggedIn') === 'true') {
            showDashboard();
        }
        const MAX_ATTEMPTS = 3;
        const LOCKOUT_TIME = 5 * 60 * 1000;
        function checkLockout() {
            const lockoutTimestamp = localStorage.getItem('adminLockoutTime');
            if (lockoutTimestamp) {
                const now = Date.now();
                if (now < parseInt(lockoutTimestamp)) {
                    const remaining = Math.ceil((parseInt(lockoutTimestamp) - now) / 60000);
                    alert(`Account Locked due to too many failed attempts. Try again in ${remaining} minutes.`);
                    document.querySelector('#admin-login-form button').disabled = true;
                    return true;
                } else {
                    localStorage.removeItem('adminLockoutTime');
                    localStorage.removeItem('adminFailedAttempts');
                    document.querySelector('#admin-login-form button').disabled = false;
                }
            }
            return false;
        }
        checkLockout();
        adminLoginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (checkLockout()) return;
            const emailInput = document.getElementById('admin-email').value;
            const passwordInput = document.getElementById('admin-password').value;
            const emailHash = await sha256(emailInput);
            const passwordHash = await sha256(passwordInput);
            if (emailHash === ADMIN_EMAIL_HASH && passwordHash === ADMIN_PASS_HASH) {
                sessionStorage.setItem('isAdminLoggedIn', 'true');
                localStorage.removeItem('adminFailedAttempts');
                showDashboard();
            } else {
                let attempts = parseInt(localStorage.getItem('adminFailedAttempts') || '0');
                attempts++;
                localStorage.setItem('adminFailedAttempts', attempts);
                if (attempts >= MAX_ATTEMPTS) {
                    localStorage.setItem('adminLockoutTime', Date.now() + LOCKOUT_TIME);
                    alert('Security Alert: Too many failed login attempts. Account locked for 5 minutes.');
                    document.querySelector('#admin-login-form button').disabled = true;
                    location.reload();
                } else {
                    alert(`Invalid Credentials! Attempt ${attempts} of ${MAX_ATTEMPTS}.`);
                }
            }
        });
        if (logoutButton) {
            logoutButton.addEventListener('click', (e) => {
                e.preventDefault();
                if (confirm('Are you sure you want to logout?')) {
                    sessionStorage.removeItem('isAdminLoggedIn');
                    window.location.reload();
                }
            });
        }
    }
    window.logoutAdmin = () => {
        if (confirm('Are you sure you want to logout?')) {
            sessionStorage.removeItem('isAdminLoggedIn');
            window.location.reload();
        }
    };
    function showDashboard() {
        if (adminLoginView && adminDashboardView) {
            adminLoginView.style.display = 'none';
            adminDashboardView.style.display = 'block';


            renderAppointments();
            startAutoLogout();
        }
    }
    let logoutTimer;
    function startAutoLogout() {
        const TIMEOUT_MS = 10 * 60 * 1000;
        function resetTimer() {
            clearTimeout(logoutTimer);
            logoutTimer = setTimeout(() => {
                alert('Session Expired due to inactivity.');
                sessionStorage.removeItem('isAdminLoggedIn');
                location.reload();
            }, TIMEOUT_MS);
        }
        window.addEventListener('mousemove', resetTimer);
        window.addEventListener('keypress', resetTimer);
        resetTimer();
    }
    function saveAppointments() {
        localStorage.setItem('myAppointments', JSON.stringify(appointments));
    }
    function renderAppointments() {
        if (!appointmentsList) return;

        appointmentsList.innerHTML = '';
        if (appointments.length === 0) {
            appointmentsList.innerHTML = '<p style="text-align:center; color: var(--text-light);">No scheduled appointments.</p>';
            return;
        }
        appointments.sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
        appointments.forEach(app => {
            const card = document.createElement('div');
            card.classList.add('appointment-card');
            const dateObj = new Date(app.date);
            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            const formattedDate = dateObj.toLocaleDateString('en-US', options);
            const infoDiv = document.createElement('div');
            infoDiv.classList.add('appointment-info');
            infoDiv.innerHTML = `
                <h4>${app.service}</h4>
                <p><i class="far fa-calendar-alt"></i> ${formattedDate} | <i class="far fa-clock"></i> ${app.time}</p>
                <p><strong>Patient:</strong> ${app.name}</p>
                <p><strong>Email:</strong> ${app.email || 'N/A'}</p>
                <p><strong>Phone:</strong> ${app.phone}</p>
            `;
            const actionsDiv = document.createElement('div');
            actionsDiv.classList.add('appointment-actions');
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'btn-delete';
            deleteBtn.textContent = 'Cancel / Delete';
            deleteBtn.addEventListener('click', () => {
                deleteAppointment(app.id);
            });
            actionsDiv.appendChild(deleteBtn);
            card.appendChild(infoDiv);
            card.appendChild(actionsDiv);
            appointmentsList.appendChild(card);
        });
    }
    function deleteAppointment(id) {
        if (confirm('⚠️ PERMANENT ACTION\n\nAre you sure you want to completely delete this appointment? This action cannot be undone.')) {
            const initialLength = appointments.length;
            appointments = appointments.filter(app => app.id !== id);
            if (appointments.length < initialLength) {
                saveAppointments();
                renderAppointments();
                alert('Appointment deleted successfully.');
            } else {
                alert('Error: Could not find appointment to delete.');
            }
        }
    }
});