import Notiflix from 'notiflix';
export { fetchBreeds, fetchCatByBreed };

function fetchBreeds(errorMessage) {
    let urlBreeds = 'https://api.thecatapi.com/v1/breeds';
    return fetch(urlBreeds)
    .then(response => {
        if (!response.ok) {
          throw new Error(response.status);
        }
        return response.json();
      })
};

function getCat(breedId) {
    const BASE_URL = 'https://api.thecatapi.com/v1/images/search?';
    const API_KEY = 'live_anumGhryRDvoofU1ZIrUXAuBoVsYwyaTG1w7bMxrAubCQjWfmpVoZ5hwpkuB6cym';
    const params = new URLSearchParams({
        breed_ids: breedId,
        api_key: API_KEY,
    });
    return BASE_URL + params.toString();
}

function fetchCatByBreed(breedId) {
    const urlBreed = getCat(breedId);
    return fetch(urlBreed)
    .then(response => {
        if (!response.ok) {
          throw new Error(response.status);
          
        }
        return response.json();
      })
    }