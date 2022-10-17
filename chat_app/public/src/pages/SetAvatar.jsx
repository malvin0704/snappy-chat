import React from 'react'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import axios from 'axios'
import { setAvatarRoute } from '../utils/APIRoutes'

export default function SetAvatar() {

 const navigate = useNavigate();
 const [avatars,setAvatars] = useState([]);
 const [url,setUrl] = useState("");
 const [selectedAvatar,setSelectedAvatar] = useState(undefined);

 const toastOptions = {
  position: 'bottom-right',
  autoClose: 8000,
  pauseOnHover: true,
  draggable: true,
  theme: 'dark',
 }
  let imageUrl = []
  let fullUrl = "";
  const setProfilePicture = async () => {
    if (selectedAvatar === undefined) {
      toast.error('Please select an avatar',toastOptions)
    }
    else { 
      const user = await JSON.parse(localStorage.getItem("chat-app-user"));
      const { data } = await axios.post(`${setAvatarRoute}/${user._id}`,{
        image: avatars[selectedAvatar],
      });
      console.log(data)
      if (data.isSet) {
        user.isAvatarImageSet = true;
        user.avatarImage = data.image;
        localStorage.setItem("chat-app-user",JSON.stringify(user));
        navigate("/");
      } else { toast.error("Error setting avatar.Please try again",toastOptions)}
    }
  };
  useEffect(() => {
    if (!localStorage.getItem("chat-app-user")) navigate('/login')
   },[])
  useEffect(() => {},[avatars]);
  const handleChange = (event) => { 
    setUrl(`https://avatars.dicebear.com/api/${event.target.value}`)
  }
  
  
  const handleSubmit = (event) => {
    event.preventDefault();
    for (let i = 0; i < 4; i++) {
      fullUrl = url + `/${Math.random()}.svg`;
      console.log(fullUrl)
      imageUrl.push(fullUrl)
    }
    setAvatars(imageUrl);
    return imageUrl;
  }
 return (
   <>
     
   <Container>
       <div className='title-container'>
         <h1>Pick an avatar as your profile picture</h1>
       </div>
       <form>
         <span> Pick a style for your Avatar:</span>
         <select
           name='avatarStyle'
           defaultValue={'default'}
           onChange={(event) => handleChange(event)}
         >
           <option value={'default'} disabled>
             Choose an option
           </option>
           <option value='male'>male</option>
           <option value='female'>female</option>
           <option value='human'>human</option>
           <option value='identicon'>identicon</option>
           <option value='initials'>initials</option>
           <option value='bottts'>bottts</option>
           <option value='avataaars'>avataaars</option>
           <option value='jdenticon'>jdenticon</option>
           <option value='gridy'>gridy</option>
           <option value='micah'>micah</option>
         </select> 
         <button type='submit' onClick={(event) => handleSubmit(event)}>
           submit
         </button>
       </form>
       <div className='avatars'>
         {avatars.map((item, index) => {
           return (
             <div
               key={index}
               className={`avatar ${selectedAvatar===index?"selected":""}`}
             >
               <img src={item} alt='avatar' onClick={() => setSelectedAvatar(index)} />
             </div>
           )
         })}
       </div>
       <button className="submit-btn" onClick={setProfilePicture}>Set as Profile Picture</button>
         </Container>,
         <ToastContainer />
         
     
   </>
 );
    }
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 3rem;
  background-color: #131324;
  height: 100vh;
  width: 100vw;
  span {
    color: white;
  }
  .loader {
    max-inline-size: 100%;
  }
  .title-container {
    h1 {
      color: white;
    }
  }
  .avatars {
    display: flex;
    gap: 2rem;
    .avatar {
      border: 0.4rem solid transparent;
      padding: 0.4rem;
      border-radius: 5rem;
      display: flex;
      justify-content: center;
      align-item: center;
      transition: 0.5s ease-in-out;
      img {
        height: 6rem;
      }
    }
    .selected{ border: 0.4rem solid #4e0eff;}
    
    }
  }
  .submit-btn {
      background-color: #997af0;
      color: white;
      padding: 1rem 2rem;
      border: none;
      font-weight: bold;
      cursor: pointer;
      border-radius: 0.4rem;
      font-size: 1rem;
      text-transform: uppercase;
      &:hover {
        background-color: #4e0eff;
      }
`
