import { useEffect } from 'react'
import { Container } from 'semantic-ui-react'
import Navbar from './Navbar'
import ActivtyDashboard from '../../features/activities/dashboard/ActivityDashboard'
import LoadingComponent from './LoadingComponent'
import { useStore } from '../stores/store'
import { observer } from 'mobx-react-lite'
import HomePage from '../../features/home/HomePage'
import { Route, Routes, useLocation } from 'react-router-dom'
import ActivityForm from '../../features/activities/form/ActivityForm'
import ActivityDetails from '../../features/activities/details/ActivityDetails'
import './style.css'
import 'react-toastify/dist/ReactToastify.css';
import LoginForm from '../../features/users/LoginForm'
import ModalContainer from '../common/modals/ModalContainer'
import ProfilePage from '../../features/profiles/ProfilePage'
import TestErrors from '../../features/errors/TestError'
import { ToastContainer } from 'react-toastify'
import NotFound from '../../features/errors/NotFound'
import ServerError from '../../features/errors/ServerError'
import 'react-calendar/dist/Calendar.css';


function App() {
    const location = useLocation()
    const { activityStore, userStore } = useStore()
    const { loadActivities, activityRegistry } = activityStore

    useEffect(() => {
        if (userStore.token) {
            userStore.getUser().finally(() => userStore.setAppLoaded())
        } else {
            userStore.setAppLoaded()
        }
    }, [userStore])

    if (!userStore.appLoaded)
        return <LoadingComponent content="Loading app...." />

    const onHomePage =
        window.location.pathname === '/' || window.location.pathname === ''

    return (
        <>
            <ToastContainer position='bottom-right' hideProgressBar/>
            {onHomePage ? null : <Navbar />}
            <Container style={{ marginTop: '7em' }}>
                <ModalContainer />
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/activities" element={<ActivtyDashboard />} />
                    <Route
                        path="/activities/:id"
                        element={<ActivityDetails />}
                    />
                    <Route
                        path="/profiles/:username"
                        element={<ProfilePage />}
                    />
                    <Route
                        key={location.key}
                        path="/createactivity"
                        element={<ActivityForm />}
                    />
                    <Route path="/manage/:id" element={<ActivityForm />} />
                    <Route path="/login" element={<LoginForm />} />
                    <Route path="/errors" element={<TestErrors />} />
                    <Route path="/server-error" element={<ServerError />} />
                    <Route path='/*' element={<NotFound />} />
                </Routes>
            </Container>
        </>
    )
}

export default observer(App)
