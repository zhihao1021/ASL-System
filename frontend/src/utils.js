import axios from "axios";

const hashMap = {
    "announcement": 0,
    "account": 1,
    "login-history": 2,
    "new-leave": 3,
    "old-leave": 3,
    "authorize": 4,
    "query": 5,
    "other": 6,
    "setting": 7,
    "management": 8,
};

var userInfoData = {};
var classInfoData = {};

export var setLoading, showMessage;

export function getHashIndex() {
    const hash = window.location.hash.slice(1);
    return hashMap[hash] || 0;
}

export function functionInit(fnLoading, fnMessage) {
    setLoading = fnLoading;
    showMessage = fnMessage;
}

export function getUserInfoList(sidList, callback) {
    let uniqueSidList = sidList.filter((item, pos) => {
        return sidList.indexOf(item) === pos;
    })
    const notExistSid = uniqueSidList.filter(
        sid => !Object.keys(userInfoData).includes(`c${sid}`)
    );
    axios.all(
        notExistSid.map(sid => axios.get(`/api/info/user/${sid}`))
    ).then((responses) => {
        responses.forEach((response, index) => {
            const sid = notExistSid[index];
            const data = response.data.data;
            userInfoData[`c${sid}`] = data;
        });

        const results = sidList.map(sid => userInfoData[`c${sid}`])
        callback(results)
    });
}

export function getClassInfoList(classCodeList, callback) {
    let uniqueclassCodeList = classCodeList.filter((item, pos) => {
        return classCodeList.indexOf(item) === pos;
    })
    const notExistClassCode = uniqueclassCodeList.filter(
        classCode => !Object.keys(classInfoData).includes(`c${classCode}`)
    );

    axios.all(
        notExistClassCode.map(classCode => axios.get(`/api/class/${classCode}`))
    ).then((responses) => {
        responses.forEach((response, index) => {
            const classCode = notExistClassCode[index];
            const data = response.data.data;
            classInfoData[`c${classCode}`] = data;
        });

        const results = classCodeList.map(classCode => classInfoData[`c${classCode}`])
        callback(results)
    });
}
