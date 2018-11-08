export class Farmer{
    FramGuid: string = '';
    tyshxydm: string = '';
    jgdmUrl: string = '';
    FramType: string = '';
    FramName: string = '';
    FramTel: string = '';
    FramPeopleID: string = '';
    addr: string = '';
    FramBank: string = '';
    branch: string = '';
    FramIDFontUrl: string = '';
    FramIDBackUrl: string = '';
    BankCardUrl: string = '';
    fyzgzUrl: string = '';
    GPS: string = '';
    Remarks: string = '';
    createtime: string = '';
    dispute: string = '';
    management: string = '';
    percent: string = '';
    relationship: string = '';
    endtime: string = '';
    starttime: string = '';
    insurancepro: string = '';
    insuranceproname: string = '';
    insurancetype: string = '';
    policysignaUrl: string = '';
    housesignaUrl: string = '';
    isAllSigna: string = '';
    isHouseSigna: string = '';
    farmsmessage: string = '';
    banknum: string = '';
    isPass: string = '';
    noPassReason: string = '';
    insuranceId: string = '';
    OtherPicUrl: string = '';
    HandlePerson: string = '';
    EarTarNum: string = '';

    form2Model(object){
        let dbOBJ = {};
        for (const key in object) {
            if (this.hasOwnProperty(key)) {
                const element = object[key];
                dbOBJ[key] = element;
            }
        }
        let date = new Date();
        let year = date.getFullYear();
        let mon = date.getMonth() + 1;
        let day = date.getDate();
        dbOBJ['relationship'] = object.relationship ? object.relationship['types'] + ',' + object.relationship['name'] : '';
        dbOBJ['management'] = object.management ? object.management['types'] + ',' + object.management['name'] : '';
        dbOBJ['createtime'] = year + '-' + mon + '-' + day;
        dbOBJ['addr'] = object.provice ? `${object.provice['id']},${object.provice['name']}${object.moreAddr}` : '';
        dbOBJ['isAllSigna'] = null;
        dbOBJ['isHouseSigna'] = null;
        dbOBJ['insurancetype'] = object.insurancetype ? `${object.insurancetype.TypeId},${object.insurancetype.TypeName}` : '';
        dbOBJ['insurancepro'] = object.insurancepro ? `${JSON.stringify(object.insurancepro)}` : '';
        dbOBJ['insuranceproname'] = object.insurancepro ? `${object.insurancepro.ProjectId},${object.insurancepro.ProjectName}` : '';
        dbOBJ['Isloc'] = 1;
        dbOBJ['dispute'] = object.dispute ? `${object.dispute['Id']},${object.dispute['Name']}` : '';
        dbOBJ['OtherPicUrl'] = object.OtherPicUrl ? object.OtherPicUrl.join() : '';
        dbOBJ['FramGuid'] = this.FramGuid;
        dbOBJ['GPS'] = this.GPS;
        dbOBJ['FramType'] = this.FramType;
        return dbOBJ;
    }
}
