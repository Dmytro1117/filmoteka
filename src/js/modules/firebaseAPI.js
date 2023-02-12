import { FIREBASE_CONFIG } from '../utils/envConsts';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  onAuthStateChanged,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
  signInWithRedirect,
} from 'firebase/auth';
import { getDatabase, ref, set, get, child, remove, onValue } from 'firebase/database';
import refsMdl from './refsMdl';
import storageAPI from './storageAPI';
import modalMovieCardAPI from './modalMovieCardAPI';
import { uiAPI } from './uiAPI';
import fetchAPI from './fetchAPI';

class firebaseAPI {
  constructor(signInBtnEl, logOutBtnEl) {
    this.firebaseConfig = JSON.parse(FIREBASE_CONFIG);
    this.firebaseApp = initializeApp(this.firebaseConfig);
    this.firebaseAuth = getAuth(this.firebaseApp);
    this.providerGoogle = new GoogleAuthProvider();
    this.database = getDatabase(this.firebaseApp);
    this.userStatus = refsMdl.userStatusEl;
    this.apiKey = this.firebaseConfig.apiKey;
    this.dbRef = ref(this.database);
    this.monitorAuthState();
    signInBtnEl.addEventListener('click', this.signInWithRedirectFirebase.bind(this));
    logOutBtnEl.addEventListener('click', this.logout.bind(this));
  }

  async signInWithEmailLink() {
    const actionCodeSettings = {
      // URL you want to redirect back to. The domain (www.example.com) for this
      // URL must be in the authorized domains list in the Firebase Console.
      url: 'http://localhost:1234',
      // This must be true.
      handleCodeInApp: true,
    };
    const userEmail = refsMdl.emailInputEl.value.trim();
    // console.log(userEmail);
    sendSignInLinkToEmail(this.firebaseAuth, userEmail, actionCodeSettings)
      .then(() => {
        // The link was successfully sent. Inform the user.
        // Save the email locally so you don't need to ask the user for it again
        // if they open the link on the same device.
        window.localStorage.setItem('emailForSignIn', userEmail);
        // ...
      })
      .catch(error => {
        //console.log(error);
        const errorCode = error.code;
        const errorMessage = error.message;
        // ...
      });
  }
  async signInWithPopupGoogle() {
    try {
      const signInResult = await signInWithPopup(this.firebaseAuth, this.providerGoogle);
      // const credential = GoogleAuthProvider.credentialFromResult(signInResult);
      // const token = credential.accessToken;
      const user = signInResult.user;
      this.userId = user.uid;
      this.userStatus.textContent = `Hello, ${user.displayName}`;
      //console.log(user);
    } catch (error) {
      // const errorCode = error.code;
      // const errorMessage = error.message;
      // The email of the user's account used.
      // const email = error.customData.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      //console.log(error);
      //console.log(credential);
      //console.log('error');
    }
  }

  async signInWithRedirectFirebase() {
    signInWithRedirect(this.firebaseAuth, this.providerGoogle);
  }

  async writeDataToStorage(key, data) {
    storageAPI.save(key, data);
  }

