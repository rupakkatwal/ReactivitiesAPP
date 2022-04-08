import { Formik,Form } from "formik"
import { observer } from "mobx-react-lite"
import { useStore } from "../../app/stores/store"
import * as Yup from 'yup';
import { Button } from "semantic-ui-react";
import MyTextInput from "../../app/common/form/MyTextInput";


interface Props {
    setEditMode: (editMode: boolean) => void
}

export default observer(function ProfileEditForm({setEditMode}: Props){

    const{profileStore:{profile, updateProfile}} =  useStore();
    return(
        <>
         <Formik
            initialValues={{displayName:profile?.displayName, bio:profile?.bio}}
            onSubmit={values => {
                console.log(values)
                updateProfile(values).then(() => {
                setEditMode(false);
                })
            }}
            validationSchema =  {Yup.object({
                displayName: Yup.string().required()
            })}
            >
                {({isSubmitting,isValid,dirty})=>(
                    <Form className="ui form">
                        <MyTextInput placeholder="Display Name" name="displayName"/>
                        <MyTextInput placeholder="Add your Bio" name="bio"/>
                        <Button
                            positive
                            type="submit"
                            loading = {isSubmitting}
                            content = 'update profile'
                            floated = 'right'
                            disabled = {!isValid || !dirty}
                        />

                    </Form>
                )}
            </Formik>
        </>
       
    )
})
