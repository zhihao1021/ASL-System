import axios from "axios";
import React from "react";

import TitleBar from "./title-bar";

import "../css/authorize.css"

export default class Authorize extends React.Component {
    constructor(props) {
        super(props);
        this.showMessage = props.showMessage;
        this.loading = props.loading;
        this.state = {
            list: []
        }
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
        this.loading(true);
        const typeOptions = this.props.typeOptions;
        const lessonOptions = this.props.lessonOptions;
        if (typeOptions.length === 0 || lessonOptions.length === 0) {
            setTimeout(this.getData.bind(this), 500)
            return
        }
        axios.get("/api/leave/status/0").then(
            (response) => {
                let dataList = response.data.data.map((data) => {
                    let images = Array.from(Array(data.files || 0).keys()).map((index) => {
                        return <img key={index} src={`/api/leave/id/${data.id}/${index}`} alt="" />
                    })
                    data.start_lesson = lessonOptions[data.start_lesson];
                    data.end_lesson = lessonOptions[data.end_lesson];
                    data.type = typeOptions[data.type];
                    data.files = images;
                    return data;
                })
                axios.all(dataList.map((data) => {
                    return axios.get(`/api/info/user/${data.sid}`);
                })).then(
                    (responses) => {
                        axios.all(responses.map((response, index) => {
                            const data = response.data.data;
                            dataList[index].name = data.name;
                            return axios.get(`/api/class/${data.class_id}`);
                        })).then(
                            (responses) => {
                                responses.forEach((response, index) => {
                                    const data = response.data.data;
                                    dataList[index].class_name = data.class_name;
                                })
                                let list = dataList.map((data, index) => {
                                    return (
                                        <ResultBox
                                            key={index}
                                            showMessage={this.showMessage}
                                            loading={this.loading}
                                            id={data.id}
                                            createTime={data.create_time}
                                            startDate={data.start_date}
                                            endDate={data.end_date}
                                            startLesson={data.start_lesson}
                                            endLesson={data.end_lesson}
                                            type={data.type}
                                            remark={data.remark}
                                            files={data.files}
                                            sid={data.sid}
                                            name={data.name}
                                            className={data.class_name}
                                            updateTime={Date.now()}
                                        />
                                    )
                                });
                                this.setState({
                                    list: list
                                });
                            }
                        )
                    }
                )
            }
        ).finally(
            () => {
                this.loading(false);
            }
        )
    }

    render() {
        const display = this.props.display;
        return (
            <div id="authorize" style={{ "display": display ? "" : "none" }}>
                <TitleBar title="審核">
                    <button onClick={this.getData.bind(this)}>
                        重新整理
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

class ResultBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            finish: false,
            reject: false,
        }
        this.ref = React.createRef();
        this.showMessage = props.showMessage;
        this.loading = props.loading;
    }

    componentDidUpdate(props) {
        if (props.updateTime !== this.props.updateTime) {
            this.setState({
                finish: false,
                reject: false,
            });
        }
    }

    showRejectBox() {
        this.setState({
            reject: true
        });
    }

    hideRejectBox() {
        this.setState({
            reject: false
        });
    }

    accept() {
        this.loading(true);
        axios.put(`/api/authorize/accept/${this.props.id}`).then(
            () => {
                this.setState({
                    finish: true
                });
            }
        ).catch(
            () => {
                this.showMessage("執行失敗", "執行失敗，請嘗試重新整理頁面。", "error");
            }
        ).finally(
            () => {
                this.loading(false);
            }
        )
    }

    reject() {
        this.loading(true);
        let data = new FormData()
        data.append("reject_reason", this.ref.current.textContent || "");
        axios.put(
            `/api/authorize/reject/${this.props.id}`,
            data
        ).then(
            () => {
                this.setState({
                    finish: true
                });
            }
        ).catch(
            () => {
                this.showMessage("執行失敗", "執行失敗，請嘗試重新整理頁面。", "error");
            }
        ).finally(
            () => {
                this.loading(false);
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
            <div className={`result-box ${this.state.finish ? "finish" : ""}`}>
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
                        onClick={this.state.reject ? this.hideRejectBox.bind(this) : this.accept.bind(this)}
                    >
                        {this.state.reject ? "回上頁" : "允許"}
                    </button>
                    <button
                        className="reject"
                        onClick={this.state.reject ? this.reject.bind(this) : this.showRejectBox.bind(this)}
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