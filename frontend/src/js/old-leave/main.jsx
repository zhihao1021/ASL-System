import axios from "axios";
import React from "react";

import DetailBox from "./detail";
import ResultBox from "./result-box";

import "../../css/old-leave/main.css"


export default class OldLeave extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            select: undefined,
            displayData: {},
        };
        this.showMessage = props.showMessage;
        this.loading = props.loading;
        this.reload = () => {
            this.setState({
                select: undefined,
                displayData: {}
            });
            this.getLeaveData();
        };
        this.name = props.name;
        this.sid = props.sid;
        this.userClass = props.userClass;
        this.getLeaveData = props.getLeaveData;
    }

    componentDidMount() {
        this.getLeaveData();
    }

    select(leave) {
        const typeOptions = this.props.typeOptions;
        const lessonOptions = this.props.lessonOptions;
        this.setState(() => {
            let displayData = Object.assign({}, leave);
            displayData.start_lesson = lessonOptions[leave.start_lesson];
            displayData.end_lesson = lessonOptions[leave.end_lesson];
            displayData.type = typeOptions[leave.type];

            return {
                select: leave.id,
                displayData: displayData
            };
        })
    }

    delete() {
        if (this.state.select === undefined) {
            this.showMessage("刪除失敗", "未選擇任何資料。", "error");
        }
        else {
            this.loading(true);
            axios.delete(
                `/api/leave/id/${this.state.select}`
            ).then(
                () => {
                    this.showMessage("刪除成功", "請假資料刪除成功。", "success");
                }
            ).catch(        
                () => {
                    this.showMessage("刪除失敗", "請假資料刪除失敗。\n(注意: \"已完成\"之資料不可刪除)", "error");
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
        const typeOptions = this.props.typeOptions;
        const lessonOptions = this.props.lessonOptions;
        const list = this.props.data.map((data, index)=>{
            return (
                <ResultBox
                    key={index}
                    createTime={data.create_time}
                    startDate={data.start_date}
                    endDate={data.end_date}
                    startLesson={lessonOptions[data.start_lesson]}
                    endLesson={lessonOptions[data.end_lesson]}
                    remark={data.remark}
                    files={data.files}
                    type={typeOptions[data.type]}
                    status={data.status}
                    select={this.state.select === data.id}
                    onClick={this.select.bind(this, data)}
                />
            );
        })
        return (
            <div className="old-leave" style={{ "display": display ? "" : "none" }}>
                <div className="button-bar">
                    <button onClick={() => {this.setState({select: undefined})}}>回上頁</button>
                    <div className="empty" />
                    <button onClick={this.delete.bind(this)}>移除請假</button>
                    <button onClick={this.reload}>重新整理</button>
                </div>
                <div className="content">
                    <div className="results">
                        {list}
                    </div>
                    <DetailBox
                        name={this.name}
                        sid={this.sid}
                        userClass={this.userClass}
                        data={this.state.displayData}
                    />
                </div>
            </div>
        );
    }
}
