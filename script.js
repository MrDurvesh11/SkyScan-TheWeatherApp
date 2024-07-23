const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userWeather = document.querySelector(".weather-container");
const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector(".form-container");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");
const currentTab = userTab;

let oldTab = userTab;
const API_Key = "eb27f1a52ef4312eb4c2980a1833d852";
currentTab.classList.add("current-tab");
getfromSessionStorage();

function switchTab(newTab)
{
    if(newTab != oldTab)
    {
        oldTab.classList.remove("current-tab");
        oldTab = newTab;
        oldTab.classList.add("current-tab");
        if(!searchForm.classList.contains("active"))
        {
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }
        else{
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            getfromSessionStorage();
        }

    }

}

userTab.addEventListener("click", () => {
    switchTab(userTab);
});

searchTab.addEventListener("click", () => {
    switchTab(searchTab);
});

function getfromSessionStorage(){
    const localCoordinates=sessionStorage.getItem("user-cordinates");
    if(!localCoordinates){
        grantAccessContainer.classList.toggle("active");
    }
    else{
        const coordinates = JSON.parse(localCoordinates);
        fetchWeather(coordinates.lat, coordinates.lon);
    }
}

async function fetchWeather(lat,lan){
    grantAccessContainer.classList.remove("active");
    loadingScreen.classList.add("active");
    
    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lan}&appid=${API_Key}&units=metric`);
        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeather(data);
    }
    catch(error){
        loadingScreen.classList.remove("active");
        console.log("Error: ", error);
    }
}

function renderWeather(weatherInfo){
    const cityname = document.querySelector("[data-cityName]");
    const icon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windSpeed = document.querySelector("[data-windSpeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-clundiness]");

    cityname.innerHTML=weatherInfo?.name;
    icon.src='https://flagcdn.com/144x108/'+weatherInfo?.sys?.country.toLowerCase()+'.png';
    desc.innerHTML=weatherInfo?.weather?.[0]?.description;
    weatherIcon.src='https://openweathermap.org/img/wn/'+weatherInfo?.weather?.[0]?.icon+'.png';
    temp.innerHTML=weatherInfo?.main?.temp+'°C';
    windSpeed.innerHTML=weatherInfo?.wind?.speed+'m/s';
    humidity.innerHTML=weatherInfo?.main?.humidity+'%';
    cloudiness.innerHTML=weatherInfo?.clouds?.all+'%';
}


function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        alert("Geolocation is not supported by this browser.");
    }
}

function showPosition(position){
    const coordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude
    }
    sessionStorage.setItem("user-cordinates", JSON.stringify(coordinates));
    fetchWeather(coordinates.lat, coordinates.lon);
}

const grantacessbtn = document.querySelector("[data-grantAccess]");
grantacessbtn.addEventListener("click",getLocation);

const searchInput = document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const city = searchInput.value;
   if(city === ""){
         alert("Please enter a city name");
         return;
    }
    else{
        fetchWeatherByCity(city);
    }
});

async function fetchWeatherByCity(city){
    try{
        loadingScreen.classList.add("active");
        
        userInfoContainer.classList.remove("active");
        grantacessbtn.classList.remove("active");

        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_Key}&units=metric`);
        const data = await response.json();
        loadingScreen.classList.remove("active");
        if(data.cod === "404"){
            alert("City not found");
            userInfoContainer.classList.remove("active");
            return;
        }
        else{
            userInfoContainer.classList.add("active");
           
            renderWeather(data);
        }
    }
    catch(error){
        userInfoContainer.classList.remove("active");
    }
}

