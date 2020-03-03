import myaxios from "@/axios";
let axios = new myaxios();

export function getBuildingTable() { //获取建筑目录
    return axios.get("/property/rest/realty/common/enums/building", null).then(resp => resp.data);
}

export function getNextBuildingData(parent: String, child: String, parentId: String) {//获取下层建筑数据
    return axios.get("/rest/realty/common/item", {
        child: child,
        parent: parent,
        parentId: parentId
    }).then(resp => resp.data)
}

export function getHouseList(params:any)  { //获取套间列表
    return axios.get("/rest/realty/building/flat", params).then(resp => resp.data);
}

export function getOwnerHistoryTable(params:any) { //获取建筑目录
    return axios.get("/rest/realty/relation/flat/owner/history", params).then(resp => resp.data);
}

export function getTenantHistoryTable(params:any) { //获取建筑目录
    return axios.get("/rest/realty/relation/residents/tenant", params).then(resp => resp.data);
}

export function getTenantByRoomId(id:String){//通过套房id/房间id查询在住人员列表
    return axios.get("/rest/realty/relation/flat/residents",{
        parentId:id,
        parentModule:"flat"//因为需求限制先写死
    }).then(resp => resp.data);
}

export function getOwnerData(id:String){//获取户主档案详情
    return axios.get(`/rest/realty/relation/flat/owner/${id}`,null).then(resp => resp.data);
}
