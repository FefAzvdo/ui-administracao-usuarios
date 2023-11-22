import banner from "./assets/mulher-rh.jpg";

function App() {
  return (
    <>
      <div className="flex">
        <div className="bg-black absolute top-0 left-0 w-full h-full bg-opacity-30" />
        <img
          src={banner}
          alt="Mulher que trabalha no RH de uma empresa"
          className="w-full h-screen"
        />
        <div className="absolute w-full h-5/6 flex justify-around items-end flex-col pr-32 pt-32">
          <h1 className="text-white text-5xl italic">
            Bem vindo(a) ao Jaé empresa.
          </h1>
          <div className="flex flex-col items-end">
            <p className="text-white">Primeira vez aqui ?</p>
            <a href="" className="text-white font-black text-3xl underline">
              Abrir conta
            </a>
          </div>
          <div className="flex flex-col items-end">
            <p className="text-white">Já possui cadastro ?</p>
            <a href="" className="text-white font-black  text-3xl underline">
              Entrar
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
