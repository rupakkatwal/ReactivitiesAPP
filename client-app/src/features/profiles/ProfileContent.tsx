import { observer } from "mobx-react-lite";
import React from "react";
import { Grid, Tab } from "semantic-ui-react";
import { useStore } from "../../app/stores/store";
import { Profile } from "../../models/profile";
import ProfileAbout from "./ProfileAbout";
import ProfileActivity from "./ProfileActivity";
import ProfileFollowing from "./ProfileFollowing";
import ProfileHeader from "./ProfileHeader";
import ProfilePhotos from "./ProfilePhotos";

interface Props{
    profile: Profile
}

export default observer(function ProfileContent({profile}: Props){

    const{profileStore} = useStore();

    const panes = [
        {menuItem:'About', render:()=> <ProfileAbout/>},
        {menuItem:'Photos', render:()=> <ProfilePhotos profile = {profile}/>},
        {menuItem:'Events', render:()=> <ProfileActivity/>},
        {menuItem:'Followers', render:()=> <ProfileFollowing/>},
        {menuItem:'Following', render:()=> <ProfileFollowing/>}
    ]

    return (
        <Tab
            menu={{fluid: true, vertical: true}}
            menuPosition = 'right'
            panes={panes}
            onTabChange = {(e,data) => profileStore.setActiveTab(data.activeIndex)}
        />
    )
    
})