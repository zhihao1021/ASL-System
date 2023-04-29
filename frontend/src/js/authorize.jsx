import axios from "axios";
import React from "react";

import TitleBar from "./title-bar";

import { getClassInfoList, getUserInfoList, setLoading, showMessage } from "../utils";
import { leaveTypeList, lessonList } from "../variables";

import "../css/authorize.css"

export default class Authorize extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            list: []
        }

        this.getData = this.getData.bind(this);
    }

    componentDidMount() {
        this.getData();
    }

    componentDidUpdate(props) {
        if (!props.display && this.props.display) {
            this.getData();
            window.location.hash = "authorize";
        }
    }

    getData() {
        setLoading(true);
        axios.get("/api/leave/status/-1").then(
            (response) => {
                const leaveDataList = response.data.data;
                const userInfoCallback = (userInfoList) => {
                    const classInfoCallback = (classInfoList) => {
                        const elementList = leaveDataList.map((leaveData, index) => {
                            const userInfo = userInfoList[index];
                            const classInfo = classInfoList[index];

                            const id = leaveData.id;
                            const createTime = leaveData.create_time;
                            let startDate = leaveData.start_date.split("-");
                            startDate = `${startDate[0]}年${startDate[1]}月${startDate[2]}日`
                            let endDate = leaveData.end_date.split("-");
                            endDate = `${endDate[0]}年${endDate[1]}月${endDate[2]}日`
                            const startLesson = lessonList[leaveData.start_lesson];
                            const endLesson = lessonList[leaveData.end_lesson];
                            const type = leaveTypeList[leaveData.type];
                            const remark = leaveData.remark
                            
                            const files = Array.from(Array(leaveData.files || 0).keys()).map((index) => {
                                return <img key={index} src={`/api/leave/id/${id}/${index}`} alt="" />
                            })

                            const sid = userInfo.sid;
                            const name = userInfo.name;
                            const className = classInfo.class_name;

                            return (
                                <ResultPage
                                    key={index}
                                    id={id}
                                    createTime={createTime}
                                    startDate={startDate}
                                    endDate={endDate}
                                    startLesson={startLesson}
                                    endLesson={endLesson}
                                    type={type}
                                    remark={remark}
                                    files={files}
                                    sid={sid}
                                    name={name}
                                    className={className}
                                    updateTime={Date.now()}
                                    last={index === leaveDataList.length - 1}
                                    updateData={this.getData}
                                />
                            )
                        });
                        this.setState({
                            list: elementList
                        });
                        setLoading(false);
                    };
                    const classCodeList = userInfoList.map(userInfo => userInfo.class_code);
                    getClassInfoList(classCodeList, classInfoCallback);
                };
                const userSidList = leaveDataList.map(leaveData => leaveData.sid);
                getUserInfoList(userSidList, userInfoCallback);
            }
        ).finally(
            () => {
                setLoading(false);
            }
        )
    }

    render() {
        const display = this.props.display;
        return (
            <div id="authorize" style={{ "display": display ? "" : "none" }}>
                <TitleBar title="審核">
                    <button onClick={this.getData}>
                        <p className="ms">refresh</p>
                        <p>重新整理</p>
                    </button>
                </TitleBar>
                <hr />
                <div className="results">
                    <div className="empty">
                        <div className="ms">done_all</div>
                        <div className="title">當前沒有需要審核的資料。</div>
                    </div>
                    {this.state.list.reverse()}
                </div>
            </div>
        )
    }
}

class ResultPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            finish: false,
            reject: false,
        }
        this.ref = React.createRef();
        this.updateData = props.updateData;

        this.accept = this.accept.bind(this);
        this.reject = this.reject.bind(this);

        this.showRejectBox = () => {
            this.setState({
                reject: true
            });
        }
        this.hideRejectBox = () => {
            this.setState({
                reject: false
            });
        }
    }

    componentDidUpdate(props) {
        if (props.updateTime !== this.props.updateTime) {
            this.setState({
                finish: false,
                reject: false,
            });
        }
    }

    accept() {
        setLoading(true);
        axios.put(`/api/authorize/accept/${this.props.id}`).then(
            () => {
                if (this.props.last) {
                    this.updateData();
                }
                else {
                    this.setState({
                        finish: true
                    });
                    setLoading(false);
                }
            }
        ).catch(
            () => {
                showMessage("執行失敗", "執行失敗，請嘗試重新整理頁面。", "error");
                setLoading(false);
            }
        )
    }

    reject() {
        setLoading(true);
        let data = new FormData()
        data.append("reject_reason", this.ref.current.textContent || "");
        axios.put(
            `/api/authorize/reject/${this.props.id}`,
            data
        ).then(
            () => {
                if (this.props.last) {
                    this.updateData();
                }
                else {
                    this.setState({
                        finish: true
                    });
                    setLoading(false);
                }
            }
        ).catch(
            () => {
                showMessage("執行失敗", "執行失敗，請嘗試重新整理頁面。", "error");
                setLoading(false);
            }
        )
    }

    render() {
        const createTime = this.props.createTime;
        const startDate = this.props.startDate;
        const endDate = this.props.endDate;
        const startLesson = this.props.startLesson;
        const endLesson = this.props.endLesson;
        const type = this.props.type;
        const remark = this.props.remark;
        const files = this.props.files;
        const sid = this.props.sid;
        const name = this.props.name;
        const className = this.props.className;
        return (
            <div className={`result-page ${this.state.finish ? "finish" : ""}`}>
                <div className="title">個人資料</div>
                <ul>
                    <li>
                        <p>姓名：{name}</p>
                    </li>
                    <li>
                        <p>學號：{sid}</p>
                    </li>
                    <li>
                        <p>班級：{className}</p>
                    </li>
                </ul>
                <div className="title">請假資料</div>
                <ul>
                    <li>
                        <p>請假時間：{createTime.split(".", 1)[0]}</p>
                    </li>
                    <li>
                        <p>假別：{type}</p>
                    </li>
                    <li>
                        <p>開始時間：{startDate} {startLesson}</p>
                    </li>
                    <li>
                        <p>結束時間：{endDate} {endLesson}</p>
                    </li>
                </ul>
                <div className="title">請假事由</div>
                <div className="reason">{remark || "無"}</div>
                <div className="title">附件</div>
                <div className="img-content">
                    {files.length === 0 ? "無" : files}
                </div>
                <div className="operation">
                    <hr />
                    <div
                        ref={this.ref}
                        className={`reject-reason ${this.state.reject ? "rejecting" : ""}`}
                        contentEditable
                    />
                    <button
                        className={`accept ${this.state.reject ? "rejecting" : ""}`}
                        onClick={this.state.reject ? this.hideRejectBox : this.accept}
                    >
                        {this.state.reject ? "回上頁" : "允許"}
                    </button>
                    <button
                        className="reject"
                        onClick={this.state.reject ? this.reject : this.showRejectBox}
                    >
                        拒絕
                    </button>
                    <button
                        className="skip"
                        onClick={() => {this.setState({finish: true})}}
                    >
                        跳過
                    </button>
                </div>
            </div>
        )
    }
}