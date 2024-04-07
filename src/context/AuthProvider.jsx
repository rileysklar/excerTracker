import { createContext, useContext, useEffect, useState } from "react";
import supabase from "../supabase";

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

const signOut = () => supabase.auth.signOut();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [auth, setAuth] = useState(false);

  const login = async (email, password) => {
    const result = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    console.log(result);

    const { user, session, error } = result.data;

    if (error) {
      console.error("Error in login:", error);
      return { error };
    } else {
      setUser(user);
      setAuth(true);
      return { user, session };
    }
  };

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN") {
        setUser(session.user);
        setAuth(true);
      } else if (event === "SIGNED_OUT") {
        setUser(null);
        setAuth(false);
      }
    });
    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, auth, login, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
