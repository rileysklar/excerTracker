import { useRef, useState } from "react";
import supabase from "../supabase";
import { Link } from "react-router-dom";
import "../form.css";

const Register = () => {
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const register = (email, password) =>
    supabase.auth.signUp({ email, password });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !passwordRef.current?.value ||
      !emailRef.current?.value ||
      !confirmPasswordRef.current?.value
    ) {
      setErrorMsg("Please fill all the fields");
      return;
    }
    if (passwordRef.current.value !== confirmPasswordRef.current.value) {
      setErrorMsg("Passwords doesn't match");
      return;
    }
    try {
      setErrorMsg("");
      setLoading(true);
      const { data, error } = await register(
        emailRef.current.value,
        passwordRef.current.value
      );
      if (!error && data) {
        setMsg(
          "Registration Successful. Check your email to confirm your account"
        );
      }
    } catch (error) {
      setErrorMsg("Error in Creating Account");
    }
    setLoading(false);
  };

  return (
    <>
      <div className="card">
        <div className="card-body">
          <h2 className="text-center mb-4">Register</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group" id="email">
              <label>Email</label>
              <input
                type="email"
                className="form-control"
                ref={emailRef}
                required
              />
            </div>
            <div className="form-group" id="password">
              <label>Password</label>
              <input
                type="password"
                className="form-control"
                ref={passwordRef}
                required
              />
            </div>
            <div className="form-group" id="confirm-password">
              <label>Confirm Password</label>
              <input
                type="password"
                className="form-control"
                ref={confirmPasswordRef}
                required
              />
            </div>
            {errorMsg && (
              <div className="alert alert-danger" role="alert">
                {errorMsg}
                <button
                  type="button"
                  className="close"
                  aria-label="Close"
                  onClick={() => setErrorMsg("")}
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
            )}
            {msg && (
              <div className="alert alert-success" role="alert">
                {msg}
                <button
                  type="button"
                  className="close"
                  aria-label="Close"
                  onClick={() => setMsg("")}
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
            )}
            <div className="text-center mt-2">
              <button
                disabled={loading}
                type="submit"
                className="btn btn-primary w-50"
              >
                Register
              </button>
              Already a User? <Link to={"/login"}>Login</Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Register;
