"use server"
import { Gateway, Wallets } from("fabric-network");
import FabricCAServices from("fabric-ca-client");
import path from("path");
import {
  buildCAClient,
  registerAndEnrollUser,
  enrollAdmin,
} from("../../test-application/javascript/CAUtil.js");
import {
  buildCCPOrg1,
  buildWallet,
} from("../../test-application/javascript/AppUtil.js");

const channelName = process.env.CHANNEL_NAME || "trustcalculator";
const chaincodeName = process.env.CHAINCODE_NAME || "tC";

const mspOrg1 = "Org1MSP";
const walletPath = path.join(__dirname, "wallet");
const org1UserId = "javascriptAppUser";

await enrollAdmin(caClient, wallet, mspOrg1);
const ccp = buildCCPOrg1();
const caClient = buildCAClient(FabricCAServices, ccp, 'ca.org1.example.com');
const wallet = await buildWallet(Wallets, walletPath);
await enrollAdmin(caClient, wallet, mspOrg1);
await registerAndEnrollUser(caClient, wallet, mspOrg1, org1UserId, 'org1.department1');
const gateway = new Gateway();
await gateway.connect(ccp, {
  wallet,
  identity: org1UserId,
  discovery: { enabled: true, asLocalhost: true } // using asLocalhost as this gateway is using a fabric network deployed locally
});

const network = await gateway.getNetwork(channelName);
    
const contract = network.getContract(chaincodeName);


export async function register({ username, password, role}){
  
  let result = await contract.submitTransaction('registerUser', username, password, role);

}