import React from "react";

import QueryByName from "./query-by-name";
import QueryBySid from "./query-by-sid";

import "../../css/query-block/main.css"

export default class QueryBlock extends React.Component {
    constructor(props) {
        super(props);
        this.getResult = props.getResult;
        this.setSelect = props.setSelect;
    }

    render() {
        const display = this.props.display;
        const queryDisplay = this.props.queryDisplay;
        return (
            <div className={`query-block ${display ? "display" : ""}`}>
                <div className={`query-page`}>
                    <QueryBySid
                        getResult={this.getResult}
                        setSelect={this.setSelect}
                        selected={queryDisplay === 1}
                    />
                    <hr />
                    <QueryByName
                        getResult={this.getResult}
                        setSelect={this.setSelect}
                        selected={queryDisplay === 2}
                    />
                </div>
            </div>
        )
    }
}
