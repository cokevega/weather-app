const fs = require('fs');
const axios = require('axios').default;

class Queries {
    history = [];
    dbPath = './db/database.json';

    constructor() {
        this.readDb();
    }

    get paramsMapbox() {
        return {
            access_token: process.env.MAPBOX_KEY,
            limit: 5,
            language: 'es'
        };
    }

    get paramsWeather() {
        return {
            appid: process.env.OPENWEATHER_KEY,
            units: 'metric',
            lang: 'es'
        };
    }

    async city(place = '') {
        try {
            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${place}.json`,
                params: this.paramsMapbox
            });
            const resp = await instance.get();
            return resp.data.features.map(place => ({
                id: place.id,
                name: place.place_name,
                lng: place.center[0],
                lat: place.center[1]
            }));
        } catch (error) {
            return [];
        }
    }

    async weather(lat, lon) {
        try {
            const instance = axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather`,
                params: {...this.paramsWeather, lat, lon }
            });
            const resp = await instance.get();
            const { weather, main } = resp.data;
            return {
                desc: weather[0].description,
                min: main.temp_min,
                max: main.temp_max,
                temp: main.temp
            };
        } catch (error) {
            console.log(error);
        }
    }

    addHistory(place = '') {
        if (this.history.includes(place)) return;
        this.history.unshift(place);
        this.history = this.history.splice(0, 5);
        this.writeDb();
    }

    writeDb() {
        const payload = {
            history: this.history
        }
        fs.writeFileSync(this.dbPath, JSON.stringify(payload));
    }

    readDb() {
        if (fs.existsSync(this.dbPath)) {
            const data = fs.readFileSync(this.dbPath, { encoding: 'utf-8' });
            this.history = JSON.parse(data).history;
        }
    }

}

module.exports = Queries;