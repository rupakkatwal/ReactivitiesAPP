import { Console } from "console";
import { format } from "date-fns";
import { el } from "date-fns/locale";
import {  makeAutoObservable, reaction, runInAction} from "mobx";
import { Activity, ActivityFormValues } from "../../models/activity";
import { Pagination, PagingParams } from "../../models/pagination";
import { Profile } from "../../models/profile";
import agent from "../api/agent";
import { store } from "./store";



export default class ActivityStore{
    activityRegistry = new Map<string, Activity>();
    selectedActivity: Activity | undefined = undefined;
    editMode = false;
    loading = false;
    loadingIntial = false;
    pagination: Pagination | null = null;
    pagingParams = new PagingParams();
    predicate =  new Map().set('all',true);
    constructor(){
        makeAutoObservable(this);

        reaction(
            ()=> this.predicate.keys(),
            ()=>{
                this.pagingParams = new PagingParams();
                this.activityRegistry.clear();
                this.loadActivities();
            }
        )
    }

    setPagingParams = (pagingParams: PagingParams) => {
        this.pagingParams =  pagingParams
    }

    get activitiesByDate(){
        return Array.from(this.activityRegistry.values()).sort()
    }

    setPredicate =(predicate: string, value: string | Date) => {
        const resetPredicate =  () => {
            this.predicate.forEach((value,key) => {
                if(key !== 'startDate') this.predicate.delete(key);
            })
        }
        switch(predicate){
            case 'all':
                resetPredicate();
                this.predicate.set('all', true);
                break;
            case 'isGoing':
                resetPredicate();
                this.predicate.set('isGoing', true);
                break;
            case 'isHost':
                resetPredicate();
                this.predicate.set('isHost', true);
                break;
            case 'startDate':
                this.predicate.delete('startDate');
                this.predicate.set('startDate', value);

        }
    }

    get axiosParams() {
        const params =  new URLSearchParams();
        params.append('pageNumber', this.pagingParams.pageNumber.toString());
        params.append('pageSize', this.pagingParams.paGeSize.toString())
        this.predicate.forEach((value,key)=>{
            if(key === 'startDate')
            {
                params.append(key,(value as Date).toISOString())
            }else{
                params.append(key,value)
            }
        })
        return params;
    }

    get groupedActivities (){
        return Object.entries(
            this.activitiesByDate.reduce((activities, activity) => {
                const date = format(activity.date!, 'dd MMM yyy h:mm aa')
                activities[date] =  activities[date] ? [...activities[date],activity] : [activity]
                return activities
            },{} as {[key: string]: Activity[]})
        )
    }

    loadActivities = async() => {
        this.loadingIntial = true;
        try {
            const result =  await agent.Activities.list(this.axiosParams);
            result.data.forEach(activity =>{
                this.setActivity(activity);
            })
            this.setPagination(result.pagination)
            this.setLoadingInitial(false)
        } catch (error) {
            console.log(error)
            this.setLoadingInitial(false);
        }
    }

    setPagination = (pagiation:Pagination) =>{
        this.pagination = pagiation;
    }

    loadActivity = async(id: string) => {
        this.loadingIntial = false;
        let activity =  this.getActivity(id);
        if(activity){
            this.selectedActivity = activity
            
            return activity
        } else {
            this.loadingIntial = false;
            try {
                const activity  =  await agent.Activities.details(id);
                runInAction(()=> {
                    this.setActivity(activity);
                    this.selectedActivity = activity;
                    return activity
                })
                this.setLoadingInitial(false);
            } catch (error) {
                console.log(error)
                runInAction(()=> {
                    this.loadingIntial = false;
                })
            }
        }
    }

    private setActivity =  (activity: Activity) => {
        const user =  store.userStore.user;
        if(user){
            activity.isGoing = activity.attendees!.some(
                a => a.userName === user.userName
            )
            // activity.attendees!.forEach(element => {
            //     activity.isGoing = element.userName == user.userName
            //     console.log(activity.isGoing)
            // });
            activity.isHost = activity.hostUsername === user.userName
            activity.host =  activity.attendees?.find(x => x.userName === activity.hostUsername)
        }
        activity.date = new Date(activity.date!)
        this.activityRegistry.set(activity.id,activity)
    }

    private getActivity = (id: string) => {
        return this.activityRegistry.get(id);
    }

    setLoadingInitial = (state: boolean) => {
        this.loadingIntial = state;
    }

    createActivity  = async(activity : ActivityFormValues) =>  {
        const user = store.userStore.user
        const attendee = new Profile(user!)
        this.loading =  true;
        try {
            await agent.Activities.create(activity)
            const newActivity =  new Activity(activity)
            newActivity.hostUsername =  user?.userName;
            newActivity.attendees =  [attendee]
            this.setActivity(newActivity)
            runInAction(() => {
                this.selectedActivity = newActivity;
                this.loading = false;
            })
            
        } catch (error) {
            runInAction(() => {
                console.log(error)
                this.loading = false;
            })
            
        }
    }

    updateActivity =  async(activity: ActivityFormValues) => {
        this.loading =  true;
        try {
            await agent.Activities.update(activity)
            runInAction(()=>{
                if(activity.id){
                    let updatedActivity =  {...this.getActivity(activity.id),...activity}
                    this.activityRegistry.set(activity.id, updatedActivity as Activity)
                    this.selectedActivity = updatedActivity as Activity;
                }
            })
            
            this.loading = false;
        } catch (error) {
            runInAction(() => {
                console.log(error)
                this.loading = false;
            })
        }
    }

    deleteActivty  = async(id: string) =>{
        this.loading  =  true;
        try {
            await  agent.Activities.delete(id)
            this.activityRegistry.delete(id)
            this.editMode = false;
            this.loading = false;
        } catch (error) {
            console.log(error)
            this.loading = false;
        }
    }

    updateAttendance  = async() =>{
        const user =   store.userStore.user;
        this.loading  =  true;
        try {
            await  agent.Activities.attend(this.selectedActivity!.id)
           runInAction(()=> {
               if(this.selectedActivity?.isGoing){
                   this.selectedActivity.attendees = this.selectedActivity.attendees?.filter(a => a.userName !== user?.userName)
                   this.selectedActivity.isGoing =  false
                   this.loading =  false
               }
               else{
                   const attendee  = new Profile(user!);
                   this.selectedActivity?.attendees?.push(attendee)
                   this.selectedActivity!.isGoing =  true
                   this.loading =  false
               }
               this.activityRegistry.set(this.selectedActivity!.id, this.selectedActivity!)
               this.loading =  false
           })
        } catch (error) {
            console.log(error)
            this.loading = false;
        }
    }

    cancelActivityToggle =  async() => {
        this.loading =  true;
         try {
             await agent.Activities.attend(this.selectedActivity!.id)
             runInAction(()=> {
                 this.selectedActivity!.isCancelled  =  !this.selectedActivity!.isCancelled;
                 this.activityRegistry.set(this.selectedActivity!.id, this.selectedActivity!)
                 this.loading =  false;
             })
             
         } catch (error) {
             console.log(error)
            this.loading =  false;
             
         }
    }

    clearSelectedActivity  = () => {
        this.selectedActivity =  undefined
    }

    updateAttendeeFollwing = (username:string) =>{
        this.activityRegistry.forEach(activity =>{
            activity.attendees?.forEach(attendee =>{
                if(attendee.userName = username){
                    attendee.following ? attendee.followersCount-- : attendee.followersCount++;
                    attendee.following =! attendee.following
                }
            })
        })
    }

}