import React, { Fragment, useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Navbar from './components/layout/Navbar'
import Users from './components/users/Users'
import User from './components/users/User'
import Search from './components/users/Search'
import Alert from './components/layout/Alert'
import About from './components/pages/About'
import axios from 'axios';
import './App.css';

const App = () => {
  const [users, setUsers] = useState([])
  const [user, setUser] = useState({})
  const [loading, setLoading] = useState(false)
  const [alert, setAlert] = useState(null)
  const [repos, setRepos] = useState([])

    useEffect(()=> {
        (async () => {
            setLoading(true)

            const { data } = await axios.get(
                'https://api.github.com/users',
                {
                    params: {
                        client_id: process.env.REACT_APP_GITHUB_CLIENT_ID,
                        client_secret: process.env.REACT_APP_GITHUB_CLIENT_SECRET,
                    }
                });
            setUsers( data )
            setLoading(false)
        })()
        // eslint-disable-next-line
    }, [])

    const searchUsers = async text => {
        setLoading(true)

        const { data: { items } } = await axios.get(
            'https://api.github.com/search/users',
            {
                params: {
                    q: text,
                    client_id: process.env.REACT_APP_GITHUB_CLIENT_ID,
                    client_secret: process.env.REACT_APP_GITHUB_CLIENT_SECRET,
                }
            });
        setUsers( items )
        setLoading(false)
    }

    // Get single Github user
    const getUser = async (username) => {
        setLoading(true)

        const { data }  = await axios.get(
            `https://api.github.com/users/${username}`,
            {
                params: {
                    client_id: process.env.REACT_APP_GITHUB_CLIENT_ID,
                    client_secret: process.env.REACT_APP_GITHUB_CLIENT_SECRET,
                }
            });
        setUser( data )
        setLoading(false)
    }

    const clearUsers = () => {
        setUsers([])
        setLoading(false)
    }

    // Get users repos
    const getUserRepos = async (username) => {
        setLoading(true)

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
        setRepos(data)
        setLoading(false)
    }

    const showAlert = (msg, type) => {
      setAlert({ msg, type })
      setTimeout(() => setAlert(null), 3000)
    }

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
                                    searchUsers={searchUsers}
                                    clearUsers={clearUsers}
                                    showClear={!!users.length}
                                    setAlert={showAlert}
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
                              getUser={getUser}
                              getUserRepos={getUserRepos}
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

export default App;
