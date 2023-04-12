import React from "react";

import InputBox from "../input-box";

import "../../css/query-block/query-filter.css"

export default class QueryFilter extends React.Component {
    constructor(props) {
        super(props);
        this.startDateRefList = props.startDateRefList || [];
        this.endDateRefList = props.endDateRefList || [];
    }

    render() {
        const display = this.props.display;
        return (
            <div className={`query-filter ${display ? "display" : ""}`}>
                <div className="filter-box">
                    <div className="input-block">
                        <p>起始日期</p>
                        <div className="date-box">
                            <InputBox
                                cref={this.startDateRefList[0]}
                                title="西元"
                            />
                            <InputBox
                                cref={this.startDateRefList[1]}
                                title="月"
                            />
                            <InputBox
                                cref={this.startDateRefList[2]}
                                title="日"
                            />
                        </div>
                        <p>結束日期</p>
                        <div className="date-box">
                            <InputBox
                                cref={this.endDateRefList[0]}
                                title="西元"
                            />
                            <InputBox
                                cref={this.endDateRefList[1]}
                                title="月"
                            />
                            <InputBox
                                cref={this.endDateRefList[2]}
                                title="日"
                            />
                        </div>
                    </div>
                    <hr />
                    <div className="input-block">
                        <label></label>
                    </div>
                </div>
            </div>
        )
    }
}