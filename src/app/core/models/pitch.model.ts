import { Establishment } from './establishment.model';

export interface Pitch {
    id: number;
    name: string;
    location: string;
    establishment?: Establishment;
}