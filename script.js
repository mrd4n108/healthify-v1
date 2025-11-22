document.addEventListener('DOMContentLoaded', () => {

    // --- INISIALISASI ---
    AOS.init({
        duration: 800,
        once: true,
        offset: 50,
    });

    // --- INISIALISASI LENIS ---
    const lenis = new Lenis({
        lerp: 0.1, // Nilai default untuk scroll yang 'smooth'
        smoothWheel: true, // Mengaktifkan smooth wheel
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    // --- AKHIR MODIFIKASI LENIS ---


    // --- Logika Kustom AOS untuk Mobile ---
    if (window.innerWidth < 768) {
        // 1. Tentukan bagian mana yang animasinya akan DINONAKTIFKAN di mobile
        // Sesuai permintaan: Penyebab Kematian (page-facts), Artikel (page-articles), dan Tentang (page-about)
        const sectionsToDisable = ['page-facts', 'page-articles', 'page-about'];

        sectionsToDisable.forEach(sectionId => {
            const section = document.getElementById(sectionId);
            if (section) {
                // Temukan semua elemen [data-aos] di dalam bagian ini
                const aosElements = section.querySelectorAll('[data-aos]');
                // Hapus atributnya agar tidak ter-animasi
                aosElements.forEach(el => {
                    el.removeAttribute('data-aos');
                });
            }
        });

        // 2. Ubah SEMUA animasi yang TERSISA (yang tidak dinonaktifkan) menjadi 'fade-up'
        // Ini akan memengaruhi hero, "Kenapa Memilih", dan "Kesehatan dalam Angka"
        const allRemainingAosElements = document.querySelectorAll('[data-aos]');
        allRemainingAosElements.forEach(el => {
            el.setAttribute('data-aos', 'fade-up');
        });
    }


    // --- LOGIKA PRELOADER ---
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        }, 300);
    });

    // --- Variabel Navigasi ---
    const navLinks = document.querySelectorAll('.nav-link');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');

    // --- Listener Menu Mobile ---
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });

    // --- Logika Animasi Scroll Navbar (Besar/Kecil) ---
    const header = document.querySelector('header');
    const nav = document.querySelector('nav');

    function handleScroll() {
        if (window.scrollY > 50) {
            // --- Style Saat Scroll (Kecil) ---
            nav.classList.add('max-w-xl', 'px-6', 'py-3');
            nav.classList.remove('max-w-2xl', 'px-8', 'py-4');
        } else {
            // --- Style Awal (Besar) ---
            nav.classList.remove('max-w-xl', 'px-6', 'py-3');
            nav.classList.add('max-w-2xl', 'px-8', 'py-4');
        }
    }

    // Terapkan listener
    window.addEventListener('scroll', handleScroll);
    // Panggil sekali saat load untuk mengatur state awal
    handleScroll();


    // --- Logika Klik Navigasi ---
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const pageId = link.dataset.page;
            const targetElement = document.getElementById(`page-${pageId}`);

            if (targetElement) {
                // Kalkulasi offset untuk navbar yang selalu mengambang
                const navHeight = document.querySelector('nav').offsetHeight;
                const headerTopOffset = 24; // top-6 = 24px (Ini sekarang konstan)
                const offsetCompensation = navHeight + headerTopOffset + 24; // Tinggi nav + jarak dari atas + padding ekstra

                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - offsetCompensation;

                // --- Menggunakan lenis.scrollTo() ---
                lenis.scrollTo(offsetPosition);
            }

            // Update active state
            navLinks.forEach(nav => {
                nav.classList.remove('active', 'font-bold', 'text-brand-primary');
                nav.classList.add('text-gray-700');
            });
            document.querySelectorAll(`.nav-link[data-page="${pageId}"]`).forEach(activeLink => {
                activeLink.classList.add('active', 'font-bold', 'text-brand-primary');
                activeLink.classList.remove('text-gray-700');
            });

            // Tutup mobile menu (jika terbuka)
            mobileMenu.classList.add('hidden');
        });
    });


    // --- ANIMASI MENGETIK (Typing Animation) ---
    const typingTextEl = document.getElementById('typing-text');
    const words = ["Kesehatan", "Kebugaran", "Kebahagiaan"];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typeWriter() {
        const currentWord = words[wordIndex];

        if (isDeleting) {
            typingTextEl.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingTextEl.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
        }

        let typeSpeed = isDeleting ? 100 : 200;

        if (!isDeleting && charIndex === currentWord.length) {
            typeSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typeSpeed = 500;
        }

        setTimeout(typeWriter, typeSpeed);
    }
    typeWriter();


    // --- ANIMASI STATISTIK (Counter Up) ---
    const statSection = document.getElementById('page-stats');
    let hasAnimatedStats = false;

    if (statSection) {
        const observer = new IntersectionObserver((entries) => {
            const entry = entries[0];
            if (entry.isIntersecting && !hasAnimatedStats) {
                hasAnimatedStats = true;
                const counters = document.querySelectorAll('.stat-counter');

                counters.forEach(counter => {
                    const target = +counter.getAttribute('data-target');
                    const duration = 2000;
                    const stepTime = 20;
                    const totalSteps = duration / stepTime;
                    let increment = target / totalSteps;

                    if (target > 1000 && increment < 1) {
                        increment = 1;
                    }

                    let current = 0;

                    const timer = setInterval(() => {
                        current += increment;
                        if (current >= target) {
                            clearInterval(timer);
                            counter.textContent = target.toLocaleString('id-ID');
                        } else {
                            counter.textContent = Math.ceil(current).toLocaleString('id-ID');
                        }
                    }, stepTime);
                });

                observer.disconnect();
            }
        }, {
            threshold: 0.5
        });

        observer.observe(statSection);
    }


    // --- LOGIKA CHATBOT AI (GEMINI) ---
    const chatModal = document.getElementById('chat-modal');
    const chatToggleBtn = document.getElementById('chat-toggle-btn');
    const chatCloseBtn = document.getElementById('chat-close-btn');
    const chatOverlay = document.getElementById('chat-overlay');
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    const chatMessages = document.getElementById('chat-messages');

    // 
    // ========================================================================
    // PERBAIKAN FINAL (v6) - Kombinasi yang Benar
    // ========================================================================
    //
    function toggleChatModal(show) {
        // Hitung lebar scrollbar SEBELUM kita menyembunyikannya
        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

        if (show) {
            // Tampilkan modal
            chatModal.classList.remove('hidden');
            setTimeout(() => {
                chatModal.classList.remove('opacity-0');
                document.getElementById('chat-window').classList.remove('scale-95');
            }, 10);


            // 1. Terapkan padding ke <html> (documentElement) untuk mencegah layout shift
            document.documentElement.style.paddingRight = `${scrollbarWidth}px`;

            // 2. Terapkan overflow: hidden ke <html> dan <body>
            // Ini adalah cara standar untuk membekukan scroll halaman.
            // Lenis akan menghormati ini. KITA TIDAK PERLU 'lenis.stop()'.
            document.documentElement.style.overflow = 'hidden';
            document.body.style.overflow = 'hidden';

        } else {
            // Sembunyikan modal
            chatModal.classList.add('opacity-0');
            document.getElementById('chat-window').classList.add('scale-95');
            setTimeout(() => {
                chatModal.classList.add('hidden');
            }, 300);

            // 1. Kembalikan style <html>
            document.documentElement.style.paddingRight = '';
            document.documentElement.style.overflow = '';

            // 2. Kembalikan style <body>
            document.body.style.overflow = '';
        }
    }

    chatToggleBtn.addEventListener('click', () => toggleChatModal(true));
    chatCloseBtn.addEventListener('click', () => toggleChatModal(false));
    chatOverlay.addEventListener('click', () => toggleChatModal(false));

    function displayMessage(message, sender) {
        const msgDiv = document.createElement('div');
        msgDiv.classList.add('flex');

        let content = '';
        if (sender === 'user') {
            msgDiv.classList.add('justify-end');
            content = `
                <div class="bg-brand-primary text-white p-3 rounded-2xl rounded-br-none max-w-[85%]">
                    <p class="text-sm">${message}</p>
                </div>
            `;
        } else {
            content = `
                <div class="bg-brand-light text-brand-dark p-3 rounded-2xl rounded-bl-none max-w-[85%]" ${sender === 'loading' ? 'id="loading-indicator"' : ''}>
                    <p class="text-sm">${message}</p>
                </div>
            `;
        }

        msgDiv.innerHTML = content;
        chatMessages.appendChild(msgDiv);
        // Selalu scroll ke bawah saat pesan baru ditambahkan
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function removeLoadingIndicator() {
        const loadingEl = document.getElementById('loading-indicator');
        if (loadingEl) {
            loadingEl.parentElement.remove();
        }
    }

    chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const userMessage = chatInput.value.trim();
        if (userMessage === '') return;

        displayMessage(userMessage, 'user');
        chatInput.value = '';
        displayMessage('Mengetik...', 'loading');

        fetchGeminiResponse(userMessage);
    });

    const apiKey = "AIzaSyAUhUA8a1hkxkV0AVFMMA1XYyDbUmPab1A"; // <-- GANTI DENGAN API KEY ANDA
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
    // --- const systemPrompt = "Anda adalah Asisten Kesehatan AI yang ramah, suportif, dan informatif. Anda dapat memberikan informasi kesehatan umum, tips kebugaran, dan saran gaya hidup sehat. Anda BUKAN profesional medis dan tidak dapat memberikan diagnosis atau nasihat medis. Selalu ingatkan pengguna untuk berkonsultasi dengan dokter untuk masalah medis.";

    async function fetchWithBackoff(apiUrl, payload, retries = 3, delay = 1000) {
        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                if (response.status === 429 && retries > 0) {
                    await new Promise(res => setTimeout(res, delay));
                    return fetchWithBackoff(apiUrl, payload, retries - 1, delay * 2);
                }
                throw new Error(`API error: ${response.statusText} (Status: ${response.status})`);
            }

            return await response.json();

        } catch (error) {
            if (retries > 0) {
                await new Promise(res => setTimeout(res, delay));
                return fetchWithBackoff(apiUrl, payload, retries - 1, delay * 2);
            }
            throw error;
        }
    }

    async function fetchGeminiResponse(prompt) {
        const payload = {
            contents: [{ parts: [{ text: prompt }] }],
            systemInstruction: {
                parts: [{ text: systemPrompt }]
            }
        };

        try {
            const result = await fetchWithBackoff(apiUrl, payload);

            removeLoadingIndicator();

            const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
            if (text) {
                const formattedText = text.replace(/\n/g, '<br>');
                displayMessage(formattedText, 'ai');
            } else {
                displayMessage("Maaf, saya tidak dapat menemukan jawaban. Coba lagi.", 'ai');
            }
        } catch (error) {
            removeLoadingIndicator();
            console.error("Error fetching Gemini:", error);
            displayMessage("Maaf, terjadi kesalahan saat menghubungi asisten AI. Silakan coba lagi nanti.", 'ai');
        }
    }

});
