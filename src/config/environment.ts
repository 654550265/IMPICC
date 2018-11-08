import { DATA_TABLE } from "./table";
import { SQLiteObject } from "@ionic-native/sqlite";

let database: SQLiteObject;

// window['IPS'] = 'http://192.168.1.210:9009';//本地调试地址
window["IPS"] = "https://picc.realidfarm.com";
export const ENV = {
    MODAL: null,
    PRODUCTION: false,
    API_URL: "dev.local",
    WINDOW_WIDTH: window.document.documentElement.getBoundingClientRect().width,
    WEB_URL: `${window["IPS"]}/api/platapi/`,
    WEB_URLs: `${window["IPS"]}/api/AppClaims/`,
    OTHER_API: `${window["IPS"]}/api/AppUser/`,
    IMG_URL: `${window["IPS"]}`,
    LOCAL_IMG_URL:
        "file:///storage/emulated/0/Android/data/com.realidfarm.impicc/cache/",
    USER: JSON.parse(localStorage.getItem("user")) || null,
    JURISDICTION: JSON.parse(localStorage.getItem("jurisdiction")) || [],
    IN_FRAM_MESSAGE: JSON.parse(localStorage.getItem("in_farm_message")) || [],
    GETAREATREE: JSON.parse(localStorage.getItem("GetAreaTree")) || [],
    ARBITRAL: JSON.parse(localStorage.getItem("arbitral")) || [],
    DIEMESSAGE: JSON.parse(localStorage.getItem("dieMessage")) || [],
    XZLIST: JSON.parse(localStorage.getItem("xzlist")) || [],
    VARITEY: JSON.parse(localStorage.getItem("varitey")) || [],
    DATA_TABLE: DATA_TABLE,
    DB: {
        database: database
    },
    RELATIONSHIPS: [
        { types: "1", name: "本人" },
        { types: "2", name: "管理" },
        { types: "3", name: "其他" }

    ],
    MANAGEMENTS: [
        { types: "1", name: "自办" },
        { types: "2", name: "代办" },
        { types: "3", name: "联办" }
    ],
    BREEDTYPES: [{ Id: 1, Name: "散养" }, { Id: 2, Name: "规模化养殖" }]
};
