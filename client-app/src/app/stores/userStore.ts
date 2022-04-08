import { makeAutoObservable, reaction, runInAction } from "mobx";
import { useNavigate } from "react-router-dom";
import { User, UserFormValues } from "../../models/users";
import agent from "../api/agent";
import { store } from "./store";

export default class  UserStore{
    user: User | null= null
    token: string | null = window.localStorage.getItem('jwt')
    appLoaded = false;

    constructor(){
        makeAutoObservable(this);

        reaction (
            () => this.token,
            token => {
                if(token){
                    window.localStorage.setItem('jwt', token);
                }else{
                    window.localStorage.removeItem('jwt');
                }
            }
        )

    }

    get isLoggedIn(){
        return  !!this.user;
    }
    setToken =  (token:string | null) =>{
        this.token = token
    }

    setDisplayName = (name:string) => {
        if(this.user) this.user.displayName = name
    }

    setAppLoaded = () => {
        this.appLoaded =  true
    }

    
    login = async(creds: UserFormValues)=>{
        try {
            const  user =  await agent.Account.login(creds)
            this.setToken(user.token)
            runInAction(()=>{
                this.user = user
            })
            // window.location.href = "http://localhost:3000/activities"
            window.history.replaceState({}, document.title, "/" + "activities");
            window.location.reload()       
            store.modalStore.closeModal()
        } catch (error) {
          throw error;  
        }
    }

    logout = () => {
        this.setToken(null)
        window.localStorage.removeItem('jwt')
        this.user = null
        // window.location.href = "http://localhost:3000/login"
        window.history.replaceState({}, document.title, "/" + "login");
        window.location.reload()       
        store.modalStore.closeModal()
    }

    getUser =  async() => {
        try{
            const user= await agent.Account.current();
            runInAction(()=> this.user = user)
        }catch(error){
            console.log(error);
        }
    }

    register = async (creds:UserFormValues) => {
        try {
            const  user =  await agent.Account.register(creds)
            this.setToken(user.token)
            runInAction(()=>{
                this.user = user
            })
            window.history.replaceState({}, document.title, "/" + "activities");
            window.location.reload()  
            store.modalStore.closeModal()
        } catch (error) {
          throw error;  
        }
    }

    setImage =  (image: string) =>{
        if(this.user) this.user.image = image
    }
   

}