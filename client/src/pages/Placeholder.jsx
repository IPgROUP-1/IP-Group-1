import { Link } from "react-router-dom";

export default function Placeholder({ title, note }) {
  return (
    <main className="page">
      <section className="card">
        <h1>{title}</h1>
        <p className="sub">{note}</p>
        <p className="switch"><Link to="/signup">Back to sign up</Link></p>
      </section>
    </main>
  );
}