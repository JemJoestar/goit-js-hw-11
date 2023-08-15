import { Notify } from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import {searchPhotos} from './photoAPI/photo-api-service.js';

const refs = {
  formEl: document.getElementById('search-form'),
  galleryEl: document.getElementById('gallery'),
  loadMoreZone: document.getElementById('load-more'),
};

let request = ""

let observerTriggered = false;

let reachedEnd = false

const observer = new IntersectionObserver(event => {
  if (observerTriggered) {
    return;
  }
  if(reachedEnd){
    refs.loadMoreZone.hidden = true;
    observerTriggered = true
    Notify.info("We're sorry, but you've reached the end of search results.");
    return
  }

  observerTriggered = true;
  loadPhotos().catch(err => err);
});

const lightbox = new SimpleLightbox('.photo-card a');



refs.formEl.addEventListener('submit', onSearch);

function onSearch(event) {
  event.preventDefault();
  reachedEnd = false

  if (event.currentTarget.searchQuery.value === '') {
    Notify.failure('Please enter your request');
    return;
  }
  request = event.currentTarget.searchQuery.value;
  refs.galleryEl.innerHTML = '';
  refs.formEl.reset();


  page = 1;

  loadPhotos();
  refs.loadMoreZone.hidden = false;
  observer.observe(refs.loadMoreZone);
}

function createMarcup(photoArr) {
  return photoArr
    .map(
      photo => `<div class="photo-card">
    <a href="${photo.largeImageURL}"><img src="${photo.webformatURL}" alt="${photo.tags}" title="${photo.tags}" loading="lazy" /></a>
    <div class="info">
      <p class="info-item">
        <b>Likes</b> ${photo.likes}
      </p>
      <p class="info-item">
        <b>Views</b> ${photo.views} 
      </p>
      <p class="info-item">
        <b>Comments</b> ${photo.comments}
      </p>
      <p class="info-item">
        <b>Downloads</b> ${photo.downloads}
      </p>
    </div>
  </div>`
    )
    .join('');
}

async function loadPhotos() {
  try {
    observerTriggered = true;

    const loadetData = await searchPhotos(request, page++);
    try {
      if (loadetData.totalHits === 0) {
        throw new Error(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      }
    } catch (err) {
      Notify.failure(err.message);
      return
    }

    if (loadetData.hits.length < 40) {
      reachedEnd = true      
    }

    refs.galleryEl.insertAdjacentHTML(
      'beforeend',
      createMarcup(loadetData.hits)
    );
// !=======DELETE========
    refs.formEl.reset();
// !=======DELETE========

    setTimeout(() => (observerTriggered = false), 1000);
    lightbox.refresh();

  } catch (err) {
    throw err
    // Notify.failure(err.message);
  }
}
