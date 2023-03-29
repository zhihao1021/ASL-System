import React from "react";

import TitleBox from "./title-box";

import "../../css/old-leave/result-box.css"

function getStatus(status) {
    if (status >= 0b1000) {
        return "已完成"
    }
    if (status >= 0b0100) {
        return "等待學務主任核准"
    }
    if (status >= 0b0010) {
        return "等待教官核准"
    }
    if (status >= 0b0001) {
        return "等待導師核准"
    }
}

export default class ResultBox extends React.Component {
    constructor(props) {
        super(props);
    }
    
    render() {
        const createTime = this.props.createTime.split(".")[0];
        const startDate = this.props.startDate;
        const endDate = this.props.endDate;
        const startLesson = this.props.startLesson;
        const endLesson = this.props.endLesson;
        const remark = this.props.remark;
        const type = this.props.type;
        const status = this.props.status;
        return (
            <div className="result-box">
                <TitleBox icon="more_time" title="創建時間">
                    <div className="content">{createTime}</div>
                </TitleBox>
                <TitleBox icon="construction" title="假別">
                    <div className="content">{type}</div>
                </TitleBox>
                <TitleBox icon="calendar_month" title="起始日期">
                    <div className="content">{startDate} {startLesson}</div>
                </TitleBox>
                <TitleBox icon="calendar_month" title="結束日期">
                    <div className="content">{endDate} {endLesson}</div>
                </TitleBox>
                <TitleBox icon="info" title="備註">
                    <div className="content">{remark || "無"}</div>
                </TitleBox>
                <TitleBox icon="question_mark" title="當前狀態">
                    <div className="content">{getStatus(status)}</div>
                </TitleBox>
            </div>
        )
    }
}
