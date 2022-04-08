import { observer } from "mobx-react-lite";
import React from "react";
import { Link } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { Button, Container, Menu ,Image, Dropdown} from "semantic-ui-react";
import { useStore } from "../stores/store";

export default observer (function Navbar(){
    const{userStore} = useStore();
    const{user,logout} = userStore;
    return(
        <Menu inverted fixed = 'top'>
            <Container>
                <Menu.Item as ={NavLink} to = '/'  header>
                    <img src ="/assets/logo.png" alt ="logo" style = {{marginRight : '10px'}}/>
                    Reactivities
                </Menu.Item>
                <Menu.Item as ={NavLink} to = '/activities' name='Activites'/> 
                <Menu.Item>
                    <Button as ={NavLink} to = '/createactivity' positive content = 'Create Activity'/>
                </Menu.Item>
                <Menu.Item>
                    <Image src ={user?.image || '/assets/user.png'} avatar spaced = 'right'/>
                    <Dropdown pointing = 'top left' text = {user?.displayName}>
                        <Dropdown.Menu>
                        <Dropdown.Item as = {Link} to = {`/profiles/${user?.userName}`} text ='My profile'/>
                        <Dropdown.Item onClick={logout} text='Logout' icon='power'/>
                        </Dropdown.Menu>
                    </Dropdown>
                </Menu.Item>
            </Container>
        </Menu>
    )
})