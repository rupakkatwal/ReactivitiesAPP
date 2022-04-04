import { observer } from "mobx-react-lite";
import { Fragment } from "react";
import { Header, Item, Segment } from "semantic-ui-react";
import { useStore } from "../../../app/stores/store";
import ActivityListItem from "./ActivityListItem";

export default observer(function ActivityList(){

    const {activityStore} = useStore();
    const {activitiesByDate, groupedActivities} = activityStore;
  
    return(
        <>
        {groupedActivities.map(([group,activites]) => (
            <Fragment key = {group}>
               <Header sub color = 'teal'>
                   {group}
                </Header>
                {activites.map(activity => (
                    <ActivityListItem key = {activity.id} activity={activity} />
                ))}
            </Fragment>
        ))}
        </>
    )
})