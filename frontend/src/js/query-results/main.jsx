import React from "react";

import DetailBox from "../detail-box";
import ResultBox from "../result-box";

import "../../css/query-results/main.css"

export default class Results extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            select: undefined,
            displayData: undefined
        }
    }

    componentDidUpdate(props) {
        if (props.display !== this.props.display) {
            this.setState({
                select: undefined,
                displayData: undefined
            })
        }
    }

    select(leave) {
        const typeOptions = this.props.typeOptions;
        const lessonOptions = this.props.lessonOptions;
        this.setState((state) => {
            if (state.select === leave.id) {
                return {
                    select: undefined,
                    displayData: undefined
                }
            }
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

    render() {
        const display = this.props.display;
        const typeOptions = this.props.typeOptions;
        const lessonOptions = this.props.lessonOptions;
        const list = this.props.data.map((data, index) => {
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
        });
        const userData = this.props.userData;
        return (
            <div className={`query-results ${display ? "display" : ""}`}>
                <div className="results">
                    <div className={`icon ${list.length === 0 ? "display" : ""}`}>
                        <div className="ms">quick_reference_all</div>
                        <div>無紀錄</div>
                    </div>
                    {list}
                </div>
                <DetailBox
                    name={userData.name}
                    sid={userData.sid}
                    userClass={userData.userClass}
                    data={this.state.displayData}
                />
            </div>
        )
    }
}
