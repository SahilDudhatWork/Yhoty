const axios = require("axios");
const parseSoapResponse = require("./parseSoapResponse");

const { API_USER_NAME, API_PASSWORD, CARD_ISSUER_BIN_ID } = process.env;

const generateRandomString = (length) => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

// #region createNewCard
const createNewCard = async (userData, walletData, body) => {
  const firstName = userData?.fullName?.split(" ")[1] || userData?.fullName;
  const lastName = userData?.fullName?.split(" ")[2] || generateRandomString(5);

  const phoneNumber = `+${userData.countryCode + userData.phoneNumber}`;

  const gender =
    userData.gender === "Male"
      ? "m"
      : userData.gender === "Female"
      ? "f"
      : userData.gender === "Other"
      ? "o"
      : null;

  const url = "https://testapi.stradacarte.cloud/prepaidCardsManagement.asmx";
  const soapAction = "https://api.prepaidcards.cloud/Card_CreateNew";

  const xmlData = `<?xml version="1.0" encoding="utf-8"?>
  <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
    <soap:Body>
      <Card_CreateNew xmlns="https://api.prepaidcards.cloud/">
        <ApiUserName>${API_USER_NAME}</ApiUserName>
        <ApiPassword>${API_PASSWORD}</ApiPassword>
        <WalletID>${walletData.walletId}</WalletID>
        <CardIssuerBinID>${CARD_ISSUER_BIN_ID}</CardIssuerBinID>
        <FirstName>${firstName}</FirstName>
        <LastName>${lastName}</LastName>
        <AdrLine1>${body.address1}</AdrLine1>
        <AdrLine2>${body?.address2 || null}</AdrLine2>
        <City>${body.city}</City>
        <State>${body?.state || ""}</State>
        <Country>${body.country}</Country>
        <ZipCode>${body.zipCode}</ZipCode>
        <PhoneNumber>${phoneNumber}</PhoneNumber>
        <Custom1>${userData.email}</Custom1>
        <Custom2>${gender}</Custom2>
        <Custom3>${userData.dob}</Custom3>
      </Card_CreateNew>
    </soap:Body>
  </soap:Envelope>`;

  const response = await axios.post(url, xmlData, {
    headers: {
      "Content-Type": "text/xml; charset=utf-8",
      SOAPAction: soapAction,
    },
  });

  const jsonResponse = await parseSoapResponse(response.data);

  jsonResponse.userId = userData._id;
  jsonResponse.apiUserName = API_USER_NAME;
  jsonResponse.apiPassword = API_PASSWORD;
  jsonResponse.walletId = walletData.walletId;
  jsonResponse.cardIssuerBinId = CARD_ISSUER_BIN_ID;
  jsonResponse.firstName = firstName;
  jsonResponse.lastName = lastName;
  jsonResponse.adrLine1 = body.address1;
  jsonResponse.adrLine2 = body.address2 || null;
  jsonResponse.city = body.City;
  jsonResponse.state = body.state;
  jsonResponse.country = body.country;
  jsonResponse.zipCode = body.zipCode;
  jsonResponse.phoneNumber = userData.phoneNumber;
  jsonResponse.custom = {
    c1: userData.email,
    c2: gender,
    c3: userData.dob,
  };
  jsonResponse.statusId = jsonResponse.StatusID || "";
  jsonResponse.cardNumber = jsonResponse.CardNumber || "";
  jsonResponse.cardExpMonth = jsonResponse.CardExpMth || "";
  jsonResponse.cardExpYear = jsonResponse.CardExpYear || "";
  jsonResponse.cardCvv = jsonResponse.CardCvv || "";
  jsonResponse.cardToken = jsonResponse.CardToken || "";
  return jsonResponse;
};

