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

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

function setupCarousel(track, previous, next) {
  const [first, second] = track.children;
  if (!second) return;

  function updateArrows() {
    const end = track.scrollWidth - track.clientWidth;
    previous.setAttribute('aria-disabled', String(track.scrollLeft <= 1));
    next.setAttribute('aria-disabled', String(track.scrollLeft >= end - 1));
  }

  function scroll(button, direction) {
    if (button.getAttribute('aria-disabled') === 'true') return;
    track.scrollBy({
      left: direction * (second.offsetLeft - first.offsetLeft),
      behavior: reduceMotion.matches ? 'instant' : 'smooth',
    });
  }

  previous.addEventListener('click', () => scroll(previous, -1));
  next.addEventListener('click', () => scroll(next, 1));
  track.addEventListener('scroll', updateArrows, { passive: true });
  previous.hidden = next.hidden = false;
  track.parentElement.classList.add('has-arrows');
  new ResizeObserver(updateArrows).observe(track);
  updateArrows();
}

setupCarousel(
  document.getElementById('service-grid'),
  document.getElementById('service-prev'),
  document.getElementById('service-next'),
);

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

const galleryTrack = document.getElementById('gallery-photos');
const galleryTemplate = document.getElementById('gallery-tile-template');
const galleryViewer = document.getElementById('gallery-viewer');
const viewerPhoto = galleryViewer.querySelector('.gallery-viewer-photo');
const viewerStatus = document.getElementById('gallery-viewer-status');
const previousPhoto = document.getElementById('gallery-previous-photo');
const nextPhoto = document.getElementById('gallery-next-photo');
let viewerIndex = 0;

function showViewerPhoto(index, direction = 0) {
  viewerIndex = (index + galleryPhotos.length) % galleryPhotos.length;
  const photo = galleryPhotos[viewerIndex];
  viewerPhoto.alt = photo.alt;
  viewerPhoto.src = photo.src;
  if (direction && !reduceMotion.matches) {
    viewerPhoto.getAnimations().forEach(animation => animation.cancel());
    viewerPhoto.animate(
      [
        { transform: `translateX(${direction * 12}%)`, opacity: 0 },
        { transform: 'translateX(0)', opacity: 1 },
      ],
      { duration: 240, easing: 'ease-out' },
    );
  }
  viewerStatus.textContent = `Photo ${viewerIndex + 1} of ${galleryPhotos.length}`;
}

galleryPhotos.forEach((photo, index) => {
  const tile = galleryTemplate.content.firstElementChild.cloneNode(true);
  tile.setAttribute('aria-label', `View photo ${index + 1}: ${photo.alt}`);
  tile.querySelector('img').src = photo.src;
  tile.addEventListener('click', () => {
    showViewerPhoto(index);
    galleryViewer.showModal();
  });
  galleryTrack.append(tile);
});

setupCarousel(
  galleryTrack,
  document.getElementById('gallery-prev'),
  document.getElementById('gallery-next'),
);

previousPhoto.disabled = nextPhoto.disabled = galleryPhotos.length <= 1;
previousPhoto.addEventListener('click', () => showViewerPhoto(viewerIndex - 1, -1));
nextPhoto.addEventListener('click', () => showViewerPhoto(viewerIndex + 1, 1));
galleryViewer.addEventListener('keydown', event => {
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    event.preventDefault();
    const direction = event.key === 'ArrowLeft' ? -1 : 1;
    showViewerPhoto(viewerIndex + direction, direction);
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
