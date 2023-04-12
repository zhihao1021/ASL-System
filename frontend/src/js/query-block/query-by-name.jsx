import axios from "axios";
import React from "react";

import SelectOption from "./select-option";

import "../../css/query-block/query-by-name.css"

export default class QueryByName extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            display: 0,
            selected: -1,
            classData: [],
            userData: []
        };
        this.getResult = props.getResult;
        this.loading = props.loading;
        this.setSelect = props.setSelect;
    }

    componentDidMount() {
        this.getClass();
    }

    reset() {
        this.setState({
            display: 0,
            selected: -1,
            userData: []
        });
        this.setSelect(0);
    }

    getClass() {
        this.loading(true);
        axios.get("/api/class").then(
            (response) => {
                const classData = response.data.data;
                this.setState({
                    classData: classData
                });
            }
        ).finally(() => {
            this.loading(false);
        })
    }

    getUser() {
        this.loading(true);
        setTimeout(() => {
            axios.get(`/api/class/${this.state.selected}/students`).then(
                (response) => {
                    const userData = response.data.data;
                    this.setState({
                        userData: userData
                    });
                }
            ).finally(() => {
                this.setState({
                    display: 1
                })
                this.loading(false);
            })
        }, 500);
    }

    selectClass(i) {
        if (this.state.selected === i) {
            this.setState({
                selected: -1,
            });
            this.setSelect(0);
        }
        else {
            this.setState({
                selected: i,
            });
            this.setSelect(2);
            this.getUser();
        }
    }

    back() {
        if (this.state.display === 0) {
            this.setState({
                selected: -1,
            });
            this.setSelect(0);
        }
        else {
            this.setState({
                display: 0
            })
        }
    }

    render() {
        const selected = this.props.selected;
        const classList = this.state.classData.map((data, index) => {
            return (
                <SelectOption
                    key={index}
                    context={data.class_name}
                    select={this.selectClass.bind(this, data.id)}
                    selected={data.id === this.state.selected}
                />
            )
        });
        const userList = this.state.userData.map((data, index) => {
            return (
                <SelectOption
                    key={index}
                    context={data.name}
                    select={() => { this.getResult(data.sid, this.reset.bind(this)) }}
                />
            )
        });
        return (
            <div className={`query-name ${selected ? "selected" : ""}`}>
                <div className="title">
                    <p>依班級查詢</p>
                    <button onClick={this.back.bind(this)}>回上頁</button>
                </div>
                <div className={`select-page ${this.state.display === 0 ? "display" : ""}`}>
                    {classList}
                </div>
                <div className={`select-page ${this.state.display === 1 ? "display" : ""}`}>
                    {userList}
                </div>
            </div>
        )
    }
}
