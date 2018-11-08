export const DATA_TABLE = {
    //申报承保录入农户信息的表
    inframmessage: [
        {name: 'FramGuid', type: 'text', ISNull: 'NOT NULL'},       //唯一id
        {name: 'tyshxydm', type: 'text', ISNull: ''},               //统一社会信用代码
        {name: 'jgdmUrl', type: 'text', ISNull: ''},                //机构代码照片
        {name: 'FramType', type: 'text', ISNull: 'NOT NULL'},       //投保农户类型(1:个体，2企业，3组织)
        {name: 'FramName', type: 'text', ISNull: ''},               //农户姓名
        {name: 'FramTel', type: 'text', ISNull: ''},                //电话号码
        {name: 'FramPeopleID', type: 'text', ISNull: ''},           //身份证号码
        {name: 'addr', type: 'text', ISNull: ''},                   //地址
        {name: 'FramBank', type: 'text', ISNull: ''},               //开户银行
        {name: 'branch', type: 'text', ISNull: ''},                 //分行
        {name: 'FramIDFontUrl', type: 'text', ISNull: ''},          //身份证正面照片
        {name: 'FramIDBackUrl', type: 'text', ISNull: ''},          //身份证呗面照片
        {name: 'BankCardUrl', type: 'text', ISNull: ''},            //银行卡照片
        {name: 'fyzgzUrl', type: 'text', ISNull: ''},               //防疫资格证
        {name: 'GPS', type: 'text', ISNull: 'NOT NULL'},            //经纬度
        {name: 'Remarks', type: 'text', ISNull: ''},                //特别约定
        {name: 'createtime', type: 'text', ISNull: 'NOT NULL'},     //创建时间
        {name: 'dispute', type: 'text', ISNull: 'NOT NULL'},        //争议处理方式
        {name: 'management', type: 'text', ISNull: 'NOT NULL'},     //经营模式（1：自办，2：代办，3：联办，）
        {name: 'percent', type: 'text', ISNull: ''},                //联办时所占的份额
        {name: 'relationship', type: 'text', ISNull: 'NOT NULL'},   //与投保人关系（1：本人，2：管理，3：其他）
        {name: 'endtime', type: 'text', ISNull: 'NOT NULL'},        //终保时间
        {name: 'starttime', type: 'text', ISNull: 'NOT NULL'},      //起保时间
        {name: 'insurancepro', type: 'text', ISNull: 'NOT NULL'},   //保险产品
        {name: 'insuranceproname', type: 'text', ISNull: 'NOT NULL'},//保险产品名字加ID
        {name: 'insurancetype', type: 'text', ISNull: 'NOT NULL'},  //业务性质
        {name: 'policysignaUrl', type: 'text', ISNull: ''},         //投保单签字
        {name: 'housesignaUrl', type: 'text', ISNull: ''},          //分户投保清单签字
        {name: 'isAllSigna', type: 'text', ISNull: ''},             //投保单未签字
        {name: 'isHouseSigna', type: 'text', ISNull: ''},           //分户投保清单未签字
        {name: 'farmsmessage', type: 'text', ISNull: ''},           //组织投保的农户信息
        {name: 'banknum', type: 'text', ISNull: ''},                //银行卡号
        {name: 'isPass', type: 'text', ISNull: ''},                 //是否通过（1 通过 2 未通过）
        {name: 'noPassReason', type: 'text', ISNull: ''},           //未通过原因
        {name: 'insuranceId', type: 'text', ISNull: ''},            //保单号
        {name: 'OtherPicUrl', type: 'text', ISNull: ''},            //其他图片
        {name: 'HandlePerson', type: 'text', ISNull: ''},           //承保员姓名
        {name: 'EarTarNum', type: 'text', ISNull: ''},              //标的数量
    ],
    //申报承保信息的表
    Underwriting: [
        {name: 'FramGuid', type: 'text', ISNull: 'NOT NULL'},               //农户信息ID
        {name: 'SelfGuid', type: 'text', ISNull: 'NOT NULL'},               //承保id
        {name: 'QiyeGuid', type: 'text', ISNull: ''},                       //组织id
        {name: 'FramPeopleId', type: 'text', ISNull: 'NOT NULL'},           //身份证或者信用代码
        {name: 'AnimalId', type: 'text', ISNull: 'NOT NULL'},               //动物标签号
        {name: 'AnimalType', type: 'text', ISNull: 'NOT NULL'},             //动物类型
        {name: 'Varieties', type: 'text', ISNull: 'NOT NULL'},              //品种
        {name: 'AnimalAge', type: 'text', ISNull: ''},                      //动物年龄
        {name: 'AnimalWeight', type: 'text', ISNull: ''},                   //动物体重
        {name: 'SelfPayPremium', type: 'text', ISNull: 'NOT NULL'},         //自缴保费
        {name: 'TotalPremium', type: 'text', ISNull: 'NOT NULL'},           //总保费
        {name: 'breedType', type: 'text', ISNull: 'NOT NULL'},              //养殖方式(1:散养,2:规模化养殖)
        {name: 'ImplantationSiteUrl', type: 'text', ISNull: 'NOT NULL'},    //植入部位照
        {name: 'PositiveUrl', type: 'text', ISNull: 'NOT NULL'},            //正面照
        {name: 'LeftUrl', type: 'text', ISNull: 'NOT NULL'},                //左照
        {name: 'RightUrl', type: 'text', ISNull: 'NOT NULL'},               //右照
        {name: 'GPS', type: 'text', ISNull: 'NOT NULL'},                    //GPS定位
        {name: 'OtherPicUrl', type: 'text', ISNull: ''},                    //其他图片
        {name: 'createtime', type: 'text', ISNull: 'NOT NULL'},             //创建时间
        {name: 'Insuredamount', type: 'text', ISNull: 'NOT NULL'},          //保额
        {name: 'rate', type: 'text', ISNull: 'NOT NULL'},                   //费率
        {name: 'Exemption', type: 'text', ISNull: ''},                      //免赔率
        {name: 'parity', type: 'text', ISNull: ''},                         //胎次
        {name: 'breedadd', type: 'text', ISNull: 'NOT NULL'},               //养殖地点
        {name: 'isPass', type: 'text', ISNull: ''},                         //是否通过（1 通过 2 未通过）
    ],
    //批量申报承保信息的表
    PiliangUnderwriting: [
        {name: 'FramGuid', type: 'text', ISNull: 'NOT NULL'},               //农户信息ID
        {name: 'SelfGuid', type: 'text', ISNull: 'NOT NULL'},               //承保id
        {name: 'FramPeopleId', type: 'text', ISNull: 'NOT NULL'},           //身份证或者信用代码
        {name: 'StartAnimalIds', type: 'text', ISNull: 'NOT NULL'},         //动物起始号段
        {name: 'EndAnimalIds', type: 'text', ISNull: 'NOT NULL'},           //动物结束号段
        {name: 'AnimalType', type: 'text', ISNull: 'NOT NULL'},             //动物类型
        {name: 'Varieties', type: 'text', ISNull: 'NOT NULL'},              //品种
        {name: 'SelfPayPremium', type: 'text', ISNull: 'NOT NULL'},         //自缴保费
        {name: 'TotalPremium', type: 'text', ISNull: 'NOT NULL'},           //总保费
        {name: 'breedType', type: 'text', ISNull: 'NOT NULL'},              //养殖方式
        {name: 'GPS', type: 'text', ISNull: 'NOT NULL'},                    //GPS定位
        {name: 'createtime', type: 'text', ISNull: 'NOT NULL'},             //创建时间
        {name: 'Insuredamount', type: 'text', ISNull: 'NOT NULL'},          //保额
        {name: 'rate', type: 'text', ISNull: 'NOT NULL'},                   //费率
        {name: 'parity', type: 'text', ISNull: ''},                         //胎次
        {name: 'Exemption', type: 'text', ISNull: ''},                      //免赔率
        {name: 'AnimalAge', type: 'text', ISNull: ''},                      //动物年龄
        {name: 'AnimalWeight', type: 'text', ISNull: ''},                   //动物体重
        {name: 'Animals1Url', type: 'text', ISNull: 'NOT NULL'},            //群体动物1
        {name: 'Animals2Url', type: 'text', ISNull: 'NOT NULL'},            //群体动物2
        {name: 'Animals3Url', type: 'text', ISNull: 'NOT NULL'},            //群体动物3
        {name: 'AnimalsotherUrl', type: 'text', ISNull: ''},                //群体动物其他图片
        {name: 'AnimalList', type: 'text', ISNull: 'NOT NULL'},             //投保的动物们
        {name: 'isPass', type: 'text', ISNull: ''},                         //是否通过（1 通过 2 未通过）
        {name: 'noPassReason', type: 'text', ISNull: ''},                   //未通过原因
        {name: 'breedadd', type: 'text', ISNull: 'NOT NULL'},               //养殖地点
    ],
    // 被保险人信息
    InsuredFarmer: [
        {name: 'FramGuid', type: 'text', ISNull: 'NOT NULL'},       //唯一id
        {name: 'FramType', type: 'text', ISNull: ''},
        {name: 'GPS', type: 'text', ISNull: 'NOT NULL'},            //经纬度
        {name: 'insuranceId', type: 'text', ISNull: ''},            //保单号
        {name: 'name', type: 'text', ISNull: ''},                   //被保险人
        {name: 'idCard', type: 'text', ISNull: ''},                 //身份证号
        {name: 'bankName', type: 'text', ISNull: 'NOT NULL'},       //开户行
        {name: 'bankAccount', type: 'text', ISNull: ''},            //银行账号
        {name: 'accountType', type: 'text', ISNull: 'NOT NULL'},    //账户形式（信用卡、借记卡、活期存折、其他）
        {name: 'startTime', type: 'text', ISNull: 'NOT NULL'},      //起保时间
        {name: 'endTime', type: 'text', ISNull: 'NOT NULL'},        //终保时间
        {name: 'BanNum', type: 'text', ISNull: 'NOT NULL'},         //报案号
        {name: 'reportDate', type: 'text', ISNull: 'NOT NULL'},     //报案日期
        {name: 'outDate', type: 'text', ISNull: 'NOT NULL'},        //出险日期
        {name: 'contactNumber', type: 'text', ISNull: 'NOT NULL'},  //联系电话
        {name: 'address', type: 'text', ISNull: ''},                //住址
        {name: 'FramIDFont', type: 'text', ISNull: ''},             //身份证正面
        {name: 'FramIDBack', type: 'text', ISNull: ''},             //身份证反面
        {name: 'VaccinationCertificateImg', type: 'text', ISNull: ''},//防疫资格证
        {name: 'InstitutionCodeImg', type: 'text', ISNull: ''},      //机构代码证
        {name: 'BankCardImg', type: 'text', ISNull: ''},              //银行卡
        {name: 'vaccinationCertificateImgs', type: 'text', ISNull: ''},//分户投保清单签字兽医资格证拍照上传，可上传多张
        {name: 'remarks', type: 'text', ISNull: ''},                //标的特征
        {name: 'CreateTime', type: 'text', ISNull: ''},             //创建日期
        {name: 'canvasImg', type: 'text', ISNull: ''},              //保单图 1都没签字 2，兽医已签，3.被保险人已签，4.查勘员已签
        {name: 'detailImg', type: 'text', ISNull: ''},               //详情图1表示未签字,2已签字
        {name: 'Reason', type: 'text', ISNull: ''}            //未通过原因
    ],
    //理赔表
    DeclareClaimTable: [
        {name: 'FramGuid', type: 'text', ISNull: 'NOT NULL'},       //被保险人id
        {name: 'lhGuid', type: 'text', ISNull: 'NOT NULL'},                     //唯一ID
        {name: 'idCard', type: 'text', ISNull: 'NOT NULL'},                     //身份证
        {name: 'AnimalId', type: 'text', ISNull: 'NOT NULL'},                   //动物标签号
        {name: 'AnimalType', type: 'text', ISNull: 'NOT NULL'},                 //动物类型ID
        {name: 'AnimalTypeName', type: 'text', ISNull: 'NOT NULL'},             //动物名字
        {name: 'Varieties', type: 'text', ISNull: 'NOT NULL'},                  //品种ID
        {name: 'AnimalVarietyName', type: 'text', ISNull: 'NOT NULL'},          //类型名字
        {name: 'AnimalAge', type: 'text', ISNull: ''},                          //畜龄
        {name: 'AnimalWeight', type: 'text', ISNull: ''},                       //体重
        {name: 'InsuranceAmount', type: 'text', ISNull: 'NOT NULL'},            //保额
        {name: 'FinalMoney', type: 'text', ISNull: ''},                         //核定金额
        {name: 'FindAddress', type: 'text', ISNull: ''},                        //勘察地点
        {name: 'FangyiType', type: 'text', ISNull: 'NOT NULL'},                 //防疫情况
        {name: 'DieMessage', type: 'text', ISNull: 'NOT NULL'},                 //死亡原因
        {name: 'WuHaiHua', type: 'text', ISNull: 'NOT NULL'},                 //无害化处理情况及方式
        {name: 'Scene', type: 'text', ISNull: 'NOT NULL'},                      //现场勘查
        {name: 'Harmless', type: 'text', ISNull: 'NOT NULL'},                   //无害化处理
        {name: 'ForDie', type: 'text', ISNull: 'NOT NULL'},                     //死亡证明
        {name: 'Other', type: 'text', ISNull: ''},                      //其他
        {name: 'GPS', type: 'text', ISNull: 'NOT NULL'},
        {name: 'Time', type: 'text', ISNull: 'NOT NULL'}
    ]
};

