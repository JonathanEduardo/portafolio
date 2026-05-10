// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Mobile menu toggle
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');
const mobileMenuLinks = document.querySelectorAll('.mobile-nav-link');

if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener('click', () => {
        const isHidden = mobileMenu.classList.contains('hidden');
        mobileMenu.classList.toggle('hidden');
        mobileMenuButton.setAttribute('aria-expanded', isHidden ? 'true' : 'false');
    });

    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
            mobileMenuButton.setAttribute('aria-expanded', 'false');
        });
    });
}

// Project cards collapse toggles
const toggles = document.querySelectorAll('.project-toggle');
toggles.forEach(button => {
    button.addEventListener('click', event => {
        event.stopPropagation();
        const targetId = button.dataset.target;
        const content = document.getElementById(targetId);
        if (!content) return;
        const isOpen = content.classList.contains('open');

        if (isOpen) {
            content.classList.remove('open');
            content.style.maxHeight = '0';
            button.textContent = '+';
        } else {
            content.classList.add('open');
            content.style.maxHeight = content.scrollHeight + 'px';
            button.textContent = '−';
        }
    });
});

// Background image carousel for project cards
const projectCards = document.querySelectorAll('.project-image');
const projectState = {};
const modal = document.getElementById('project-modal');
const modalImage = document.getElementById('modal-image');
const modalClose = document.getElementById('modal-close');
const modalPrev = document.getElementById('modal-prev');
const modalNext = document.getElementById('modal-next');
let modalProject = null;
let modalIndex = 0;
let modalTimer = null;

projectCards.forEach(card => {
    const images = JSON.parse(card.dataset.images || '[]');
    const project = card.dataset.project;
    if (!project) return;
    projectState[project] = {
        images,
        index: 0,
        timer: null
    };

    const setCardBackground = () => {
        const state = projectState[project];
        const image = state.images[state.index];
        if (image) {
            card.style.backgroundImage = `url('${image}')`;
            card.querySelector('span')?.classList.add('hidden');
        } else {
            card.style.backgroundImage = 'none';
            card.style.backgroundColor = '#0f172a';
            card.querySelector('span')?.classList.remove('hidden');
        }
    };

    const startTimer = () => {
        if (projectState[project].images.length <= 1) return;
        projectState[project].timer = setInterval(() => {
            projectState[project].index = (projectState[project].index + 1) % projectState[project].images.length;
            setCardBackground();
        }, 3000);
    };

    setCardBackground();
    startTimer();

    card.addEventListener('click', () => {
        if (projectState[project].images.length === 0) return;
        modalProject = project;
        modalIndex = projectState[project].index;
        openModal();
    });
});

const openModal = () => {
    if (!modalProject) return;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    updateModalImage();
};

const closeModal = () => {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    if (modalTimer) {
        clearInterval(modalTimer);
        modalTimer = null;
    }
};

const updateModalImage = () => {
    if (!modalProject) return;
    const images = projectState[modalProject].images;
    if (!images || images.length === 0) return;
    modalImage.src = images[modalIndex];
};

modalClose.addEventListener('click', closeModal);
modal.addEventListener('click', event => {
    if (event.target === modal) closeModal();
});

modalPrev.addEventListener('click', () => {
    if (!modalProject) return;
    modalIndex = (modalIndex - 1 + projectState[modalProject].images.length) % projectState[modalProject].images.length;
    updateModalImage();
});

modalNext.addEventListener('click', () => {
    if (!modalProject) return;
    modalIndex = (modalIndex + 1) % projectState[modalProject].images.length;
    updateModalImage();
});
