import throttle from 'lodash.throttle';
import { Notify } from 'notiflix';
import Pagination from 'tui-pagination';
import galleryElementTpl from '../templates/galleryElement.hbs';
import fetchAPI from './modules/fetchAPI';
import firebaseAPI from './modules/firebaseAPI';
import footerModal from './modules/footerModal';
import modalMovieCardAPI from './modules/modalMovieCardAPI';
import refsMdl from './modules/refsMdl';
import respDataProc from './modules/responseDataProcessing';
import storageAPI from './modules/storageAPI';
import { uiAPI } from './modules/uiAPI';

export const currentAppState = {
  galleryState: 'popular',
  searchQuery: '',
  popular: { currentPage: 1 },
  search: { currentPage: 1 },
  filtered: { currentPage: 1 },
  somethingToWatch: { currentPage: 1, totalPages: null },
  isAuth: false,
};

let pagination = null;

const paginationOptions = {
  itemsPerPage: 20,
  visiblePages: 5,
  centerAlign: true,
};

const messageFailure = 'Щось пішло не так, але посіпаки вже розбираються з цим...';

const showPagination = totalPages => {
  const currentPage = currentAppState[currentAppState.galleryState].currentPage;
  refsMdl.paginationEl.classList.remove('is-hidden');
  pagination = new Pagination(refsMdl.paginationEl, {
    ...paginationOptions,
    totalItems: totalPages,
    page: currentPage,
  });
  pagination.on('beforeMove', function (eventData) {
    currentAppState[currentAppState.galleryState].currentPage = eventData.page;
    window.scroll({
      top: 0,
      behavior: 'smooth',
    });
    switch (currentAppState.galleryState) {
      case 'popular':
        showPopular();
        break;
      case 'search':
        showSearch();
        break;
      case 'filtered':
        showFiltered();
        break;
    }
  });
};

async function showFiltered() {
  currentAppState.galleryState = 'filtered';
  try {
    const response = await fetchAPI.instance.fetchFiltered(currentAppState.filtered.currentPage);
    // console.log('Popular movies server response', response);
    const processedInfo = respDataProc.prepareMoviesInfo(response.results);
    uiAPI.renderGallery(processedInfo);
    showPagination(response.total_results);
  } catch (error) {
    // console.log(error);
    Notify.failure(messageFailure);
  }
}

async function showPopular() {
  storageAPI.save('filters', []);
  refsMdl.filtersFormEl.reset();
  currentAppState.galleryState = 'popular';
  try {
    const response = await fetchAPI.instance.fetchPopular(currentAppState.popular.currentPage);
    // console.log('Popular movies server response', response);
    const processedInfo = respDataProc.prepareMoviesInfo(response.results);
    uiAPI.renderGallery(processedInfo);
    showPagination(response.total_results, currentAppState.popular.currentPage);
  } catch (error) {
    // console.log(error);
    Notify.failure(messageFailure);
  }
}

function setActiveButton(button) {
  const activeBtn = document.querySelector('.current');
  activeBtn.classList.remove('current');
  button.classList.add('current');
}

function handleLogoBtnClick() {
  const event = new Event('click');
  refsMdl.homeBtnEl.dispatchEvent(event);
}

const handleHomeBtnClick = async e => {
  removeScrollEventListener();
  refsMdl.header.classList.remove('header--lybrary');
  setActiveButton(e.target);
  refsMdl.searchInputEl.value = '';
  refsMdl.searchFormEl.classList.remove('is-hidden');
  refsMdl.watchedBtnEl.classList.add('is-hidden');
  refsMdl.queuedBtnEl.classList.add('is-hidden');
  refsMdl.filtersFormEl.classList.remove('is-hidden');
  uiAPI.hideRegistrationInfo();
  currentAppState.popular.currentPage = 1;
  showPopular();
};

const showSearch = async () => {
  currentAppState.galleryState = 'search';
  removeScrollEventListener();
  try {
    const response = await fetchAPI.instance.fetchSearch(
      currentAppState.searchQuery,
      currentAppState.search.currentPage
    );
    // console.log(response);
    if (!response.results.length) {
      Notify.failure('Немає таких фільмів :)');
      return;
    }
    const processedInfo = respDataProc.prepareMoviesInfo(response.results);
    // console.log(processedInfo);
    uiAPI.renderGallery(processedInfo);
    showPagination(response.total_results, currentAppState.popular.currentPage);
  } catch (error) {
    // console.log(error);
    Notify.failure(messageFailure);
  }
};

const handleFormSubmit = async event => {
  event.preventDefault();
  currentAppState.searchQuery = event.target.elements.searchQuery.value.trim();
  if (!currentAppState.searchQuery) return;
  currentAppState.search.currentPage = 1;
  showSearch();
};

