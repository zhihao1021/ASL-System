import React from "react";

import QueryBlock from "./query-block/main";
import TitleBar from "./title-bar";

import "../css/query.css";

export default class Query extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            display: 0,
            queryDisplay: 0,
            filterDisplay: false
        };
        this.showMessage = props.showMessage;
        this.loading = props.loading;
    }

    componentDidUpdate(props) {
        if (!props.display && this.props.display) {
            window.location.hash = "query";
        }
    }

    switchFilter() {
        this.setState((state)=>{
            return {
                filterDisplay: !state.filterDisplay
            };
        })
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
                    <button onClick={this.switchFilter.bind(this)}>
                        <p className="ms">filter_alt</p>
                        <p>篩選器</p>
                    </button>
                </TitleBar>
                <hr />
                <div className="content">
                    <QueryBlock
                        display={this.state.display === 0}
                        loading={this.loading}
                        getResult={this.getResult.bind(this)}
                        setSelect={this.setSelect.bind(this)}
                        queryDisplay={this.state.queryDisplay}
                        filterDisplay={this.state.filterDisplay}
                    />
                    <div className={`results ${this.state.display === 1 ? "display" : ""}`}>

                    </div>
                </div>
            </div>
        )
    }
}
