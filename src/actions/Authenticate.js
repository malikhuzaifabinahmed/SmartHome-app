"use server";

import { cookies } from "next/headers";
__dirname = `/home/${os.userInfo().username}/hlf/fabric-samples/test-network/a`;
import jwt from "jsonwebtoken";
import { deleteCookies, getCooKies, setCookies } from "./cookiesManger.js";
import { redirect } from "next/navigation.js";
import { randomUUID } from "crypto";
import * as os from "os";
import { revalidatePath } from "next/cache.js";
const { Gateway, Wallets } = require("fabric-network");
const FabricCAServices = require("fabric-ca-client");
const path = require("path");
const {
  buildCAClient,
  registerAndEnrollUser,
  enrollAdmin,
} = require("../../../hlf/fabric-samples/test-application/javascript/CAUtil.js");
const {
  buildCCPOrg1,
  buildWallet,
} = require("../../../hlf/fabric-samples/test-application/javascript/AppUtil.js");

const channelName = process.env.CHANNEL_NAME || "identitymangement";
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

__dirname = `/home/${os.userInfo().username}/SmartHome/src/actions/`;
const oneDay = 24 * 60 * 60 * 1000;

export default async function createInitialWallet() {
  buildWallet(Wallets, walletPath).then((wallet) => {
    enrollAdmin(caClient, wallet, mspOrg1).then(() => {
      registerAndEnrollUser(
        caClient,
        wallet,
        mspOrg1,
        org1UserId,
        "org1.department1"
      );
    });
  });
}


export async function register({ firstName, lastName, email, password, role, setCokkies = true }) {
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
      "registerUser",
      firstName,
      lastName,
      email,
      password,
      role
    );
    const oneDay = 24 * 60 * 60 * 1000;
    let response = JSON.parse(result.toString());
    {
      setCokkies && cookies().set("refreshToken", response.refreshToken, {
        maxAge: oneDay * 7,
      });
    }
    gateway.disconnect()
    return response;
  } catch (e) {
    console.log("Error at  register", e); gateway.disconnect()
  }
}
export async function loginUser({ email, password }) {
  let wallet = await buildWallet(Wallets, walletPath);
  const gateway = new Gateway();
  await gateway.connect(ccp, {
    wallet,
    identity: org1UserId,
    discovery: { enabled: true, asLocalhost: true }, // using asLocalhost as this gateway is using a fabric network deployed locally
  });
  const network = await gateway.getNetwork(channelName);
  const contract = network.getContract(chaincodeName);

  try {
    let result = await contract.submitTransaction(
      "loginUser",

      email,
      password
    );
    let response = JSON.parse(result.toString());
    const oneDay = 24 * 60 * 60 * 1000;
    if (response.isOk) {
      cookies().set("refreshToken", response.refreshToken, {
        maxAge: oneDay * 7,
      });
      cookies().set(
        "userData",
        JSON.stringify({
          email: response.email,
          role: response.role,
          firstName: response.firstName,
          lastName: response.lastName,
        })
      );
    }
    gateway.disconnect()
    return response;
  } catch (e) {
    console.log("Error at login ", e);
    gateway.disconnect()
  }
}
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
  console.log(refreshToken.value);
  try {
    let result = await contract.submitTransaction(
      "authenticateUser",
      email,
      refreshToken.value
    );

    let response = JSON.parse(result.toString());
    setCookies({ name: "accessToken", value: response.accessToken });
    gateway.disconnect()
    return response;
  } catch (e) {
    console.log("Error at authenticateUser ", e);
    gateway.disconnect()
  }
}

export async function logout() {
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
  let user = jwt.decode(refreshToken.value);
  console.log(user);

  let email = user.email;
  deleteCookies({ name: "refreshToken" });
  deleteCookies({ name: "userData" });
  deleteCookies({ name: "accessToken" });
  try {
    let result = await contract.submitTransaction(
      "logoutUser",
      email,
      refreshToken.value
    );
    let response = JSON.parse(result.toString());
    gateway.disconnect()
    return response;
  } catch (e) {
    console.log("Error at logoutUser ", e);
    gateway.disconnect()
  }
}

