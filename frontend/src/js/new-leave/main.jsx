import axios from "axios";
import React from "react";

import Page from "./page";
import DateBox from "./date-box";
import ButtonBar from "./button-bar";

import { setLoading, showMessage } from "../../utils";
import { name, sid, className, leaveTypeList, lessonList } from "../../variables";

import "../../css/new-leave/main.css";

const flowMap = [
    "選擇假別",
    "起始時間",
    "結束時間",
    "請假事由",
    "上傳附件",
    "內容確認",
    "完成"
]

export default class NewLeave extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            proc: 10,
            display: 0,
            leaveTypeSelect: -1,
            dateCheck: 0,
            files: undefined,
            finish: false,
        };

        this.dateRefList = [
            [
                React.createRef(),
                React.createRef(),
                React.createRef(),
                React.createRef(),
            ],
            [
                React.createRef(),
                React.createRef(),
                React.createRef(),
                React.createRef(),
            ]
        ];
        this.reason = React.createRef();
        this.filesInput = React.createRef();

        this.dateList = [
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ];
        this.reasonContent = "";

        this.getLeaveData = props.getLeaveData;
        this.setPage = this.setPage.bind(this);
        this.saveReason = this.saveReason.bind(this);
        this.saveFiles = this.saveFiles.bind(this);
        this.checkFiles = this.checkFiles.bind(this);
        this.sendData = this.sendData.bind(this);
        this.dataInit = this.dataInit.bind(this)
    }

    dataInit() {
        this.setState({
            proc: 10,
            display: 0,
            leaveTypeSelect: -1,
            dateCheck: 0,
            files: undefined,
            finish: false,
        });
        this.dateList = [
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ];
        this.reasonContent = "";
    }

    setPage(i) {
        this.setState({
            proc: 15 * i + 10,
            display: i,
        });
    }

    checkDate(index) {
        this.setState((state) => {
            return {
                dateCheck: state.dateCheck | (1 << index)
            };
        })
        let emptyRef = this.dateRefList[index].filter(
            ref => ref.current.value === ""
        )[0];
        if (emptyRef) {
            emptyRef.current.focus();
            return false;
        }
        return true;
    }

    saveDate(index) {
        this.dateList[index] = this.dateRefList[index].map(
            ref => ref.current.value
        );
    }

    saveReason() {
        this.reasonContent = this.reason.current.textContent;
    }

    checkFiles() {
        if (this.filesInput.current.files.length > 3) {
            showMessage("檔案不符合限制", "不得選擇超過3個檔案。", "error");
            return false;
        }
        else if (Array.from(this.filesInput.current.files).filter(
            file => file.size > 10000000
        ).length !== 0) {
            showMessage("檔案不符合限制", "檔案不得超過10MB。", "error");
            return false;
        }
        return true;
    }

    saveFiles() {
        this.setState({
            files: this.filesInput.current.files
        });
    }

    sendData() {
        setLoading(true);
        let form = new FormData();
        form.append("leave_type", this.state.leaveTypeSelect);
        form.append("start_date", this.dateList[0].slice(0, 3).map(value => value.toString().padStart(2, "0")).join("-"));
        form.append("end_date", this.dateList[1].slice(0, 3).map(value => value.toString().padStart(2, "0")).join("-"));
        form.append("start_lesson", this.dateList[0][3]);
        form.append("end_lesson", this.dateList[1][3]);
        Array.from(this.state.files || []).forEach((file) => {
            form.append("files", file)
        });
        form.append("remark", this.reasonContent);
        axios.postForm(
            "/api/leave",
            form
        ).then(() => {
            this.setState({
                finish: true
            });
        }).catch(() => {
            this.setPage(this.state.display - 1);
            showMessage("發生錯誤", "發生錯誤，請重新檢查填寫容是否正確。", "error");
        }).finally(
            () => {
                setLoading(false);
                this.getLeaveData();
            }
        );
        return true;
    }

    render() {
        const display = this.props.display;
        const flow = flowMap.map(
            (flowName, index) => {
                let pos = 10 + 15 * index;
                pos = pos === 100 ? "100% - 1em" : `${pos}%`;
                return (
                    <div
                        key={index}
                        onClick={this.setPage.bind(this, index)}
                        className={`tag ${this.state.display >= index && !this.state.finish ? "activate" : ""}`}
                        style={{ "--pos": pos }}
                    >
                        {flowName}
                    </div>
                );
            }
        );
        const leaveTypeOptionsElement = Object.entries(leaveTypeList).map(
            (item, index) => {
                const leaveTypeCode = parseInt(item[0]);
                const leaveTypeName = item[1];
                return (
                    <div
                        key={index}
                        className={`option ${this.state.leaveTypeSelect === leaveTypeCode ? "selected" : ""}`}
                        onClick={() => {
                            this.setState({ leaveTypeSelect: leaveTypeCode });
                            this.setPage(1);
                        }}
                    >
                        {leaveTypeName}
                    </div>
                );
            }
        );
        const imgList = Array.from(this.state.files || []).map((file, index) => {
            return (
                <img key={index} src={URL.createObjectURL(file)} alt="附件" />
            );
        })
        return (
            <div className={`new-leave ${display ? "display" : ""}`}>
                <div className="flow" style={{ "--proc": `${this.state.proc}%` }}>
                    {flow}
                </div>
                <Page className="select-type" display={this.state.display === 0}>
                    {leaveTypeOptionsElement}
                </Page>
                <Page className="start-time" display={this.state.display === 1}>
                    <DateBox
                        refList={this.dateRefList[0]}
                        prefix="start"
                        check={this.state.dateCheck & 0b01}
                        defaultData={this.dateList[0]}
                        onUnmount={this.saveDate.bind(this, 0)}
                    />
                    <ButtonBar
                        now={1}
                        nextClick={this.checkDate.bind(this, 0)}
                        setPage={this.setPage}
                        display={this.state.display === 1}
                    />
                </Page>
                <Page className="end-time" display={this.state.display === 2}>
                    <DateBox
                        refList={this.dateRefList[1]}
                        prefix="end"
                        check={this.state.dateCheck & 0b10}
                        defaultData={this.dateList[1]}
                        onUnmount={this.saveDate.bind(this, 1)}
                    />
                    <ButtonBar
                        now={2}
                        nextClick={this.checkDate.bind(this, 1)}
                        setPage={this.setPage}
                        display={this.state.display === 2}
                    />
                </Page>
                <Page className="reason" display={this.state.display === 3}>
                    <TextDivInput
                        cref={this.reason}
                        content={this.reasonContent}
                        onUnmount={this.saveReason}
                    />
                    <ButtonBar
                        now={3}
                        setPage={this.setPage}
                        display={this.state.display === 3}
                    />
                </Page>
                <Page className="appendix" display={this.state.display === 4}>
                    <div className="rule">
                        上傳檔案規定
                        <ul>
                            <li>至多選擇3個檔案。</li>
                            <li>每個檔案不可超過10MB。</li>
                        </ul>
                    </div>
                    <FilesInput cref={this.filesInput} files={this.state.files} onUnmount={this.saveFiles} />
                    <ButtonBar
                        now={4}
                        nextClick={this.checkFiles}
                        setPage={this.setPage}
                        display={this.state.display === 4}
                    />
                </Page>
                <Page className="confirm" display={this.state.display === 5}>
                    <div className="confirm-data">
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
                                <p>假別：{leaveTypeList[this.state.leaveTypeSelect]}</p>
                            </li>
                            <li>
                                <p>開始時間：</p>
                                <p>{this.dateList[0][0]}年{this.dateList[0][1]}月{this.dateList[0][2]}日 {lessonList[this.dateList[0][3]]}</p>
                            </li>
                            <li>
                                <p>結束時間：</p>
                                <p>{this.dateList[1][0]}年{this.dateList[1][1]}月{this.dateList[1][2]}日 {lessonList[this.dateList[1][3]]}</p>
                            </li>
                        </ul>
                        <div className="title">請假事由</div>
                        <div className="reason">{this.reasonContent || "無"}</div>
                        <div className="title">附件</div>
                        <div className="img-content">
                            {imgList.length === 0 ? "無" : imgList}
                        </div>
                    </div>
                    <ButtonBar
                        now={5}
                        nextClick={this.sendData}
                        setPage={this.setPage}
                        final={true}
                        display={this.state.display === 5}
                    />
                </Page>
                <Page className="finished" display={this.state.display === 6 && this.state.finish}>
                    <FinishPage init={this.dataInit} />
                </Page>
            </div>
        );
    }
}

