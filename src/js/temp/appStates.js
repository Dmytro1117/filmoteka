const unregisteredState = {
  signInBtnEl: true,
  signOutBtnEl: false,
  lybraryBtnEl: false,
  watchedBtnEl: false,
  queuedBtnEl: false,
  header: 'main',
};

const popularState = {
  header: 'main',
  logoEl: true,
  searchFormEl: true,
  homeBtnEl: true,
  lybraryBtnEl: true,
  signInBtnEl: false,
  signInWindowEl: false,
  signOutBtnEl: true,
  galleryEl: true,
  paginationEl: true,
  watchedBtnEl: false,
  queuedBtnEl: false,
  searchBtn: true,
  activeBtn: 'home',
};
const searchState = {
  ...popularState,
  activeBtn: 'search',
};
const signInState = {
  ...popularState,
  activeBtn: 'signIn',
  searchFormEl: false,
  galleryEl: false,
  paginationEl: false,
  signInWindowEl: true,
};

const lybState = {
  header: 'lyb',
  logoEl: true,
  searchFormEl: false,
  homeBtnEl: true,
  lybraryBtnEl: true,
  signInBtnEl: false,
  signInWindowEl: false,
  signOutBtnEl: true,
  galleryEl: true,
  paginationEl: true,
  watchedBtnEl: true,
  queuedBtnEl: true,
  searchBtn: true,
  activeBtn: 'lyb',
};

const stateKeys = Object.keys(popularState);

export default {
  unregisteredState,
  popularState,
  searchState,
  signInState,
  lybState,
  stateKeys,
};
