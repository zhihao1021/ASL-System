import React from "react";

import DetailBox from "../detail-box";
import ResultBox from "../result-box";

import "../../css/query-results/main.css"

export default class Results extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            displayData: undefined
        }
        this.setQuerySelect = props.setQuerySelect;
    }

    componentDidUpdate(props) {
        if (props.display !== this.props.display) {
            this.setState({
                displayData: undefined
            })
            this.setQuerySelect(undefined);
        }
        if (props.querySelect !== undefined && this.props.querySelect === undefined) {
            this.setState({
                displayData: undefined
            })
        }
    }

    select(leave) {
        const typeOptions = this.props.typeOptions;
        const lessonOptions = this.props.lessonOptions;
        const select = this.props.select;
        this.setState((state) => {
            if (select === leave.id) {
                this.setQuerySelect(undefined);
                return {
                    displayData: undefined
                }
            }
            let displayData = Object.assign({}, leave);
            displayData.start_lesson = lessonOptions[leave.start_lesson];
            displayData.end_lesson = lessonOptions[leave.end_lesson];
            displayData.type = typeOptions[leave.type];

            this.setQuerySelect(leave.id);
            return {
                displayData: displayData
            };
        })
    }

    render() {
        const display = this.props.display;
        const typeOptions = this.props.typeOptions;
        const lessonOptions = this.props.lessonOptions;
        const select = this.props.querySelect
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
                    select={select === data.id}
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
