import axios from 'axios';
const API_KEY = '37475907-c242f021b93093dc80b059dca';
const BASE_URL = 'https://pixabay.com/api/';

export async function fetchImages(searchQuery, page, perPage) {
  const response = await axios.get(
    `${BASE_URL}?key=${API_KEY}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`
  );
  const { hits, totalHits } = response.data;
  return { hits, totalHits };
}