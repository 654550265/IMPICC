export class InsuredFarmerView{
    FramGuid: string;
    GPS: string;
    insuranceId: string;
    name: string;
    idCard: string;
    bankName: string;
    bankAccount: string;
    accountType: string;
    startTime: string;
    endTime: string;
    reportDate: string;
    outDate: string;
    contactNumber: string;
    address: string;
    vaccinationCertificateImgs: Array<any>;
    remarks: string;
    zhangHu: Array<any>;
    isOtherPic: boolean;
    OtherPicLen: number;
    datas: object;
    BaoNameList: Array<any>;
    canChooseName: boolean;
    getInfo: object;
    BaoDan: Array<any>;
    FramIDFont: string;
    FramIDBack: string;
    VaccinationCertificateImg: string;
    InstitutionCodeImg: string;
    BankCardImg: string;
    isFontCard: boolean;
    isBackCard: boolean;
    isVaccinationCertificateImg: boolean;
    isInstitutionCodeImg: boolean;
    isBackCardF: boolean;
    canPeopleId: boolean;
    quchongArr: Array<any>;
    peopleArr: Array<any>;
    FramType: string;
    BanNum: string;


    constructor() {
        this.FramGuid = "";
        this.GPS = "";
        this.insuranceId = "";
        this.name = "";
        this.idCard = "";
        this.bankName = "";
        this.bankAccount = "";
        this.accountType = "";
        this.startTime = "";
        this.endTime = "";
        this.reportDate = "";
        this.outDate = "";
        this.contactNumber = "";
        this.address = "";
        this.vaccinationCertificateImgs = [];
        this.remarks = "";
        this.zhangHu = ['信用卡','借记卡','活期存折','其他'];
        this.isOtherPic = false;
        this.datas = {};
        this.canChooseName = false;
        this.BaoDan = [];
        this.FramIDFont = '';
        this.FramIDBack = '';
        this.VaccinationCertificateImg = '';
        this.InstitutionCodeImg = '';
        this.BankCardImg = '';
        this.isFontCard = false;
        this.isBackCard = false;
        this.isVaccinationCertificateImg = false;
        this.isInstitutionCodeImg = false;
        this.isBackCardF = false;
        this.canPeopleId = false;
        this.quchongArr = [];
        this.peopleArr = [];
        this.FramType = '';
        this.BanNum = '';
    }
}
