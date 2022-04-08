import { observer } from "mobx-react-lite";
import React, { ChangeEvent, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button, Header, Segment } from "semantic-ui-react";
import { useStore } from "../../../app/stores/store";
import{v4 as uuid} from 'uuid';
import { useNavigate } from "react-router-dom";
import { Formik,Form,Field } from "formik";
import * as Yup from 'yup';
import MyTextInput from "../../../app/common/form/MyTextInput";
import MyTextArea from "../../../app/common/form/MyTextArea";
import MySelectInput from "../../../app/common/form/MySelectInput";
import { categoryOptions } from "../../../app/common/options/categoryOptions";
import MyDateInput from "../../../app/common/form/MyDateInput";
import { Activity, ActivityFormValues } from "../../../models/activity";

export default observer(function ActivityForm(){
    const {activityStore} = useStore();
    const{createActivity, updateActivity, loading, loadActivity} = activityStore;
    const {id} = useParams<{id: string}>();
    const navigate =  useNavigate();
    const[activity, setActivity] = useState<ActivityFormValues>(new ActivityFormValues());
    
    const validationSchema  =  Yup.object({
        title: Yup.string().required('The activity title is required'),
        description: Yup.string().required('The activity description is required'),
        date: Yup.string().required('The activity date is required').nullable(),
        category: Yup.string().required('The activity category is required'),
        venue: Yup.string().required('The activity venue is required'),
        city: Yup.string().required('The activity city is required'),
    })

    useEffect(() => {
      if(id) loadActivity(id).then(activity => setActivity(new ActivityFormValues(activity)))
    },[id, loadActivity])
    
    function handleSubmit(activity: ActivityFormValues){
        if(!activity.id)
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
 

    return(
        
        <Segment clearing>
            <Header content = 'Activity Details' sub color = 'teal'/>
            <Formik validationSchema={validationSchema} enableReinitialize initialValues={activity} onSubmit={values => handleSubmit(values)} >
            {({ handleSubmit, isValid, isSubmitting,dirty}) =>(
                <Form className ='ui form' onSubmit={handleSubmit} autoComplete = 'off'>
                    <MyTextInput placeholder = 'Title'  name = 'title'/>
                    <MyTextArea placeholder = 'Description'  name = 'description' rows={3} />
                    <MySelectInput options = {categoryOptions} placeholder = 'Category'  name = 'category' />
                    <MyDateInput showTimeSelect timeCaption= 'time' dateFormat='MMMM d, yyyy h:mm aa'  placeholderText = 'Date'  name = 'date' />
                    <Header content = 'Loaction Details' sub color = 'teal'/>
                    <MyTextInput placeholder = 'City'  name = 'city' />
                    <MyTextInput placeholder = 'Venue' name = 'venue' />
                    <Button 
                    disabled = {isSubmitting || !dirty || !isValid}
                    loading = {isSubmitting}
                    floated="right" positive type="submit" content = "Submit"/>
                    <Button  as = {Link}  to = '/activities' floated="right"  type="button" content = "Cancel"/>
              </Form>
            )}
        </Formik>
            
        </Segment>
    )
}
)