import React from "react";

import "../css/input-box.css";

export default class InputBox extends React.Component {
    constructor(props) {
        super(props);
        this.ref = props.cref || React.createRef();
        this.title = props.title;
        this.necessary = props.necessary || false;
        this.type = props.type || "text";
        this.autoFocus = props.autoFocus || false;
        this.onChangeFunc = props.onChangeFunc;
        this.state = {
            empty: true,
        }
        this.first = true;
        if (this.necessary) {
            this.title += "*";
        }
        this.default = props.default;
    }

    componentDidMount() {
        if (this.default !== undefined) {
            this.ref.current.value = this.default;
            this.setState({
                empty: false
            })
        }
    }

    componentDidUpdate() {
        if (this.ref.current) {
            if (this.ref.current.value === "" && !this.state.empty) {
                this.setState({
                    empty: true
                });
            }
        }
    }

    onChange(event) {
        this.first = false
        if (event.target.value) {
            this.setState({
                empty: false
            });
        }
        else {
            this.setState({
                empty: true
            });
        }
        if (this.onChangeFunc !== undefined) {
            this.onChangeFunc(event);
        }
    }

    render() {
        const check = this.props.check;
        let classList = [
            this.props.className || "",
            "input-box",
        ];
        if (this.state.empty) {
            classList.push("empty")
        }
        if (this.necessary) {
            classList.push("necessary")
        }
        if (check) {
            classList.push("check")
        }
        if (this.first) {
            classList.push("first")
        }
        return (
            <div
                style={{
                    "--content": `"${this.title}"`
                }}
                className={classList.join(" ")}
            >
                <input
                    ref={this.ref}
                    onChange={this.onChange.bind(this)}
                    type={this.type}
                    autoFocus={this.autoFocus}
                />
            </div>
        );
    }
}