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
    const notExistSid = sidList.filter(sid => !Object.keys(userInfoData).includes(sid));
    axios.all(
        notExistSid.map(sid => axios.get(`/api/info/user/${sid}`))
    ).then((responses) => {
        responses.forEach((response, index) => {
            const sid = notExistSid[index];
            const data = response.data.data;
            userInfoData[sid] = data;
        });

        const results = sidList.map(sid => userInfoData[sid])
        callback(results)
    });
}

export function getClassInfoList(classCodeList, callback) {
    const notExistClassCode = classCodeList.filter(
        classCode => !Object.keys(classCodeList).includes(classCode)
    );

    axios.all(
        notExistClassCode.map(classCode => axios.get(`/api/class/${classCode}`))
    ).then((responses) => {
        responses.forEach((response, index) => {
            const classCode = notExistClassCode[index];
            const data = response.data.data;
            classInfoData[classCode] = data;
        });

        const results = classCodeList.map(classCode => classInfoData[classCode])
        callback(results)
    });
}
