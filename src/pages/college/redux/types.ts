
export interface ICampusInfoCreatePayload {
    name:string,
    email?:string,
    phone?:number,
    location?:string,
    organizationChart?:File | null,
}