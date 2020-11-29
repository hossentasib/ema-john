import firebase from "firebase/app";
import "firebase/auth";
import { useState, useContext } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { userContext } from "../../App";
import firebaseConfig from "./Firebase.config";

firebase.initializeApp(firebaseConfig);

function Login() {
  const [newUser, setNewUser] = useState(false)
  const [user, setUser] = useState({
    isSignedIn : false,
    name : '',
    email : '',
    password : '',
    photo : '',
    error : '',
    success : ''
  });
  const [loggedInUser, setLoggedInUser] = useContext(userContext);
  const history = useHistory();
  const location = useLocation();
  let { from } = location.state || { from: { pathname: "/" } };

  const googleProvider = new firebase.auth.GoogleAuthProvider();
  const fbProvider = new firebase.auth.FacebookAuthProvider();
  const handleSignIn = () => {
    firebase.auth().signInWithPopup(googleProvider)
    .then(res => {
      const {displayName, email, photoURL} = res.user;
      const signedInUser = {
        isSignedIn : true,
        name : displayName,
        email : email,
        photo : photoURL
      }
      setUser(signedInUser);
      console.log(displayName, email, photoURL);
    })
  
  }
  const handleFbSignIn = () => {
    firebase.auth().signInWithPopup(fbProvider).then(function(result) {
      // This gives you a Facebook Access Token. You can use it to access the Facebook API.
      var token = result.credential.accessToken;
      // The signed-in user info.
      var user = result.user;
      // ...
    }).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      // ...
    });
  }
  const handleSignOut = () => {
      firebase.auth().signOut()
      .then(res => {
          const signedOutUser = {
            isSignedIn : false,
            name : '',
            email : '',
            photo : ''
          }
          setUser(signedOutUser);
      })
      .catch(err => {

      })
  }

  const handleSubmit = (e) => {
      if (newUser && user.email && user.password){
        firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
        .then(res => {
          const newUSerInfo = {...user};
          newUSerInfo.error = '';
          newUSerInfo.success = true;
          setUser(newUSerInfo);
          updateUserName(user.name)
        })
        .catch((error) => {
          var errorCode = error.code;
          var errorMessage = error.message;
          const newUSerInfo = {...user};
          newUSerInfo.error = errorMessage;
          newUSerInfo.success = false;
          setUser(newUSerInfo);
          
          // ..
        });
      }
      if(!newUser && user.email && user.password){
        firebase.auth().signInWithEmailAndPassword(user.email, user.password)
          .then(res => {
            const newUSerInfo = {...user};
            newUSerInfo.error = '';
            newUSerInfo.success = true;
            setUser(newUSerInfo);
            setLoggedInUser(newUSerInfo);
            history.replace(from);
          })
          .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            const newUSerInfo = {...user};
            newUSerInfo.error = errorMessage;
            newUSerInfo.success = false;
            setUser(newUSerInfo);
          });
      }
      e.preventDefault();
  }
  const updateUserName = name => {
    const user = firebase.auth().currentUser;
    user.updateProfile({
      displayName: name,
      photoURL: "https://example.com/jane-q-user/profile.jpg"
    }).then(function() {
      console.log('user name update successfully')
    }).catch(function(error) {
      // An error happened.
    });
  }
  const handleOnBlur = (e) => {
    let isFieldValid = true;
      if (e.target.name === 'email'){
         isFieldValid = /\S+@\S+\.\S+/.test(e.target.value);
      }
      if (e.target.name === 'password'){
        isFieldValid = /\d{1}/.test(e.target.value);
      }
      if(isFieldValid){
        const newUSerInfo = {...user};
        newUSerInfo[e.target.name] = e.target.value;
        setUser(newUSerInfo);
      }
  }
  return (
    <div style={{textAlign: 'center'}}>
      {
        user.isSignedIn ? <button onClick={handleSignOut}>Sign Out</button> :
        <button onClick={handleSignIn}>Sign In</button>
      }
      <button onClick={handleFbSignIn}>Sign In with Facebook</button>
      {
        user.isSignedIn && <div> 
          <p>Welcome {user.name}</p>
          <p>Your email : {user.email}</p>
          <img src={user.photo} alt=""/>
        </div>
      }

      <h1>Our Own Authentication</h1>
      <input type="checkbox" onChange={() => setNewUser(!newUser)} name="newUser" id=""/>
      <label htmlFor="newUser">New User SignUp</label>
      <form onSubmit={handleSubmit}>
        {newUser && <input type="text" onBlur={handleOnBlur} name='name' placeholder='Enter Name'/>}
        <input type="text" onBlur={handleOnBlur} name='email' placeholder='Enter Email'/>
        <input type="password" onBlur={handleOnBlur} name="password" placeholder="Enter Password"/>
        <input type="submit" value={newUser ? 'Sign Up' : 'Login'}/>
      </form>
     <p style={{color:'red'}}>{user.error}</p>
     {user.success && <p style={{color:'green'}}>User {newUser ? 'Created' : 'Logged In'} Succesfully!</p>}

    </div>
  );
}

export default Login;
