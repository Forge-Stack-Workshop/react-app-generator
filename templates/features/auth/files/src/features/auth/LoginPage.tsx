import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./useAuth";
import styles from "./LoginPage.module.scss";

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [token, setToken] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (token.trim() === "") return;
    login(token.trim());
    navigate("/");
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h1 className={styles.title}>Sign in</h1>
      <label className={styles.label} htmlFor="auth-token">
        Access token
      </label>
      <input
        id="auth-token"
        className={styles.input}
        type="text"
        value={token}
        onChange={(event) => setToken(event.target.value)}
        placeholder="Enter your token"
        autoComplete="off"
      />
      <button className={styles.button} type="submit">
        Sign in
      </button>
    </form>
  );
}
