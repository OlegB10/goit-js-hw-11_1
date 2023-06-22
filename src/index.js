import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { fetchImages } from './api';

const form = document.getElementById('search-form');
const gallery = document.getElementById('gallery');
const loadMore = document.getElementById('load-more');

let page = 1;
let currentSearchQuery = '';

form.addEventListener('submit', onFormSubmit);
loadMore.addEventListener('click', loadMoreImages);

loadMore.hidden = true;

async function onFormSubmit(event) {
  event.preventDefault();
  gallery.innerHTML = '';
  page = 1;
  const searchQuery = event.target.elements.searchQuery.value.trim();
  currentSearchQuery = searchQuery;

  if (searchQuery === '') {
    Notiflix.Notify.info('Please enter a search query.');
  } else {
    try {
      const { hits, totalHits } = await fetchImages(searchQuery, page, 40);
      if (hits.length === 0) {
        Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
        loadMore.hidden = true;
      } else {
        gallery.insertAdjacentHTML('beforeend', createMarkup(hits));
        lightbox.refresh();

        if (page === 1) {
          Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
        }
        if (totalHits - page * 40 <= 0) {
          loadMore.hidden = true;
          Notiflix.Notify.info('We\'re sorry, but you\'ve reached the end of search results.');
        } else {
          loadMore.hidden = false;
        }
        page += 1;
      }
    } catch (error) {
      console.log(error);
      Notiflix.Notify.failure('Oops! Something went wrong. Please try again later.');
    }
  }
}

async function loadMoreImages() {
  try {
    const { hits } = await fetchImages(currentSearchQuery, page, 40);
    gallery.insertAdjacentHTML('beforeend', createMarkup(hits));
    lightbox.refresh();
    page += 1;
    const { height: cardHeight } = document
      .querySelector('.gallery')
      .firstElementChild.getBoundingClientRect();
    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
  } catch (error) {
    console.log(error);
    Notiflix.Notify.failure('Oops! Something went wrong. Please try again later.');
  }
}

function createMarkup(hits) {
  return hits
    .map(
      ({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => `
    <div class="photo-card">
      <a href="${largeImageURL}">
        <img src="${webformatURL}" alt="${tags}" loading="lazy" class="photo" />
      </a>
      <div class="info">
        <p class="info-item"><b>Likes:</b> ${likes}</p>
        <p class="info-item"><b>Views:</b> ${views}</p>
        <p class="info-item"><b>Comments:</b> ${comments}</p>
        <p class="info-item"><b>Downloads:</b> ${downloads}</p>
      </div>
    </div>
  `
    )
    .join('');
}

const lightbox = new SimpleLightbox('.photo-card a', {
  captionsData: 'alt',
  captionDelay: 250,
  overlayOpacity: 0.5,
});