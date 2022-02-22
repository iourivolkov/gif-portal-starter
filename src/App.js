import "./App.css";
import React, { useEffect, useState } from "react";

const TEST_JOBS = [
  "https://www.linkedin.com/jobs/collections/recommended/?currentJobId=2903362227",
  "https://www.linkedin.com/jobs/collections/recommended/?currentJobId=2908048350",
  "https://www.linkedin.com/jobs/collections/recommended/?currentJobId=2874312221",
  "https://www.linkedin.com/jobs/collections/recommended/?currentJobId=2929958456",
];

const App = () => {
  // state
  const [walletAddress, setWalletAddress] = useState(null);
  const [inputValue, setInputValue] = useState("");

  // function to decide if Phantom wallet is connected
  const checkIfWalletIsConnected = async () => {
    try {
      const { solana } = window;

      if (solana) {
        if (solana.isPhantom) {
          console.log("Phantom wallet found!");

          // solana obj gives us function that will allow us to connect direclty w/ user's wallet
          const response = await solana.connect({ onlyIfTrusted: true });
          console.log(
            "Connected with Public Key:",
            response.publicKey.toString()
          );
          setWalletAddress(response.publicKey.toString());
        }
      } else {
        alert("Solana object not found! Get a Phantom Wallet!");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const connectWallet = async () => {
    const { solana } = window;

    if (solana) {
      const response = await solana.connect();
      console.log("Connected with Public Key:", response.publicKey.toString());
      setWalletAddress(response.publicKey.toString());
    }
  };

  // render this UI if the user hasn't connected

  const renderNotConnectedContainer = () => (
    <button
      className="cta-button connect-wallet-button"
      onClick={connectWallet}
    >
      Connect Wallet
    </button>
  );

  const renderConnectedContainer = () => (
    <div className="connected-container">
      <form
        onSubmit={(event) => {
          event.preventDefault();
        }}
      >
        <input type="text" placeholder="Enter job posting link" />
        <button type="submit" className="cta-button submit-gif-button">
          Submit
        </button>
      </form>
      <div className="gif-grid">
        {TEST_JOBS.map((job) => (
          <div className="gif-item" key={job}>
            <p>{job}</p>
          </div>
        ))}
      </div>
    </div>
  );

  // when component first mounts / loads -> check if user has Phantom wallet
  useEffect(() => {
    const onLoad = async () => {
      await checkIfWalletIsConnected();
    };
    window.addEventListener("load", onLoad);
    return () => window.removeEventListener("load", onLoad);
  }, []);
  return (
    <div className="App">
      <div className={walletAddress ? "authed-container" : "container"}>
        <div className="container">
          <div className="header-container">
            <p className="header">Workr</p>
            <p className="sub-text">
              A decentralized job board powered by Solana
            </p>
            {!walletAddress && renderNotConnectedContainer()}
            {walletAddress && renderConnectedContainer()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
