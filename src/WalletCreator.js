
const jwt = require("jsonwebtoken");
const { Gateway, Wallets } = require("fabric-network");
const FabricCAServices = require("fabric-ca-client");
const path = require("path");
const os = require('os')
__dirname = `/home/${os.userInfo().username}/hlf/fabric-samples/test-network/a`;

require('dotenv').config();
const {
  buildCAClient,
  registerAndEnrollUser,
  enrollAdmin,
} = require("../../hlf/fabric-samples/test-application/javascript/CAUtil.js");
const {
  buildCCPOrg1,
  buildWallet,
} = require("../../hlf/fabric-samples/test-application/javascript/AppUtil.js");
const { exit } = require("process");

const channelName = process.env.CHANNEL_NAME || "identitymanagement";
const chaincodeName = process.env.CHAINCODE_NAME || "identity";
console.log("chain code name given");
const mspOrg1 = "Org1MSP";
const walletPath = path.join(
  `/home/${os.userInfo().username}/SmartHome/src/actions/`,
  "wallet"
);
const org1UserId = "javascriptAppUser1";

const ccp = buildCCPOrg1();
console.log("buid cc po org1");

const caClient = buildCAClient(FabricCAServices, ccp, "ca.org1.example.com");
console.log("able to enroll admin");

__dirname = "/home/malik/SmartHome/src/actions/";
const oneDay = 24 * 60 * 60 * 1000;
async function storeServiceProvider() {
  let wallet = await buildWallet(Wallets, walletPath);
  const gateway = new Gateway();
  await gateway.connect(ccp, {
    wallet,
    identity: org1UserId,
    discovery: { enabled: true, asLocalhost: true }, // using asLocalhost as this gateway is using a fabric network deployed locally
  });

  const network = await gateway.getNetwork(channelName);

  const contract = network.getContract(chaincodeName);
  console.log(chaincodeName);

  try {
    let result = await contract.submitTransaction(
      "storeServiceProvider"
    );

    let response = JSON.parse(result.toString());
    console.log('Successfully regitsterd service Provider')
    exit();
  } catch (e) {
    console.log("Error at  register", e);
  }
}
async function createInitialWallet() {
  buildWallet(Wallets, walletPath).then((wallet) => {
    enrollAdmin(caClient, wallet, mspOrg1).then(() => {
      registerAndEnrollUser(
        caClient,
        wallet,
        mspOrg1,
        org1UserId,
        "org1.department1"
      ).then(() => {
        storeServiceProvider();
      })
    });
  });


}

createInitialWallet()