import React from "react";

export default class Page extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            className: props.className,
            mount: props.display,
            willUnmount: false,
        };
    }

    componentDidUpdate() {
        if (this.state.mount !== this.props.display) {
            this.setState({
                mount: this.props.display,
                willUnmount: !this.props.display
            });
        }
    }

    render() {
        const children = this.props.children;
        if (this.state.mount) {
            return (
                <div className={`page ${this.state.className}`}>
                    {children}
                </div>
            );
        }
        else if (this.state.willUnmount) {
            setTimeout(()=>{this.setState({willUnmount: false})}, 100)
            return (
                <div className={`page unmount ${this.state.className}`}>
                    {children}
                </div>
            );
        }
        return;
    }
}