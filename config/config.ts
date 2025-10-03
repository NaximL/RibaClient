import { PatchNoteSection } from "@screens/PatchNotes/PatchNotes";

export const ISPROD: boolean = true;

export const UPDATE_SCHEDULE: number = 0;

export const VERSION: string = `v1.8.1 ${ISPROD ? '' : 'dev'}`;

//https://fatsharkserv.online
//http://192.168.31.162

export const SERVER_URL: string =
    ISPROD ?
        "https://fatsharkserv.online" :
        'http://localhost';




export const patchNotes: PatchNoteSection[] = [
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