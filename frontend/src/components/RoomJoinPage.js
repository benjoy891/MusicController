import React, { Component } from "react";
import { TextField, Button, Grid, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import withRouter from "./withRouter";


class HomePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            roomCode: "",
            error: "",
        };
        this.handleTextFieldChange = this.handleTextFieldChange.bind(this);
        this.enterRoom = this.enterRoom.bind(this);
    }

    handleTextFieldChange(e) {
        this.setState({
            roomCode: e.target.value,
        });
    }

    enterRoom() {
        const requestOptions = {
            method:"POST",
            headers: { "Content-Type":"application/json" },
            body: JSON.stringify({
                code:this.state.roomCode,
            }),
        };
        fetch("/api/joinroom", requestOptions)
        .then((response) => {
            console.log("Join room response:", response);
            if (response.ok) {
                const navigate = this.props.navigate
                navigate(`/room/${this.state.roomCode}`)
            } else {
                this.setState({ error: "Room not found." });
            }
        })
        .catch((error) => {
            console.log("Error joining room", error);
        });
    }

    render() {
        return (
            <Grid
                container
                spacing={1}
                alignItems="center"
                justifyContent="center"
            >
                <Grid item xs={12} align="center">
                    <Typography variant="h4" component="h4">
                        Join a Room
                    </Typography>
                </Grid>
                <Grid item xs={12} align="center">
                    <TextField
                        error={!!this.state.error}
                        label="Room Code"
                        placeholder="Enter a room code"
                        value={this.state.roomCode}
                        helperText={this.state.error}
                        variant="outlined"
                        onChange={this.handleTextFieldChange}
                    />
                </Grid>
                <Grid item xs={12} align="center">
                    <Button
                        color="secondary"
                        variant="contained"
                        onClick={this.enterRoom}
                    >
                        Join a Room
                    </Button>
                </Grid>
                <Grid item xs={12} align="center">
                    <Button
                        color="primary"
                        variant="contained"
                        to="/"
                        component={Link}
                    >
                        Back
                    </Button>
                </Grid>
            </Grid>
        );
    }
}

export default withRouter(HomePage);