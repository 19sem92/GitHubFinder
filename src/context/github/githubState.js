import React, { useReducer } from 'react'
import axios from 'axios'
import GithubContext from './githubContext'
import GithubReducer from './githubReducer'
import {
    SEARCH_USERS,
    SET_LOADING,
    CLEAR_USERS,
    GET_USER,
    GET_REPOS,
    INIT_USERS,
} from '../types'

const GithubState = props => {
    const initialState = {
     users: [],
     user: {},
     repos: [],
     loading: false,
    }

    const [state, dispatch] = useReducer(GithubReducer, initialState)

    const initUsers = async () => {
        setLoading()

        const { data } = await axios.get(
            'https://api.github.com/users',
            {
                params: {
                    client_id: process.env.REACT_APP_GITHUB_CLIENT_ID,
                    client_secret: process.env.REACT_APP_GITHUB_CLIENT_SECRET,
                }
            });
        dispatch({
            type: INIT_USERS,
            payload: data
        })
    }

    // Search Users
    const searchUsers = async text => {
        setLoading()

        const { data: { items } } = await axios.get(
            'https://api.github.com/search/users',
            {
                params: {
                    q: text,
                    client_id: process.env.REACT_APP_GITHUB_CLIENT_ID,
                    client_secret: process.env.REACT_APP_GITHUB_CLIENT_SECRET,
                }
            });
        dispatch({
            type: SEARCH_USERS,
            payload: items
        })
    }

    // Get User
    const getUser = async (username) => {
        setLoading()

        const { data }  = await axios.get(
            `https://api.github.com/users/${username}`,
            {
                params: {
                    client_id: process.env.REACT_APP_GITHUB_CLIENT_ID,
                    client_secret: process.env.REACT_APP_GITHUB_CLIENT_SECRET,
                }
            });
        dispatch({
            type: GET_USER,
            payload: data
        })
    }

    // Get Repos
    const getUserRepos = async (username) => {
        setLoading()

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
        dispatch({
            type: GET_REPOS,
            payload: data
        })
    }

    // Clear Users
    const clearUsers = () => dispatch({ type: CLEAR_USERS })

    // SetLoading
    const setLoading = () => dispatch({ type: SET_LOADING })

    return <GithubContext.Provider
        value = {{
            users: state.users,
            user: state.user,
            repos: state.repos,
            loading: state.loading,
            searchUsers,
            clearUsers,
            getUser,
            getUserRepos,
            initUsers,
        }}
    >
        { props.children }

    </GithubContext.Provider>
}

export default GithubState