export async function createADevice({ deviceName, properties }) {
  let accessToken = await getCooKies({ name: "accessToken" });
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
  const network = await gateway.getNetwork(channelName);
  const contract = network.getContract(chaincodeName);
  console.log(deviceName,
    properties,
    accessToken)
  try {
    let result = await contract.submitTransaction(
      "createDevice",
      deviceName,
      JSON.stringify(properties),
      accessToken.value,
      randomUUID()
    );

    let response = JSON.parse(result.toString());
    console.log(response)
    console.log(result.toString())
    gateway.disconnect()
    return response;
  } catch (e) {
    console.log("Error at  createADevice ", e.errors[0].endorsements[0].connection.options);
    // console.log(e.responses[0].payload.toString())
    // console.log(e.responses[1].payload.toString())
    // console.log(e.responses[1].response.payload.toString())
    gateway.disconnect()

  }
}
export async function updateDevice({ deviceId, deviceName, properties }) {
  let accessToken = await getCooKies({ name: "accessToken" });
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
  const network = await gateway.getNetwork(channelName);
  const contract = network.getContract(chaincodeName);
  console.log(deviceName,
    properties,
    accessToken)
  try {
    let result = await contract.submitTransaction(
      "updateDevice",
      deviceName,
      JSON.stringify(properties),
      accessToken.value,
      deviceId
    );

    let response = JSON.parse(result.toString());
    console.log(response)
    console.log(result.toString())
    gateway.disconnect()
    return response;
  } catch (e) {
    console.log("Error at  updateDevice ", e);
    // console.log(e.responses[0].payload.toString())
    // console.log(e.responses[1].payload.toString())
    // console.log(e.responses[1].response.payload.toString())

    gateway.disconnect()
  }
}

export async function getAllDevicesList() {
  let accessToken = await getCooKies({ name: "accessToken" });
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
  const network = await gateway.getNetwork(channelName);
  const contract = network.getContract(chaincodeName);
  console.log(
    accessToken)
  try {
    let result = await contract.submitTransaction(
      "getAllDevicesList",

      accessToken.value
    );

    let response = JSON.parse(result.toString());
    console.log(result)
    console.log(result.toString())
    gateway.disconnect()
    return response;
  } catch (e) {
    console.log("Error at  createADevice ", e);// console.log(e.responses[1].payload.toString())
    // console.log(e.responses[1].response.payload.toString())
    gateway.disconnect()

  }
}

export async function createaHome({ homeName, properties, ownerEmail }) {
  let accessToken = await getCooKies({ name: "accessToken" });
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
  const network = await gateway.getNetwork(channelName);
  const contract = network.getContract(chaincodeName);
  console.log(homeName,
    properties,
    accessToken, ownerEmail)
  try {
    let result = await contract.submitTransaction(
      "createNewHome",
      homeName,
      JSON.stringify(properties),
      accessToken.value,
      ownerEmail,
      randomUUID()
    );

    let response = JSON.parse(result.toString());
    revalidatePath('/serviceProvider/homeList')
    console.log(response)
    console.log(result.toString())
    gateway.disconnect()
    return response;
  } catch (e) {
    console.log("Error at  createaHome ", e);
    // console.log(e.responses[0].payload.toString())
    // console.log(e.responses[1].payload.toString())
    // console.log(e.responses[1].response.payload.toString())
    gateway.disconnect()

  }
}

