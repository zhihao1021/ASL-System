import React from "react";

import DetailBox from "../detail-box";
import LoadingBox from "../loading-box";
import ResultBox from "../result-box";

import "../../css/query-results/main.css"

export default class Results extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            displayData: undefined
        }
        this.setQuerySelect = props.setQuerySelect;
        this.updateResultData = props.updateResultData;
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
        const select = this.props.querySelect;
        this.setState(() => {
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

    scrollDown(event) {
        const element = event.target;
        if (element.scrollTop > element.scrollHeight - (element.clientHeight * 1.5)) {
            if (this.props.hasUpdate) {
                this.updateResultData();
            }
        }
    }

    render() {
        const display = this.props.display;
        const typeOptions = this.props.typeOptions;
        const lessonOptions = this.props.lessonOptions;
        const select = this.props.querySelect
        const rawData = this.props.data;
        // .slice(Math.max(0, rawData.length - 10))
        const list = rawData.map((data, index) => {
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
                <div className="results" onScroll={this.scrollDown.bind(this)}>
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
                    name={userData.name}
                    sid={userData.sid}
                    userClass={userData.userClass}
                    data={this.state.displayData}
                />
            </div>
        )
    }
}
