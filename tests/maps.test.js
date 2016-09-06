'use strict';

const GoogleMapsAPI = require('googlemaps');
const config = {
    key: 'AIzaSyBnsCuuS0N0Akc1I3WEifbNoBCQ1iZ4a9g', //Não tente usar a chave, ela só aceita requests do meu server =)
    secure: true,
    proxy: 'https://127.0.0.1:9090'
}

const g = new GoogleMapsAPI(config);

let params = {
    center: 'São Paulo',
    zoom: 20,
    size: '500x400',
    maptype: 'roadmap',
    style: {
        feature: 'road',
        element: 'all'
    },
    markers: [
        {
            location: 'São Paulo',
            label: 'A',
            color: 'green',
            shadow: true
        }
    ]
}

console.log(g.staticMap(params));