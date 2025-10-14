export const ISPROD: boolean = true;

export const UPDATE_SCHEDULE: number = 0;

export const VERSION: string = `v2.0.0 ${ISPROD ? '' : 'dev'}`;

//https://fatsharkserv.online
//http://192.168.31.162

export const SERVER_URL: string =
    ISPROD ?
        "https://fatsharkserv.online" :
        'http://localhost';
