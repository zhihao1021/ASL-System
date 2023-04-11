import React from "react";

import QueryByName from "./query-by-name/main";
import QueryBySid from "./query-by-sid/main";
import TitleBar from "./title-bar";

import "../css/query.css";

export default class Query extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            display: 0,
            queryDisplay: 0
        };
        this.showMessage = props.showMessage;
        this.loading = props.loading;
    }

    componentDidUpdate(props) {
        if (!props.display && this.props.display) {
            window.location.hash = "query";
        }
    }

    setSelect(i) {
        this.setState({
            queryDisplay: i
        });
    }

    getResult(sid, callback) {
        console.log(sid)
        if (callback) {
            callback();
        }
    }

    render() {
        const display = this.props.display;
        return (
            <div id="query" style={{ "display": display ? "" : "none" }}>
                <TitleBar title="查詢">
                    <button>
                        <p className="ms">filter_alt</p>
                        <p>篩選器</p>
                    </button>
                </TitleBar>
                <hr />
                <div className="content">
                    <div className={`query-page ${this.state.display === 0 ? "display" : ""}`}>
                        <QueryBySid
                            loading={this.loading}
                            getResult={this.getResult.bind(this)}
                            setSelect={this.setSelect.bind(this)}
                            selected={this.state.queryDisplay === 1}
                            />
                        <hr />
                        <QueryByName
                            loading={this.loading}
                            getResult={this.getResult.bind(this)}
                            setSelect={this.setSelect.bind(this)}
                            selected={this.state.queryDisplay === 2}
                        />
                    </div>
                    <div className={`results ${this.state.display === 1 ? "display" : ""}`}>

                    </div>
                </div>
            </div>
        )
    }
}
