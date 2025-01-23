const axios = require("axios");
const parseSoapResponse = require("./parseSoapResponse");
const { API_USER_NAME, API_PASSWORD, PARENT_WALLET_ID } = process.env;

const generateRandomString = (length) => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

// #region createSubWallet
const createSubWallet = async () => {
  const walletName = `Wallet_${generateRandomString(10)}`;

  const url = "https://testapi.stradacarte.cloud/prepaidCardsManagement.asmx";
  const soapAction = "https://api.prepaidcards.cloud/Wallet_CreateSubWallet";
  const xmlData = `<?xml version="1.0" encoding="utf-8"?>
  <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
    <soap:Body>
      <Wallet_CreateSubWallet xmlns="https://api.prepaidcards.cloud/">
        <ApiUserName>${API_USER_NAME}</ApiUserName>
        <ApiPassword>${API_PASSWORD}</ApiPassword>
        <ParentWalletID>${PARENT_WALLET_ID}</ParentWalletID>
        <WalletName>${walletName}</WalletName>
      </Wallet_CreateSubWallet>
    </soap:Body>
  </soap:Envelope>`;

  const response = await axios.post(url, xmlData, {
    headers: {
      "Content-Type": "text/xml; charset=utf-8",
      SOAPAction: soapAction,
    },
  });

  const jsonResponse = await parseSoapResponse(response.data);
  console.log("jsonResponse :>> ", jsonResponse);
  return {
    parentWalletId: PARENT_WALLET_ID,
    walletName: walletName,
    statusId: jsonResponse.StatusID,
    walletId: jsonResponse.WalletID,
  };
};

// #region viewWalletBalance
const viewWalletBalance = async (walletId) => {
  const url = "https://testapi.stradacarte.cloud/prepaidCardsManagement.asmx";
  const soapAction = "https://api.prepaidcards.cloud/Wallet_ViewBalance";
  const xmlData = `<?xml version="1.0" encoding="utf-8"?>
  <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
    <soap:Body>
      <Wallet_ViewBalance xmlns="https://api.prepaidcards.cloud/">
        <ApiUserName>${API_USER_NAME}</ApiUserName>
        <ApiPassword>${API_PASSWORD}</ApiPassword>
        <WalletID>${walletId}</WalletID>
      </Wallet_ViewBalance>
    </soap:Body>
  </soap:Envelope>`;

  const response = await axios.post(url, xmlData, {
    headers: {
      "Content-Type": "text/xml; charset=utf-8",
      SOAPAction: soapAction,
    },
  });

  const jsonResponse = await parseSoapResponse(response.data);

  return {
    statusId: jsonResponse?.StatusID || "",
    balance: jsonResponse?.Balance || 0,
  };
};

// #region transferFunds
const transferFunds = async (payload) => {
  const url = "https://testapi.stradacarte.cloud/prepaidCardsManagement.asmx";
  const soapAction = "https://api.prepaidcards.cloud/Wallet_TransferFunds";
  const xmlData = `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <Wallet_TransferFunds xmlns="https://api.prepaidcards.cloud/">
      <ApiUserName>${API_USER_NAME}</ApiUserName>
      <ApiPassword>${API_PASSWORD}</ApiPassword>
      <WalletIDFrom>${payload.walletIdFrom}</WalletIDFrom>
      <WalletIDTo>${payload.walletIdTo}</WalletIDTo>
      <Description>${payload.description}</Description>
      <Amount>${payload.amount}</Amount>
    </Wallet_TransferFunds>
  </soap:Body>
</soap:Envelope>`;

  const response = await axios.post(url, xmlData, {
    headers: {
      "Content-Type": "text/xml; charset=utf-8",
      SOAPAction: soapAction,
    },
  });

  const jsonResponse = await parseSoapResponse(response.data);
  return {
    statusId: jsonResponse.StatusID,
    refTransId: jsonResponse.RefTransId,
  };
};

module.exports = {
  createSubWallet,
  viewWalletBalance,
  transferFunds,
};
