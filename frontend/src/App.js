import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavBar from './components/NavBar';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import OfferList from './components/Offers/OfferList';
import OfferDetails from './components/Offers/OfferDetails';
import OfferForm from './components/Offers/OfferForm';
import RequestList from './components/Requests/RequestList';
import UserRequestsList from './components/Requests/UserRequestsList';
import UserAcceptedRequestsList from './components/Requests/UserAcceptedRequestsList';
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
import { login, userProfile, personalProfile, register, editProfile, resetPassword, forgotPassword, requestsList, myRequests, myAcceptedRequests, requestDetails, newRequest, editRequest } from './routeNames.js';
import ForgotPassword from './components/Auth/ForgotPassword.js';
import ResetPassword from './components/Auth/ResetPassword.js';
import RequestUpdateForm from './components/Requests/RequestUpdateForm.js';



function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/offers" element={<OfferList />} />
        <Route path="/offers/details/*" element={<OfferDetails />} />
        <Route path="/offers/new" element={<OfferForm />} />
        <Route path={requestsList} element={<RequestList />} />
        <Route path={myRequests} element={<UserRequestsList />} />
        <Route path={myAcceptedRequests} element={<UserAcceptedRequestsList />} />
        <Route path={requestDetails} element={<RequestDetails />} />
        <Route path={newRequest} element={<RequestForm />} />
        <Route path={editRequest} element={<RequestUpdateForm />} />
        <Route path="/messages/received" element={<ReceivedMessageList />} />
        <Route path="/messages/sent" element={<SentMessageList />} />
        <Route path="/messages/new" element={<MessageForm />} />
        <Route path="/groups" element={<GroupsList />} />
        <Route path="/groups/details/*" element={<GroupDetails />} />
        <Route path="/groups/new" element={<GroupForm />} />
        <Route path={login} element={<Login />} />
        <Route path={register} element={<Register />} />
        <Route path={userProfile} element={ <UserProfile />} />
        <Route path={personalProfile} element={ <PersonalProfile />} />
        <Route path={editProfile} element={ <EditProfile />} />
        <Route path={forgotPassword} element={ <ForgotPassword />} />
        <Route path={resetPassword} element={ <ResetPassword />} />

      </Routes>
    </Router>
  );
}

export default App;