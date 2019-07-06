import React, { Fragment, Component } from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Navbar from './components/layout/Navbar'
import Users from './components/users/Users'
import User from './components/users/User'
import Search from './components/users/Search'
import Alert from './components/layout/Alert'
import About from './components/pages/About'
import axios from 'axios';
import './App.css';

class App extends Component {
  state = {
      users: [],
      user: {},
      loading: false,
      alert: null,
      repos: [],
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

    // Get single Github user
    getUser = async (username) => {
        this.setState( { loading: true })

        const { data }  = await axios.get(
            `https://api.github.com/users/${username}`,
            {
                params: {
                    client_id: process.env.REACT_APP_GITHUB_CLIENT_ID,
                    client_secret: process.env.REACT_APP_GITHUB_CLIENT_SECRET,
                }
            });
        this.setState( { loading: false, user: data })
    }

    clearUsers = () => {
        this.setState( { users: [], loading: false })
    }

    // Get users repos
    getUserRepos = async (username) => {
        this.setState( { loading: true })

        const { data }  = await axios.get(
            `https://api.github.com/users/${username}/repos`,
            {
                params: {
                    per_page: 5,
                    sort: 'created:asc',
                    client_id: process.env.REACT_APP_GITHUB_CLIENT_ID,
                    client_secret: process.env.REACT_APP_GITHUB_CLIENT_SECRET,
                }
            });
        this.setState( { loading: false, repos: data })
    }

    setAlert = (msg, type) => {
      this.setState({ alert: { msg, type } })
      setTimeout(() => this.setState({ alert: null }), 3000)
    }

  render() {
    const { loading, alert, user, users, repos } = this.state

    return (
        <Router>
            <div className="App">
              <Navbar icon='fab fa-github'/>
              <div className="container">
                <Alert alert={alert} />
                  <Switch>
                      <Route
                        exact
                        path='/'
                        render={() => (
                            <Fragment>
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
                            </Fragment>
                        )}
                      />
                      <Route exact path='/about' component={About} />
                      <Route exact path='/user/:login' render={(props) => (
                          <User
                              { ...props }
                              getUser={this.getUser}
                              getUserRepos={this.getUserRepos}
                              user={user}
                              repos={repos}
                              loading={loading}
                          />
                      )} />
                  </Switch>
              </div>
            </div>
        </Router>
    );
  }
}

export default App;
