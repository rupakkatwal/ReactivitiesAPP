import { ErrorMessage, Form, Formik } from "formik";
import { observer } from "mobx-react-lite";
import React from "react";
import { Button, Header, Label } from "semantic-ui-react";
import MyTextArea from "../../app/common/form/MyTextArea";
import MyTextInput from "../../app/common/form/MyTextInput";
import { useStore } from "../../app/stores/store";
import * as Yup from 'yup';
import { Link } from "react-router-dom";
import ValidationErrors from "../errors/ValidationErrors";

export default observer(function RegisterForm(){

    const{userStore,activityStore} =  useStore();

    const validationSchema  =  Yup.object({
        displayName: Yup.string().required('The display name is required'),
        userName: Yup.string().required('The UserName  is required'),
        email: Yup.string().required('The Email  is required').nullable(),
        password: Yup.string().required('The Password  is required')
    })
    return(
        <>
         <Formik
         validationSchema={validationSchema} enableReinitialize 
        initialValues={{displayName:'',userName:'',email:'', password:'', error: null}}
        onSubmit = {(values,{setErrors})  => userStore.register(values).catch(error => console.log(error))}
        >
            {({handleSubmit, errors,isValid, isSubmitting,dirty,touched}) =>(
                <Form className="ui form error" onSubmit={handleSubmit} autoComplete='off'>
                    <Header as = 'h2' content = 'SignUp to Reactivities' color="teal" textallign="center"/>
                    <MyTextInput name='displayName' placeholder="displayName" />
                    <MyTextInput name='userName' placeholder="userName" />
                    <MyTextInput name='email' placeholder="email" />
                    <Label>Password must be 8 character and combined with uppercase,number and special character </Label>
                    <MyTextInput name='password' placeholder="password" type='password' />

                    <ErrorMessage 
                       name="error" render={()=>
                        <ValidationErrors errors= {errors.error}/>
                    }
                    />
                    <Button 
                    disabled = {isSubmitting || !dirty || !isValid}
                    loading = {activityStore.loading}
                     positive type="submit" content = "Register" fluid/>
                </Form>
            )}
        </Formik>
        </>
       
    )
})