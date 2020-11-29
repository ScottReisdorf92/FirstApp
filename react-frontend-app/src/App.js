import React, {Component} from 'react';
import axios from 'axios';
import logo from './logo.svg';
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
    }
  }

  async CreatePostTable() {
    try {
      const res = await axios.get('http://localhost:9051/post-data')
      console.log("LOGGING DATA" + res.data);
      console.log("more specificaly: " + res.data[0].title);
      const data = [];
      for(var i = 0; i < res.data.length; i++) {
        data.push([res.data[i].post_id,res.data[i].title,res.data[i].post_body,res.data[i].user_id]);
        console.log(data[i]);
      }

      this.setState({
        posts: data,
      });
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.log(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message);
      }
    console.log(error.config);
    }
  }

  componentDidMount() {
    this.CreatePostTable()
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
          <div>{this.state.posts}</div>
        </header>
      </div>
    );
  }

}

export default App;



/*

<div className="App">
  <header>
    <div>
      FirstLast
    </div>
    <div>
      login or Sign up
    </div>
  </header>
  <div>


*/
