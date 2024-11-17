import { Member } from "./member";
import { Office } from "./office";

export interface AppointmentDetailed{
    id: number;
    dateStart: Date;
    dateEnd: Date;
    isOpen: boolean;
    hasEnded: boolean;
    patient?: Member;
    office: Office;
}
