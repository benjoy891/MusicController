import React, { Component } from "react";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";  // Updated import path
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import { Link } from "react-router-dom";
import Radio from "@mui/material/Radio";  // Updated import path
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import withRouter from "./withRouter";
import { Collapse, Alert } from "@mui/material";



class HomePage extends Component {
    static defaultProps = {
        votesToSkip: 2,
        guestCanPause: true,
        update: false,
        roomCode: null,
        updateCallback: () => {},
    }
    constructor(props) {
        super(props);
        this.state = {
            guestCanPause: this.props.guestCanPause,
            votesToSkip: this.props.votesToSkip,
            errorMsg: "",
            successMsg: "",
        };

        this.handleVotesChange = this.handleVotesChange.bind(this);
        this.handleGuestCanPause = this.handleGuestCanPause.bind(this);
        this.handleCreateRoomButton = this.handleCreateRoomButton.bind(this);
        this.renderCreateButton = this.renderCreateButton.bind(this);
        this.renderUpdateButton = this.renderUpdateButton.bind(this);
        this.handleUpdateRoomButton = this.handleUpdateRoomButton.bind(this);
    }

    handleVotesChange(e) {
        this.setState({
            votesToSkip: e.target.value,
        });
    }


    handleGuestCanPause(e){
        this.setState({
            guestCanPause: e.target.value === "true" ? true : false,
        });
    }

    handleCreateRoomButton(){
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                votes_to_skip: this.state.votesToSkip,
                guest_can_pause: this.state.guestCanPause,
            }),
        };

        fetch("/api/createroom", requestOptions)
        .then((response) => {
            if(!response.ok) {
                throw new Error("Network response was not Ok");
            }
            return response.json();
        })
        .then((data) => {
            const navigate = this.props.navigate;
            navigate(`/room/${data.code}`);
        })
        .catch((error) => {
            console.error("There was a problem with the fetch operation:", error);
        });
    }

    handleUpdateRoomButton() {
        const requestOptions = {
            method : "PATCH",
            headers: {"Content-type": "application/json"},
            body: JSON.stringify({
                votes_to_skip: this.state.votesToSkip,
                guest_can_pause: this.state.guestCanPause,
                code: this.props.roomCode,
            }),
        };
        fetch("/api/updateroom", requestOptions)
        .then((response) => {
            if(response.ok) {
                this.setState({
                    successMsg: "Room updated Successfully!", errorMsg:""
                });
            } else {
                this.setState({
                    errorMsg: "Error updating room...", successMsg:""
                });
            }
            this.props.updateCallback();
        })
        .catch((error) => {
            console.error("There was a problem with the fetch operation:", error);
            this.setState({ errorMsg: "There was a problem"});
        });
    }

    renderCreateButton() {
        return (
            <Grid container spacing={1}>
                <Grid item xs={12} align="center">
                    <Button color="secondary" variant="contained" onClick={this.handleCreateRoomButton}>
                        Create a Room
                    </Button>
                </Grid>
                <Grid item xs={12} align="center">
                    <Button color="primary" variant="contained" to="/" component={Link}>
                        Back
                    </Button>
                </Grid>
            </Grid>
        );
    }

    renderUpdateButton() {
        return (
            <Grid container spacing={1}>
                <Grid item xs={12} align="center">
                    <Button color="primary" variant="contained" onClick={this.handleUpdateRoomButton}>
                        Update Room
                    </Button>
                </Grid>
            </Grid>
        );
    }

    
    render() {
        const title = this.props.update ? "Update Room" : "Create a Room";
        return (
            <Grid container spacing={1}>
                <Grid item xs={12}>
                    <Collapse in={this.state.errorMsg != "" || this.state.successMsg != ""}>
                        {this.state.successMsg ? (
                            <Alert 
                            severity="success" 
                            onClose={() => {this.setState({ successMsg: "" });
                        }}
                        >
                            {this.state.successMsg}</Alert>
                        ) : (
                            <Alert 
                            severity="error"
                            onClose={() => {this.setState({ errorMsg: "" });
                        }}
                        >
                            {this.state.errorMsg}</Alert>
                        )} 
                    </Collapse>
                </Grid>
                <Grid item xs={12} align="center">
                    <Typography component="h4" variant="h4">
                        {title}
                    </Typography>
                </Grid>
                <Grid item xs={12} align="center">
                    <FormControl component="fieldset">
                        <FormHelperText>
                            <div align="center">
                                Guest Control of Playback State
                            </div>
                        </FormHelperText>
                        <RadioGroup row defaultValue={this.props.guestCanPause.toString()} onChange={this.handleGuestCanPause}>
                            <FormControlLabel value="true" control={<Radio color="primary"/>} label="Play/Pause" labelPlacement="bottom" />
                            <FormControlLabel value="false" control={<Radio color="secondary"/>} label="No control" labelPlacement="bottom" />
                        </RadioGroup>
                    </FormControl>
                </Grid>
                <Grid item xs={12} align="center">
                    <FormControl>
                        <TextField 
                        required={true} 
                        onChange={this.handleVotesChange}
                        type="number" 
                        defaultValue={ this.state.votesToSkip} 
                        inputProps={{
                            min:1, style:{ textAlign: "center" }, 
                            }} 
                        />
                        <FormHelperText> 
                            <div align="center">
                                Votes Required to skip song.
                            </div>
                        </FormHelperText>
                    </FormControl>
                </Grid>
                {this.props.update ? this.renderUpdateButton() : this.renderCreateButton()}
            </Grid>
        );
    }
}
 

export default withRouter(HomePage);