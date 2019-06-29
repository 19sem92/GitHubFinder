import React, { Component } from 'react';
import Navbar from './components/layout/Navbar'
import Users from './components/users/Users'
import Search from './components/users/Search'
import Alert from './components/layout/Alert'
import axios from 'axios';
import './App.css';

class App extends Component {
  state = {
      users: [],
      loading: false,
      alert: null,
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

    searchUsers = async text => {
        this.setState( { loading: true })

        const { data: { items } } = await axios.get(
            'https://api.github.com/search/users',
            {
                params: {
                    q: text,
                    client_id: process.env.REACT_APP_GITHUB_CLIENT_ID,
                    client_secret: process.env.REACT_APP_GITHUB_CLIENT_SECRET,
                }
            });
        this.setState( { loading: false, users: items })
    }

    clearUsers = () => {
        this.setState( { users: [], loading: false })
    }

    setAlert = (msg, type) => {
      this.setState({ alert: { msg, type } })
      setTimeout(() => this.setState({ alert: null }), 3000)
    }

  render() {
    const { loading, users } = this.state

    return (
        <div className="App">
          <Navbar icon='fab fa-github'/>
          <div className="container">
            <Alert alert={this.state.alert} />
            <Search
                searchUsers={this.searchUsers}
                clearUsers={this.clearUsers}
                showClear={!!users.length}
                setAlert={this.setAlert}
            />
            <Users
                loading={loading}
                users={users}
            />
          </div>
        </div>
    );
  }
}

export default App;
