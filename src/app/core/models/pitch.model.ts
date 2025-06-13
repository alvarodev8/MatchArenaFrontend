import { Establishment } from './establishment.model';

export interface Pitch {
    id: number;
    name: string;
    location: string;
    price: number;
    description: string;
    establishment?: Establishment;
    deleted_at?: Date;
}