// api对应sqlite字段
// 农户信息
export const Farmer_APIDATA = {
    Id: "FramGuid",
    FramLocation: "addr",//联系地址
    FramName: "FramName", //承保人
    FramTel: "FramTel",//联系方式
    FramPeopleID: "FramPeopleID",//身份证，机构编码
    FramBank: "FramBank",//开户行
    idfrontUrl: "FramIDFontUrl",//身份证正面
    idbackUrl: "FramIDBackUrl",//身份证反面
    bankUrl: "BankCardUrl",//银行卡
    signUrl: "policysignaUrl",//签名照
    BankAccount: "banknum",//银行账号
    CreateTime: "createtime",
    Reason: "noPassReason",//审核不通过原因
    VaccinationCertificateImg: "fyzgzUrl",//防疫正面
    FarmType: "FramType",//承保类型
    InstitutionCodeImg: "jgdmUrl",//机构图片
    InsuraceType: "insurancetype",//业务性质
    InsuraceProject: "insuranceproname",//保险项目
    StartTime: "starttime",//起始时间
    EndTime: "endtime",//结束时间
    RelationShip: "relationship",//承保关系
    CoppPercent: "percent",//所占比例
    Branch: "branch",//分行
    BusinessModel: "management",//经营模式
    Appointment: "Remarks",//特别约定
    DisputeName: "dispute",//争议处理方式
    isPass: "isPass",//争议处理方式
    InsuraceNo: "insuranceId",//保单号
    HandlePerson: "HandlePerson",//承保员姓名
    insurancepro: "insurancepro",//保险产品对象
    OtherImgs: "OtherPicUrl",//保险产品对象
    EarTarNum: "EarTarNum",//标的数量
}
// 个人、企业、团体 承包
export const Policy_APIDATA = {
    AnimalAge: "AnimalAge",//畜龄
    AnimalId: "AnimalId",//标签号
    AnimalType: "AnimalType",//类型
    AnimalVarietyName: "Varieties",//品种
    BreedAddress: "breedadd",//养殖地点
    BreedType: "breedType",//养殖类型
    FramPeopleID: "FramPeopleId",
    Id: "SelfGuid",
    InsuranceAmount: "Insuredamount",//保额
    InsuranceRate: "rate",//费率
    ParentId: "FramGuid",
    SelfPayPremium: "SelfPayPremium",//自交
    TotalPremium: "TotalPremium",//保费
    frontUrl: "PositiveUrl",//正面
    leftUrl: "LeftUrl",//左面
    otherUrl: "OtherPicUrl",//其他
    positonUrl: "ImplantationSiteUrl",//植入部位
    rightUrl: "RightUrl", //右面
}

