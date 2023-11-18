import { useContext, useEffect, useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { authentication } from "../../firebase";
import * as UserRepository from "../../domain/FirebaseRepository/UserRepository";
const useLoginViewModel = (navigation) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token,setToken] = useState()

  useEffect(() => {
    const unsubscribe = authentication.onAuthStateChanged((user) => {
      if (user) {
        navigation.replace("Home");
      }
    });

    return unsubscribe;
  }, []);

  const signIn = () => {
    signInWithEmailAndPassword(authentication, email, password)
      .then(async(userCredentials) => {
        let newToken = await UserRepository.registerForPushNotificationsAsync()
        console.log('stored token:',newToken)
        const user = userCredentials.user;
        console.log("Logged in with:", user.email);
        UserRepository.updateUserToken(user.uid,newToken);
        
      })
      .catch((error) => alert(error.message));
  };

  return { email, password, setEmail, setPassword, signIn };
};

export default useLoginViewModel;