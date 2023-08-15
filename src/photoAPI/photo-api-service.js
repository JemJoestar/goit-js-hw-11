import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '38816166-f921759e60a0931b2b81a2c9d';

export async function searchPhotos(request, page) {
  const response = await axios({
    url: BASE_URL,
    params: {
      key: API_KEY,
      q: request,
      per_page: 40,
      page: page,
      orientation: 'horizontal',
    },
  });
  return response.data
}

/*

export default class ApiService {
  #BASE_URL = 'https://pixabay.com/api/';
  #API_KEY = '38816166-f921759e60a0931b2b81a2c9d';
  constructor(){
    this.page = 1
    this.per_page = 40
  }
  request = ""
  async searchPhotos(){
    const options = {
        url: `${this.#BASE_URL}`,
        params: {
            key: this.#API_KEY,
            q: this.request,
            per_page: this.per_page,
            page: this.page++,
            orientation: "horizontal"
        }
    }
    return await axios(options).then(photos => photos.data)
  }

  set request(newRequest){
    this.request = newRequest
    this.page = 1
  }
}
*/
