import { ErrorMessage, Field, Form, Formik } from "formik";
import { observer } from "mobx-react-lite";
import React from "react";
import { Button, Header, Label, Segment } from "semantic-ui-react";
import MyTextArea from "../../app/common/form/MyTextArea";
import MyTextInput from "../../app/common/form/MyTextInput";
import { useStore } from "../../app/stores/store";
import * as Yup from 'yup';
import ValidationErrors from "../errors/ValidationErrors";


export default observer(function LoginForm(){

    const{userStore} =  useStore();
    const DisplayingErrorMessagesSchema = Yup.object().shape({
        password: Yup.string()
          .required('Required'),
        email: Yup.string().email('Invalid email').required('Required'),
      });
    return(
        <>
        <Segment>
        <Formik
        initialValues={{email:'', password:'', error: null}}
        validationSchema={DisplayingErrorMessagesSchema}
        onSubmit = {(values,{setErrors})  => userStore.login(values).catch(error => setErrors({error: "Invalid email or password"}))}
        >
            {({handleSubmit, isSubmitting,dirty,isValid,errors}) =>(
                <Form className="ui form" onSubmit={handleSubmit} autoComplete='off'>
                    <Header as = 'h2' content = 'Login to Reactivities' color="teal" textAlign="center"/>
                    <MyTextInput name="email" placeholder = 'email' type="email"/>
                    <MyTextInput name='password' placeholder="password" type='password' />
                    <ErrorMessage 
                       name="error" render={()=>
                        <Label basic color='red' content= {errors.error}/>
                    }
                    />
                    <Button
                     disabled = {isSubmitting || !dirty || !isValid}
                     positive content='login' type='submit' fluid />
                </Form>
            )}
        </Formik>
        </Segment>
        
        </>
       
    )
})