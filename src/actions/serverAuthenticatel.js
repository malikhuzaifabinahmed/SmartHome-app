import { cookies } from "next/headers.js";

__dirname = "/home/malik/hlf/fabric-samples/test-network/a";
const path = require("path");
const { Gateway, Wallets } = require("fabric-network");
const {
    buildCCPOrg1,
    buildWallet,
  } = require("../../../hlf/fabric-samples/test-application/javascript/AppUtil.js");

  const channelName = process.env.CHANNEL_NAME || "identitymangement";
const chaincodeName = process.env.CHAINCODE_NAME || "identity2";
  const mspOrg1 = "Org1MSP";
  const walletPath = path.join(
    "/home/malik/SmartHome-app/src/actions/",
    "wallet"
  );
  const org1UserId = "javascriptAppUser";
  const ccp = buildCCPOrg1();
export async function authenticateUser({ email }) {
    let wallet = await buildWallet(Wallets, walletPath);
    const gateway = new Gateway();
    await gateway.connect(ccp, {
      wallet,
      identity: org1UserId,
      discovery: { enabled: true, asLocalhost: true }, // using asLocalhost as this gateway is using a fabric network deployed locally
    });
    const network = await gateway.getNetwork(channelName);
    const contract = network.getContract(chaincodeName);
  
    const refreshToken = cookies().get("refreshToken");
    if (!refreshToken) {
      return { message: "User is not signed in!" };
    }
  
    try {
      let result = await contract.submitTransaction(
        "authenticateUser",
        email,
        refreshToken
      );
  
      let response = JSON.parse(result.toString());
  
        console.log(response)
      return response;
    } catch (e) {
      console.log("Error at authenticateUser ", e);
    }
  }