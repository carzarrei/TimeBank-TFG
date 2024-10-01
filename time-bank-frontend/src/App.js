import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavBar from './components/NavBar';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import OfferList from './components/Offers/OfferList';
import OfferForm from './components/Offers/OfferForm';
import RequestList from './components/Requests/RequestList';
import RequestForm from './components/Requests/RequestForm';
import MessageList from './components/Messages/MessageList';
import MessageForm from './components/Messages/MessageForm';
import Profile from './components/Auth/Profile';

function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<OfferList />} />
        <Route path="/offers/new" element={<OfferForm />} />
        <Route path="/requests" element={<RequestList />} />
        <Route path="/requests/new" element={<RequestForm />} />
        <Route path="/messages" element={<MessageList />} />
        <Route path="/messages/new" element={<MessageForm />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={ <Profile />} />
      </Routes>
    </Router>
  );
}

export default App;