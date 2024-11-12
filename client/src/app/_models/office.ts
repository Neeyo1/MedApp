import { Member } from "./member";

export interface Office{
    id: number;
    name: string;
    city: string;
    street: string;
    apartment: string;
    mondayHours: number[];
    TuesdayHours: number[];
    WednesdayHours: number[];
    ThursdayHours: number[];
    FridayHours: number[];
    SaturdayHours: number[];
    SundayHours: number[];
    createdAt: Date;
    doctor: Member;
}
