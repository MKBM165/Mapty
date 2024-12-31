'use strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

class Workout {
  date = new Date();
  id = (Date.now() + '').slice(-10);
  constructor(coords, duration, distance) {
    this.coords = coords;
    this.duration = duration;
    this.distance = distance;
  }
}
class Running extends Workout {
  constructor(coords, duration, distance, cadence) {
    super(coords, duration, distance);
    this.cadence = cadence;
    this.calcPace();
  }
  calcPace() {
    //km/min
    this.pace = this.duration / this.distance;
    return this.pace;
  }
}
class Cycling extends Workout {
  constructor(coords, duration, distance, elevationGain) {
    super(coords, duration, distance);
    this.elevationGain = elevationGain;
    this.calcSpeed();
  }
  calcSpeed() {
    //km/h
    this.speed = this.duration / (this.distance / 60);
    return this.speed;
  }
}
class App {
  //private fields
  #map;
  #mapEvent;
  constructor() {
    this._getPosition();
    form.addEventListener('submit', this._newWorkout.bind(this));
    inputType.addEventListener('change', this._toggleElevationField);
  }
  _getPosition() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        this._loadMap.bind(this),
        function () {
          alert('Could not get your location');
        }
      );
    }
  }
  _loadMap(position) {
    const { latitude } = position.coords;
    const { longitude } = position.coords;
    const coords = [latitude, longitude];
    // console.log(`https://www.google.com/maps/@${latitude},${longitude}`);
    this.#map = L.map('map').setView(coords, 15);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);
    this.#map.on('click', this._showForm.bind(this));
  }
  _showForm(mapE) {
    this.#mapEvent = mapE;
    form.classList.remove('hidden');
    inputDistance.focus();
  }
  _toggleElevationField() {
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
  }
  _newWorkout(e) {
    e.preventDefault();
    //get data from form
    const type = inputType.value;
    const distance = +inputDistance.value;
    const duration = +inputDuration.value;

    //if workout is running create running object
    if (type === 'running') {
      const cadence = +inputCadence.value;
      //check data
      if (
        !Number.isFinite(distance) ||
        !Number.isFinite(duration) ||
        !Number.isFinite(cadence) ||
        distance < 0 ||
        duration < 0
      )
        return alert('Inputs have to be positive Numbers');
    }
    //if workout is cycling create cycling object
    if (type === 'cycling') {
      const elevation = +inputElevation.value;
      //check data
      if (
        !Number.isFinite(distance) ||
        !Number.isFinite(duration) ||
        !Number.isFinite(elevation) ||
        distance < 0 ||
        duration < 0
      )
        return alert('Inputs have to be positive Numbers');
    }
    //render workout on map as marker
    const { lat, lng } = this.#mapEvent.latlng;
    L.marker([lat, lng])
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 200,
          minWidht: 100,
          autoClose: false,
          closeOnClick: false,
          className: 'running-popup',
        })
      )
      .setPopupContent('Workout')
      .openPopup();

    //clearing fields + hide form
    inputCadence.value =
      inputDistance.value =
      inputDuration.value =
      inputElevation.value =
        '';
    //adding marker
  }
}
const app = new App();
