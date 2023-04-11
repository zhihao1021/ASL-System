import React from "react";

export default class QueryFilter extends React.Component {
    render() {
        const display = this.props.display;
        return (
            <div className={`query-filter ${display ? "display" : ""}`}>

            </div>
        )
    }
}