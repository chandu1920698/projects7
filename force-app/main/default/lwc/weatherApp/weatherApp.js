import { api, LightningElement } from 'lwc';
import WEATHER_ICONS from '@salesforce/resourceUrl/weatherAppIcons';
import getWeatherDetails from '@salesforce/apex/WeatherAppController.getWeatherDetails';



export default class WeatherApp extends LightningElement {

    clearIcon = WEATHER_ICONS + '/weatherAppIcons/clear.svg';
    cloudIcon = WEATHER_ICONS + '/weatherAppIcons/cloud.svg';
    dropletIcon = WEATHER_ICONS + '/weatherAppIcons/droplet.svg';
    mapIcon = WEATHER_ICONS + '/weatherAppIcons/map.svg';
    rainIcon = WEATHER_ICONS + '/weatherAppIcons/rain.svg';
    snowIcon = WEATHER_ICONS + '/weatherAppIcons/snow.svg';
    stormIcon = WEATHER_ICONS + '/weatherAppIcons/storm.svg';
    thermometerIcon = WEATHER_ICONS + '/weatherAppIcons/thermometer.svg';
    arrowBackIcon = WEATHER_ICONS + '/weatherAppIcons/arrow-back.svg';
    hazeIcon = WEATHER_ICONS + '/weatherAppIcons/haze.svg';

    cityName = '';
    // apiKey = API_KEY;
    loadingText = '';
    isError = false;
    response;
    weatherIcon;

    get loadingClass() {
        return this.isError ? 'error-message' : 'success-message';
    }

    handleSearch(event) {
        this.cityName = event.target.value;
    }

    handleSubmit(event) {
        event.preventDefault();
        this.fetchWeatherInfo();
    }

    fetchWeatherInfo() {
        this.isError = false;
        console.log("cityName -> " + this.cityName);
        this.loadingText = 'Fetching Weather Details...';

        getWeatherDetails({cityName : this.cityName})
        .then(data => {
            console.log("data -> " + JSON.stringify(data));
            this.loadingText = '';
            if(data == "") {
                this.isError = true;
                this.loadingText = 'Please enter a valid city name.';
            } else  {
                this.weatherDetails(JSON.parse(data));
            }
        })
        .catch(error => {
            console.log("error -> " + JSON.stringify(error));
            this.loadingText = 'Something went wrong.';
            this.isError = true;
        });
        // const url = `https://api.openweathermap.org/data/2.5/weather?q=${this.cityName}&appid=${this.apiKey}&units=metric`;

        // fetch(url)
        // .then(response => response.json())
        // .then(data => {
        //     console.log(data);
        //     this.loadingText = '';
        //     this.weatherDetails(data);
        // } )
        // .catch(error => {
            // console.log(error);
            // this.loadingText = 'Something went wrong.';
            // this.isError = true;
        // });
    }

    weatherDetails(details) {
        if(details == null || details == undefined || details == "" || details.cod == '404') {
            this.isError = true;
            this.loadingText = `${this.cityName} ${details.message}`;
        } else {
            this.loadingText = '';
            this.isError = false;

            const city = details.name;
            const country = details.sys.country;
            const {description, id} = details.weather[0];
            const {temp, feels_like, humidity} = details.main;
            
            if(id === 800) {
                this.weatherIcon = this.clearIcon;
            } else if((id >= 200 && id <= 232) || (id >= 600 && id <= 622)) {
                this.weatherIcon = this.stormIcon;
            } else if(id >= 701 && id <= 781) {
                this.weatherIcon = this.hazeIcon;
            } else if(id >= 801 && id <= 804) {
                this.weatherIcon = this.cloudIcon;
            } else if(id >= 500 && id <= 531 || (id >= 300 && id <= 321))  {
                this.weatherIcon = this.rainIcon;
            } else {

            }

            this.response = {
                city : city,
                temperature : Math.floor(temp),
                description : description,
                location : `${city}, ${country}`,
                humidity : `${humidity}%`,
                feels_like : Math.floor(feels_like),
            }

            console.log("this.response -> " + JSON.stringify(this.response));
        }
    }

    handleBackArrowClick() {
        this.response = null;
        this.cityName = '';
        this.isError = false;
        this.loadingText = '';
        this.weatherIcon = '';
    }
}