import refsMdl from './refsMdl';
import appStates from '../utils/appStates';
import firebaseAPI from '../main';

let currentAppState = {
  galleryState: 'popular',
  searchQuery: '',
  showElems: { ...appStates.popularState, ...appStates.unregisteredState },
  popular: { currentPage: 1, totalPages: null },
  search: { currentPage: 1, totalPages: null },
  watched: { currentPage: 1, totalPages: null },
  queued: { currentPage: 1, totalPages: null },
  isAuth: false,
};
// let newAppState = {};

// function activeElClick(element) {
//   switch (element) {
//     case refsMdl.homeBtnEl:
//     case refsMdl.logoEl:
//       newAppState.galleryState = 'popular';
//       newAppState.showElems = { ...appStates.popularState };
//       break;
//   }
//   if (!firebaseAPI.instance.userId) {
//     newAppState.showElems = { ...newAppState.showElems, ...appStates.unregisteredState };
//   }
//   showAppElems();
// }

// function pageReload() {
//   newAppState.galleryState = 'popular';
//   newAppState.showElems = { ...appStates.popularState };
//   if (!firebaseAPI.instance.userId) {
//     newAppState.showElems = { ...newAppState.showElems, ...appStates.unregisteredState };
//   }
//   showAppElems();
// }

// function getDiffState() {
//   const diffState = {};
//   for (const key of appStates.stateKeys) {
//     if (newAppState[key] !== currentAppState[key]) {
//       diffState[key] = newAppState[key];
//     }
//   }
//   return diffState;
// }

// function showAppElems() {
//   const diffState = getDiffState();
//   const keys = Object.keys(diffState);
//   for (const key of keys) {
//     if (typeof diffState[key] === 'boolean') {
//       if (diffState[key]) {
//         refsMdl[key].classList.remove('is-hidden');
//       } else {
//         refsMdl[key].classList.add('is-hidden');
//       }
//     } else {
//       switch (key) {
//         case 'bgMain':
//           if (diffState[key]) {
//             refsMdl.header.classList.add('header--search');
//           } else {
//             refsMdl.header.classList.remove('header--search');
//           }
//           break;

//         case 'bgLyb':
//           if (diffState[key]) {
//             refsMdl.header.classList.add('header--lybrary');
//           } else {
//             refsMdl.header.classList.remove('header--lybrary');
//           }
//           break;

//         case 'logo':
//           if (diffState[key]) {
//             refsMdl.logoEl.classList.remove('is-hidden');
//           } else {
//             refsMdl.logoEl.classList.add('is-hidden');
//           }
//           break;

//         case 'searchInput':
//           if (diffState[key]) {
//             refsMdl.searchFormEl.classList.remove('is-hidden');
//           } else {
//             refsMdl.searchFormEl.classList.add('is-hidden');
//           }
//           break;
//       }
//     }
//   }
// }

export default {
  currentAppState,
  // activeElClick,
};
