import React, { SyntheticEvent, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Item, Label, Segment } from "semantic-ui-react";
import { useStore } from "../../../app/stores/store";
import { Activity } from "../../../models/activity";

interface Props {
    activity: Activity
}

export default function ActivityListItem({activity}: Props){
    const {activityStore} = useStore();
    const { deleteActivty, loading} = activityStore;
    const [target, setTarget] = useState('');

    function handleActivityDelete(e: SyntheticEvent<HTMLButtonElement>, id: string){
        setTarget(e.currentTarget.name)
        deleteActivty(id);
    }
    return (
    // <Item key = {activity.id}>
    //     <Item.Content>
    //         <p>it works</p>
    //         <Item.Header as = 'a' >{activity.title}</Item.Header>
    //         <Item.Meta>{activity.date}</Item.Meta>
    //         <Item.Description>
    //             <div>{activity.description}</div>
    //             <div>{activity.city}</div>
    //             <div>{activity.venue}</div>
    //         </Item.Description>
    //         <Item.Extra>
    //             <Button as = {Link} to = {`/activities/${activity.id}`} floated="right" content='view' color='green'/>
    //             <Button name = {activity.id} loading = {loading && target === activity.id} onClick = {(e) => handleActivityDelete(e,activity.id)}floated="right" content='Delete' color='red'/>
    //             <Label basic content ={activity.category}/>
    //         </Item.Extra>
    //     </Item.Content>
    // </Item>

    <Segment.Group>
        <Segment>
            <Item.Group>
                <Item>
                    <Item.Image size = 'tiny' circular src= '/assets/user.png'/>
                    <Item.Content>
                        <Item.Header as = {Link} to = {`/activities/${activity.id}`} >
                            {activity.title}
                        </Item.Header>
                        <Item.Description>Hossted by Rupak</Item.Description>
                    </Item.Content>
                </Item>
            </Item.Group>
        </Segment>
        <Segment secondary>
            Attendes go here
        </Segment>
        <Segment clearing>
            <span>{activity.description}</span>
            <Button as = {Link} to = {`/activities/${activity.id}`} floated="right" content='view' color='teal'/>
        </Segment>
    </Segment.Group>
)}
