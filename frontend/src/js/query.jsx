import axios from "axios";
import React from "react";

import QueryBlock from "./query-block/main";
import Results from "./query-results/main";
import TitleBar from "./title-bar";

import { setLoading, showMessage } from "../utils";

import "../css/query.css";

export default class Query extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            display: 0,
            queryDisplay: 0,
            data: [],
            userData: {},
            pageUpdated: 0,
            querySelect: undefined
        };
        
        this.sid = undefined;
        this.updateLock = false

        this.setSelect = this.setSelect.bind(this);
        this.setQuerySelect = this.setQuerySelect.bind(this);
        this.getResult = this.getResult.bind(this);
        this.updateResultData = this.updateResultData.bind(this);
        this.back = this.back.bind(this);
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

    setQuerySelect(value) {
        this.setState({
            querySelect: value
        })
    }

    getResult(sid, callback) {
        setLoading(true);
        this.sid = sid;
        axios.all([
            axios.get(`/api/leave/sid/${sid}`),
            axios.get(`/api/info/user/${sid}`),
        ]).then(
            (responses) => {
                let leaveData = responses[0].data.data;
                let userData = responses[1].data.data;
                axios.get(`/api/class/${userData.class_code}`).then(
                    (response) => {
                        let userClass = response.data.data.class_name;
                        userData.userClass = userClass === "None" ? "無" : userClass;
                        this.setState({
                            display: 1,
                            data: leaveData,
                            userData: userData,
                            pageUpdated: leaveData.length < 10 ? -1 : 1
                        })
                    }
                ).finally(
                    () => {
                        setLoading(false);
                    }
                )
            }
        ).catch(
            () => {
                showMessage("查詢失敗", "查詢失敗，請次檢查輸入參數。", "error");
                setLoading(false);
            }
        )
        if (callback) {
            callback();
        }
    }

    updateResultData() {
        if (this.state.pageUpdated === -1 || this.updateLock || this.sid === undefined) {
            return
        }
        this.updateLock = true;
        axios.get(`/api/leave/sid/${this.sid}?page=${this.state.pageUpdated}`).then(
            (response)=>{
                const data = response.data.data;
                this.setState((state) => {
                    return {
                        data: state.data.concat(data),
                        pageUpdated: data.length < 10 ? -1 : state.pageUpdated + 1
                    }
                })
            }
        ).finally(
            () => {
                this.updateLock = false;
            }
        )
    }

    back() {
        if (this.state.querySelect === undefined) {
            this.setState({
                display: 0,
            })
        }
        else {
            this.setState({
                querySelect: undefined
            })
        }
    }

    render() {
        const display = this.props.display;
        return (
            <div id="query" style={{ "display": display ? "" : "none" }}>
                <TitleBar title="查詢">
                    <button onClick={this.back}>
                        <p className="ms">arrow_back</p>
                        <p>回上頁</p>
                    </button>
                    <button onClick={() => {window.open(`/api/leave/sid/${this.sid}/export`, "_blank").focus();}}>
                        <p className="ms">ios_share</p>
                        <p>匯出檔案</p>
                    </button>
                </TitleBar>
                <hr />
                <div className="content">
                    <QueryBlock
                        display={this.state.display === 0}
                        getResult={this.getResult}
                        setSelect={this.setSelect}
                        queryDisplay={this.state.queryDisplay}
                    />
                    <Results
                        display={this.state.display === 1}
                        data={this.state.data}
                        userData={this.state.userData}
                        querySelect={this.state.querySelect}
                        setQuerySelect={this.setQuerySelect}
                        updateResultData={this.updateResultData}
                        hasUpdate={this.state.pageUpdated !== -1}
                    />
                </div>
            </div>
        )
    }
}
