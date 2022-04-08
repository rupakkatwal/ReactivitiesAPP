import { profile } from "console";
import { createContext, useContext } from "react";
import ActivityStore from "./activtityStore";
import CommentStore from "./commentStore";
import modalStore from "./modalStore";
import ProfileStore from "./profileStore";
import UserStore from "./userStore";

interface Store{
    activityStore: ActivityStore
    userStore: UserStore
    modalStore: modalStore
    profileStore: ProfileStore
    commentStore: CommentStore
}

export const store: Store = {
    activityStore: new ActivityStore(),
    userStore: new UserStore(),
    modalStore: new modalStore(),
    profileStore: new ProfileStore(),
    commentStore: new CommentStore()

}

export const StoreContext =  createContext(store);

export function useStore(){
    return useContext(StoreContext);
}