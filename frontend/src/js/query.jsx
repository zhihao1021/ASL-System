import axios from "axios";
import React from "react";

import QueryBlock from "./query-block/main";
import Results from "./query-results/main";
import TitleBar from "./title-bar";

import "../css/query.css";

export default class Query extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            display: 0,
            queryDisplay: 0,
            data: [],
            userData: {}
        };
        this.showMessage = props.showMessage;
        this.loading = props.loading;
    }

    componentDidUpdate(props) {
        if (!props.display && this.props.display) {
            window.location.hash = "query";
        }
    }

    setSelect(i) {
        this.setState({
            queryDisplay: i
        });
    }

    getResult(sid, callback) {
        this.loading(true);
        axios.all([
            axios.get(`/api/leave/sid/${sid}`),
            axios.get(`/api/info/user/${sid}`),
        ]).then(
            (responses) => {
                let leaveData = responses[0].data.data;
                let userData = responses[1].data.data;
                axios.get(`/api/class/${userData.class_id}`).then(
                    (response) => {
                        let userClass = response.data.data.class_name;
                        userData.userClass = userClass === "None" ? "無" : userClass;
                        this.setState({
                            display: 1,
                            data: leaveData,
                            userData: userData
                        })
                    }
                ).finally(
                    () => {
                        this.loading(false);
                    }
                )
            }
        ).catch(
            () => {
                this.showMessage("查詢失敗", "查詢失敗，請次檢查輸入參數。", "error");
                this.loading(false);
            }
        )
        if (callback) {
            callback();
        }
    }

    render() {
        const display = this.props.display;
        const lessonOptions = this.props.lessonOptions;
        const typeOptions = this.props.typeOptions;
        return (
            <div id="query" style={{ "display": display ? "" : "none" }}>
                <TitleBar title="查詢">
                    <button onClick={() => { this.setState({ display: 0 }) }}>
                        <p className="ms">arrow_back</p>
                        <p>回上頁</p>
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
                    />
                    <Results
                        display={this.state.display === 1}
                        data={this.state.data}
                        userData={this.state.userData}
                        typeOptions={typeOptions}
                        lessonOptions={lessonOptions}
                    />
                </div>
            </div>
        )
    }
}
