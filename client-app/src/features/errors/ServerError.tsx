import { observer } from "mobx-react-lite";
import { Container, Header, Segment } from "semantic-ui-react";
import { useStore } from "../../app/stores/store";


export default observer(function ServerError(){
    const {commonStore} = useStore();
    const{error} = commonStore;
    console.log(error)
    return(
      <Container>
          <Header as = 'h1'  content = 'Server Error'/>
    
          <Segment>
              <Header as= 'h4' content = 'Stack trace' color="teal"/>
              <code style = {{marginTop: '10px'}}>
                  We're sorry! The server encounter  an internal error and was unable to complete the request. Please contact system adminstration  for more information.
                  
              </code>
          </Segment>
          <Segment>
          <code style = {{marginTop: '10px'}}>
                Error code : 500
              </code>
          </Segment>
      </Container>
    )
})