const handleLybraryBtnClick = async e => {
  removeScrollEventListener();
  // console.log()
  refsMdl.paginationEl.classList.add('is-hidden');
  refsMdl.header.classList.add('header--lybrary');
  if (!firebaseAPI.instance.userId) uiAPI.showRegistrationInfo();
  setActiveButton(e.target);
  currentAppState.galleryState = 'watched';
  refsMdl.watchedBtnEl.classList.add('active');
  refsMdl.queuedBtnEl.classList.remove('active');
  refsMdl.searchFormEl.classList.add('is-hidden');
  refsMdl.watchedBtnEl.classList.remove('is-hidden');
  refsMdl.queuedBtnEl.classList.remove('is-hidden');
  refsMdl.filtersFormEl.classList.add('is-hidden');
  const watched = storageAPI.load('watched') || [];
  refsMdl.galleryEl.innerHTML = galleryElementTpl(watched);
};

const handleWatchedBtnClick = () => {
  currentAppState.galleryState = 'watched';
  refsMdl.watchedBtnEl.classList.add('active');
  refsMdl.queuedBtnEl.classList.remove('active');
  const watched = storageAPI.load('watched') || [];
  refsMdl.galleryEl.innerHTML = galleryElementTpl(watched);
};

const handleQueuedBtnClick = () => {
  currentAppState.galleryState = 'queue';
  refsMdl.queuedBtnEl.classList.add('active');
  refsMdl.watchedBtnEl.classList.remove('active');
  const queued = storageAPI.load('queue') || [];
  refsMdl.galleryEl.innerHTML = galleryElementTpl(queued);
};

const handleGalleryClick = async e => {
  const card = e.target.closest('.gallery__item');
  if (!card) return;
  const id = +card.dataset.id;
  try {
    const response = await fetchAPI.instance.fetchId(id);
    // console.log('Full movie info', response);
    const processedInfo = respDataProc.prepareModalCardInfo(response);

    storageAPI.save('modalInfo', processedInfo);
    modalMovieCardAPI.showModalMovieCard(processedInfo);
  } catch (error) {
    // console.log(error);
    Notify.failure(messageFailure);
  }
};

async function handleFilterFormChange(e) {
  e.preventDefault();
  refsMdl.searchInputEl.value = '';
  const form = e.target.closest('.js-filters-form');
  let filters = [];
  for (let i = 0; i < form.elements.length; i += 1) {
    if (form[i].name && form[i].value) {
      filters.push({ [form[i].name]: form[i].value });
    }
  }
  const periodFilter = filters.filter(filter => filter['primary_release_date.gte']);
  if (periodFilter.length) {
    const year = +periodFilter[0]['primary_release_date.gte'].slice(0, 4);
    if (year === 1949) {
      filters.push({ ['primary_release_date.lte']: periodFilter[0]['primary_release_date.gte'] });
      const index = filters.findIndex(filter => filter['primary_release_date.gte']);
      filters.splice(index, 1);
    } else {
      filters.push({ ['primary_release_date.lte']: year + 10 + '-01-01' });
    }
  }
  storageAPI.save('filters', filters);
  currentAppState.galleryState = 'filtered';
  try {
    const response = await fetchAPI.instance.fetchFiltered();
    // console.log(response);
    if (!response.results.length) {
      Notify.failure('І тут щось пішло не так, але посіпаки вже розбираються з цим :)');
      return;
    }
    const processedInfo = respDataProc.prepareMoviesInfo(response.results);
    // console.log(processedInfo);
    uiAPI.renderGallery(processedInfo);
    currentAppState.filtered.currentPage = 1;
    showPagination(response.total_results, currentAppState.filtered.currentPage);
  } catch (error) {
    // console.log(error);
    Notify.failure(messageFailure);
  }
}

async function showFiltered() {
  try {
    const response = await fetchAPI.instance.fetchFiltered(currentAppState.filtered.currentPage);
    // console.log(response);
    if (!response.results.length) {
      Notify.failure('Немає таких фільмів :)');
      return;
    }
    const processedInfo = respDataProc.prepareMoviesInfo(response.results);
    // console.log(processedInfo);
    uiAPI.renderGallery(processedInfo);
  } catch (error) {
    // console.log(error);
    Notify.failure(messageFailure);
  }
}

function handleUpBtnClick() {
  window.scroll({
    top: 0,
    behavior: 'smooth',
  });
}

const throttledHandlerDocumentScroll = throttle(handleDocumentScroll, 300);

function handleDocumentScroll() {
  if (
    document.documentElement.scrollHeight -
      document.documentElement.clientHeight -
      document.documentElement.scrollTop <
    500
  ) {
    showMoreGallery();
  }
}

