import {  makeAutoObservable, runInAction} from "mobx";
import { Activity } from "../../models/activity";
import agent from "../api/agent";



export default class ActivityStore{
    activityRegistry = new Map<string, Activity>();
    selectedActivity: Activity | undefined = undefined;
    editMode = false;
    loading = false;
    loadingIntial = false;

    constructor(){
        makeAutoObservable(this);
    }
    get activitiesByDate(){
        return Array.from(this.activityRegistry.values()).sort()
    }

    get groupedActivities (){
        return Object.entries(
            this.activitiesByDate.reduce((activities, activity) => {
                const date = activity.date;
                activities[date] =  activities[date] ? [...activities[date],activity] : [activity]
                return activities
            },{} as {[key: string]: Activity[]})
        )
    }

    loadActivities = async() => {
        this.loadingIntial = true;
        try {
            const activities =  await agent.Activities.list();
            runInAction(()=> {
                activities.forEach(activity =>{
                    this.setActivity(activity);
                })
            })
            
        this.loadingIntial = false;
        } catch (error) {
            runInAction(()=> {
                console.log(error)
                this.loadingIntial = false;
            })
               
        }
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
                activity  =  await agent.Activities.details(id);
                this.setActivity(activity);
                this.selectedActivity = activity;
                this.loadingIntial = false;
                return activity
            } catch (error) {
                console.log(error)
                this.loadingIntial = false;
            }
        }
    }

    private setActivity =  (activity: Activity) => {
        activity.date = activity.date.split('T')[0];
        this.activityRegistry.set(activity.id,activity)
    }

    private getActivity = (id: string) => {
        return this.activityRegistry.get(id);
    }


    createActivity  = async(activity : Activity) =>  {
        this.loading =  true;
        try {
            await agent.Activities.create(activity)
            runInAction(() => {
                this.activityRegistry.set(activity.id,activity)
                this.selectedActivity = activity;
                this.editMode = false;
                this.loading = false;
            })
            
        } catch (error) {
            runInAction(() => {
                console.log(error)
            this.loading = false;
            })
            
        }
    }

    updateActivity =  async(activity: Activity) => {
        this.loading =  true;
        try {
            await agent.Activities.update(activity)
            this.activityRegistry.set(activity.id, activity)
            this.selectedActivity = activity;
            this.editMode = false;
            this.loading = false;
        } catch (error) {
            console.log(error)
            this.loading = false;
        }
    }

    deleteActivty  = async(id: string) =>{
        this.loading  =  true;
        try {
            await  agent.Activities.delete(id)
            this.activityRegistry.delete(id)
            // if(this.selectedActivity?.id === id ) this.cancelSelectedActivity();
            this.editMode = false;
            this.loading = false;
        } catch (error) {
            console.log(error)
            this.loading = false;
        }
    }
}