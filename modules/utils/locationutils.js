'use strict';

const GoogleMapsAPI = require('googlemaps');
const config = {
    key: 'AIzaSyBnsCuuS0N0Akc1I3WEifbNoBCQ1iZ4a9g', //Não tente usar a chave, ela só aceita requests do meu server =)
    secure: true
}

if (process.env.proxy) config.proxy = process.env.proxy;

const api = new GoogleMapsAPI(config);
const mapsBaseUrl = 'https://www.google.com.br/maps/place/';

const getStaticMap = (name, lat, lng) => {
    let params = {
        center: `${lat},${lng}`,
        zoom: 15,
        size: '500x400',
        maptype: 'roadmap',
        style: {
            feature: 'road',
            element: 'all'
        },
        markers: [
            {
                location: `${lat},${lng}`,
                label: name,
                color: 'green',
                shadow: true
            }
        ]
    }

    return api.staticMap(params);
}

module.exports = {
    getStaticMap,
    mapsBaseUrl
}