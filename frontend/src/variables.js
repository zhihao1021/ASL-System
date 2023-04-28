import axios from "axios";

export var sid, name, role, className, leaveTypeList, lessonList, statusList;

export default function variablesInit(callback, errorCallback) {
    axios.all([
        axios.get("/api/info/user/current"),
        axios.get("/api/leave/type"),
        axios.get("/api/leave/lesson"),
        axios.get("/api/leave/status"),
    ]).then(
        (responses) => {
            const userData = responses[0].data.data;
            sid = userData.sid;
            name = userData.name;
            role = userData.role;

            leaveTypeList = responses[1].data.data;
            lessonList = responses[2].data.data;
            statusList = responses[3].data.data;

            axios.get(`/api/class/${userData.class_code}`).then(
                (response) => {
                    const classData = response.data.data;
                    className = classData.class_name === "None" ? "無" : classData.class_name;

                    if (callback) {
                        callback();
                    }
                }
            )
        }
    ).catch(
        () => {
            if (errorCallback) {
                errorCallback();
            }
        }
    )
}
