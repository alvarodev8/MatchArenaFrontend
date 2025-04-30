export interface Pitch {
    id: number;
    name: string;
    location: string;
}

export interface Fixture {
    id: number;
    opponent: string;
    date: string;
    pitch: Pitch;
}