function showMoreGallery() {
  const moviesToShow = getMoviesToShow();
  currentAppState.somethingToWatch.currentPage += 1;
  const processedInfo = respDataProc.prepareMoviesInfo(moviesToShow);
  uiAPI.addToGallery(processedInfo);
}

function handleWatchSomethingBtnClick() {
  const watchSomethingInfo = storageAPI.load('watchSomeThingMovies');

  if (!watchSomethingInfo) {
    Notify.failure('Для прегляду рекомендацій будь ласка зареєструйтеся в системі');
    return;
  }
  refsMdl.filtersFormEl.classList.add('is-hidden');
  refsMdl.paginationEl.classList.add('is-hidden');
  function shuffle(array) {
    let currentIndex = array.length;
    let randomIndex;
    // While there remain elements to shuffle.
    while (currentIndex != 0) {
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
  }
  const watched = storageAPI.load('watched');
  const watchedIDs = watched.map(movieInfo => movieInfo.id);
  watchedIDs.forEach(id => {
    if (watchSomethingInfo[id]) delete watchSomethingInfo[id];
  });
  const arrRandomizedIDs = shuffle(Object.keys(watchSomethingInfo));
  const arrRandomizedMovies = arrRandomizedIDs.map(id => watchSomethingInfo[id]);
  const filteredMovies = arrRandomizedMovies.filter(movieInfo => movieInfo.vote_count >= 300);
  currentAppState.somethingToWatch.movies = filteredMovies;
  currentAppState.somethingToWatch.totalPages = Math.ceil(filteredMovies.length / 20);
  const moviesToShow = getMoviesToShow();
  currentAppState.somethingToWatch.currentPage += 1;
  const processedInfo = respDataProc.prepareMoviesInfo(moviesToShow);
  uiAPI.renderGallery(processedInfo);
  document.addEventListener('scroll', throttledHandlerDocumentScroll);
}

function getMoviesToShow() {
  if (
    currentAppState.somethingToWatch.currentPage === currentAppState.somethingToWatch.totalPages
  ) {
    return currentAppState.somethingToWatch.movies.slice(
      currentAppState.somethingToWatch.currentPage * 20 - 20,
      currentAppState.somethingToWatch.movies.length
    );
  }
  return currentAppState.somethingToWatch.movies.slice(
    currentAppState.somethingToWatch.currentPage * 20 - 20,
    currentAppState.somethingToWatch.currentPage * 20
  );
}

function removeScrollEventListener() {
  document.removeEventListener('scroll', throttledHandlerDocumentScroll);
}

refsMdl.logoEl.addEventListener('click', handleLogoBtnClick);
refsMdl.homeBtnEl.addEventListener('click', handleHomeBtnClick);
refsMdl.watchSomethingBtnEl.addEventListener('click', handleWatchSomethingBtnClick);

refsMdl.searchFormEl.addEventListener('submit', handleFormSubmit);

refsMdl.lybraryBtnEl.addEventListener('click', handleLybraryBtnClick);

refsMdl.watchedBtnEl.addEventListener('click', handleWatchedBtnClick);
refsMdl.queuedBtnEl.addEventListener('click', handleQueuedBtnClick);
refsMdl.upBtnEl.addEventListener('click', handleUpBtnClick);

refsMdl.galleryEl.addEventListener('click', handleGalleryClick);

refsMdl.filtersFormEl.addEventListener('change', handleFilterFormChange);
refsMdl.filtersResetBtnEl.addEventListener('click', showPopular);
refsMdl.themeSwitchFormEl.addEventListener('change', e => {
  const isDark = e.target.checked;
  if (isDark) {
    storageAPI.save('darkTheme', true);
    refsMdl.themeNameEl.textContent = 'Темна тема';
    refsMdl.body.classList.add('dark-theme');
  } else {
    storageAPI.save('darkTheme', false);
    refsMdl.themeNameEl.textContent = 'Світла тема';
    refsMdl.body.classList.remove('dark-theme');
  }
});

function upButton() {
  window.addEventListener(
    'scroll',
    throttle(function () {
      if (document.body.scrollTop > 400 || document.documentElement.scrollTop > 400) {
        refsMdl.upBtnEl.classList.add('up-button--visible');
      } else {
        refsMdl.upBtnEl.classList.remove('up-button--visible');
      }
    }, 500)
  );
}

// currentAppState.popular.currentPage = Math.ceil(Math.random() * 1000);
// currentAppState.popular.currentPage = 414;
if (storageAPI.load('darkTheme')) {
  refsMdl.themeNameEl.textContent = 'Темна тема';
  refsMdl.body.classList.add('dark-theme');
  refsMdl.themeInput.checked = true;
}
showPopular();
upButton();
storageAPI.save('filters', []);
footerModal();
