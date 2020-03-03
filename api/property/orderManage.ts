import myaxios from "@/axios";
let axios = new myaxios();

export function getOrderList(params: any) {//获取工单列表
    return axios.get("/rest/realty/order/info", params).then(resp => resp.data);
}

export function getOrderDetail(id:String){//获取工单详情
    return axios.get(`/rest/realty/order/info/${id}`,null).then(resp => resp.data);
}

export function changeOrderInfo(list:any){//更新工单信息
    return axios.put('/rest/realty/order/info',list).then(resp => resp.data);
}

export function newOrderInfo(list:any){//新增工单信息
    return axios.post('/rest/realty/order/info',list).then(resp => resp.data);
}

export function getWorkerList(params: any) {//获取工人列表
    return axios.get("/rest/realty/preson/worker", params).then(resp => resp.data);
}

export function pushOrder(orderId: String, workerId: String) {//推送工单
    return axios.get("/rest/realty/order/info/send", {
        orderId,
        workerId,
    }).then(resp => resp.data);
}



export function getOrderWorkType(type:String,code:String){//获取工单工作类型
    return axios.get(`/rest/realty/common/dictionary/${type}/${code}`,null).then(resp => resp.data);
}

export function cancelOrder(orderId:string){
    return axios.get('/rest/realty/order/info/cancel',{orderId,remark:null}).then(resp => resp.data);
}

export function deleteOrder(list:Array<string>){
    return axios.delete('/rest/realty/order/info',list).then(resp => resp.data);
}
