import { useState } from "react";
import type { FormEvent } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { Navigate, useNavigate } from "react-router-dom";

import { useAuth } from "@/auth/AuthContext";
import styles from "./Login.module.css";

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (user) {
    return <Navigate to="/" replace />;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await login(username, password);
      navigate("/", { replace: true });
    } catch {
      setError("Usuário ou senha inválidos.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logo}>
          <span className={styles.logoMark}>◉</span>
          <span className={styles.logoText}>logoipsum</span>
        </div>

        <h1 className={styles.title}>Entrar</h1>

        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="login-username" className={styles.field}>
            <Form.Label className={styles.label}>Usuário</Form.Label>
            <Form.Control
              type="text"
              className={styles.formControl}
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              autoComplete="username"
              autoFocus
            />
          </Form.Group>

          <Form.Group controlId="login-password" className={styles.field}>
            <Form.Label className={styles.label}>Senha</Form.Label>
            <Form.Control
              type="password"
              className={styles.formControl}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
            />
          </Form.Group>

          {error && <div className={styles.error}>{error}</div>}

          <Button
            type="submit"
            variant="primary"
            className={styles.submit}
            disabled={submitting || !username || !password}
          >
            {submitting ? "Entrando..." : "Entrar"}
          </Button>
        </Form>

        <p className={styles.note}>
          Ambiente de desenvolvimento
        </p>
      </div>
    </div>
  );
}