const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
function setNavigationOpen(open) {
  nav.classList.toggle('open', open);
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  toggle.textContent = open ? '✕' : '☰';
}

toggle.addEventListener('click', () => {
  setNavigationOpen(!nav.classList.contains('open'));
});
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setNavigationOpen(false)));
document.querySelector('.header').addEventListener('keydown', event => {
  if (event.key === 'Escape' && nav.classList.contains('open')) {
    setNavigationOpen(false);
    toggle.focus();
  }
});
document.getElementById('year').textContent = new Date().getFullYear();

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const mobileServices = window.matchMedia('(max-width: 700px)');

document.querySelectorAll('.service-details').forEach(details => {
  const summary = details.querySelector('summary');
  const title = summary.querySelector('h3');
  const description = details.querySelector('p');
  const copy = document.createElement('div');
  copy.className = 'service-copy';

  function updateServiceCard() {
    if (mobileServices.matches) {
      copy.append(title, description);
      details.replaceWith(copy);
    } else if (copy.isConnected) {
      summary.append(title);
      details.append(description);
      copy.replaceWith(details);
    }
  }

  mobileServices.addEventListener('change', updateServiceCard);
  updateServiceCard();
});

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

const galleryPhotos = [
  { src: 'images/IMG-20261124-WA0001.jpg', alt: 'Kitchenette with gray cabinets and a stainless steel refrigerator' },
  { src: 'images/IMG-20261124-WA0002.jpg', alt: 'Room with a green accent wall and wood-look flooring' },
  { src: 'images/IMG-20261124-WA0003.jpg', alt: 'Hallway with colorful doors and a wall mural' },
  { src: 'images/IMG-20261124-WA0007.jpg', alt: 'Kitchen with dark cabinets and a dining area' },
  { src: 'images/office-suites-west.jpg', alt: 'Office Suites West building exterior in Plainfield, Indiana' },
  { src: 'images/pic_7.jpg', alt: 'Restroom with a polished dark tile floor' },
  { src: 'images/pic_8.jpg', alt: 'Exterior of a two-story house with blue and white siding' },
  { src: 'images/pic_9.jpg', alt: 'Break room with a round table and a polished dark floor' },
  { src: 'images/pic_10.jpg', alt: 'Close-up of a white-framed window reflecting a nearby house' },
  { src: 'images/pic_11.jpg', alt: 'Room with white cabinets, a yellow sink counter, and light wood-look flooring' },
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
form.addEventListener('submit', async event => {
  event.preventDefault();
  const button = form.querySelector('button[type="submit"]');
  const status = form.querySelector('.form-message');
  if (button.disabled) return;

  button.disabled = true;
  status.textContent = 'Sending your request…';
  try {
    const response = await fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
    });
    const result = await response.json();
    if (!response.ok || result.ok !== true) throw new Error('Quote submission failed');
    form.reset();
    status.textContent = 'Thanks! Your quote request was submitted. We’ll be in touch soon.';
  } catch {
    status.textContent = 'We couldn’t send your request. Please try again or call +1 317-668-9274.';
  } finally {
    button.disabled = false;
  }
});
