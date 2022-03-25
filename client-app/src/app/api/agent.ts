import axios, { AxiosResponse } from "axios";
import { Activity } from "../../models/activity";
axios.defaults.baseURL = 'https://localhost:7294/api/';
const responseBody = <T>  (response: AxiosResponse<T>) => response.data;

const  requests = {
    get:<T>(url: string) => axios.get<T>(url).then(responseBody),
    post:<T>(url: string, body:{}) => axios.post<T>(url, body).then(responseBody),
    put:<T>(url: string, body:{}) => axios.put<T>(url,body).then(responseBody),
    del:(url: string) => axios.get(url).then(responseBody)
}

const Activities = {
    list: () => requests.get<Activity[]>('/activity'),
    details:(id:string) => requests.get<Activity>(`/activity/${id}`),
    create: (activity: Activity) => axios.post<void>('/activity',activity),
    update: (activity: Activity) => axios.put<void>(`/activity/${activity.id}`,activity),
    delete: (id:string) => axios.delete<void>(`/activity/${id}`),

}

const agent = {
    Activities
}

export default agent;