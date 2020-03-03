import myaxios from "@/axios";
let property_axios = new myaxios();

export function getBuildingTable() { //获取建筑目录
    return property_axios.get("/property/rest/realty/common/enums/building", null).then(resp => resp.data);
}

export function getNextBuildingData(parent: String, child: String, parentId: String) {//获取下层建筑数据
    return property_axios.get("/rest/realty/common/item", {
        child: child,
        parent: parent,
        parentId: parentId
    }).then(resp => {
        let table = resp.data.map((item: any) => {
            let obj:any = {};
            obj.title = item.name;
            obj.id = item.id;
            obj.children = null;
            return obj;
        });
        return table;
    });
}

export function getOwnerList(pageNum: Number, pageSize: Number, parentId: String, parentModule: string,ownerName:string) {//获取户主档案列表
    return property_axios.get("/rest/realty/relation/flat/owner", {
        pageNum,
        pageSize,
        parentId,
        parentModule,
        ownerName
    }).then(resp => resp.data);
}

export function getOwnerData(id:String){//获取户主档案详情
    return property_axios.get(`/rest/realty/relation/flat/owner/${id}`,null).then(resp => resp.data);
}

export function getTenantByRoomId(id:String){//通过套房id/房间id查询在住人员列表
    return property_axios.get("/rest/realty/relation/flat/residents",{
        parentId:id,
        parentModule:"flat"//因为需求限制先写死
    }).then(resp => resp.data);
}


export function changeOwnerInfo(list:Object){//更新人员信息
    return property_axios.put('/rest/realty/prerson/basic/info',list).then(resp => resp.data)
}

export function newFamilyInfo(list:Object){//新建户主家人信息
    return property_axios.post('/rest/realty/prerson/basic/info',list).then(resp => resp.data)
}

export function newLiveConect(list:Object){//新建在住人员关联
    return property_axios.post('/rest/realty/relation/flat/residents',list).then(resp => resp.data)
}

export function changeLiveConect(list:Object){//新建在住人员关联
    return property_axios.put('/rest/realty/relation/flat/residents',list).then(resp => resp.data)
}

export function getHouseSelectList(presonInfoId:string) { //获取房主房产下拉框
    return property_axios.get('/rest/realty/relation/flat/owner/item/list',{presonInfoId}).then(resp => resp.data)
}

export  function  deleteLiveConect(arr:Array<string>) {//删除在住人员关联
    return property_axios.delete('/rest/realty/relation/flat/residents',arr).then(resp => resp.data)
}
