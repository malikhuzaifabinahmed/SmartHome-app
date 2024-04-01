// "use server"



// export async function register({ email, password, role}){

//   const  { Gateway, Wallets } = require("fabric-network");
// const FabricCAServices = require("fabric-ca-client");
// const path = require ("path");
// const {
//   buildCAClient,
//   registerAndEnrollUser,
//   enrollAdmin,
// } = require ("../../../hlf/fabric-samples/test-application/javascript/CAUtil.js");
// const {
//   buildCCPOrg1,
//   buildWallet,
// } = require ("../../../hlf/fabric-samples/test-application/javascript/AppUtil.js");
// console.log(FabricCAServices)
// // const channelName = process.env.CHANNEL_NAME || "identitymangement";
// // const chaincodeName = process.env.CHAINCODE_NAME || "basic";

// // const mspOrg1 = "Org1MSP";
// // const walletPath = path.join(__dirname, "wallet");
// // const org1UserId = "javascriptAppUser";

// // await enrollAdmin(caClient, wallet, mspOrg1);
// // const ccp = buildCCPOrg1();
// // const caClient = buildCAClient(FabricCAServices, ccp, 'ca.org1.example.com');
// // const wallet = await buildWallet(Wallets, walletPath);
// // await enrollAdmin(caClient, wallet, mspOrg1);
// // await registerAndEnrollUser(caClient, wallet, mspOrg1, org1UserId, 'org1.department1');
// // const gateway = new Gateway();
// // await gateway.connect(ccp, {
// //   wallet,
// //   identity: org1UserId,
// //   discovery: { enabled: true, asLocalhost: true } // using asLocalhost as this gateway is using a fabric network deployed locally
// // });

// // const network = await gateway.getNetwork(channelName);
    
// // const contract = network.getContract(chaincodeName);
// //   try{
// //     let result = await contract.submitTransaction('registerUser', email, password, role);
// // console.log(result);
// //   }catch(e){
// //     console.log(e)
// //   }

// }