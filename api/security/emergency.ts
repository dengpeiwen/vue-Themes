import myaxios from "@/axios";
const axios = new myaxios(`./apr`);


//获取组织列表
export function getorganizationlist(superOrganizationId:string) {
    return axios.get(`yj/organization/addressBookQuery?superOrganizationId=${superOrganizationId}`);
}

//获取通讯录列表
export function getmailList(url:string) {
    return axios.get(url);
}
//向通讯录中添加人员
export function addUser(data:any) {
    return axios.post(`/yj/user/addAddressBookUser`,data);
}
//从通讯录中删除人员
export function deleteUser(data:any) {
    return axios.post(`/yj/user/deleteAddressBookUser?id=${data}`);
}

//获取应急资源列表
export function getresourcelist(pageNo:any,pageSize:any) {
    return axios.get(`/yj/resource/query?pageNo=${pageNo}&pageSize=${pageSize}`);
}

//添加应急资源
export function addResource(data:any) {
    return axios.post(`/yj/resource/add`,data);
}
//删除应急资源
export function deleteResource(data:any) {
    return axios.get(`/yj/resource/delete`,data);
}


//查询事件列表
export function queryEvent(data:any) {
    return axios.get(`/yj/event/query`,data);
}


//查询值班人员
export function getStayMan(data:any) {
    return axios.get(`/yj/user/query`,data);
}

//查询历史案例列表
export function queryHistory(data:any) {
    return axios.get(`/yj/historicalcase/query`,data);
}
//删除历史案例
export function deleteHistory(data:any) {
    return axios.get(`/yj/historicalcase/delete`,data);
}

//获取事件类型
export function getEventType(data?:any) {
    return axios.get(`/yj/plan/querySjlx`,data);
}

//查询预案管理列表
export function queryPlanList(data:any) {
    return axios.get(`/yj/plan/query`,data);
}

//添加预案
export function addPlan(data:any) {
    return axios.post(`/yj/plan/add`,data);
}
//删除预案
export function deletePlan(data:any) {
    return axios.get(`/yj/plan/delete`,data);
}
//查询预案人员
export function queryPlanPerson(data:any) {
    return axios.get(`/yj/plan/queryPlanPerson`,data);
}
// 查询预案流程
export function queryPlanProcess(data:any) {
    return axios.get(`/yj/plan/queryPlanProcess`,data);
}


