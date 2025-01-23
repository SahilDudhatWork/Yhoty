const xml2js = require("xml2js");

const parseSoapResponse = async (soapResponse) => {
  const parser = new xml2js.Parser({
    explicitArray: false,
    ignoreAttrs: true,
    tagNameProcessors: [xml2js.processors.stripPrefix],
  });

  try {
    const result = await parser.parseStringPromise(soapResponse);
    const body = result.Envelope.Body;
    const responseKey = Object.keys(body)[0];
    const resultKey = Object.keys(body[responseKey])[0];

    return body[responseKey][resultKey];
  } catch (error) {
    console.error("Error parsing SOAP response:", error);
    return null;
  }
};

module.exports = parseSoapResponse;