  // Monitor auth state
  async monitorAuthState() {
    if (isSignInWithEmailLink(this.firebaseAuth, window.location.href)) {
      // Additional state parameters can also be passed via URL.
      // This can be used to continue the user's intended action before triggering
      // the sign-in operation.
      // Get the email if available. This should be available if the user completes
      // the flow on the same device where they started it.
      let email = window.localStorage.getItem('emailForSignIn');
      if (!email) {
        // User opened the link on a different device. To prevent session fixation
        // attacks, ask the user to provide the associated email again. For example:
        email = window.prompt('Please provide your email for confirmation');
      }
      // The client SDK will parse the code from the link for you.
      await signInWithEmailLink(this.firebaseAuth, email, window.location.href)
        .then(result => {
          // Clear email from storage.
          window.localStorage.removeItem('emailForSignIn');
          window.location.replace(window.location.origin);
          // You can access the new user via result.user
          // Additional user info profile not available via:
          // result.additionalUserInfo.profile == null
          // You can check if the user is new or existing:
          // result.additionalUserInfo.isNewUser
        })
        .catch(error => {
          // Some error occurred, you can inspect the code: error.code
          // Common errors could be invalid email and invalid or expired OTPs.
        });
    }
    onAuthStateChanged(this.firebaseAuth, async user => {
      if (user) {
        const YTStatus = await this.getYouTubeStatus();
        const dateNow = new Date();
        const savedDate = new Date(YTStatus.timeStamp);
        if (
          (YTStatus.status === false && savedDate.getUTCDate() < dateNow.getUTCDate()) ||
          savedDate.getUTCMonth() < dateNow.getUTCMonth() ||
          savedDate.getUTCFullYear() < dateNow.getUTCFullYear()
        ) {
          this.setYouTubeStatus(Date.now(), true);
          storageAPI.save('YTStatus', { status: true, timeStamp: dateNow });
        } else {
          storageAPI.save('YTStatus', YTStatus);
        }
        const watchSomething = await this.getWatchSomethingMovies();
        //console.log(watchSomething);
        const savedWSDate = new Date(watchSomething.timeStamp);
        const timeObj = {
          date: savedWSDate.getUTCDate(),
          dateNow: dateNow.getUTCDate(),
        };
        if (
          savedWSDate.getUTCDate() < dateNow.getUTCDate() ||
          savedWSDate.getUTCMonth() < dateNow.getUTCMonth() ||
          savedWSDate.getUTCFullYear() < dateNow.getUTCFullYear()
        ) {
          const movies = await fetchAPI.instance.fetchSomethingToWatch();
          this.saveWatchSomethingMovies(Date.now(), movies);
          storageAPI.save('watchSomeThingMovies', movies);
        } else {
          storageAPI.save('watchSomeThingMovies', watchSomething.movies);
        }
        uiAPI.hideRegistrationInfo();
        this.userId = user.uid;
        refsMdl.signOutBtnEl.classList.remove('is-hidden');
        refsMdl.signInBtnEl.classList.add('is-hidden');
        refsMdl.userStatusEl.textContent = `Hello, ${user.displayName}`;
        //console.log('User info from monitor', user);
        this.accessToken = user.accessToken;
        const watched = storageAPI.load('watched');
        if (watched) {
          watched.forEach(movie => {
            this.addToLyb(movie.id, 'watched', movie);
          });
        }

        const queue = storageAPI.load('queue');
        if (queue) {
          queue.forEach(movie => {
            this.addToLyb(movie.id, 'queue', movie);
          });
        }

        const userLybraryWatched = ref(this.database, `users/${this.userId}/lybrary/watched/`);
        onValue(userLybraryWatched, watched => {
          uiAPI.hideLoadingInfo();
          const data = watched.val();
          if (data) {
            const keys = Object.keys(data);
            const watchedStorage = keys.map(key => data[key]);
            this.writeDataToStorage('watched', watchedStorage);
          } else {
            this.writeDataToStorage('watched', []);
          }
          //console.log('Data Monitor ---> Data from watched DB have changed', data);
          modalMovieCardAPI.showLybrary('watched');
        });
        const userLybraryQueue = ref(this.database, `users/${this.userId}/lybrary/queue/`);
        onValue(userLybraryQueue, queue => {
          uiAPI.hideLoadingInfo();
          const data = queue.val();
          if (data) {
            const keys = Object.keys(data);
            const queueStorage = keys.map(key => data[key]);
            this.writeDataToStorage('queue', queueStorage);
          } else {
            this.writeDataToStorage('queue', []);
          }
          //console.log('Data Monitor ---> Data from queue DB have changed', data);
          modalMovieCardAPI.showLybrary('queue');
        });
        const YTStatusRef = ref(this.database, `appSettings/YTstatus`);
        onValue(YTStatusRef, status => {
          uiAPI.hideLoadingInfo();
          const data = status.val();
          if (data) {
            this.writeDataToStorage('YTStatus', data);
          } else {
            this.writeDataToStorage('YTStatus', { status: true, timeStamp: Date.now() });
          }
          //console.log('Data Monitor ---> Data from YTstatus DB have changed', data);
        });
      } else {
        refsMdl.signOutBtnEl.classList.add('is-hidden');
        refsMdl.signInBtnEl.classList.remove('is-hidden');
        this.userStatus.textContent = 'You are not logged in';
        //console.log(`You're not logged in.`);
      }
    });
  }

  // Log out
  async logout() {
    try {
      await signOut(this.firebaseAuth);
      sessionStorage.clear();
      window.location.reload();
      this.userStatus.textContent = 'Logged Out';
      this.userId = null;
    } catch (error) {
      //console.log(error);
    }
  }
  async isInLyb(id, type) {
    try {
      const snapshot = await get(child(this.dbRef, `users/${this.userId}/lybrary/${type}/${id}`));
      if (snapshot.exists()) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      //console.log(error);
      return false;
    }
  }
  async addToLyb(id, type, movieInfo) {
    // console.log(`Movie is added to ${type}`);
    // console.dir(movieInfo);
    set(ref(this.database, `users/${this.userId}/lybrary/${type}/${id}`), {
      id: movieInfo.id || null,
      title: movieInfo.title || null,
      posterUrl: movieInfo.posterUrl || null,
      genres: movieInfo.genres || null,
      year: movieInfo.year || null,
      overview: movieInfo.overview || null,
    });
  }
  async removeFromLyb(id, type) {
    try {
      remove(ref(this.database, `users/${this.userId}/lybrary/${type}/${id}`));
    } catch (error) {
      // console.log(`Fail to remove from DB ---> ${error}`);
    }
  }
  async saveWatchSomethingMovies(timeStamp, movies) {
    set(ref(this.database, 'watchSomething'), {
      movies,
      timeStamp,
    });
  }
  async getWatchSomethingMovies() {
    const snapshot = await get(child(this.dbRef, `watchSomething`));
    return snapshot.val();
  }
  async setYouTubeStatus(timeStamp, status) {
    set(ref(this.database, 'appSettings/YTstatus'), {
      status,
      timeStamp,
    });
  }
  async getYouTubeStatus() {
    const snapshot = await get(child(this.dbRef, `appSettings/YTstatus`));
    return snapshot.val();
  }
}

const instance = new firebaseAPI(refsMdl.signInBtnEl, refsMdl.signOutBtnEl);

export default {
  instance,
};
