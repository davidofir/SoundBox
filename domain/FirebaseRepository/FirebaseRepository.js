
import { signInWithEmailAndPassword } from "firebase/auth";
import { authentication } from "../../firebase";

const signInWithCredentials = (email, password) => {
    return signInWithEmailAndPassword(authentication, email, password);
  };
  
  export { signInWithCredentials };