class FilesInput extends React.Component {
    constructor(props) {
        super(props);
        this.ref = props.cref;
        this.files = props.files;
        this.onUnmount = props.onUnmount;
    }

    componentDidMount() {
        if (this.files) {
            this.ref.current.files = this.files;
        }
    }

    componentWillUnmount() {
        if (this.onUnmount) {
            this.onUnmount();
        }
    }

    render() {
        return (
            <input ref={this.ref} type="file" accept="image/*" multiple />
        )
    }
}

class TextDivInput extends React.Component {
    constructor(props) {
        super(props);
        this.ref = props.cref;
        this.content = props.content;
        this.onUnmount = props.onUnmount;
    }

    componentDidMount() {
        if (this.content) {
            this.ref.current.textContent = this.content;
        }
    }

    componentWillUnmount() {
        if (this.onUnmount) {
            this.onUnmount();
        }
    }

    render() {
        return (
            <div
                ref={this.ref}
                className="reason-block"
                contentEditable
            />
        )
    }
}

class FinishPage extends React.Component {
    constructor(props) {
        super(props);
        this.init = props.init;
    }

    componentDidMount() {
        if (this.init) {
            setTimeout(this.init, 10000);
        }
    }

    render() {
        return (
            <div className="finish-box">
                <p className="ms">task_alt</p>
                <p>完成</p>
            </div>
        )
    }
}
