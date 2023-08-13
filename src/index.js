import { Notify } from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import ApiService from './photoAPI/photo-api-service.js';
import axios from 'axios';

const refs = {
  formEl: document.getElementById('search-form'),
  galleryEl: document.getElementById('gallery'),
  loadMoreZone: document.getElementById('load-more'),
};

const observer = new IntersectionObserver(event => {
  loadPhotos().catch(err => err);
});

const apiService = new ApiService();

const lightbox = new SimpleLightbox('.photo-card a');

// !============================================

// !============================================

refs.formEl.addEventListener('submit', onSearch);

function onSearch(event) {
  event.preventDefault();
  if (event.currentTarget.searchQuery.value === '') {
    Notify.failure('Please enter your request');
    return;
  }
  apiService.request = event.currentTarget.searchQuery.value;
  refs.galleryEl.innerHTML = '';
  //   axios({
  //     url: 'https://pixabay.com/api/',
  //     params: {
  //       key: '38816166-f921759e60a0931b2b81a2c9d',
  //       q: apiService.request,
  //     },
  //   })
  //     .then(response => response.data.totalHits)
  //     .then(totalHits => {
  //       if (totalHits === 0) {
  //         throw new Error('Sorry, there are no images matching your search query. Please try again.');
  //       }
  //       Notify.success(`Hooray! We found ${totalHits} images.`);
  //     })
  //     .catch(err => {
  //       Notify.failure(
  //         err.message
  //       );
  //       refs.loadMoreZone.hidden = true
  //     });

  loadPhotos().catch(err => Notify.failure(err.message));
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
  const loadetData = await apiService
    .searchPhotos()
    .catch(err => Notify.failure(err.message));

  if (loadetData.totalHits === 0) {
    throw new Error(
      'Sorry, there are no images matching your search query. Please try again.'
      );
      return
  }
  if (loadetData.hits.length < 40) {
    refs.loadMoreZone.hidden = true;
    Notify.info("We're sorry, but you've reached the end of search results.");
  }

  refs.galleryEl.insertAdjacentHTML('beforeend', createMarcup(loadetData.hits));
  console.log(`loadetData.hits:`, loadetData.hits);
  refs.formEl.reset();

  lightbox.refresh();
  console.log('asdf');
}
