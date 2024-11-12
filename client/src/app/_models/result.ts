import { Member } from "./member";
import { Office } from "./office";

export interface Result{
    id: number;
    name: string;
    description: string;
    createdAt: Date;
    patient: Member;
    office: Office;
}
