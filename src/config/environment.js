"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var table_1 = require("./table");
window['IPS'] = 'http://192.168.1.210:9009';
exports.ENV = {
    MODAL: null,
    PRODUCTION: false,
    API_URL: 'dev.local',
    WINDOW_WIDTH: window.document.documentElement.getBoundingClientRect().width,
    WEB_URL: window['IPS'] + "/api/platapi/",
    OTHER_API: window['IPS'] + "/api/AppUser/",
    IMG_URL: "" + window['IPS'],
    LOCAL_IMG_URL: 'file:///storage/emulated/0/Android/data/com.realidfarm.impicc/cache/',
    USER: JSON.parse(localStorage.getItem('user')) || null,
    JURISDICTION: JSON.parse(localStorage.getItem('jurisdiction')) || [],
    IN_FRAM_MESSAGE: JSON.parse(localStorage.getItem('in_farm_message')) || [],
    DATA_TABLE: table_1.DATA_TABLE
};
