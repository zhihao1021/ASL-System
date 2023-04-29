import axios from "axios";
import React from "react";

import DetailBox from "../detail-box";
import ResultBox from "../result-box";
import LoadingBox from "../loading-box";

import { setLoading, showMessage } from "../../utils";
import { sid, name, className, leaveTypeList, lessonList } from "../../variables";

import "../../css/old-leave/main.css"


export default class OldLeave extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            select: undefined,
            displayData: undefined,
        };

        this.reload = () => {
            this.setState({
                select: undefined,
                displayData: undefined
            });
            props.getLeaveData();
        };
        this.updateLeaveData = props.updateLeaveData;

        this.delete = this.delete.bind(this);
        this.scrollDown = this.scrollDown.bind(this);
    }

    select(leave) {
        this.setState((state) => {
            if (state.select === leave.id) {
                return {
                    select: undefined,
                    displayData: undefined
                }
            }
            let displayData = Object.assign({}, leave);
            displayData.start_lesson = lessonList[leave.start_lesson];
            displayData.end_lesson = lessonList[leave.end_lesson];
            displayData.type = leaveTypeList[leave.type];

            return {
                select: leave.id,
                displayData: displayData
            };
        })
    }

    scrollDown(event) {
        const element = event.target;
        if (element.scrollTop > element.scrollHeight - (element.clientHeight * 1.5)) {
            if (this.props.hasUpdate) {
                this.updateLeaveData();
            }
        }
    }

    delete() {
        if (this.state.select === undefined) {
            showMessage("刪除失敗", "未選擇任何資料。", "error");
        }
        else {
            setLoading(true);
            axios.delete(
                `/api/leave/id/${this.state.select}`
            ).then(
                () => {
                    showMessage("刪除成功", "請假資料刪除成功。", "success");
                }
            ).catch(
                () => {
                    showMessage("刪除失敗", "請假資料刪除失敗。\n(注意: \"已完成\"之資料不可刪除)", "error");
                }
            ).finally(
                () => {
                    setTimeout(this.reload, 500);
                }
            );
        }
    }

    render() {
        const display = this.props.display;
        const rawData = this.props.data;
        const list = rawData.map((data, index) => {
            return (
                <ResultBox
                    key={index}
                    createTime={data.create_time}
                    startDate={data.start_date}
                    endDate={data.end_date}
                    startLesson={lessonList[data.start_lesson]}
                    endLesson={lessonList[data.end_lesson]}
                    remark={data.remark}
                    files={data.files}
                    type={leaveTypeList[data.type]}
                    status={data.status}
                    select={this.state.select === data.id}
                    onClick={this.select.bind(this, data)}
                />
            );
        })
        return (
            <div className={`old-leave ${display ? "display" : ""}`}>
                <div className="button-bar">
                    <button onClick={() => { this.setState({ select: undefined }) }}>回上頁</button>
                    <div className="empty" />
                    <button onClick={this.delete}>移除請假</button>
                    <button onClick={this.reload}>重新整理</button>
                </div>
                <div className="content">
                    <div className="results" onScroll={this.scrollDown}>
                        <div className={`icon ${list.length === 0 ? "display" : ""}`}>
                            <div className="ms">quick_reference_all</div>
                            <div>無紀錄</div>
                        </div>
                        {list}
                        {
                            this.props.hasUpdate ? (
                                <div className="loading-update">
                                    <LoadingBox />
                                </div>
                            ) : null
                        }
                    </div>
                    <DetailBox
                        name={name}
                        sid={sid}
                        userClass={className}
                        data={this.state.displayData}
                    />
                </div>
            </div>
        );
    }
}
