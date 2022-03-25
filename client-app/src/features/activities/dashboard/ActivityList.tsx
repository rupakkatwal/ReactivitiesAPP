import { observer } from "mobx-react-lite";
import React, { SyntheticEvent, useState } from "react";
import { Button, Item, Label, Segment } from "semantic-ui-react";
import { useStore } from "../../../app/stores/store";

export default observer(function ActivityList(){

    const {activityStore} = useStore();
    const {activities, deleteActivty, loading} = activityStore;
    const [target, setTarget] = useState('');

    function handleActivityDelete(e: SyntheticEvent<HTMLButtonElement>, id: string){
        setTarget(e.currentTarget.name)
        deleteActivty(id);
    }
   
    return(
        <Segment>
            <Item.Group>
                {activities.map(activity => (
                    <Item key = {activity.id}>
                        <Item.Content>
                            <p>it works</p>
                            <Item.Header as = 'a' >{activity.title}</Item.Header>
                            <Item.Meta>{activity.date}</Item.Meta>
                            <Item.Description>
                                <div>{activity.description}</div>
                                <div>{activity.city}</div>
                                <div>{activity.venue}</div>
                            </Item.Description>
                            <Item.Extra>
                                <Button onClick = {() => activityStore.selectActivity(activity.id)} floated="right" content='view' color='blue'/>
                                <Button name = {activity.id} loading = {loading && target === activity.id} onClick = {(e) => handleActivityDelete(e,activity.id)}floated="right" content='Delete' color='red'/>
                                <Label basic content ={activity.category}/>
                            </Item.Extra>
                        </Item.Content>
                        
                    </Item>
                ))}
            </Item.Group>
        </Segment>

    )
}
)