export async function getAllHomeList() {
  let accessToken = await getCooKies({ name: "accessToken" });
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
  const network = await gateway.getNetwork(channelName);
  const contract = network.getContract(chaincodeName);
  console.log(
    accessToken)
  try {
    let result = await contract.submitTransaction(
      "getAllHomeList",

      accessToken.value
    );

    let response = JSON.parse(result.toString());
    console.log(result)
    console.log(result.toString())
    gateway.disconnect()
    return response;
  } catch (e) {
    console.log("Error at  createADevice ", e);// console.log(e.responses[1].payload.toString())
    // console.log(e.responses[1].response.payload.toString())
    gateway.disconnect()

  }
}
export async function getUserData({ email }) {
  let accessToken = await getCooKies({ name: "accessToken" });
  if (!accessToken) {
    throw new Error("No access token found");
  }
  console.log('working')

  const decoded = jwt.decode(accessToken.value);
  decoded.email
  let wallet = await buildWallet(Wallets, walletPath);
  const gateway = new Gateway();
  await gateway.connect(ccp, {
    wallet,
    identity: org1UserId,
    discovery: { enabled: true, asLocalhost: true }, // using asLocalhost as this gateway is using a fabric network deployed locally
  });
  const network = await gateway.getNetwork(channelName);
  const contract = network.getContract(chaincodeName);


  try {

    let result;
    if (email) {
      console.log("I am using given email : ", email)
      result = await contract.submitTransaction(
        "getUserData",
        email,
        accessToken.value
      )
    } else {
      result = await contract.submitTransaction(
        "getUserData",
        decoded.email,
        accessToken.value
      )
    }

    let response = JSON.parse(result.toString());
    console.log(result)
    console.log(result.toString())
    gateway.disconnect()
    return response;
  } catch (e) {
    console.log("Error at  getUserData ", e);
    gateway.disconnect()

  }
}



export async function getAllHomeData({ homeId }) {
  let accessToken = await getCooKies({ name: "accessToken" });
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
  const network = await gateway.getNetwork(channelName);
  const contract = network.getContract(chaincodeName);
  console.log(
    accessToken)
  try {
    let result = await contract.submitTransaction(
      "getHomeData",
      homeId,
      accessToken.value
    );

    let response = JSON.parse(result.toString());
    console.log(result)
    console.log(result.toString())
    gateway.disconnect()
    return response;
  } catch (e) {
    console.log("Error at  createADevice ", e);// console.log(e.responses[1].payload.toString())
    // console.log(e.responses[1].response.payload.toString())
    gateway.disconnect()

  }
}

export async function assignDeviceToHome({ deviceId, homeId }) {
  let accessToken = await getCooKies({ name: "accessToken" });
  if (!accessToken) {
    throw new Error("No access token found");
  }
  let wallet = await buildWallet(Wallets, walletPath);
  const gateway = new Gateway();
  await gateway.connect(ccp, {
    wallet,
    identity: org1UserId,
    discovery: { enabled: true, asLocalhost: true },
  });
  const network = await gateway.getNetwork(channelName);
  const contract = network.getContract(chaincodeName);
  console.log(homeId, deviceId,
    accessToken)
  try {
    let result = await contract.submitTransaction(
      "assignDeviceToHome",
      homeId,

      deviceId,
      accessToken.value,

    );

    let response = JSON.parse(result.toString());
    console.log(response)
    console.log(result.toString())
    revalidatePath('/serviceProvider/homeList/assignDevices')
    gateway.disconnect()
    // return response;
  } catch (e) {
    console.log("Error at  updateDevice ", e);
    gateway.disconnect()


  }
}
export async function getUserHome() {
  let accessToken = await getCooKies({ name: "accessToken" });
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
  const network = await gateway.getNetwork(channelName);
  const contract = network.getContract(chaincodeName);
  console.log(
    accessToken)
  try {
    let result = await contract.submitTransaction(
      "getUserHome",

      accessToken.value
    );

    let response = JSON.parse(result.toString());
    console.log(result)
    console.log(result.toString())
    gateway.disconnect()
    return response;

  } catch (e) {
    console.log("Error at  createADevice ", e);// console.log(e.responses[1].payload.toString())
    // console.log(e.responses[1].response.payload.toString())

    gateway.disconnect()
  }
}

