import React, { useReducer } from 'react';
// import {v4 as uuid} from 'uuid'; // generate random id, when working with hardcoded data before dealing with the Backend.
import ContactContext from './contactContext';
import contactReducer from './contactReducer';
import {
    GET_CONTACTS,
    ADD_CONTACT,
    DELETE_CONTACT,
    SET_CURRENT,
    CLEAR_CURRENT,
    UPDATE_CONTACT,
    FILTER_CONTACTS,
    CLEAR_CONTACTS,
    CONTACT_ERROR,
    CLEAR_FILTER
} from '../types';
import axios from 'axios';

const ContactState = props => {
    const initialState = {
        contacts: null, 
        current: null,
        filtered: null,
        error: null
    }

    const [state, dispatch] = useReducer(contactReducer, initialState);

    // Get Contacts
    const getContacts = async () => {

        try {
            const res = await axios.get('/api/contacts');

            dispatch({ 
                type: GET_CONTACTS, 
                payload: res.data 
            }); 
        } catch (err) {
            dispatch({ 
                type: CONTACT_ERROR,
                payload: err.response.msg
            });
        }        
    }

    // Add contact
    const addContact = async contact => {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        try {
            const res = await axios.post('/api/contacts', contact, config);

            // remember, we don't need to send token individually, setAuthToken takes care of that locally.
            dispatch({ 
                type: ADD_CONTACT, 
                payload: res.data // the data is the new contact added to the DB.
            }); 
        } catch (err) {
            dispatch({ 
                type: CONTACT_ERROR,
                payload: err.response.msg
            });
        }        
    }

    // Delete contact
    const deleteContact = async id => {
        try {
            const res = await axios.delete (`/api/contacts/${id}`);

            dispatch({ 
                type: DELETE_CONTACT, 
                payload: id 
            });
        } catch (err) {
            dispatch({ 
                type: CONTACT_ERROR,
                payload: err.response.msg
            });
        }
    }

    // Update contact
    const updateContact = async contact => {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        try {
            const res = await axios.put(`/api/contacts/${contact._id}`, contact, config);

            dispatch({ 
                type: UPDATE_CONTACT, 
                payload: res.data 
            });
        } catch (err) {
            dispatch({ 
                type: CONTACT_ERROR,
                payload: err.response.msg
            });
        }   
        
    } 

    // Clear Contacts
    const clearContacts = () => {
        dispatch ({ type: CLEAR_CONTACTS });
    }

    // Set current contact
    const setCurrent = contact => {
        dispatch({ type: SET_CURRENT, payload: contact });
    } 

    // Clear current contact
    const clearCurrent = () => {
        dispatch({ type: CLEAR_CURRENT });
    } 

    // Filter contacts
    const filterContacts = text => {
        dispatch({ type: FILTER_CONTACTS, payload: text });
    } 

    // Clear Filter
    const clearFilter = () => {
        dispatch({ type: CLEAR_FILTER });
    }


    return (
        <ContactContext.Provider
        value={{
            contacts: state.contacts,
            current: state.current,
            filtered: state.filtered,
            error: state.error,
            getContacts,
            addContact,
            updateContact,
            deleteContact,
            setCurrent,
            clearCurrent,
            filterContacts,
            clearFilter,
            clearContacts
        }}>
             { props.children }
        </ContactContext.Provider>
    )
}

export default ContactState;
