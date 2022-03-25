import React from "react";
import { Button, Card, Icon, Image } from "semantic-ui-react";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { useStore } from "../../../app/stores/store";
import { Activity } from "../../../models/activity";

export default function ActivityList(){
    const {activityStore} = useStore();
    const{selectedActivity: activity,openForm, cancelSelectedActivity } = activityStore;
    if(!activity) return <LoadingComponent/>
    return(
        <Card fluid>
            <Image src = {`/assets/categoryImages/${activity.category}.jpg`}/>
            <Card.Content>
            <Card.Header>{activity.title}</Card.Header>
            <Card.Meta>
                <span className='date'>{activity.date}</span>
            </Card.Meta>
            <Card.Description>
               {activity.description}
            </Card.Description>
            </Card.Content>
            <Card.Content extra>
                <Button.Group widths= '2'>
                    <Button onClick={() => {openForm(activity.id)}} basic color="blue" content = "Edit"/>
                    <Button onClick={cancelSelectedActivity} color="grey" content = "Cancel"/>
                </Button.Group>
            </Card.Content>
        </Card>
    )
}