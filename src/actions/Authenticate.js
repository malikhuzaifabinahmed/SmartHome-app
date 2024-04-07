"use server";

import { cookies } from "next/headers";

__dirname = "/home/malik/hlf/fabric-samples/test-network/a";
import jwt from "jsonwebtoken";
import { deleteCookies, setCookies } from "./cookiesManger.js";
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
  "/home/malik/SmartHome-app/src/actions/",
  "wallet"
);
const org1UserId = "javascriptAppUser";

const ccp = buildCCPOrg1();
console.log("buid cc po org1");

const caClient = buildCAClient(FabricCAServices, ccp, "ca.org1.example.com");
console.log("able to enroll admin");

__dirname = "/home/malik/SmartHome-app/src/actions/";
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

export async function register({ firstName, lastName, email, password, role }) {
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
    cookies().set("refreshToken", response.refreshToken, {
      maxAge: oneDay * 7,
    });
    return response;
  } catch (e) {
    console.log("Error at  register", e);
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

    return response;
  } catch (e) {
    console.log("Error at login ", e);
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

    return response;
  } catch (e) {
    console.log("Error at authenticateUser ", e);
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
    return response;
  } catch (e) {
    console.log("Error at logoutUser ", e);
  }
}
