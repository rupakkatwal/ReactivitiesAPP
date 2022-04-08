import { observer } from "mobx-react-lite";
import { SyntheticEvent } from "react";
import { Button, Reveal } from "semantic-ui-react";
import { useStore } from "../../app/stores/store";
import { Profile } from "../../models/profile";

interface Props{
    profile: Profile
}
export default observer(function FollowButton({profile}: Props){
    const{profileStore, userStore} = useStore();
    const{updateFollowing, loading} = profileStore;

    if(userStore.user?.userName === profile.userName) return null;

    function handleFollow(e: SyntheticEvent, userName:string){
        e.preventDefault()
        profile.following ? updateFollowing(userName,false) : updateFollowing(userName, true)

    }
    return(
        <Reveal animated="move">
            <Reveal.Content visible style={{width:'100%'}}>
                {console.log(profile.following)}
                <Button fluid color="teal" content={profile.following ? 'Following' : 'Not following'}/>
            </Reveal.Content>
            <Reveal.Content hidden style={{width:'100%'}}>
                <Button fluid basic
                color= {profile.following ? 'red': 'green'}
                content= {profile.following  ? 'Unfollow': 'Follow'}
                onClick = {(e) => handleFollow(e,profile.userName)}
                />
                
            </Reveal.Content>
     </Reveal>
    )
})