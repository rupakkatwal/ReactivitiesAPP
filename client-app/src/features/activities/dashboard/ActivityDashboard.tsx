import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { Grid, Loader } from "semantic-ui-react";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { useStore } from "../../../app/stores/store";
import { PagingParams } from "../../../models/pagination";
import ActivityFilter from "./ActivityFilter";
import ActivityList from "./ActivityList";
import InfiniteScroll from 'react-infinite-scroller';
import ActivityListItemPlaceholder from "./AcitivityListItemPlaceholder";


 export default observer ( function ActivtyDashboard(){
    const { activityStore } = useStore();
    const { loadActivities, activityRegistry, setPagingParams,pagination} = activityStore;
    const[loadingNext, setLoadingNext] = useState(false);

    function handleGetNext(){
        setLoadingNext(true)
        setPagingParams(new PagingParams(pagination!.currentPage + 1))
        loadActivities().then(()=> setLoadingNext(false))
    }


    useEffect(() => {
        if (activityRegistry.size <= 1) loadActivities();
    }, [activityRegistry.size, loadActivities])

    // if(activityStore.loadingIntial && !loadingNext) return <LoadingComponent content ='Loading activities....'/>

     return (
         <Grid>
             <Grid.Column width = '10'>
                 {activityStore.loadingIntial && !loadingNext ? (
                     <>
                        <ActivityListItemPlaceholder/>
                        <ActivityListItemPlaceholder/>
                     </>
                 ) : (
                    <InfiniteScroll
                    pageStart={0}
                    loadMore={handleGetNext}
                    hasMore = {!loadingNext && !!pagination && pagination.currentPage < pagination.totalPages}
                    initialLoad = {false}                 
                    >
                          <ActivityList/>
                    </InfiniteScroll>
                 )}
             
             </Grid.Column>
             <Grid.Column width = "6">
                 <ActivityFilter/>
             </Grid.Column>
             <Grid.Column>
                 <Loader active = {loadingNext}/>
             </Grid.Column>
         </Grid>
     )
 } )