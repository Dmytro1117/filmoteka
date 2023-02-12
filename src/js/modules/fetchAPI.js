import axios from 'axios';
import { TMDB_KEY, GOOGLE_SEARCH_KEY } from '../utils/envConsts';
import storageAPI from './storageAPI';
import { uiAPI } from './uiAPI';
import firebaseAPI from './firebaseAPI';

class fetchTMDBAPI {
  constructor() {
    this.axiosTMDB = axios.create({
      baseURL: 'https://api.themoviedb.org/3/',
      params: {
        api_key: TMDB_KEY,
        include_adult: false,
      },
    });
    this.filterParams = {
      sort_by: 'vote_count.desc',
      ['vote_count.gte']: 10,
    };
  }
  async fetchPopular(page = 1) {
    uiAPI.showLoadingInfo();
    const arrFetch = [
      this.axiosTMDB.get('trending/movie/week', {
        params: { page, language: 'uk' },
      }),
      this.axiosTMDB.get('trending/movie/week', {
        params: { page, language: 'en' },
      }),
    ];
    const arrResponse = await Promise.all(arrFetch);
    const { data } = arrResponse[0];
    data.en = arrResponse[1].data;
    uiAPI.hideLoadingInfo();
    return data;
  }
  async fetchSomethingToWatch() {
    uiAPI.showLoadingInfo();
    let page;
    const arrFetch = [];
    for (let i = 1; i <= 2; i += 1) {
      page = i;
      arrFetch.push(
        this.axiosTMDB.get('discover/movie', {
          params: {
            page,
            language: 'uk',
            sort_by: 'vote_count.desc',
            with_genres: '28',
          },
        }),
        this.axiosTMDB.get('discover/movie', {
          params: {
            page,
            language: 'en',
            sort_by: 'vote_count.desc',
            with_genres: '28',
          },
        }),
        this.axiosTMDB.get('discover/movie', {
          params: {
            page,
            language: 'uk',
            sort_by: 'vote_count.desc',
            with_genres: '12',
          },
        }),
        this.axiosTMDB.get('discover/movie', {
          params: {
            page,
            language: 'en',
            sort_by: 'vote_count.desc',
            with_genres: '12',
          },
        }),
        this.axiosTMDB.get('discover/movie', {
          params: {
            page,
            language: 'uk',
            sort_by: 'vote_count.desc',
            with_genres: '16',
          },
        }),
        this.axiosTMDB.get('discover/movie', {
          params: {
            page,
            language: 'en',
            sort_by: 'vote_count.desc',
            with_genres: '16',
          },
        }),
        this.axiosTMDB.get('discover/movie', {
          params: {
            page,
            language: 'uk',
            sort_by: 'vote_count.desc',
            with_genres: '35',
          },
        }),
        this.axiosTMDB.get('discover/movie', {
          params: {
            page,
            language: 'en',
            sort_by: 'vote_count.desc',
            with_genres: '35',
          },
        }),
        this.axiosTMDB.get('discover/movie', {
          params: {
            page,
            language: 'uk',
            sort_by: 'vote_count.desc',
            with_genres: '80',
          },
        }),
        this.axiosTMDB.get('discover/movie', {
          params: {
            page,
            language: 'en',
            sort_by: 'vote_count.desc',
            with_genres: '80',
          },
        }),
        this.axiosTMDB.get('discover/movie', {
          params: {
            page,
            language: 'uk',
            sort_by: 'vote_count.desc',
            with_genres: '99',
          },
        }),
        this.axiosTMDB.get('discover/movie', {
          params: {
            page,
            language: 'en',
            sort_by: 'vote_count.desc',
            with_genres: '99',
          },
        }),
        this.axiosTMDB.get('discover/movie', {
          params: {
            page,
            language: 'uk',
            sort_by: 'vote_count.desc',
            with_genres: '18',
          },
        }),
        this.axiosTMDB.get('discover/movie', {
          params: {
            page,
            language: 'en',
            sort_by: 'vote_count.desc',
            with_genres: '18',
          },
        }),
        this.axiosTMDB.get('discover/movie', {
          params: {
            page,
            language: 'uk',
            sort_by: 'vote_count.desc',
            with_genres: '10751',
          },
        }),
        this.axiosTMDB.get('discover/movie', {
          params: {
            page,
            language: 'en',
            sort_by: 'vote_count.desc',
            with_genres: '10751',
          },
        }),
        this.axiosTMDB.get('discover/movie', {
          params: {
            page,
            language: 'uk',
            sort_by: 'vote_count.desc',
            with_genres: '14',
          },
        }),
        this.axiosTMDB.get('discover/movie', {
          params: {
            page,
            language: 'en',
            sort_by: 'vote_count.desc',
            with_genres: '14',
          },
        }),
        this.axiosTMDB.get('discover/movie', {
          params: {
            page,
            language: 'uk',
            sort_by: 'vote_count.desc',
            with_genres: '36',
          },
        }),
        this.axiosTMDB.get('discover/movie', {
          params: {
            page,
            language: 'en',
            sort_by: 'vote_count.desc',
            with_genres: '36',
          },
        }),
        this.axiosTMDB.get('discover/movie', {
          params: {
            page,
            language: 'uk',
            sort_by: 'vote_count.desc',
            with_genres: '9648',
          },
        }),
        this.axiosTMDB.get('discover/movie', {
          params: {
            page,
            language: 'en',
            sort_by: 'vote_count.desc',
            with_genres: '9648',
          },
        }),
        this.axiosTMDB.get('discover/movie', {
          params: {
            page,
            language: 'uk',
            sort_by: 'vote_count.desc',
            with_genres: '10749',
          },
        }),
        this.axiosTMDB.get('discover/movie', {
          params: {
            page,
            language: 'en',
            sort_by: 'vote_count.desc',
            with_genres: '10749',
          },
        }),
        this.axiosTMDB.get('discover/movie', {
          params: {
            page,
            language: 'uk',
            sort_by: 'vote_count.desc',
            with_genres: '878',
          },
        }),
        this.axiosTMDB.get('discover/movie', {
          params: {
            page,
            language: 'en',
            sort_by: 'vote_count.desc',
            with_genres: '878',
          },
        }),
        this.axiosTMDB.get('discover/movie', {
          params: {
            page,
            language: 'uk',
            sort_by: 'vote_count.desc',
            with_genres: '53',
          },
        }),
        this.axiosTMDB.get('discover/movie', {
          params: {
            page,
            language: 'en',
            sort_by: 'vote_count.desc',
            with_genres: '53',
          },
        }),
        this.axiosTMDB.get('discover/movie', {
          params: {
            page,
            language: 'uk',
            sort_by: 'vote_count.desc',
            with_genres: '10752',
          },
        }),
        this.axiosTMDB.get('discover/movie', {
          params: {
            page,
            language: 'en',
            sort_by: 'vote_count.desc',
            with_genres: '10752',
          },
        })
      );
    }

    const arrResponse = await Promise.all(arrFetch);
    const data = { uk: {}, en: {} };
    arrResponse.forEach((response, i) => {
      if (i % 2 === 0) {
        //uk
        const filtered = response.data.results.filter(movieInfo => !data.uk[movieInfo.id]);
        filtered.forEach(movieInfo => (data.uk[movieInfo.id] = movieInfo));
      } else {
        //en
        const filtered = response.data.results.filter(movieInfo => !data.en[movieInfo.id]);
        filtered.forEach(movieInfo => (data.en[movieInfo.id] = movieInfo));
      }
    });
    const keys = Object.keys(data.uk);
    keys.forEach(key => {
      if (data.en[key]) {
        data.uk[key].en = data.en[key];
      }
    });
    uiAPI.hideLoadingInfo();
    // console.log(data);
    return data.uk;
  }
  async fetchId(movie_id) {
    uiAPI.showLoadingInfo();
    const arrFetch = [
      this.axiosTMDB.get(`movie/${movie_id}`, {
        params: { language: 'uk' },
      }),
      this.axiosTMDB.get(`movie/${movie_id}`, {
        params: { language: 'ru' },
      }),
      this.axiosTMDB.get(`movie/${movie_id}`, {
        params: { language: 'en' },
      }),
      this.axiosTMDB.get(`movie/${movie_id}/videos`, {
        params: { language: 'en' },
      }),
    ];
    const arrResponse = await Promise.all(arrFetch);
    const { data } = arrResponse[0];
    data.ru = arrResponse[1].data;
    data.en = arrResponse[2].data;
    data.videos = arrResponse[3].data?.results;
    uiAPI.hideLoadingInfo();
    return data;
  }

