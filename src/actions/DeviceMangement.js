import { getCooKies } from "./cookiesManger";

const { Gateway, Wallets } = require("fabric-network");
const FabricCAServices = require("fabric-ca-client");
const path = require("path");
__dirname = "/home/malik/SmartHome-app/src/actions/";
const org1UserId = "javascriptAppUser";
const ccp = buildCCPOrg1();

export async function createADevice({ deviceName, properties }) {
  let accessToken = getCooKies("accessToken");
  if (!accessToken) {
    throw new Error("No access token found");
  }
  let wallet = await buildWallet(Wallets, walletPath);
  const gateway = new Gateway();
  await gateway.connect(ccp, {
    wallet,
    identity: org1UserId,
    discovery: { enabled: true, asLocalhost: true }, // using asLocalhost as this gateway is using a fabric network deployed locally
  });

  try {
    let result = await contract.submitTransaction(
      "createDevice",
      deviceName,
      properties,
      accessToken
    );

    let response = JSON.parse(result.toString());

    return response;
  } catch (e) {
    console.log("Error at  createADevice ", e);
  }
}