export async function sendRequest({ deviceId, homeId }) {
  let accessToken = await getCooKies({ name: "accessToken" });
  if (!accessToken) {
    throw new Error("No access token found");
  }
  let wallet = await buildWallet(Wallets, walletPath);
  const gateway = new Gateway();
  await gateway.connect(ccp, {
    wallet,
    identity: org1UserId,
    discovery: { enabled: true, asLocalhost: true },
  });
  const network = await gateway.getNetwork(channelName);
  const contract = network.getContract(chaincodeName);
  console.log(" Sending request", homeId, deviceId,
    accessToken)
  try {
    let result = await contract.submitTransaction(
      "sendRequest",
      accessToken.value,
      deviceId,

      homeId,


    );

    let response = JSON.parse(result.toString());
    console.log(response)
    console.log(result.toString())
    revalidatePath('/serviceProvider/homeList/assignDevices')
    gateway.disconnect()
    // return response;
  } catch (e) {
    console.log("Error at  updateDevice ", e);
    gateway.disconnect()

  }
}

export async function getHomeDevice({ deviceId, homeId }) {
  let accessToken = await getCooKies({ name: "accessToken" });
  if (!accessToken) {
    throw new Error("No access token found");
  }
  let wallet = await buildWallet(Wallets, walletPath);
  const gateway = new Gateway();
  await gateway.connect(ccp, {
    wallet,
    identity: org1UserId,
    discovery: { enabled: true, asLocalhost: true },
  });
  const network = await gateway.getNetwork(channelName);
  const contract = network.getContract(chaincodeName);
  console.log(homeId, deviceId,
    accessToken)
  try {
    let result = await contract.submitTransaction(
      "getHomeDevice",
      homeId,

      deviceId,
      accessToken.value,

    );

    let response = JSON.parse(result.toString());
    console.log(response)
    console.log(result.toString())
    revalidatePath('/serviceProvider/homeList/assignDevices')
    gateway.disconnect()
    // return response;
  } catch (e) {
    console.log("Error at  updateDevice ", e);
    gateway.disconnect()

  }
}
export async function updateUser({ firstName, lastName, password, }) {
  console.log('I am herr')
  let accessToken = await getCooKies({ name: "accessToken" });
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

  const network = await gateway.getNetwork(channelName);

  const contract = network.getContract(chaincodeName);

  try {
    let result = await contract.submitTransaction(
      "updateUser",
      firstName,
      lastName,
      password,
      accessToken.value

    );
    let response = JSON.parse(result.toString());
    gateway.disconnect()
    return response;
  } catch (e) {
    console.log("Error at  register", e);
    gateway.disconnect()
  }
}


export async function assignDevicesToUser({ deviceId, homeId, email }) {

  console.log('deviceId', deviceId, 'homeId', homeId, 'email', email)


  let accessToken = await getCooKies({ name: "accessToken" });
  if (!accessToken) {
    throw new Error("No access token found");
  }
  let wallet = await buildWallet(Wallets, walletPath);
  const gateway = new Gateway();
  await gateway.connect(ccp, {
    wallet,
    identity: org1UserId,
    discovery: { enabled: true, asLocalhost: true },
  });
  const network = await gateway.getNetwork(channelName);
  const contract = network.getContract(chaincodeName);
  console.log(homeId, deviceId,
    accessToken)
  try {
    let result = await contract.submitTransaction(
      "assignDevicesToUser",
      homeId,
      deviceId,
      email,
      accessToken.value,
    );

    let response = JSON.parse(result.toString());
    console.log(response)
    console.log(result.toString())
    revalidatePath('/serviceProvider/homeList/assignDevices')
    gateway.disconnect()
    // return response;
  } catch (e) {
    console.log("Error at  updateDevice ", e);
    gateway.disconnect()

  }
}
