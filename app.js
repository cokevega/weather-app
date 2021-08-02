const { inquirerMenu, pause, readInput, listPlaces } = require('./helpers/inquirer');
require('dotenv').config();
const Queries = require('./models/queries');

const main = async() => {
    let opt;
    const queries = new Queries();
    do {
        opt = await inquirerMenu();
        switch (parseInt(opt)) {
            case 1:
                const place = await readInput('Lugar: ');
                const places = await queries.city(place);
                const id = await listPlaces(places);
                if (id === '0') continue;
                const placeSelected = places.find(place => place.id === id);
                queries.addHistory(placeSelected.name);
                const weather = await queries.weather(placeSelected.lat, placeSelected.lng);
                console.log('Información del lugar:\n'.green);
                console.log('Ciudad: ', placeSelected.name.green);
                console.log('Latitud: ', placeSelected.lat);
                console.log('Longitud: ', placeSelected.lng);
                console.log('Temperatura: ', weather.temp);
                console.log('Temperatura mínima: ', weather.min);
                console.log('Temperatura máxima: ', weather.max);
                console.log('Descripción: ', weather.desc.green);
                break;
            case 2:
                if (queries.history.length > 0) {
                    queries.history.forEach((place, index) => {
                        const idx = `${index+1}. `.green;
                        console.log(`${idx}${place}`);
                    });
                } else console.log('Historial vacío');
                break;
            default:
                break;
        }
        if (opt != 3) await pause();
    } while (opt != 3)
}

main();