import { action, makeAutoObservable} from "mobx";
import { Activity } from "../../models/activity";
import agent from "../api/agent";
import{v4 as uuid} from 'uuid';



export default class ActivityStore{
    activities: Activity[] = [];
    selectedActivity: Activity | undefined = undefined;
    editMode = false;
    loading = false;
    loadingIntial = false;

    constructor(){
        makeAutoObservable(this);
    }

    loadActivities = async() => {
        this.loadingIntial = true;
        try {
            const activities =  await agent.Activities.list();
                activities.forEach(activity =>{
                    activity.date = activity.date.split('T')[0];
                    this.activities.push(activity);
                })
            this.loadingIntial = false;
        } catch (error) {
                console.log(error)
                this.loadingIntial = false;
        }
    }

    selectActivity = (id: string) => {
        this.selectedActivity =  this.activities.find(a => a.id === id)
    }

    cancelSelectedActivity = () => {
        this.selectedActivity =  undefined;
    }

    openForm =  (id?: string)=> {
       id ? this.selectActivity(id) : this.cancelSelectedActivity();
       this.editMode =  true;
    }

    closeForm = () => {
        this.editMode = false
    }

    createActivity  = async(activity : Activity) =>  {
        this.loading =  true;
        activity.id =  uuid();
        try {
            await agent.Activities.create(activity)
            this.activities.push(activity);
            this.selectedActivity = activity;
            this.editMode = false;
            this.loading = false;
        } catch (error) {
            console.log(error)
            this.loading = false;
        }
    }

    updateActivity =  async(activity: Activity) => {
        this.loading =  true;
        try {
            await agent.Activities.update(activity)
            this.activities = [... this.activities.filter ( x => x.id !== activity.id), activity]
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
            this.activities = [... this.activities.filter ( x => x.id !== id)]
            if(this.selectedActivity?.id === id ) this.cancelSelectedActivity();
            this.editMode = false;
            this.loading = false;
        } catch (error) {
            console.log(error)
            this.loading = false;
        }
    }
}