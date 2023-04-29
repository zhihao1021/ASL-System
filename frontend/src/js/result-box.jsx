import React from "react";

import TitleBox from "./old-leave/title-box";

import { statusList } from "../variables";

import "../css/result-box.css"

function getStatus(status) {
    return statusList[status][0]
}

function getClassName(status) {
    return ["", "accept", "reject"][statusList[status][1] || 0]
}

export default class ResultBox extends React.Component {
    render() {
        const createTime = this.props.createTime.split(".")[0];
        const startDate = this.props.startDate;
        const endDate = this.props.endDate;
        const startLesson = this.props.startLesson;
        const endLesson = this.props.endLesson;
        const remark = this.props.remark;
        const files = this.props.files;
        const type = this.props.type;
        const status = this.props.status;
        const select = this.props.select;
        const onClick = this.props.onClick;
        return (
            <div
                className={"result-box " + (select ? "select " : "") + getClassName(status)}
                onClick={onClick}
            >
                <TitleBox icon="more_time" title="創建時間">
                    <div className="context">{createTime}</div>
                </TitleBox>
                <TitleBox icon="construction" title="假別">
                    <div className="context">{type}</div>
                </TitleBox>
                <TitleBox icon="calendar_month" title="起始日期">
                    <div className="context">{startDate} {startLesson}</div>
                </TitleBox>
                <TitleBox icon="calendar_month" title="結束日期">
                    <div className="context">{endDate} {endLesson}</div>
                </TitleBox>
                <TitleBox icon="attachment" title="附件">
                    <div className="context">{files === 0 ? "無" : `${files}個`}</div>
                </TitleBox>
                <TitleBox icon="question_mark" title="當前狀態">
                    <div className="context">{getStatus(status)}</div>
                </TitleBox>
                <TitleBox icon="info" title="備註">
                    <div className="context">{remark || "無"}</div>
                </TitleBox>
            </div>
        )
    }
}
