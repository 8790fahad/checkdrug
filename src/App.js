import React, { useEffect, useCallback, useState } from "react";
import { Container } from "react-bootstrap";
import { login, accountBalance } from "./utils/helper";
import coverImg from "./image/drugs.jpeg";
import "./App.css";
import Cover from "./utils/Cover";
import Products from "./component/marketplace/Products";
import NavBar from "./component/marketplace/Nav";

const App = function AppWrapper() {
  const account = window.walletConnection.account();
  const [balance, setBalance] = useState("0");
  const getBalance = useCallback(async () => {
    if (account.accountId) {
      setBalance(await accountBalance());
    }
  }, [account.accountId]);

  useEffect(() => {
    getBalance();
    console.log(window.walletConnection.account())
  }, [getBalance]);
  //..
  return (
    <>
     

      {account.accountId ? (
        <Container fluid="md">
          <NavBar balance={balance}/>
          <main>
            <Products />
          </main>
        </Container>
      ) : (
        <Cover name="Drug Tracker" login={login} coverImg={coverImg} />
      )}
    </>
  );
};

export default App;
