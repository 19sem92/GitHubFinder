import React, { Component } from 'react';
import Navbar from './components/layout/Navbar'
import Users from './components/users/Users'
import axios from 'axios';
import './App.css';

class App extends Component {
  state = {
      users: [],
      loading: false,
  };

  async componentDidMount() {
      this.setState( { loading: true })

      const { data } = await axios.get(
          'https://api.github.com/users',
          {
              params: {
                  client_id: process.env.REACT_APP_GITHUB_CLIENT_ID,
                  client_secret: process.env.REACT_APP_GITHUB_CLIENT_SECRET,
              }
          });
      this.setState( { loading: false, users: data })
  }

  render() {
    // return React.createElement('div', {className: 'App'}, React.createElement('h1', null, 'Hello from React@@!'))  // ===
    return (
        <div className="App">
          <Navbar icon='fab fa-github'/>
          <div className="container">
            <Users loading={this.state.loading} users={this.state.users} />
          </div>
        </div>
    );
  }
}

export default App;
