import { useContext, useEffect, useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { authentication } from "../../firebase";
import { useUser } from "../../Contexts/UserContext";
const useLoginViewModel = (navigation) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const {user,setUser} = useUser(); 
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
      .then((userCredentials) => {
        const user = userCredentials.user;
        console.log("Logged in with:", user.email);
        setUser(user);
      })
      .catch((error) => alert(error.message));
  };

  return { email, password, setEmail, setPassword, signIn };
};

export default useLoginViewModel;