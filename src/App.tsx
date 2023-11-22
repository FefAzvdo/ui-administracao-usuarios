import "./App.css";
import banner from "./assets/mulher-rh.jpg";

function App() {
  return (
    <>
      <div className="bannerContainer">
        <div className="darkOverlay" />
        <img
          src={banner}
          alt="Mulher que trabalha no RH de uma empresa"
          className="bannerImg"
        />
        <div className="infoContainer">
          <div>{""}</div>
          <a href="aa">
            <h1>Abrir conta</h1>
          </a>
        </div>
      </div>
    </>
  );
}

export default App;
