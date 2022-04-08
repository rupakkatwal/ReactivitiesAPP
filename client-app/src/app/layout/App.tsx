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
import LoginForm from '../../features/users/LoginForm';
import ModalContainer from '../common/modals/ModalContainer';
import ProfilePage from '../../features/profiles/ProfilePage';

function App() {
  const location =  useLocation();
  const {activityStore,userStore} = useStore();
  const{loadActivities,activityRegistry} =  activityStore
  
  useEffect(() => {
    if(userStore.token){
      userStore.getUser().finally(()=>userStore.setAppLoaded())
    }
    else{
      userStore.setAppLoaded();
    }
    
  }, [userStore])

  if(!userStore.appLoaded) return <LoadingComponent content ='Loading app....'/>


  const onHomePage = window.location.pathname === "/" || window.location.pathname === ""

  return (
    <>
    {onHomePage ? null
    : <Navbar/>}
     
     <Container style = {{marginTop: '7em'}}>
     <ModalContainer/>
     <Routes>
       <Route path = '/' element = {<HomePage/>}/>
       <Route path = '/activities' element = {<ActivtyDashboard/>}/>
       <Route  path = '/activities/:id' element = {<ActivityDetails/>}/>
       <Route  path = '/profiles/:username' element = {<ProfilePage/>}/>
       <Route  key = {location.key} path = '/createactivity' element = {<ActivityForm/>}/>
       <Route path = '/manage/:id' element = {<ActivityForm/>}/>
       <Route path = '/login' element = {<LoginForm/>}/>
     </Routes>
     </Container>
   
    </>
  );
}

export default observer(App);