import myaxios from "@/axios";
let axios = new myaxios();

//获取图片
export function getImg() {
    return axios.get('/rest/realty/img/config').then(resp => resp.data);
}

export function getDictionaryType() { //获取所有字典类型
    return axios.get("/rest/realty/common/dictionaryType", null).then(resp => resp.data);
}

export function getDictionary(type:string) { //获取字典
    return axios.get(`/rest/realty/common/dictionary/${type}`, {type}).then(resp => resp.data);
}