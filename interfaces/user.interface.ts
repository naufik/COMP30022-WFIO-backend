/**
 * This User interface is done in order to have a 'unified' type of
 * the Carer type and Elder type.
 */
export interface User {
    id: string | number,
    username?: string,
    password?: string,
    accountType?: "ELDER" | "CARER",
    content?: ElderData | CarerData, 
}

export interface ElderData {
    fullName: string,
    listCarers: User[],
}

export interface CarerData {
    fullName: string,
    listElders: User[]
}