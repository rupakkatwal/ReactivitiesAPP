import React, { Fragment, useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Header, List } from 'semantic-ui-react';
import { Activity } from '../../models/activity';
import Navbar from './Navbar';
import ActivtyDashboard from '../../features/activities/dashboard/ActivityDashboard';
import{v4 as uuid} from 'uuid';

function App() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const[selectedActivtity, setSelectedActivity] = useState<Activity | undefined>(undefined);
  const[editMode,setEditMode] = useState(false);

  useEffect(() => {
    axios.get<Activity[]>("https://localhost:7294/api/activity").then(response => {
      setActivities(response.data)
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
    activity.id 
    ? setActivities([...activities.filter(x => x.id !== activity.id), activity])
    : setActivities([...activities,{...activity, id: uuid()}])
    setEditMode(false);
    setSelectedActivity(activity);
  }

  function handleDeleteActivity(id: string){
    setActivities([...activities.filter(x => x.id !== id)])
  }

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
     /> 
     </Container>
           
    </Fragment>
  );
}

export default App;