 

import { NextResponse } from "next/server.js"


__dirname = '/home/malik/hlf/fabric-samples/test-network/a'

const { Gateway, Wallets } = require("fabric-network");
const FabricCAServices = require("fabric-ca-client");
const path = require("path");
const {
  buildCAClient,
  registerAndEnrollUser,
  enrollAdmin,
} = require("../../../../../hlf/fabric-samples/test-application/javascript/CAUtil.js");
const {
  buildCCPOrg1,
  buildWallet,
} = require("../../../../../hlf/fabric-samples/test-application/javascript/AppUtil.js");


const channelName = process.env.CHANNEL_NAME || "identitymangement";
const chaincodeName = process.env.CHAINCODE_NAME || "identity2";
console.log("chain code name given")
const mspOrg1 = "Org1MSP";
const walletPath = path.join('/home/malik/SmartHome-app/src/app/api/register/', "wallet");
const org1UserId = "javascriptAppUser";


const ccp = buildCCPOrg1();
console.log("buid cc po org1")

const caClient = buildCAClient(FabricCAServices, ccp, 'ca.org1.example.com');
console.log("able to enroll admin")

__dirname = '/home/malik/SmartHome-app/src/app/api/register/'



let wallet;


  buildWallet(Wallets, walletPath).then((res) => {
wallet =res;
    enrollAdmin(caClient, res, mspOrg1).then(() => {
      registerAndEnrollUser(caClient, wallet, mspOrg1, org1UserId, 'org1.department1');
    })

  })



export async function POST(request) {
    const gateway = new Gateway();
    await gateway.connect(ccp, {
      wallet,
      identity: org1UserId,
      discovery: { enabled: true, asLocalhost: true } // using asLocalhost as this gateway is using a fabric network deployed locally
    });

    const network = await gateway.getNetwork(channelName);
    
    const contract = network.getContract(chaincodeName);
      try{
        let result = await contract.submitTransaction('registerUser', email, password, role);
    console.log(result);
      }catch(e){
        console.log(e)
      }


return NextResponse.json({ req: JSON.parse(await request.text()),status: 200})
}
