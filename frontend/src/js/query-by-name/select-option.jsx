import React from "react";

export default class SelectOption extends React.Component {
    constructor(props) {
        super(props);
        this.select = props.select;
    }

    render() {
        const context = this.props.context;
        const selected = this.props.selected;
        return (
            <div
                className={`select-option ${selected ? "selected" : ""}`}
                onClick={this.select}
            >
                {context}
            </div>
        )
    }
}