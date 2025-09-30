

async function main() {

    async function getWeather(latitude, longitude) {
        try {
            const response = await fetch("https://api.open-meteo.com/v1/forecast?latitude=" + latitude + "&longitude=" + longitude + "&current=temperature_2m,is_day,rain,snowfall,cloud_cover&forecast_days=1");
            return response.json();
        } catch (error) {
            console.error(error);

        } finally {

        }
    }

    async function getWeatherByName(town) {
        try {
            const response = await fetch("https://geocoding-api.open-meteo.com/v1/search?name=" + town + "&count=1&language=en&format=json");
            return response.json();
        } catch (error) {
            console.error(error);
        }
    }


    if ("geolocation" in navigator) {
        console.log("ca marche ");
        navigator.geolocation.getCurrentPosition(async (position) => {
            const meteo = await getWeather(position.coords.latitude, position.coords.longitude);
            console.log(meteo);
            showMeteo(meteo);
        });

    } else {
        console.log("marche pas");
    }


    const myLoc = document.querySelector("#myloc");
    myLoc.onclick = function (event) {
        if ("geolocation" in navigator) {
            console.log("ca marche ");
            navigator.geolocation.getCurrentPosition(async (position) => {
                const meteo = await getWeather(position.coords.latitude, position.coords.longitude);
                console.log(meteo);
                showMeteo(meteo);
                const nameTown = document.querySelector("h1");
                nameTown.textContent = "";
            });

        } else {
            console.log("marche pas");
        }
    }


    const searchPosition = document.querySelector("#position-form");
    searchPosition.addEventListener("submit", async function (event) {
        event.preventDefault();
        const formData = new FormData(searchPosition);
        const longitude = formData.get("longitude");
        const latitude = formData.get("latitude")
        const meteo = await getWeather(latitude, longitude);
        showMeteo(meteo);
        const nameTown = document.querySelector("h1");
        nameTown.textContent = "";

    })

    const searchTown = document.querySelector("#town-form");
    searchTown.addEventListener("submit", async function (event) {
        event.preventDefault();
        const formData = new FormData(searchTown);

        const nameTown = document.querySelector("h1");
        nameTown.textContent = formData.get("town");


        const weather = await getWeatherByName(formData.get("town"));
        const responses = weather.results;


        for (const response of responses) {
            const latitude = response.latitude;
            const longitude = response.longitude;
            const meteo = await getWeather(latitude, longitude)
            showMeteo(meteo);
        }
    });


    function showMeteo(meteo) {
        //recup ifno
        const temperature_2m = meteo.current.temperature_2m;
        const is_day = meteo.current.is_day;
        const rain = Number(meteo.current.rain);
        const cloud_cover = Number(meteo.current.cloud_cover);
        const snowfall = Number(meteo.current.snowfall);

        //recup html meteo 
        const meteoDiv = document.querySelector(".meteo");
        const temperatureDisplay = meteoDiv.querySelector("h3");
        const imgInfo = document.querySelector("#img-info")
        const body = document.querySelector("body");
        temperatureDisplay.textContent = temperature_2m;
        imgInfo.className = "";
        console.log(rain);
        console.log(cloud_cover);
        console.log(is_day);
        console.log(temperature_2m);
        if (rain >= 0.1) {
            imgInfo.classList.add("fa-cloud-rain")
            imgInfo.classList.add("fa-solid")
        } else if (cloud_cover > 20) {
            imgInfo.classList.add("fa-cloud")
            imgInfo.classList.add("fa-solid")
        } else if (snowfall > 0) {
            imgInfo.classList.add("fa-snowflake")
            imgInfo.classList.add("fa-solid")
        } else {
            imgInfo.classList.add("fa-sun")
            imgInfo.classList.add("fa-solid")
        }

        if (is_day === 1) {
            body.classList.add("day");
        } else {
            body.classList.add("night");
        }
    }










}

main();