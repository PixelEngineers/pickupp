export type User = {
    id: string;
    name: string;
    driver: boolean;
}

export enum Station {
    A = "A",
    B = "B",
    C = "C",
    D = "D",
    EGIN = "EGIN",
    H = "H",
    J = "J",
    K = "K",
    L = "L",
    M = "M",
    O = "O",
    PG = "PG",
    Q = "Q",
    FRF_FRG = "FRF/FRG",
    Bblk = "Bblk",
    Cblk = "Cblk",
    Dblk = "Dblk",
    Gblk = "Gblk",
    Cos = "Cos",
    Tan = "Tan",
    MainAudi = "MainAudi",
    Nirvana = "Nirvana",
    Dispen = "Dispen",
    MainGate = "MainGate",
    Sports = "Sports",
    Guest = "Guest",
    TSLAS = "TSLAS",
    Admin = "Admin",
    LT = "LT",
    Mechanical = "Mechanical",
}

export function mapName(station: Station): string {
    switch (station) {
        case Station.A:
            return "Hostel A";
        case Station.B:
            return "Hostel B";
        case Station.C:
            return "Hostel C";
        case Station.D:
            return "Hostel D";
        case Station.EGIN:
            return "Hostel EGIN";
        case Station.H:
            return "Hostel H";
        case Station.J:
            return "Hostel J";
        case Station.K:
            return "Hostel K";
        case Station.L:
            return "Hostel L";
        case Station.M:
            return "Hostel M";
        case Station.O:
            return "Hostel O";
        case Station.PG:
            return "Hostel PG";
        case Station.Q:
            return "Hostel Q";
        case Station.FRF_FRG:
            return "Hostel FRF/FRG";
        case Station.Bblk:
            return "Block B";
        case Station.Cblk:
            return "Block C";
        case Station.Dblk:
            return "Block D";
        case Station.Gblk:
            return "Block G";
        case Station.Cos:
            return "Cos";
        case Station.Tan:
            return "Tan";
        case Station.MainAudi:
            return "Main Auditorium";
        case Station.Nirvana:
            return "Nirvana";
        case Station.Dispen:
            return "Dispensary";
        case Station.MainGate:
            return "Main Gate";
        case Station.Sports:
            return "Sports Complex";
        case Station.Guest:
            return "Guest House";
        case Station.TSLAS:
            return "TSLAS Block";
        case Station.Admin:
            return "Admin Block";
        case Station.LT:
            return "LT Block";
        case Station.Mechanical:
            return "Mechanical Workshop";
    }
}

export function mapNames(stations: Station[], keys: string[]): {
    label: string;
    value: string;
}[] {
    return stations.map((station, index) => ({
        label: mapName(station),
        value: keys[index]
    }));
}

export type Booking = {
    requester: User;
    station: Station;
    expiryTimestamp: number;
}