// 团体农户
export const Org_APIDATA = {
    BankName: "FramBank",//开户行
    Bankbranch: "branch",//分行
    IdNumber: "FramPeopleID",//身份证
    Name: "FramName",//被承保人
    PolicyId: "qiyeGuid",//团体id
    Tel: "FramTel",//联系方式
    idfrontUrl: "FramIDFontUrl",//身份证正面
    idbackUrl: "FramIDBackUrl",//身份证反面
    bankUrl: "BankCardUrl",//银行卡
    VaccinationCertificateImg: "fyzgzUrl",//防疫正面
    Id: "FramGuid",//开户行
    PinNum: "EarTarNum",//标的数量
}

export const ManyPolicy_APIDATA = {
    ParentId: "FramGuid",
    AnimalAge: "AnimalAge",//畜龄
    AnimalIdEnd: "EndAnimalIds",//结束号
    AnimalIdStart: "StartAnimalIds",//其实很
    AnimalType: "AnimalType",//动物类型
    AnimalVarietyName: "Varieties",//品种
    BreedAddress: "breedadd",//养殖地点
    BreedType: "breedType",//养殖类型
    FramPeopleID: "FramPeopleId",
    Id: "SelfGuid",
    InsuranceAmount: "Insuredamount",//保额
    InsuranceRate: "rate",//费率
    Reason: "noPassReason",//
    SelfPayPremium: "SelfPayPremium",//自交
    TotalPremium: "TotalPremium",//保费
    Parity: "parity",
    Exemption: "Exemption",
    AnimalWeight: "AnimalWeight",
    Animals1Url: "Animals1Url",
    Animals2Url: "Animals2Url",
    Animals3Url: "Animals3Url",
    AnimalsotherUrl: "AnimalsotherUrl",
    AnimalList: "AnimalList",
}

