import { observer } from "mobx-react-lite";
import React from "react";
import { Link } from "react-router-dom";
import { List, Image, Popup } from "semantic-ui-react";
import { Profile } from "../../../models/profile";
import ProfileCard from "../../profiles/ProfileCard";
interface Props{
    attendees: Profile[];
}

export default observer(function ActivityListItemAttendee({attendees}: Props){
    const styles = {
        borderColor: 'orange',
        borderWidth: 3
    }
    return(
        <List horizontal>
            {attendees.map(attendee => (
                <Popup hoverable key={attendee.displayName} trigger = {
                    <List.Item key= {attendee.displayName} as = {Link} to = {`/profiles/${attendee.userName}`}>
                        <Image size ='mini' circular src = { attendee.image || '/assets/user.png'} bordered  style={attendee.following ? styles: null}/>
                    </List.Item>
                }>
                   <Popup.Content>
                       <ProfileCard profile={attendee}/>
                   </Popup.Content>
                </Popup>
                
            ))}

        </List>
    )
});