  async fetchSearch(query = '', page = 1) {
    uiAPI.showLoadingInfo();

    const { data } = await this.axiosTMDB.get('search/movie', {
      params: { page, query, language: 'uk' },
    });
    uiAPI.hideLoadingInfo();
    return data;
  }
  async fetchFiltered(page = 1) {
    uiAPI.showLoadingInfo();
    const filters = storageAPI.load('filters');
    const newFilters = {};
    filters.forEach(filter => {
      const [filterName, filterValue] = Object.entries(filter)[0];
      newFilters[filterName] = filterValue;
    });
    const { data } = await this.axiosTMDB.get('discover/movie', {
      params: { page, language: 'uk', ...this.filterParams, ...newFilters },
    });
    uiAPI.hideLoadingInfo();
    return data;
  }
}

class fetchYT {
  constructor() {
    this.axiosTMDB = axios.create({
      baseURL: 'https://www.googleapis.com/youtube/v3/search',
      params: {
        part: 'snippet',
        type: 'video',
      },
    });
  }
  async fetchYTSearch(q) {
    const { data } = await this.axiosTMDB.get('', {
      params: { q, key: firebaseAPI.instance.apiKey },
    });
    return data;
  }
}

class fetchGoogle {
  constructor() {
    this.axiosTMDB = axios.create({
      baseURL: 'https://www.googleapis.com/customsearch/v1',
      params: {
        cx: GOOGLE_SEARCH_KEY,
      },
    });
  }
  async fetchGoogleSearch(q) {
    const { data } = await this.axiosTMDB.get('', {
      params: { q, key: firebaseAPI.instance.apiKey },
    });
    return data;
  }
}

const instance = new fetchTMDBAPI();
const instanceYT = new fetchYT();
const instanceGoogle = new fetchGoogle();

export default {
  instance,
  instanceYT,
  instanceGoogle,
};
