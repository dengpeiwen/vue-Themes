import myaxios from "@/axios";

let axios = new myaxios();

export function getPersonList(params: Object) {
    return axios.get("/rest/realty/preson/worker", params).then(resp => resp.data);
}

export function getComplaintList(params: Object) {
    return axios.get("/rest/realty/complaint/info", params).then(resp => resp.data);
}

export function getworkDetail(id: String) {
    return axios.get(`/rest/realty/preson/worker/${id}`, null).then(resp => resp.data);
}

export function getComplaintDetail(id: String) {
    return axios.get(`/rest/realty/complaint/info/${id}`, null).then(resp => resp.data);
}

export function newfeedBack(list: any) {//新建反饋
    return axios.post('/rest/realty/complaint/info/feedBackInfo', list).then(resp => resp.data)
}


export function deleteComplaint(arr: Array<string>) {//删除投訴
    return axios.delete('/rest/realty/complaint/info', arr).then(resp => resp.data)
}


export function changePerson(list: any) {//更新工作人员
    return axios.put('/rest/realty/preson/worker', list).then(resp => resp.data)
}

export function newPerson(list: any) {//新建工作人员
    return axios.post('/rest/realty/preson/worker', list).then(resp => resp.data)
}

export function deletePerson(arr: Array<string>) {//删除工作人员
    return axios.delete('/rest/realty/preson/worker', arr).then(resp => resp.data)
}