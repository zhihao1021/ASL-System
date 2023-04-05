import React from "react";

import TitleBox from "./title-box";

import "../../css/old-leave/result-box.css"

function getStatus(status) {
    switch (status) {
        case 0b1000:
            return "已完成"
        case 0b0100:
            return "等待學務主任核准"
        case 0b0010:
            return "等待教官核准"
        case 0b0001:
            return "等待導師核准"
        case 0b1001:
            return "學務主任退回"
        case 0b0101:
            return "教官退回"
        case 0b0011:
            return "導師退回"
        default:
            return "未知"
    }
}

function getClassName(status) {
    switch (status) {
        case 0b1001:
        case 0b0101:
        case 0b0011:
            return "reject"
        case 0b1000:
            return "accept"
        default:
            return ""
    }
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
