import {  useEffect } from 'react';
import {  Container} from 'semantic-ui-react';
import Navbar from './Navbar';
import ActivtyDashboard from '../../features/activities/dashboard/ActivityDashboard';
import LoadingComponent from './LoadingComponent';
import { useStore } from '../stores/store';
import { observer } from 'mobx-react-lite';



function App() {
  const {activityStore} = useStore();
  
  useEffect(() => {
    activityStore.loadActivities()
  }, [activityStore])

  if(activityStore.loadingIntial) return <LoadingComponent content ='Loadingapp'/>

  return (
    <>
     <Navbar/>
     <Container style = {{marginTop: '7em'}}>
       <ActivtyDashboard 
        activities = {activityStore.activities}
     />
     </Container>
           
    </>
  );
}

export default observer(App);