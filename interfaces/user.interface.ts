/**
 * This User interface is done in order to have a 'unified' type of
 * the Carer type and Elder type.
 */
export interface User {
    id: string | number,
    username?: string,
    email?: string,
    password?: string,
    fullName?: string,
    accountType?: "ELDER" | "CARER",
    connections: User[],
    content?: ElderData | CarerData, 
}

export interface Credentials {
    username: string,
    password: string,
}

export interface ElderData {
    fullName: string,
    listCarers: User[],
    favorites: any[],
}

export interface CarerData {
    fullName: string,
    listElders: User[],
}

export interface NewUser {
    id?: string | number,
    username: string,
    email: string
    fullName: string,
    password: string,
    accountType: "ELDER" | "CARER",
}