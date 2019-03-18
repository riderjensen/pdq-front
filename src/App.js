import React, { Component } from 'react';
import axios from 'axios';
import socketIOClient from "socket.io-client";
import './App.css';

import Spinner from '../src/components/Spinner';

class App extends Component {
  state = {
    info: {

    },
    endpoint: 'http://localhost:8080',
    loading: false,
    error: null
  }

  componentDidMount() {
    const socket = socketIOClient(this.state.endpoint);
    socket.on("loadingOne", data => {
      const state = { ...this.state };
      data.error ? state.error = data.error : state.error = null;
      state.loading = true;
      this.setState({
        ...state
      })
    });
    socket.on("information", data => {
      const state = { ...this.state };
      data.error ? state.error = data.error : state.error = null;
      state.info = { ...data };
      state.loading = false;
      this.setState({
        ...state
      })
    });
    socket.on("myError", data => {
      const state = { ...this.state };
      state.error = data;
      state.loading = false;
      this.setState({
        ...state
      })
    });
  }

  render() {
    return (<div className="App" >
      <header className="App-header" >
        {this.state.loading ? <Spinner /> : <button onClick={() => {
          const state = { ...this.state };
          state.loading = true;
          this.setState({
            ...state
          })
          axios.get('http://localhost:8080').then(resp => {
            const axiosState = { ...this.state };
            axiosState.info = resp.data;
            console.log(resp)
            this.setState({
              ...axiosState,
              loading: false,
              error: resp.data.error
            })
          })
        }}>Click me</button>}
        {this.state.error ? <p style={{ color: 'red' }}>{this.state.error}</p> : null}
        {this.state.info.personImg ? <img src={'http://' + this.state.info.personImg} alt={this.state.info.name}></img> : null}
        <div>Name: {this.state.info.name}</div>
        <div>Favorite Beer: {this.state.info.currentBeer}</div>
        <div>Current Thought: {this.state.info.currentThought}</div>

      </header>
    </div>
    );
  }
}

export default App;