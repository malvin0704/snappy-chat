import React,{ useState,useEffect,useRef} from 'react'
import styled from "styled-components"
import { useNavigate } from 'react-router-dom'
import { allUsersRoute,host } from '../utils/APIRoutes';
import Contacts from '../components/Contacts'
import Welcome from '../components/Welcome' 
import axios from 'axios';
import ChatContainer from '../components/ChatContainer';
import { io, Socket } from 'socket.io-client'

function Chat() {
  const navigate = useNavigate();
  const [contacts,setContacts] = useState([]);
  const [currentUser,setCurrentUser] = useState(undefined)
  const [currentChat,setCurrentChat] = useState(undefined)
  const [isLoaded,setIsLoaded] = useState(false);
  useEffect(() => {
    if (!localStorage.getItem('chat-app-user')) navigate('/login')
    else {
      
      const fetchData = async () => {
        const data = await JSON.parse(localStorage.getItem("chat-app-user"));
        setCurrentUser(data);
        setIsLoaded(true);
      }

      fetchData()
     
    }
  },[])
  useEffect(() => {
    if (currentUser) { 
      Socket.current = io(host);
      Socket.current.emit("add-user",currentUser._id);
    }
   },[currentUser])
  useEffect(() => {
    if (currentUser) {

      if (currentUser.isAvatarImageSet) {
        const fetchData = async () => {
        const data = await axios.get(`${allUsersRoute}/${currentUser._id}`)
          
          setContacts(data.data)
        }
        fetchData()
      }else {
        navigate('/setAvatar')
      }
    }
  },[currentUser]);
  const handleChatChange = (chat) => { 
    setCurrentChat(chat);
  }
  return (
    <Container>
      <div className='container'>
        <Contacts
          contacts={contacts}
          currentUser={currentUser}
          changeChat={handleChatChange}
        />
        {isLoaded && currentChat === undefined ? (
          <Welcome currentUser={currentUser} />
        ) : (
            <ChatContainer currentChat={currentChat} currentUser={currentUser} socket={Socket } />
        )}
      </div>
    </Container>
  )
}

const Container = styled.div`
height:100vh;
width:100vw;
display:flex;
flex-direction:colunm;
justify-content:center;
align-items:center;
gap:1rem;
background-color:#131324;
.container{
  height:85vh;
  width:85vw;
  background_color:#00000076;
  display:grid;
  grid-template-columns:25% 75%;
  @media screen and (min-width:720px) and (max-width:1080px){
    grid-template-columns:35% 65%;
  }
}
`;
export default Chat