import React, { Fragment, useEffect, useState } from 'react';
import { Container} from 'semantic-ui-react';
import { Activity } from '../../models/activity';
import Navbar from './Navbar';
import ActivtyDashboard from '../../features/activities/dashboard/ActivityDashboard';
import{v4 as uuid} from 'uuid';
import agent from '../api/agent';
import LoadingComponent from './LoadingComponent';

function App() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const[selectedActivtity, setSelectedActivity] = useState<Activity | undefined>(undefined);
  const[editMode,setEditMode] = useState(false);
  const[loading, setLoading] = useState(true);
  const[submitting, setSubmitting] = useState(false);

  useEffect(() => {
    agent.Activities.list().then(response => {
      setActivities(response);
      setLoading(false);
    })
  }, [])
  function handleSelectActivity(id: String){
    setSelectedActivity(activities.find(x => x.id === id));
  }

  function handleCancelActivity(){
    setSelectedActivity(undefined);
  }

  function handleFormOpen(id?: string){
    id ? handleSelectActivity(id) : handleCancelActivity();
    setEditMode(true);
  }

  function handleFormClose(){
    setEditMode(false);
  }

  function handleCreateOrEditActivity(activity: Activity){
    setSubmitting(true)
    if(activity.id)
    {
      agent.Activities.update(activity).then(()=>{
        setActivities([...activities.filter(x => x.id !== activity.id), activity])
        setEditMode(false);
        setSelectedActivity(activity);
        setSubmitting(false)
      })
    } else{
      agent.Activities.create(activity).then(()=>{
        setActivities([...activities,{...activity, id: uuid()}])
        setEditMode(false);
        setSelectedActivity(activity);
        setSubmitting(false)
      })
    }
  }

  function handleDeleteActivity(id: string){
    setSubmitting(true)
    agent.Activities.delete(id).then(()=>{
    setActivities([...activities.filter(x => x.id !== id)])
    })
    setSubmitting(false)
  }
  if(loading) return <LoadingComponent content ='Loadingapp'/>

  return (
    <Fragment>
     <Navbar openForm ={handleFormOpen}/>
     <Container style = {{marginTop: '7em'}}>
     <ActivtyDashboard 
     activities = {activities}
     selectedActivity = {selectedActivtity}
     selectActivity = {handleSelectActivity}
     cancelSelectActivity = {handleCancelActivity}
     editMode = {editMode}
     openForm = {handleFormOpen}
     closeForm = {handleFormClose}
     createOrEdit = {handleCreateOrEditActivity}
     deleteActivity = {handleDeleteActivity}
     submitting  = {submitting}
     /> 
     </Container>
           
    </Fragment>
  );
}

export default App;