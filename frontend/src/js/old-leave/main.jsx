import React from "react";


export default class OldLeave extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const display = this.props.display;
        return (
            <div className="old-leave" style={{ "display": display ? "" : "none" }}>
                
            </div>
        );
    }
}
