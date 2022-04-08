import { Formik,Form, FieldProps, Field } from 'formik'
import { observer } from 'mobx-react-lite'
import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import {Segment, Header, Comment, Button, Loader} from 'semantic-ui-react'
import MyTextArea from '../../../app/common/form/MyTextArea'
import { useStore } from '../../../app/stores/store'
import * as Yup from 'yup'
import { formatDistanceToNow } from 'date-fns'

interface Props{
    activityId: string
}

export default observer(function ActivityDetailedChat({activityId}: Props) {
    const{commentStore} = useStore();
    useEffect(()=>{
        if(activityId){
            commentStore.createHubConnection(activityId)
        }
        return() =>{
            commentStore.clearCommenrs()
        }
    },[commentStore,activityId])
    return (
        <>
            <Segment
                textAlign='center'
                attached='top'
                inverted
                color='teal'
                style={{border: 'none'}}
            >
                <Header>Chat about this event</Header>
            </Segment>
            <Segment attached clearing>
                <Comment.Group>
                    {commentStore.comments.map(comment => (
                        <Comment>
                        <Comment.Avatar src={comment.image || '/assets/user.png'}/>
                        <Comment.Content>
                            <Comment.Author as={Link} to={`profiles/${comment.userName}`}>{comment.displayName}</Comment.Author>
                            <Comment.Metadata>
                                <div>{formatDistanceToNow(comment.createdAt)} ago</div>
                            </Comment.Metadata>
                            <Comment.Text>{comment.body}</Comment.Text>
                        
                        </Comment.Content>
                    </Comment>
                    ))}
                    <Formik
                        onSubmit={(values,{resetForm}) => commentStore.addComment(values).then(()=> resetForm())}
                        initialValues = {{body:''}}
                        validationSchema = {Yup.object({
                            body:Yup.string().required()
                        })}
                    >
                        {({isSubmitting, isValid}) =>(
                             <Form className='ui Form'>
                                
                             <MyTextArea placeholder='Add Comment' name='body' rows={10}/>
                             <Button
                                loading = {isSubmitting}
                                disabled = {isSubmitting || !isValid}
                                 content='Add Reply'
                                 labelPosition='left'
                                 icon='edit'
                                 primary
                                 type='submit'
                                 floated='right'
                             />
                         </Form>
                        )}
                    </Formik>
                   
                </Comment.Group>
            </Segment>
        </>

    )
})