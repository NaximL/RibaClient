import { PatchNoteSection } from "@screens/PatchNotes/PatchNotes";

export const ISPROD: boolean = true;

export const UPDATE_SCHEDULE: number = 0;

export const VERSION: string = `v1.8.4 ${ISPROD ? '' : 'dev'}`;

//https://fatsharkserv.online
//http://192.168.31.162

export const SERVER_URL: string =
    ISPROD ?
        "https://fatsharkserv.online" :
        'http://localhost';

export const patchNotes: PatchNoteSection[] = [
    {
        version: "1.8.4",
        data: [
            { text: "Виправлено помилку під час отримання домашнього завдання" },
            { text: "Оптимізовано логіку роботи з токенами та оновленням токенів" },
            { text: "Виправлено типізацію HomeWorkStore та логіку групування домашніх завдань по днях" },
            { text: "Виправлено відображення модального вікна домашнього завдання (FullScreenModal)" },
            { text: "Додано анімацію карток у HomeWork та Diary" },
            { text: "Покращено обробку HTML-контенту у домашніх завданнях" },
        ],
    },
    {
        version: "1.8.3",
        data: [
            { text: "Виправлено помилку під час отримання домашнього завдання" },
        ],
    },
    {
        version: "1.8.2",
        data: [
            { text: "Фікс бага стилів в патчноуті" },
            { text: "Фікс бага в патчноуті" },
        ],
    },
    {
        version: "1.8.1",
        data: [
            { text: "Фікс бага у щоденнику з відсутніми оцінками" },
            { text: "Фікс бага під час вибору домашнього завдання" },
            { text: "Додавання патчноута" },
            { text: "Додавання ще одного типу оцінок у щоденник: «Твір»" },
        ],
    },
];