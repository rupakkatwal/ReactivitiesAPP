import axios, { AxiosError, AxiosResponse } from "axios";
import { profile } from "console";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Activity, ActivityFormValues } from "../../models/activity";
import { PaginatedResult } from "../../models/pagination";
import { Photo, Profile } from "../../models/profile";
import { UserActivity } from "../../models/UserActivity";
import { User, UserFormValues } from "../../models/users";
import { store, useStore } from "../stores/store";


axios.defaults.baseURL = process.env.REACT_APP_API_URL;
const responseBody = <T>(response: AxiosResponse<T>) => response.data;

axios.interceptors.request.use(config => {
    const token =  store.userStore.token;
    if(token) config.headers!.Authorization = `Bearer ${token}`
    return config;
})
axios.interceptors.response.use(async response => {
    const pagination =   response.headers['pagination']
    if(pagination)
    {
        response.data =  new PaginatedResult(response.data, JSON.parse(pagination))
        return response as AxiosResponse<PaginatedResult<any>>
    }
    return response;
},(error: AxiosError)=>{
    const{data, status,config} = error.response!
    switch(status){
        case 400:
            if(typeof data === 'string'){
                toast.error(data)
            }
            if(config.method == 'get' && data.errors.hasOwnProperty("id"))
            {
                window.history.replaceState({}, document.title, "/" + "not-found");
                window.location.reload() 
            }
            if(data.errors)
            {
                const modalStateErrors = [];
                for(const key in data.errors)
                {
                    if(data.errors[key])
                    {
                        modalStateErrors.push(data.errors[key])
                    }
                }
                
                throw modalStateErrors.flat();
                
            }
            break;
        case 401:
            toast.error('You have to login first');
            window.history.replaceState({}, document.title, "/");
            window.location.reload() 
            break;
        case 404:
            // let navigate =  useNavigate();
            // navigate('/not-found');
            window.history.replaceState({}, document.title, "/" + "not-found");
            window.location.reload() 
            break;
        case 500:
            store.commonStore.setServerError(data);
            
            window.history.replaceState({}, document.title, "/" + "server-error");
            window.location.reload() 
            break;
    }
    return Promise.reject(error)
});

const requests = {
    get: <T>(url: string) => axios.get<T>(url).then(responseBody),
    post: <T>(url: string, body: {}) => axios.post<T>(url, body).then(responseBody),
    put: <T>(url: string, body: {}) => axios.put<T>(url, body).then(responseBody),
    del: <T>(url: string) => axios.delete<T>(url).then(responseBody),
}

const Activities = {
    list: (params: URLSearchParams) => axios.get<PaginatedResult<Activity[]>>('/activity', {params}).then(responseBody),
    details:(id:string) => requests.get<Activity>(`/activity/${id}`),
    create: (activity: ActivityFormValues) => requests.post<void>('/activity',activity),
    update: (activity: ActivityFormValues) => requests.put<void>(`/activity/${activity.id}`,activity),
    delete: (id:string) => requests.del<void>(`/activity/${id}`),
    attend: (id: string) => requests.post<void>(`/activity/${id}/attend`,{}),

}
const Account  =  {
    current: () => requests.get<User>('/account/getcurrentuser'),
    login:(user:UserFormValues) => requests.post<User>('/account/login',user),
    register:(user:UserFormValues) => requests.post<User>('/account/register',user)    
}

const Profiles = {
    get: (username: string) => requests.get<Profile>(`/profiles/${username}`),
    uploadPhoto: (file: Blob) => {
        let formData  =  new FormData();
        formData.append('File', file);
        return axios.post<Photo>('photos', formData,{
            headers:{'Content-type': 'multipart/form-data'}
        })

    },
    updateProfile:(profile:Partial<Profile>) => requests.put(`/profiles`,profile),
    setMainPhoto: (id:string) => requests.post(`/photos/${id}/setmain`,{}),
    deletePhoto: (id:string) => requests.del(`/photos/${id}`),
    updateFollowing: (username:string) => requests.post(`/follow/${username}`,{}),
    listFollowings: (username:string, predicate: string) => requests.get<Profile[]>(`/follow/${username}?predicate=${predicate}`),
    listActivities: (username:string, predicate: string) => requests.get<UserActivity[]>(`/profiles/${username}/activities?predicate=${predicate}`)

}



const agent = {
    Activities,
    Account,
    Profiles
}

export default agent;