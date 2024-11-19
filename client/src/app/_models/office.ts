import { Member } from "./member";

export interface Office{
    id: number;
    name: string;
    city: string;
    street: string;
    apartment: string;
    mondayHours: number[];
    tuesdayHours: number[];
    wednesdayHours: number[];
    thursdayHours: number[];
    fridayHours: number[];
    saturdayHours: number[];
    sundayHours: number[];
    createdAt: Date;
    doctor: Member;
}
