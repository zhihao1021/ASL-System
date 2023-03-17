import axios from "axios";
import React from "react";

import Page from "./page";
import DateBox from "./date-box";
import ButtonBar from "./button-bar";

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
            typeOptions: [],
            typeSelect: -1,
            startDateCheck: false,
            endDateCheck: false,
        };

        this.startDate = [
            React.createRef(),
            React.createRef(),
            React.createRef(),
            React.createRef(),
        ];
        this.endDate = [
            React.createRef(),
            React.createRef(),
            React.createRef(),
            React.createRef(),
        ];
        this.date = new Date();
    }

    componentDidMount() {
        this.getLeaveType();
    }

    getLeaveType() {
        axios.get("/api/leave/type")
            .then(
                (response) => {
                    this.setState({
                        typeOptions: response.data.data
                    });
                }
            )
    }

    setPage(i) {
        this.setState({
            proc: 15 * i + 10,
            display: i,
        });
    }

    checkDate(index) {
        let list;
        if (index === 0) {
            list = this.startDate;
            this.setState({
                startDateCheck: true
            })
        }
        else {
            list = this.endDate;
            this.setState({
                endDateCheck: true
            })
        }
        let firstEmpty = null;
        list.forEach((ref) => {
            if (ref.current.value === "") {
                if (firstEmpty === null) {
                    firstEmpty = ref;
                }
            }
        });
        if (firstEmpty === null) {
            return true;
        }
        firstEmpty.current.focus();
        return false;
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
                        className={`tag ${this.state.display >= index ? "activate" : ""}`}
                        style={{ "--pos": pos }}
                    >
                        {flowName}
                    </div>
                );
            }
        );
        const typeOptions = this.state.typeOptions.map(
            (tpyeString, index) => {
                return (
                    <div
                        key={index}
                        className={`option ${this.state.typeSelect === index ? "selected" : ""}`}
                        onClick={() => { this.setState({ typeSelect: index }); this.setPage(1) }}
                    >
                        {tpyeString}
                    </div>
                )
            }
        );
        return (
            <div className="new-leave" style={{ "display": display ? "" : "none" }}>
                <div className="flow" style={{ "--proc": `${this.state.proc}%` }}>
                    {flow}
                </div>
                <Page className="select-type" display={this.state.display === 0}>
                    {typeOptions}
                </Page>
                <Page className="start-time" display={this.state.display === 1}>
                    <DateBox refList={this.startDate} prefix="start" check={this.state.startDateCheck} />
                    <ButtonBar last={0} next={2} nextClick={this.checkDate.bind(this, 0)} setPage={this.setPage.bind(this)} />
                </Page>
                <Page className="end-time" display={this.state.display === 2}>
                    <DateBox refList={this.endDate} prefix="end" check={this.state.endDateCheck} />
                    <ButtonBar last={1} next={3} nextClick={this.checkDate.bind(this, 1)} setPage={this.setPage.bind(this)} />
                </Page>
            </div>
        );
    }
}
