import axios from "axios";
import React from "react";

import "../../css/leave/new-leave.css";

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
        };
        this.step = 0;
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
                    <div className="datetime-box">
                    </div>
                </Page>
            </div>
        );
    }
}

class Page extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            className: props.className,
        };
    }

    render() {
        const display = this.props.display;
        const children = this.props.children;
        return (
            <div className={`page ${this.state.className} ${display ? "display" : ""}`}>
                {children}
            </div>
        );
    }
}
