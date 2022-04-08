import { ErrorMessage, Form, Formik } from "formik";
import { observer } from "mobx-react-lite";
import React from "react";
import { Button, Header, Label, Segment } from "semantic-ui-react";
import MyTextArea from "../../app/common/form/MyTextArea";
import MyTextInput from "../../app/common/form/MyTextInput";
import { useStore } from "../../app/stores/store";

export default observer(function LoginForm(){

    const{userStore} =  useStore();
    return(
        <>
        <Segment>
        <Formik
        initialValues={{email:'', password:'', error: null}}
        onSubmit = {(values,{setErrors})  => userStore.login(values).catch(error => setErrors({error: "Invalid email or password"}))}
        >
            {({handleSubmit, errors}) =>(
                <Form className="ui form" onSubmit={handleSubmit} autoComplete='off'>
                    <Header as = 'h2' content = 'Login to Reactivities' color="teal" textAlign="center"/>
                    <MyTextInput name='email' placeholder="name" />
                    <MyTextInput name='password' placeholder="password" type='password' />
                    <ErrorMessage 
                       name="error" render={()=>
                        <Label style ={{marginBottom: 10}} basic color="red" content={errors.error}/>
                    }
                    />
                    <Button positive content='login' type='submit' fluid />
                </Form>
            )}
        </Formik>
        </Segment>
        
        </>
       
    )
})