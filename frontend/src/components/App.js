import React, { Component } from "react";
import ReactDOM from "react-dom";
import HomePage from "./HomePage";
import RoomJoinPage from "./RoomJoinPage";
import CreateRoomPage from './CreateRoomPage';

export default class App extends Component {
    constructor(props) {
        super(props);
    }

    render(){
        return (
            <div className="center">
                <HomePage />
            </div>
        );
    }

}

const appDiv = document.getElementById("app");
ReactDOM.render(<App />, appDiv);
