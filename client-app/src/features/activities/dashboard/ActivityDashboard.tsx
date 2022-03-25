import { observer } from "mobx-react-lite";
import React from "react";
import { Grid, GridColumn, List } from "semantic-ui-react";
import { useStore } from "../../../app/stores/store";
import { Activity } from "../../../models/activity";
import ActivityDetails from "../details/ActivityDetails";
import ActivityForm from "../form/ActivityForm";
import ActivityList from "./ActivityList";
interface Props{
    activities: Activity[];
}

 export default observer ( function ActivtyDashboard({activities}: Props){
    const {activityStore} = useStore();
    const {selectedActivity, editMode,createActivity, updateActivity} = activityStore;
     return (
         <Grid>
             <Grid.Column width = '10'>
               <ActivityList/>
             </Grid.Column>
             <Grid.Column width = "6">
                 { selectedActivity && !editMode &&
                 <ActivityDetails/>}
                 {editMode &&
                 <ActivityForm  />
                 }
                 
             </Grid.Column>
            
         </Grid>
     )
 }
 )