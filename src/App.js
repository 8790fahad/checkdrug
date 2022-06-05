import React, { useEffect, useCallback, useState } from "react";
import { Container, Nav } from "react-bootstrap";
import { login, logout as destroy, accountBalance } from "./utils/helper";
import coverImg from "./image/sandwich.jpg";
import "./App.css";
import Wallet from "./component/Wallet";
import Cover from "./utils/Cover";
import { Notification } from "./utils/Notification";
import Products from "./component/marketplace/Products";

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
  }, [getBalance]);
  //..
  return (
    <>
      <Notification />
      {account.accountId ? (
        <Container fluid="md">
          <Nav className="justify-content-end pt-3 pb-5">
            <Nav.Item>
              <Wallet
                address={account.accountId}
                amount={balance}
                symbol="NEAR"
                destroy={destroy}
              />
            </Nav.Item>
          </Nav>
          <main>
            <Products />
          </main>
        </Container>
      ) : (
        <Cover name="Drug List" login={login} coverImg={coverImg} />
      )}
    </>
  );
};

export default App;
