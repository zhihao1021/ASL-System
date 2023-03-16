import axios from "axios";
import React from "react";

import "../../css/leave/new-leave.css";

export default class NewLeave extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            proc: 10,
            display: 0,
            options: [],
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
                    const list = response.data.data.map(
                        (tpyeString, index) => {
                            return (
                                <option key={index} value={index}>
                                    {tpyeString}
                                </option>
                            )
                        }
                    );
                    this.setState({
                        options: list
                    });
                }
            )
    }

    changePage(i) {
        this.setState((state) => {
            return {
                proc: 15 * (state.display + i) + 10,
                display: state.display + i,
            }
        })
    }

    render() {
        const display = this.props.display;
        return (
            <div className="new-leave" style={{ "display": display ? "" : "none" }}>
                <div className="flow" style={{ "--proc": `${this.state.proc}%` }}></div>
                <Page className="select-type" display={this.state.display === 0}>
                    <div className="input-block">
                        <div>假別</div>
                        <select>{this.state.options}</select>
                    </div>
                    <div className="button-bar">
                        <button className="next" onClick={this.changePage.bind(this, 1)}>下一頁</button>
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