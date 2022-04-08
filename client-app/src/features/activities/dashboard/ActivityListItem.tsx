import { format } from "date-fns";
import { observer } from "mobx-react-lite";
import React, { SyntheticEvent, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Icon, Item, Label, Segment } from "semantic-ui-react";
import { useStore } from "../../../app/stores/store";
import { Activity } from "../../../models/activity";
import ActivityListItemAttendee from "./ActivityListItemAttendee";


interface Props {
    activity: Activity
}

export default observer(function ActivityListItem({activity}: Props){
    const {activityStore} = useStore();
    const { deleteActivty, loading} = activityStore;
    const [target, setTarget] = useState('');

    function handleActivityDelete(e: SyntheticEvent<HTMLButtonElement>, id: string){
        setTarget(e.currentTarget.name)
        deleteActivty(id);
    }
    return (

    <Segment.Group>
        <Segment>
            <Item.Group>
                <Item>
                    <Item.Image size = 'tiny' circular src= {activity.host?.image || '/assets/user.png'}/>
                    <Item.Content>
                        <Item.Header as = {Link} to = {`/activities/${activity.id}`} >
                            {activity.title}
                        </Item.Header>
                        <Item.Description>Hosted by <Link to ={`/profiles/${activity.hostUsername}`}>{activity.hostUsername}</Link> </Item.Description>
                        {activity.isHost &&(
                            <Item.Description>
                                <Label basic color="orange">
                                    You are hosting this activity
                                </Label>
                            </Item.Description>
                        )}
                         {activity.isGoing && !activity.isHost && (
                            <Item.Description>
                                <Label basic color='green'>
                                    You are going this activity
                                </Label>
                            </Item.Description>
                        )}
                    </Item.Content>
                </Item>
            </Item.Group>
        </Segment>
        <Segment secondary>
            <ActivityListItemAttendee attendees={activity.attendees!}/>
        </Segment>
        <Segment>
            <span>
                <Icon name = 'clock'/> {format(activity.date!, 'dd MMM yyy h:mm aa')}
                <Icon name = 'clock'/> {activity.venue}
            </span>
        </Segment>
        <Segment clearing>
            <span>{activity.description}</span>
            <Button as = {Link} to = {`/activities/${activity.id}`} floated="right" content='view' color='teal'/>
        </Segment>
    </Segment.Group>
)})
