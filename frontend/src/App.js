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
import { 
  login, 
  userProfile, 
  personalProfile, 
  register, 
  editProfile, 
  resetPassword, 
  forgotPassword, 
  requestsList, 
  myRequests, 
  myAcceptedRequests, 
  requestDetails, 
  newRequest, 
  editRequest, 
  offersList, 
  myOffers, 
  myAcceptedOffers, 
  offerDetails, 
  newOffer, 
  editOffer, 
  newGroup,
  groupsList,
  groupDetails,
  groupJoinRequests,
  groupRequests,
  newGroupRequest,
  groupOffers,
  newGroupOffer,
  userGroupDetails,
  groupMembers,
  receivedMessages,
  sentMessages,
  newMessage,
  messageDetails
} from './routeNames.js';
import ForgotPassword from './components/Auth/ForgotPassword.js';
import UserOffersList from './components/Offers/UserOffersList';
import UserAcceptedOffersList from './components/Offers/UserAcceptedOffersList';
import OfferUpdateForm from './components/Offers/OfferUpdateForm';
import ResetPassword from './components/Auth/ResetPassword.js';
import RequestUpdateForm from './components/Requests/RequestUpdateForm.js';
import GroupJoinRequests from './components/Groups/GroupJoinRequests.js';
import GroupRequestsList from './components/Groups/GroupRequestsList.js';
import GroupRequestForm from './components/Groups/GroupRequestForm.js';
import UserGroupDetails from './components/Groups/UserGroupDetails.js';
import GroupOfferForm from './components/Groups/GroupOfferForm.js';
import GroupOffersList from './components/Groups/GroupOffersList.js';
import GroupMembers from './components/Groups/GroupMembers.js';
import MessageDetails from './components/Messages/MessageDetails.js';



function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
      <Route path={offersList} element={<OfferList />} />
        <Route path={myOffers} element={<UserOffersList />} />
        <Route path={myAcceptedOffers} element={<UserAcceptedOffersList />} />
        <Route path={offerDetails} element={<OfferDetails />} />
        <Route path={newOffer} element={<OfferForm />} />
        <Route path={editOffer} element={<OfferUpdateForm />} />
        <Route path={requestsList} element={<RequestList />} />
        <Route path={myRequests} element={<UserRequestsList />} />
        <Route path={myAcceptedRequests} element={<UserAcceptedRequestsList />} />
        <Route path={requestDetails} element={<RequestDetails />} />
        <Route path={newRequest} element={<RequestForm />} />
        <Route path={editRequest} element={<RequestUpdateForm />} />
        <Route path={receivedMessages} element={<ReceivedMessageList />} />
        <Route path={sentMessages} element={<SentMessageList />} />
        <Route path={newMessage} element={<MessageForm />} />
        <Route path={messageDetails} element={<MessageDetails />} />
        <Route path={groupsList} element={<GroupsList />} />
        <Route path={groupDetails} element={<GroupDetails />} />
        <Route path={userGroupDetails} element={<UserGroupDetails />} />
        <Route path={newGroup} element={<GroupForm />} />
        <Route path={groupJoinRequests} element={<GroupJoinRequests />} />
        <Route path={groupMembers} element={<GroupMembers />} />
        <Route path={groupRequests} element={<GroupRequestsList />} />
        <Route path={newGroupRequest} element={<GroupRequestForm />} />
        <Route path={groupOffers} element={<GroupOffersList />} />
        <Route path={newGroupOffer} element={<GroupOfferForm />} />
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