// #region getCardDetails
const getCardDetails = async (walletId, cardToken) => {
  const url = "https://testapi.stradacarte.cloud/prepaidCardsManagement.asmx";
  const soapAction = "https://api.prepaidcards.cloud/Card_GetCardDetails";

  const xmlData = `<?xml version="1.0" encoding="utf-8"?>
  <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
    <soap:Body>
      <Card_GetCardDetails xmlns="https://api.prepaidcards.cloud/">
        <ApiUserName>${API_USER_NAME}</ApiUserName>
        <ApiPassword>${API_PASSWORD}</ApiPassword>
        <WalletID>${walletId}</WalletID>
        <CardToken>${cardToken}</CardToken>
      </Card_GetCardDetails>
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
    cardNumber: jsonResponse.CardNumber,
    cardExpMth: jsonResponse.CardExpMth,
    cardExpYear: jsonResponse.CardExpYear,
    cardCvv: jsonResponse.CardCvv,
  };
};

// #region addFundsToCard
const addFundsToCard = async (payload) => {
  const url = "https://testapi.stradacarte.cloud/prepaidCardsManagement.asmx";
  const soapAction = "https://api.prepaidcards.cloud/Card_AddFunds";

  const xmlData = `<?xml version="1.0" encoding="utf-8"?>
  <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
    <soap:Body>
      <Card_AddFunds xmlns="https://api.prepaidcards.cloud/">
        <ApiUserName>${API_USER_NAME}</ApiUserName>
        <ApiPassword>${API_PASSWORD}</ApiPassword>
        <WalletID>${payload.walletId}</WalletID>
        <CardToken>${payload.cardToken}</CardToken>
        <Amount>${payload.balance}</Amount>
        <Description>${payload.description}</Description>
      </Card_AddFunds>
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
    balance: jsonResponse.Balance,
  };
};

// #region viewCardTransactions
const viewCardTransactions = async (payload) => {
  const xmlData = `<?xml version="1.0" encoding="utf-8"?>
  <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
    <soap:Body>
      <Card_ViewTrans xmlns="https://api.prepaidcards.cloud/">
        <ApiUserName>${API_USER_NAME}</ApiUserName>
        <ApiPassword>${API_PASSWORD}</ApiPassword>
        <WalletID>${payload.walletId}</WalletID>
        <CardToken>${payload.cardToken}</CardToken>
        <StartDate>${payload.startDate}</StartDate>
      </Card_ViewTrans>
    </soap:Body>
  </soap:Envelope>`;

  const response = await axios.post(
    "https://testapi.stradacarte.cloud/prepaidCardsManagement.asmx",
    xmlData,
    {
      headers: {
        "Content-Type": "text/xml; charset=utf-8",
        SOAPAction: "https://api.prepaidcards.cloud/Card_ViewTrans",
      },
    }
  );

  const jsonResponse = await parseSoapResponse(response.data);

  return {
    statusId: jsonResponse.StatusID,
    transList: jsonResponse.TransList,
  };
};

// #region viewCardBalance
const viewCardBalance = async (payload) => {
  const xmlData = `<?xml version="1.0" encoding="utf-8"?>
  <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
    <soap:Body>
      <Card_ViewBalance xmlns="https://api.prepaidcards.cloud/">
        <ApiUserName>${API_USER_NAME}</ApiUserName>
        <ApiPassword>${API_PASSWORD}</ApiPassword>
        <WalletID>${payload.walletId}</WalletID>
        <CardToken>${payload.cardToken}</CardToken>
      </Card_ViewBalance>
    </soap:Body>
  </soap:Envelope>`;

  const response = await axios.post(
    "https://testapi.stradacarte.cloud/prepaidCardsManagement.asmx",
    xmlData,
    {
      headers: {
        "Content-Type": "text/xml; charset=utf-8",
        SOAPAction: "https://api.prepaidcards.cloud/Card_ViewBalance",
      },
    }
  );

  const jsonResponse = await parseSoapResponse(response.data);

  return {
    statusId: jsonResponse.StatusID,
    balance: jsonResponse.Balance,
  };
};

// #region changeCardStatus
const changeCardStatus = async (payload) => {
  const xmlData = `<?xml version="1.0" encoding="utf-8"?>
  <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
    <soap:Body>
      <Card_ChangeStatus xmlns="https://api.prepaidcards.cloud/">
        <ApiUserName>${API_USER_NAME}</ApiUserName>
        <ApiPassword>${API_PASSWORD}</ApiPassword>
        <WalletID>${payload.walletId}</WalletID>
        <CardToken>${payload.cardToken}</CardToken>
        <CardStatusId>${payload.cardStatusId}</CardStatusId>
      </Card_ChangeStatus>
    </soap:Body>
  </soap:Envelope>`;

  const response = await axios.post(
    "https://testapi.stradacarte.cloud/prepaidCardsManagement.asmx",
    xmlData,
    {
      headers: {
        "Content-Type": "text/xml; charset=utf-8",
        SOAPAction: "https://api.prepaidcards.cloud/Card_ChangeStatus",
      },
    }
  );

  const jsonResponse = await parseSoapResponse(response.data);
  return { statusId: jsonResponse.StatusID };
};

module.exports = {
  createNewCard,
  getCardDetails,
  addFundsToCard,
  viewCardTransactions,
  viewCardBalance,
  changeCardStatus,
};