export const InsuredFarmer_APIDATA = {
    "id": "FramGuid",
    "insuranceId": "insuranceId",
    "name": "name",
    "idCard": "idCard",
    "bankName": "bankName",
    "bankAccount": "bankAccount",
    "accountType": "accountType",
    "startTime": "startTime",
    "endTime": "endTime",
    "reportDate": "reportDate",
    "outDate": "outDate",
    "contactNumber": "contactNumber",
    "address": "address",
    "remarks": "remarks",
    "FramIDFont": "FramIDFont",
    "FramIDBack": "FramIDBack",
    "VaccinationCertificateImg": "VaccinationCertificateImg",
    "InstitutionCodeImg": "InstitutionCodeImg",
    "BankCardImg": "BankCardImg",
    "vaccinationCertificateImgs": "vaccinationCertificateImgs",
    "Reason": "Reason",
    "BanNum":"BanNum"
}

export const Claims_APIDATA = {
    "id": "lhGuid",
    "AnimalId": "AnimalId",
    "AnimalType": "AnimalType",
    "AnimalTypeName": "AnimalTypeName",
    "Varieties": "Varieties",
    "AnimalVarietyName": "AnimalVarietyName",
    "AnimalAge": "AnimalAge",
    "AnimalWeight": "AnimalWeight",
    "InsuranceAmount": "InsuranceAmount",
    "FinalMoney": "FinalMoney",
    "FindAddress": "FindAddress",
    "FangyiType": "FangyiType",
    "DieMessage": "DieMessage",
    "WuHaiHua": "WuHaiHua",
    "Scene": "Scene",
    "Harmless": "Harmless",
    "ForDie": "ForDie",
    "Other": "Other",
    "FramGuid": "FramGuid",
    "Time": "Time",
    "idCard": 'idCard'
}
