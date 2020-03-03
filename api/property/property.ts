import myaxios from "@/axios";
let property_axios = new myaxios();

export function getDictionaryType() { //获取所有字典类型
    return property_axios.get("/rest/realty/common/dictionaryType", null).then(resp => resp.data);
}

export function getDictionary(type:string) { //获取字典
    return property_axios.get(`/rest/realty/common/dictionary/${type}`, {type}).then(resp => resp.data);
}

