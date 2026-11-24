const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
toggle.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  toggle.textContent = open ? '✕' : '☰';
});
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); toggle.textContent = '☰';
}));
document.getElementById('year').textContent = new Date().getFullYear();

const serviceGrid = document.getElementById('service-grid');
const servicePrevious = document.getElementById('service-prev');
const serviceNext = document.getElementById('service-next');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

function updateServiceArrows() {
  const end = serviceGrid.scrollWidth - serviceGrid.clientWidth;
  servicePrevious.setAttribute('aria-disabled', String(serviceGrid.scrollLeft <= 1));
  serviceNext.setAttribute('aria-disabled', String(serviceGrid.scrollLeft >= end - 1));
}

function scrollServices(button, direction) {
  if (button.getAttribute('aria-disabled') === 'true') return;
  const [first, second] = serviceGrid.children;
  serviceGrid.scrollBy({
    left: direction * (second.offsetLeft - first.offsetLeft),
    behavior: reduceMotion.matches ? 'instant' : 'smooth',
  });
}

servicePrevious.addEventListener('click', () => scrollServices(servicePrevious, -1));
serviceNext.addEventListener('click', () => scrollServices(serviceNext, 1));
serviceGrid.addEventListener('scroll', updateServiceArrows, { passive: true });
servicePrevious.hidden = serviceNext.hidden = false;
serviceGrid.parentElement.classList.add('has-arrows');
new ResizeObserver(updateServiceArrows).observe(serviceGrid);
updateServiceArrows();

// Replace the sample URLs with paths to your work photos and update their descriptions.
const galleryPhotos = [
  { src: 'https://picsum.photos/seed/kingdomnow-1/800/600', alt: 'Sample gallery photo 1' },
  { src: 'https://picsum.photos/seed/kingdomnow-2/800/600', alt: 'Sample gallery photo 2' },
  { src: 'https://picsum.photos/seed/kingdomnow-3/800/600', alt: 'Sample gallery photo 3' },
  { src: 'https://picsum.photos/seed/kingdomnow-4/800/600', alt: 'Sample gallery photo 4' },
  { src: 'https://picsum.photos/seed/kingdomnow-5/800/600', alt: 'Sample gallery photo 5' },
  { src: 'https://picsum.photos/seed/kingdomnow-6/800/600', alt: 'Sample gallery photo 6' },
  { src: 'https://picsum.photos/seed/kingdomnow-7/800/600', alt: 'Sample gallery photo 7' },
  { src: 'https://picsum.photos/seed/kingdomnow-8/800/600', alt: 'Sample gallery photo 8' },
  { src: 'https://picsum.photos/seed/kingdomnow-9/800/600', alt: 'Sample gallery photo 9' },
  { src: 'https://picsum.photos/seed/kingdomnow-10/800/600', alt: 'Sample gallery photo 10' },
  { src: 'https://picsum.photos/seed/kingdomnow-11/800/600', alt: 'Sample gallery photo 11' },
  { src: 'https://picsum.photos/seed/kingdomnow-12/800/600', alt: 'Sample gallery photo 12' },
  { src: 'https://picsum.photos/seed/kingdomnow-13/800/600', alt: 'Sample gallery photo 13' },
  { src: 'https://picsum.photos/seed/kingdomnow-14/800/600', alt: 'Sample gallery photo 14' },
  { src: 'https://picsum.photos/seed/kingdomnow-15/800/600', alt: 'Sample gallery photo 15' },
  { src: 'https://picsum.photos/seed/kingdomnow-16/800/600', alt: 'Sample gallery photo 16' },
];

const gallerySlots = document.querySelectorAll('.gallery-tile');
const galleryNext = document.getElementById('gallery-next');
const galleryStatus = document.getElementById('gallery-status');
const galleryViewer = document.getElementById('gallery-viewer');
const viewerPhoto = galleryViewer.querySelector('.gallery-viewer-photo');
const viewerStatus = document.getElementById('gallery-viewer-status');
const previousPhoto = document.getElementById('gallery-previous-photo');
const nextPhoto = document.getElementById('gallery-next-photo');
let galleryStart = 0;
let viewerIndex = 0;

function showGalleryPhotos() {
  const photos = galleryPhotos.slice(galleryStart, galleryStart + gallerySlots.length);
  gallerySlots.forEach((slot, index) => {
    const photo = photos[index];
    slot.hidden = !photo;
    if (photo) {
      slot.setAttribute('aria-label', `View photo ${galleryStart + index + 1}: ${photo.alt}`);
      slot.querySelector('img').src = photo.src;
    }
  });
  galleryStatus.textContent = photos.length
    ? `Photos ${galleryStart + 1}–${galleryStart + photos.length} of ${galleryPhotos.length}`
    : 'No photos available';
}

galleryNext.hidden = galleryPhotos.length <= gallerySlots.length;
galleryNext.addEventListener('click', () => {
  galleryStart += gallerySlots.length;
  if (galleryStart >= galleryPhotos.length) galleryStart = 0;
  showGalleryPhotos();
});
showGalleryPhotos();

function showViewerPhoto(index) {
  viewerIndex = (index + galleryPhotos.length) % galleryPhotos.length;
  const photo = galleryPhotos[viewerIndex];
  viewerPhoto.alt = photo.alt;
  viewerPhoto.src = photo.src;
  viewerStatus.textContent = `Photo ${viewerIndex + 1} of ${galleryPhotos.length}`;
}

gallerySlots.forEach((slot, index) => {
  slot.addEventListener('click', () => {
    showViewerPhoto(galleryStart + index);
    galleryViewer.showModal();
  });
});

previousPhoto.disabled = nextPhoto.disabled = galleryPhotos.length <= 1;
previousPhoto.addEventListener('click', () => showViewerPhoto(viewerIndex - 1));
nextPhoto.addEventListener('click', () => showViewerPhoto(viewerIndex + 1));
galleryViewer.addEventListener('keydown', event => {
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    event.preventDefault();
    showViewerPhoto(viewerIndex + (event.key === 'ArrowLeft' ? -1 : 1));
  }
});

const form = document.getElementById('quoteForm');
form.addEventListener('submit', event => {
  event.preventDefault();
  const data = new FormData(form);
  const subject = encodeURIComponent(`Cleaning quote request — ${data.get('service')}`);
  const body = encodeURIComponent(`Name: ${data.get('name')}\nEmail: ${data.get('email')}\nPhone: ${data.get('phone')}\nService: ${data.get('service')}\nDetails: ${data.get('message')}`);
  // Replace the placeholder address with the business email before publishing.
  const businessEmail = 'YOUR_EMAIL@example.com';
  if (businessEmail === 'YOUR_EMAIL@example.com') {
    form.querySelector('.form-message').textContent = 'Your form is working. Add your business email in script.js to receive quote requests.';
    return;
  }
  window.location.href = `mailto:${businessEmail}?subject=${subject}&body=${body}`;
});
