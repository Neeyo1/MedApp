import { ProfilePhoto } from "./profilePhoto";

export interface User{
    id: number;
    username: string;
    firstName: string;
    lastName: string;
    token: string;
    profilePhotoUrl?: string;
    profilePhotos: ProfilePhoto[];
}
