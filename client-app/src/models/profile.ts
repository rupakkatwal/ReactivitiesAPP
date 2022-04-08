
import { User } from "./users";

export interface Profile{
    userName: string;
    displayName: string;
    image?: string;
    bio?:string;
    followersCount:number;
    followingCount:number;
    following:boolean;
    photos?: Photo[];
}

export  class Profile implements Profile{
    constructor(user:User){
        this.userName = user.userName;
        this.displayName = user.userName;
        this.image = user.image;
    }
}

export interface Photo{
    id: string;
    url: string;
    isMain: boolean;
}