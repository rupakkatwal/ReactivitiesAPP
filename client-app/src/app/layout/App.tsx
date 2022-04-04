import {  useEffect } from 'react';
import {  Container} from 'semantic-ui-react';
import Navbar from './Navbar';
import ActivtyDashboard from '../../features/activities/dashboard/ActivityDashboard';
import LoadingComponent from './LoadingComponent';
import { useStore } from '../stores/store';
import { observer } from 'mobx-react-lite';
import HomePage from '../../features/home/HomePage';
import { Route, Routes, useLocation } from 'react-router-dom';
import ActivityForm from '../../features/activities/form/ActivityForm';
import ActivityDetails from '../../features/activities/details/ActivityDetails';
import './style.css';

function App() {
  const location =  useLocation();
  const {activityStore} = useStore();
  const{loadActivities,activityRegistry} =  activityStore
  
  useEffect(() => {
    if(activityRegistry.size <= 1) loadActivities();
  }, [activityStore])

  if(activityStore.loadingIntial) return <LoadingComponent content ='Loadingapp'/>

  const onHomePage = window.location.pathname === "/" || window.location.pathname === ""

  return (
    <>
    {onHomePage ? null
    : <Navbar/>}
     
     <Container style = {{marginTop: '7em'}}>
     <Routes>
       <Route path = '/' element = {<HomePage/>}/>
       <Route path = '/activities' element = {<ActivtyDashboard/>}/>
       <Route  path = '/activities/:id' element = {<ActivityDetails/>}/>
       <Route  key = {location.key} path = '/createactivity' element = {<ActivityForm/>}/>
       <Route path = '/manage/:id' element = {<ActivityForm/>}/>
     </Routes>
     </Container>
   
    </>
  );
}

export default observer(App);