import { Typography, Grid, Button } from "@mui/material";
import React, { Component } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import HomePage from "./CreateRoomPage"
import MusicPlayer from "./MusicPlayer";

function withRouter(Component) {
    function ComponentWithRouterProp(props) {
        let params = useParams();
        let navigate = useNavigate(); 
        return <Component {...props} params={params} navigate={navigate} />
    }

    return ComponentWithRouterProp;
}


class Room extends Component {
    constructor(props) {
        super(props);
        this.state = {
            votesToSkip : 2,
            guestCanPause : false,
            isHost : false,
            showSettings: false,
            spotifyAuthenticated: false,
            song: {},
        };
        this.roomCode = this.props.params.roomCode;
        this.leaveButtonPressed = this.leaveButtonPressed.bind(this);
        this.updateShowSettings = this.updateShowSettings.bind(this);
        this.renderSettingsButton = this.renderSettingsButton.bind(this);
        this.renderSettings = this.renderSettings.bind(this);
        this.getRoomDetails = this.getRoomDetails.bind(this);
        this.authenticateSpotify = this.authenticateSpotify.bind(this);
        this.getCurrentSong = this.getCurrentSong.bind(this);
    }

    componentDidMount() {
        this.getRoomDetails();
        this.interval = setInterval(this.getCurrentSong, 1000);
    }
    
    componentWillUnmount() {
        clearInterval(this.interval);
    }

    getRoomDetails() {
        fetch('/api/getroom' + '?code=' + this.roomCode)
        .then((response) => {
            if(!response.ok) {
                this.props.leaveRoomCallback()
                this.props.navigate("/");
                return null;
            }
            return response.json();
        })
        .then((data) => {
            this.setState({
                votesToSkip: data.votes_to_skip,
                guestCanPause: data.guest_can_pause,
                isHost: data.is_host,
            });
            if (this.state.isHost) {
                this.authenticateSpotify();
            }
        });
    }

    authenticateSpotify() {
        fetch("/spotify/is_authenticated")
        .then((response) => response.json())
        .then((data) => {
            this.setState({ spotifyAuthenticated: data.status });
            console.log(data.status);
            if(!data.status) {
                fetch('/spotify/getauthurl')
                .then((response) => response.json())
                .then((data) => {
                    window.location.replace(data.url);
                });
            }
        });
    }

    getCurrentSong() {
        fetch("/spotify/currentsong")
        .then((response) => {
            if(!response.ok) {
                return {};                
            } else {
                return response.json();
            }            
        })
        .then((data) => {
            this.setState({song:data});
            console.log(data);
        })
        .catch((error) => console.log(error)) ;
    }


    leaveButtonPressed() {
        const requestOptions = {
            method:"POST",
            headers: { "Content-Type": "application/json" },
        };
        fetch("/api/leaveroom", requestOptions)
        .then((_response) => {
            this.props.leaveRoomCallback();
            this.props.navigate("/");
        });
    }

    updateShowSettings(value) {
        this.setState({
            showSettings: value,
        });
    }

    renderSettings() {
        return (
        <Grid container spacing={1}>
            <Grid item xs={12} align="center">
                <HomePage 
                update={true}
                votesToSkip={this.state.votesToSkip}
                guestCanPause={this.state.guestCanPause}
                roomCode={this.roomCode}
                updateCallback={this.getRoomDetails}
                />
            </Grid>
            <Grid item xs={12} align="center">
                <Button
                variant="contained"
                color = "secondary"
                onClick = {() => this.updateShowSettings(false)}
                >
                    Close
                </Button>
            </Grid>
        </Grid>
        );
    }

    renderSettingsButton() {
        return (
            <Grid item xs={12} align="center">
                <Button 
                variant="contained"
                color="primary"
                onClick={() => this.updateShowSettings(true)}
                >
                    Settings
                </Button>
            </Grid>
        );
    }

    render() {
        if (this.state.showSettings) {
            return this.renderSettings();
        }
        return (
            <Grid container spacing={1} alignItems="center">
                <Grid item xs={12} align="center">
                    <Typography variant="h4" component="h4">
                        Code: {this.roomCode}
                    </Typography>
                </Grid>
                <MusicPlayer {...this.state.song} />
                { this.state.isHost ? this.renderSettingsButton() : null }
                <Grid item xs={12} align="center">
                    <Button variant="contained" color="secondary" onClick={this.leaveButtonPressed} >
                        Back to Home
                    </Button>
                </Grid>
            </Grid>
        );
    }
}

export default withRouter(Room);