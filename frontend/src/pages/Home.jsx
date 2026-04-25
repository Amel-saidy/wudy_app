import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="home-page">
      <section className="hero">
        <div className="container">
          <h1>Exquisite Tailoring & Ready-to-Wear</h1>
          <p>Discover beautiful designs or order a custom masterpiece tailored perfectly for you.</p>
          <div className="hero-buttons">
            <Link to="/shop" className="btn">Browse Collection</Link>
            <Link to="/custom-order" className="btn btn-secondary">Request Custom Order</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
