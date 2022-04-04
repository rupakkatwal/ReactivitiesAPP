import { observer } from "mobx-react-lite";
import React, { ChangeEvent, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button, Form, Segment } from "semantic-ui-react";
import { useStore } from "../../../app/stores/store";
import{v4 as uuid} from 'uuid';
import { useNavigate } from "react-router-dom";

export default observer(function ActivityForm(){
    const {activityStore} = useStore();
    const{createActivity, updateActivity, loadingIntial, loadActivity} = activityStore;
    const {id} = useParams<{id: string}>();
    const navigate =  useNavigate();
    const[activity, setActivity] = useState({
        id : '',
        title: '',
        category:'',
        description: '',
        date:'',
        city:'',
        venue:''
        
    });
    
    useEffect(() => {
      if(id) loadActivity(id).then(activity => setActivity(activity!))
    },[id, loadActivity])
    
    function handleSubmit(){
        if(activity.id.length === 0)
        {
            let newActivty =  {
                ...activity,
                id: uuid()
            }
           createActivity(newActivty).then(()=> navigate(`/activities/${newActivty.id}`))
        }
        else{
            updateActivity(activity).then(( )=> navigate(`/activities/${activity.id}`))
        }
    }
    function handleInputChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>)
    {
        const {name, value} = event.target;
        setActivity({...activity,[name]:value})
    }

    return(
        <Segment clearing>
            <Form onSubmit={handleSubmit} autoComplete = 'off'>
                <Form.Input placeholder = 'Title' value ={activity.title} name = 'title'onChange={handleInputChange}/>
                <Form.TextArea placeholder = 'Description' value ={activity.title} name = 'Description' onChange={handleInputChange}/>
                <Form.Input placeholder = 'Category' value ={activity.category} name = 'category' onChange={handleInputChange}/>
                <Form.Input type="date" placeholder = 'Date' value ={activity.date} name = 'date' onChange={handleInputChange}/>
                <Form.Input placeholder = 'City' value ={activity.city} name = 'city' onChange={handleInputChange}/>
                <Form.Input placeholder = 'Venue' value ={activity.venue} name = 'venue' onChange={handleInputChange}/>
                <Button floated="right" positive type="submit" content = "Submit"/>
                <Button  as = {Link}  to = '/activities' floated="right"  type="button" content = "Cancel"/>
            </Form>
        </Segment>
    )
}
)