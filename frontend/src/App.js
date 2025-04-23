import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavBar from './components/NavBar';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import OfferList from './components/Offers/OfferList';
import OfferDetails from './components/Offers/OfferDetails';
import OfferForm from './components/Offers/OfferForm';
import RequestList from './components/Requests/RequestList';
import RequestForm from './components/Requests/RequestForm';
import SentMessageList from './components/Messages/SentMessagesList';
import MessageForm from './components/Messages/MessageForm';
import UserProfile from './components/Auth/UserProfile';
import PersonalProfile from './components/Auth/PersonalProfile';
import EditProfile from './components/Auth/EditProfile.js';
import RequestDetails from './components/Requests/RequestDetails';
import ReceivedMessageList from './components/Messages/ReceivedMessagesList';
import GroupsList from './components/Groups/GroupsList';
import GroupForm from './components/Groups/GroupForm';
import GroupDetails from './components/Groups/GroupDetails';
import { login, userProfile, personalProfile, register, editProfile } from './routeNames.js';


function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/offers" element={<OfferList />} />
        <Route path="/offers/details/*" element={<OfferDetails />} />
        <Route path="/offers/new" element={<OfferForm />} />
        <Route path="/requests" element={<RequestList />} />
        <Route path="/requests/details/*" element={<RequestDetails />} />
        <Route path="/requests/new" element={<RequestForm />} />
        <Route path="/messages/received" element={<ReceivedMessageList />} />
        <Route path="/messages/sent" element={<SentMessageList />} />
        <Route path="/messages/new" element={<MessageForm />} />
        <Route path="/groups" element={<GroupsList />} />
        <Route path="/groups/details/*" element={<GroupDetails />} />
        <Route path="/groups/new" element={<GroupForm />} />
        <Route path={login} element={<Login />} />
        <Route path={register} element={<Register />} />
        <Route path={userProfile+"/*"} element={ <UserProfile />} />
        <Route path={personalProfile} element={ <PersonalProfile />} />
        <Route path={editProfile} element={ <EditProfile />} />
      </Routes>
    </Router>
  );
}

export default App;