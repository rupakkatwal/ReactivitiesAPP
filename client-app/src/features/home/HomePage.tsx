import React from "react";
import { Link } from "react-router-dom";
import { Image, Container, Header, Segment, Button } from "semantic-ui-react";

export default function HomePage(){
    return(
       <Segment Inverted  textAllign = 'center' vertical  className = 'masthead'>
           <Container text>
               <Header as= 'h1' inverted>
                   <Image size  ='massive' src ='/assets/logo.png' alt = 'logo' style ={{marginBottom: 12}}/>
                   Reactivities
               </Header>
               <Header as= 'h2' inverted content= 'Welcome to reactivities'/>
               <Button as = {Link} to = '/activities' size = 'huge' inverted>
                   Go to Activities
              </Button>
           </Container>

       </Segment>
    )
}