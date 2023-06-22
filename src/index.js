import SlimSelect from 'slim-select';
import Notiflix from 'notiflix';
import { fetchBreeds, fetchCatByBreed } from './cat-api.js';

const selectEl = document.querySelector('.breed-select');
const catInfoEl = document.querySelector('.cat-info');
const loaderEl = document.querySelector('.loader');
const errorMessage = document.querySelector('.error');
loaderEl.style.display = 'none';
errorMessage.style.display = 'none';

let breeds = [];

function takeBreeds(response) {
  const breedData = Object.values(response);
  breeds = breedData.map(breed => ({ name: breed.name, id: breed.id }));
}

function addBreeds() {
  fetchBreeds(errorMessage)
    .then(response => {
      takeBreeds(response);
   let listOfBreedsEl = breeds.map(element => `<option value="${element.id}">${element.name}</option>`).join("");
      selectEl.innerHTML = listOfBreedsEl;
      selectEl.append(...listOfBreedsEl);
    })
    .catch(error => {
      Notiflix.Notify.failure(errorMessage.textContent);
      loaderEl.style.display = 'none';
      selectEl.style.display = 'block';
    });
}

addBreeds();

function getElements(elements) {
  const name = elements[0].breeds[0].name;
  const description = elements[0].breeds[0].description;
  const temperament = elements[0].breeds[0].temperament;
  const image = elements[0].url;
  return { name: name, description: description, temperament: temperament, image: image };
}

function showBreed(returnedPromise) {
  const elements = getElements(returnedPromise);
  const { name, description, temperament, image } = elements;
  const markup = `<div class="container"><img src="${image}" alt="${name}" class="image"><div class="info"><h1 class="title">${name}</h1><p class="description">${description}</p><p class="temperament"><b class="title-temperament">Temperament: </b>${temperament}</p></div></div>`;
  catInfoEl.innerHTML = markup;
  loaderEl.style.display = 'none';
}

function onSelectChange(event) {
  const breedId = selectEl.options[selectEl.selectedIndex].value;
  selectEl.style.display = 'none';
  catInfoEl.style.display = 'none';
  loaderEl.style.display = 'block';
  fetchCatByBreed(breedId, errorMessage, loaderEl, selectEl)
    .then(returnedPromise => {
      showBreed(returnedPromise);
      catInfoEl.style.display = 'block';
      selectEl.style.display = 'block';
    })
    .catch(error => {
      Notiflix.Notify.failure(errorMessage.textContent);
      loaderEl.style.display = 'none';
      selectEl.style.display = 'block';
    });
}

new SlimSelect({
  select: '.select-breed'
});

selectEl.addEventListener('change', onSelectChange);