import React from "react";

export default class Page extends React.Component {
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