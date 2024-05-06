"use strict";

const { error } = require("console");
const { randomUUID } = require("crypto");
const { Contract } = require("fabric-contract-api");
const jwt = require("jsonwebtoken");

class UserAuthenticationContract extends Contract {
  async initLedger(ctx) {



    console.log("Chaincode instantiation is successful");
    console.log("saved the user")
  }
  #secret = "thisissecretitcanbeanythingaslongaspossibletomakeit";
  #expiryTime = "7d";
  #accessExpiryTime = "3h";
  #serviceProvider = {
    docType: "user",
    email: "serviceProvider@gmail.com",
    firstName: "John",
    lastName: "Doe",
    password: "serviceProvider",
    role: "service_provider",
    refreshTokens: [],
  }







  #deviceList = [
    {
      docType: "device",
      deviceId: "e6be0d56-2047-48ea-900e-45f0ff34f2b2",
      deviceName: "Camera_1",
      properties: {
        status: "on",
        unit: "mp4",


      },

      owner: {
        email: "serviceProvider@gmail.com",
        firstName: "Service ",
        lastName: "Provider",
        role: "Service_Provider",
      },
    },
    {
      docType: "device",
      deviceId: "e6be0d56-2047-48ea-900e-45f0f234f2b2",
      deviceName: "Camera_2",
      properties: {
        status: "on",
        unit: "mp4",


      },

      owner: {
        email: "serviceProvider@gmail.com",
        firstName: "Service ",
        lastName: "Provider",
        role: "Service_Provider",
      },
    }
    , {
      docType: "device",
      deviceId: "e6be0d56-2047-48ea-900e-r5f0ff34f2ba",
      deviceName: "Camera_3",
      properties: {
        status: "on",
        unit: "mp4",


      },

      owner: {
        email: "serviceProvider@gmail.com",
        firstName: "Service ",
        lastName: "Provider",
        role: "Service_Provider",
      },
    }
    , {
      docType: "device",
      deviceId: "e6be0d56-2047-48ea-900e-4ef0ff34f2ba",
      deviceName: "Smart Lock",
      properties: {
        status: "on",
        unit: "mp4",


      },

      owner: {
        email: "serviceProvider@gmail.com",
        firstName: "Service ",
        lastName: "Provider",
        role: "Service_Provider",
      },
    }
    ,
    {
      docType: "device",
      deviceId: "e6be0d56-2047-48ea-900e-45f0ff3432ba",
      deviceName: "Smoke detectors",
      properties: {
        status: "on",
        unit: "mp4",


      },

      owner: {
        email: "serviceProvider@gmail.com",
        firstName: "Service ",
        lastName: "Provider",
        role: "Service_Provider",
      },
    }
    ,
    {
      docType: "device",
      deviceId: "e6be0d56-2047-48ea-900e-45f0ff35f2ba",
      deviceName: "Motion detector ",
      properties: {
        status: "on",
        unit: "mp4",


      },

      owner: {
        email: "serviceProvider@gmail.com",
        firstName: "Service ",
        lastName: "Provider",
        role: "Service_Provider",
      },
    }
    , {
      docType: "device",
      deviceId: "e6be0d56-2047-48ea-900e-4df0ff34f2ba",
      deviceName: "Smart meter",
      properties: {
        status: "on",
        unit: "mp4",


      },

      owner: {
        email: "serviceProvider@gmail.com",
        firstName: "Service ",
        lastName: "Provider",
        role: "Service_Provider",
      },
    }
    , {
      docType: "device",
      deviceId: "e6be0d56-2047-48ea-900e-45d0ff34f2ba",
      deviceName: "Smart light",
      properties: {
        status: "on",
        unit: "mp4",


      },

      owner: {
        email: "serviceProvider@gmail.com",
        firstName: "Service ",
        lastName: "Provider",
        role: "Service_Provider",
      },
    }
    ,
    {
      docType: "device",
      deviceId: "e6be0d56-2047-48ea-900e-45f0ff34f2aa",
      deviceName: "  Smart socket",
      properties: {
        status: "on",
        unit: "mp4",


      },

      owner: {
        email: "serviceProvider@gmail.com",
        firstName: "Service ",
        lastName: "Provider",
        role: "Service_Provider",
      },
    }

  ]


  async test(ctx) {
    return true
  }
  async storeServiceProvider(ctx) {
    try {

      this.#deviceList.map(async device => {
        await ctx.stub.putState(device.deviceId, Buffer.from(JSON.stringify(device)));
      })


      await ctx.stub.putState("serviceProvider@gmail.com", Buffer.from(JSON.stringify(this.#serviceProvider)));

      await ctx.stub.putState("deviceList", Buffer.from(JSON.stringify(this.#deviceList)));


      return { isOk: true, }
    }

    catch (e) {
      return { isOk: false, message: e }
    }
  }
  async authenticateUser(ctx, email, token) {
    try {
      const decoded = jwt.verify(token, this.#secret);
      const userAsBytes = await ctx.stub.getState(email);

      if (!userAsBytes || userAsBytes.length === 0) {
        throw new Error(`The user ${email} does not exist`);
      }

      const user = JSON.parse(userAsBytes.toString());

      if (decoded.email !== email) {
        throw new Error("Invalid token for the given email");
      }
      if (user.email !== email) {
        throw new Error("Invalid token for the given email");
      }

      if (!user.refreshTokens.includes(token)) {
        throw new Error("Invalid token for the given email");
      }

      const currentTime = Math.floor(Date.now() / 1000);

      if (decoded.exp < currentTime) {
        user.refreshTokens = user.refreshTokens.filter(
          (refreshToken) => token !== token
        );
        await ctx.stub.putState(email, Buffer.from(JSON.stringify(user)));
        throw new Error("Refresh token has expired");
      }

      const accessToken = jwt.sign({ email }, this.#secret, {
        expiresIn: this.#accessExpiryTime,
      });

      return { isOk: true, accessToken };
    } catch (error) {
      return { isOk: false, message: error.message };
    }
  }
  async assignDevicesToUser(ctx, homeId, deviceId, requestorEmail, accessToken) {
    try {
      if (this.#isTokenValid(accessToken)) {
        throw new Error("Invalid access token");
      }

      const decoded = jwt.decode(accessToken);
      const adminemail = decoded.email;


      const requestuserAsBytes = await ctx.stub.getState(requestorEmail);

      if (!requestuserAsBytes) {
        throw new Error(`The user ${requestorEmail} does not exist`);
      }

      const reqeustor = JSON.parse(requestuserAsBytes.toString());


      const homeAsBytes = await ctx.stub.getState(homeId);


      if (!homeAsBytes) {
        throw new Error(`The home ${homeId} does not exist`);
      }


      const home = JSON.parse(homeAsBytes.toString());


      if (home.owner.email !== adminemail) {
        throw new Error(`The calling user is not the owner`);


      }

      if (reqeustor.role == "normal_user") {


        if (typeof reqeustor.accessList.normalUser[`${homeId}`] !== 'undefined') {
          reqeustor.accessList.normalUser[`${homeId}`].push(deviceId)

        } else {
          reqeustor.accessList.normalUser[`${homeId}`] = [];

          reqeustor.accessList.normalUser[`${homeId}`].push(deviceId)

        }
      }

      if (reqeustor.role == "service_requestor") {

        if (typeof (reqeustor.accessList.serviceRequestors[`${homeId}`]) !== 'undefined') {
          reqeustor.accessList.serviceRequestors[`${homeId}`].push(deviceId)

        } else {
          reqeustor.accessList.serviceRequestors[`${homeId}`] = [];

          reqeustor.accessList.serviceRequestors[`${homeId}`].push(deviceId)

        }
      }
      //TODO: something is wrong with device id assigning



      await ctx.stub.putState(requestorEmail, Buffer.from(JSON.stringify(reqeustor)))






      return { isOk: true, reqeustor };
    } catch (error) {
      return { isOk: false, message: error.message };
    }
  }
  async registerUser(ctx, firstName, lastName, email, password, role) {
    try {
      const userAsBytes = await ctx.stub.getState(email);
      if (userAsBytes && userAsBytes.length !== 0) {
        throw new Error(`The user ${email} already exits`);
      }

      const refreshToken = jwt.sign(
        { email, firstName, lastName, password, role },
        this.#secret,
        {
          expiresIn: this.#expiryTime,
        }
      );

      const user = {
        docType: "user",
        email,
        firstName,
        lastName,
        password,
        role,
        accessList: {
          admin: [],
          normalUser: {},
          serviceRequestors: {}
        },
        requests: {

          normalUser: [],
          serviceRequestors: []
        },
        refreshTokens: [refreshToken],
      };
      const accessToken = jwt.sign({ email }, this.#secret, {
        expiresIn: this.#accessExpiryTime,
      });

      await ctx.stub.putState(email, Buffer.from(JSON.stringify(user)));
      return { isOk: true, refreshToken, accessToken };
    } catch (error) {
      return { isOk: false, message: error.message };
    }
  }
  async updateUser(ctx, firstName, lastName, password, accessToken) {
    try {
      if (this.#isTokenValid(accessToken)) {
        throw new Error("Invalid access token");
      }

      const decoded = jwt.decode(accessToken);
      const email = decoded.email;
      const userAsBytes = await ctx.stub.getState(email);
      if (!userAsBytes) {
        throw new Error(`The user ${email} does not exist`);
      }

      let user = JSON.parse(userAsBytes.toString());
      user.password = password;
      user.firstName = firstName;
      user.lastName = lastName;




      await ctx.stub.putState(email, Buffer.from(JSON.stringify(user)));
      return { isOk: true, user: updatedUser };
    } catch (error) {
      return { isOk: false, message: error.message };
    }
  }

  async loginUser(ctx, email, password) {
    try {
      const userAsBytes = await ctx.stub.getState(email);
      if (!userAsBytes || userAsBytes.length === 0) {
        throw new Error(`The user ${email} does not exist`);
      }
      const user = JSON.parse(userAsBytes.toString());

      if (user.password !== password) {
        throw new Error("Invalid password");
      }

      const refreshToken = jwt.sign({ email, role: user.role }, this.#secret, {
        expiresIn: this.#expiryTime,
      });

      user.refreshTokens.push(refreshToken);

      const accessToken = jwt.sign({ email }, this.#secret, {
        expiresIn: this.#accessExpiryTime,
      });

      await ctx.stub.putState(email, Buffer.from(JSON.stringify(user)));

      return {
        isOk: true,
        refreshToken,
        accessToken,
        email: email,
        firstName: user.firstName,

        lastName: user.lastName,

        role: user.role,
      };
    } catch (error) {
      return { isOk: false, message: error.message };
    }
  }

  async logoutUser(ctx, email, refreshToken) {
    try {
      const userAsBytes = await ctx.stub.getState(email);
      if (!userAsBytes || userAsBytes.length === 0) {
        throw new Error(`The user ${email} does not exist`);
      }
      const user = JSON.parse(userAsBytes.toString());

      user.refreshTokens = user.refreshTokens.filter(
        (token) => token !== refreshToken
      );
      await ctx.stub.putState(email, Buffer.from(JSON.stringify(user)));

      return { isOk: true, deleted: true };
    } catch (error) {
      return { isOk: false, message: error.message };
    }
  }
  async getUserData(ctx, email, accessToken) {

    try {

      const userAsBytes = await ctx.stub.getState(email);

      if (!userAsBytes || userAsBytes.length === 0) {

        throw new Error(`The user ${email} does not exist`);
      }
      const user = JSON.parse(userAsBytes.toString());
      const { password, ...getUser } = user
      return { isOk: true, user: getUser };
    } catch (error) {
      return {
        isOk: false,
        messsage: error
      }
    }

  }
  async createDevice(ctx, deviceName, properties1, accessToken, deviceId) {
    let properties = JSON.parse(properties1)
    try {
      if (this.#isTokenValid(accessToken)) {
        throw new Error("Invalid access token");
      }

      const decoded = jwt.decode(accessToken);
      const email = decoded.email;
      const userAsBytes = await ctx.stub.getState(email);
      if (!userAsBytes) {
        throw new Error(`The user ${email} does not exist`);
      }

      const user = JSON.parse(userAsBytes.toString());

      if (user.role !== "service_provider") {
        throw new Error("Only service providers can add devices");
      }



      const device = {
        docType: "device",
        deviceId,
        deviceName,
        properties: properties || {},
        owner: {
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        },
      };
      const deviceListBytes = await ctx.stub.getState("deviceList");
      let deviceList = []

      if (!deviceListBytes || deviceListBytes.length === 0) {

      }
      else {
        deviceList = JSON.parse(deviceListBytes.toString());
      }

      deviceList.push(device);

      await ctx.stub.putState("deviceList", Buffer.from(JSON.stringify(deviceList)));

      await ctx.stub.putState(deviceId, Buffer.from(JSON.stringify(device)));
      return { isOk: true, added: true, device };
    } catch (error) {
      return { isOk: false, message: error.message };
    }
  }

  async updateHomeDevice(ctx, homeId, deviceName, properties1, accessToken, deviceId) {
    let properties = JSON.parse(properties1)
    try {
      if (this.#isTokenValid(accessToken)) {
        throw new Error("Invalid access token");
      }

      const decoded = jwt.decode(accessToken);
      const email = decoded.email;
      const userAsBytes = await ctx.stub.getState(email);
      if (!userAsBytes) {
        throw new Error(`The user ${email} does not exist`);
      }

      const user = JSON.parse(userAsBytes.toString());


      const homeAsBytes = await ctx.stub.getState(homeId);

      if (!homeAsBytes) {
        throw new Error(`The home ${homeId} does not exist`);
      }


      let home = JSON.parse(homeAsBytes.toString());
      let filteredDevice = home.devices.filter(device => device.deviceId == deviceId);
      if (filteredDevice.length == 0) {
        throw new Error("Device does not exits on the home")
      }
      filteredDevice = filteredDevice[0];
      filteredDevice.deviceName = deviceName;
      filteredDevice.properties = properties;

      return { isOk: true, device: filteredDevice };
    } catch (error) {
      return { isOk: false, message: error.message };
    }
  }
  async updateDevice(ctx, deviceName, properties1, accessToken, deviceId) {
    let properties = JSON.parse(properties1)
    try {
      if (this.#isTokenValid(accessToken)) {
        throw new Error("Invalid access token");
      }

      const decoded = jwt.decode(accessToken);
      const email = decoded.email;
      const userAsBytes = await ctx.stub.getState(email);
      if (!userAsBytes) {
        throw new Error(`The user ${email} does not exist`);
      }

      const user = JSON.parse(userAsBytes.toString());

      if (user.role !== "service_provider") {
        throw new Error("Only service providers can update devices");
      }

      const deviceAsBytes = await ctx.stub.getState(deviceId);



      if (!deviceAsBytes) {
        throw new Error(`The device ${deviceId} does not exist`);
      }
      const device = JSON.parse(deviceAsBytes.toString());




      let updatedDevice = {
        docType: "device",
        deviceId,
        deviceName,
        properties: properties || {},
        owner: {
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        },
      };
      const deviceListBytes = await ctx.stub.getState("deviceList");
      let deviceList = []

      if (!deviceListBytes || deviceListBytes.length === 0) {

      }
      else {
        deviceList = JSON.parse(deviceListBytes.toString());
      }

      deviceList.map(item => item.deviceId == deviceId ? device : item)

      await ctx.stub.putState("deviceList", Buffer.from(JSON.stringify(deviceList)));

      await ctx.stub.putState(deviceId, Buffer.from(JSON.stringify(device)));
      return { isOk: true, updated: true, device };
    } catch (error) {
      return { isOk: false, message: error.message };
    }
  }
  async getAllDevicesList(ctx, accessToken) {
    try {
      if (this.#isTokenValid(accessToken)) {
        throw new Error("Invalid access token");

      }

      const decoded = jwt.decode(accessToken);
      const email = decoded.email;

      const userAsBytes = await ctx.stub.getState(email);

      if (!userAsBytes) {
        throw new Error(`The user ${email} does not exist`);
      }

      const user = JSON.parse(userAsBytes.toString());

      if (user.email !== email) {
        throw new Error("Invalid access token");
      }

      const deviceListBytes = await ctx.stub.getState("deviceList");
      let deviceList = [];
      if (!deviceListBytes) {
        await ctx.stub.putState("deviceList", Buffer.from(deviceList));
      } else {
        deviceList = JSON.parse(deviceListBytes.toString());
      }

      return { isOk: true, deviceList };
    } catch (error) {
      return { isOk: false, message: error.message };
    }
  }
  async sendRequest(ctx, accessToken, deviceId, homeId) {
    try {
      if (this.#isTokenValid(accessToken)) {
        throw new Error("Invalid access token");

      }

      const decoded = jwt.decode(accessToken);
      const email = decoded.email;

      const userAsBytes = await ctx.stub.getState(email);

      if (!userAsBytes) {
        throw new Error(`The user ${email} does not exist`);
      }

      const user = JSON.parse(userAsBytes.toString());
      const homeAsBytes = await ctx.stub.getState(homeId);

      if (!homeAsBytes) {
        throw new Error(`The home ${homeId} does not exist`);
      }


      let home = JSON.parse(homeAsBytes.toString());
      // let filteredDevices = home.devices.filter(device => device.deviceId == deviceId);

      // if (filteredDevices.length == 0) {
      //   throw new Error(`The device ${deviceId} does not exits in a home`);

      // }



      if (user.role == 'admin') {
        throw new Error(`Admin cannot request`);
      }
      if (user.role == 'service_requestor') {

        let filteredUsers = home.requests.serviceRequestors.filter(normaluserEmail => normaluserEmail === email)
        if (filteredUsers.length > 0) {
          throw new Error(" The user Has Already access to the home  ")
        }
        user.requests.serviceRequestors.push(
          homeId
        )
        home.requests.serviceRequestors.push(
          email
        )

      }

      if (user.role == 'normal_user') {

        let filteredUsers = home.requests.normalUser.filter(normaluserEmail => normaluserEmail === email)
        if (filteredUsers.length > 0
        ) {
          throw new Error(" The user Has Already accessed the home  ")
        }
        user.requests.normalUser.push(homeId)
        home.requests.normalUser.push(
          email
        )
      }
      await ctx.stub.putState(user.email, Buffer.from(JSON.stringify(user)))
      await ctx.stub.putState(homeId, Buffer.from(JSON.stringify(home)));

      return { isOk: true, home }


    } catch (error) {
      return { isOk: false, message: error.message };

    }
  }

  async createNewHome(ctx, homeName, properties1, accessToken, ownerEmail, homeId) {

    let properties = JSON.parse(properties1)
    try {
      if (this.#isTokenValid(accessToken)) {
        throw new Error("Invalid access token");
      }

      const decoded = jwt.decode(accessToken);
      const email = decoded.email;
      const userAsBytes = await ctx.stub.getState(email);

      if (!userAsBytes || userAsBytes.length === 0) {

        throw new Error(`The user ${email} does not exist`);
      }

      const ownerAsBytes = await ctx.stub.getState(ownerEmail);
      if (!ownerAsBytes || ownerAsBytes.length === 0) {
        throw new Error(`The user ${ownerEmail} does not exist`);
      }

      const user = JSON.parse(userAsBytes.toString());
      const owner = JSON.parse(ownerAsBytes.toString());

      if (user.role !== "service_provider") {
        throw new Error("Only service providers can create new home");
      }

      let homeListBytes = await ctx.stub.getState("homeList");
      let homeList = [];
      if (!homeListBytes || homeListBytes.length === 0) {


      } else {
        homeList = JSON.parse(homeListBytes.toString());
      }

      let updatedUser = owner;
      updatedUser.accessList.admin.push(homeId);

      const home = {
        docType: "home",
        homeId,
        homeName,
        properties: properties || {},
        accessList: {
          admin: owner.email,
          normalUser: [],
          serviceRequestors: []
        },
        owner: {
          email: owner.email,
          firstName: owner.firstName,
          lastName: owner.lastName
        },
        requests: {
          normalUser: [],
          serviceRequestors: []
        },
        devices: [],
      };

      homeList.push(home);
      await ctx.stub.putState(
        "homeList",
        Buffer.from(JSON.stringify(homeList))
      );
      await ctx.stub.putState(homeId, Buffer.from(JSON.stringify(home)));
      await ctx.stub.putState(
        owner.email,
        Buffer.from(JSON.stringify(updatedUser))
      );
      return { isOk: true, added: true, home };
    } catch (error) {
      return { isOk: false, message: error.message };
    }
  }
  async getUserHome(ctx, accessToken) {
    try {
      if (this.#isTokenValid(accessToken)) {
        throw new Error("Invalid access token");
      }

      const decoded = jwt.decode(accessToken);
      const email = decoded.email;

      const userAsBytes = await ctx.stub.getState(email);



      const user = JSON.parse(userAsBytes.toString());



      let response = {};
      if (user.accessList.admin.length === 0) {
      }
      else {
        response.admin = await Promise.all(
          user.accessList.admin.map(async houseID =>
            JSON.parse((await ctx.stub.getState(houseID)).toString())
          )
        );
      }

      if (user.accessList.normalUser.length == 0) {

      } else {

        response.normalUser = await Promise.all(Object.keys(user.accessList.normalUser).map(async houseID => JSON.parse((await ctx.stub.getState(houseID)).toString()))
        );
        response.normalUser.map(home => {


          let filteredDevices = home.devices.filter(

            device => user.accessList.normalUser[home.homeId].some(deviceId => device.deviceId === deviceId)
          )
          home.devices = filteredDevices;
          home.requests = {

            normalUser: [],
            serviceRequestors: []
          }

        })
      }
      if (user.accessList.serviceRequestors.length == 0) {

      } else {

        response.serviceRequestors = await Promise.all(Object.keys(user.accessList.serviceRequestors).map(async houseID => JSON.parse((await ctx.stub.getState(houseID)).toString()))
        );

        response.serviceRequestors.map(home => {


          let filteredDevices = home.devices.filter(

            device => user.accessList.serviceRequestors[home.homeId].some(deviceId => device.deviceId === deviceId)
          )
          home.devices = filteredDevices;
          home.requests = {

            normalUser: [],
            serviceRequestors: []
          };

        })

      }
      return { isOk: true, response }


    } catch (error) {
      return { isOk: false, message: error.message };

    }
  }


  async getAllHomeList(ctx, accessToken) {
    try {
      if (this.#isTokenValid(accessToken)) {
        throw new Error("Invalid access token");
      }

      const decoded = jwt.decode(accessToken);
      const email = decoded.email;

      const userAsBytes = await ctx.stub.getState(email);

      if (!userAsBytes) {
        throw new Error(`The user ${email} does not exist`);
      }

      const homeListBytes = await ctx.stub.getState("homeList");
      let homeList = [];
      if (!homeListBytes || homeListBytes.length === 0) {
        await ctx.stub.putState("homeList", Buffer.from(homeList));
      } else {
        homeList = JSON.parse(homeListBytes.toString());
      }

      return { isOk: true, homeList };
    } catch (error) {
      return { isOk: false, message: error.message };
    }
  }
  async getHomeDevice(ctx, homeId, deviceId, accessToken) {
    try {
      if (this.#isTokenValid(accessToken)) {
        throw new Error("Invalid access token");
      }

      const decoded = jwt.decode(accessToken);





      const homeAsBytes = await ctx.stub.getState(homeId);
      if (!homeAsBytes) {
        throw new Error(`The home ${homeId} does not exist`);
      }
      const home = JSON.parse(homeAsBytes.toString());


      let filteredDevice = home.devices.filter(device => device.deviceId == deviceId);
      if (filteredDevice.length == 0) {
        throw new Error("Device does not exits on the home")
      }
      filteredDevice = filteredDevice[0];

      return { isOk: true, device: filteredDevice };



    } catch (error) {
      return { isOk: false, message: error.message };

    }

  }

  async assignDeviceToHome(ctx, homeId, deviceId, accessToken) {
    try {
      if (this.#isTokenValid(accessToken)) {
        throw new Error("Invalid access token");
      }

      const decoded = jwt.decode(accessToken);
      const email = decoded.email;
      const userAsBytes = await ctx.stub.getState(email);

      if (!userAsBytes) {
        throw new Error(`The user ${email} does not exist`);
      }

      const user = JSON.parse(userAsBytes.toString());

      if (user.role !== "service_provider") {
        throw new Error("Only service providers can add devices");
      }

      const homeAsBytes = await ctx.stub.getState(homeId);

      if (!homeAsBytes) {
        throw new Error(`The home ${homeId} does not exist`);
      }

      const deviceAsBytes = await ctx.stub.getState(deviceId);

      if (!deviceAsBytes) {
        throw new Error(`The device ${deviceId} does not exist`);
      }
      const device = JSON.parse(deviceAsBytes.toString());
      let home = JSON.parse(homeAsBytes.toString());
      if (typeof home.devices == 'undefined') {
        home.devices = [];
      }
      home.devices.push(device);
      await ctx.stub.putState(homeId, Buffer.from(JSON.stringify(home)));
      return { isOk: true, assigned: true, home };
    } catch (error) {
      return { isOk: false, message: error.message };
    }
  }
  async getHomesByUser(ctx, accessToken) {
    try {
      if (this.#isTokenValid(accessToken)) {
        throw new Error("Invalid access token");
      }

      const decoded = jwt.decode(accessToken);
      const email = decoded.email;

      const userAsBytes = await ctx.stub.getState(email);

      if (!userAsBytes) {
        throw new Error(`The user ${email} does not exist`);
      }

      const user = JSON.parse(userAsBytes.toString());

      if (user.email !== email) {
        throw new Error("Invalid access token");
      }

      const homeListBytes = await ctx.stub.getState("homeList");
      let homeList = [];
      if (!homeListBytes) {
        await ctx.stub.putState("homeList", Buffer.from(homeList));
      } else {
        homeList = JSON.parse(homeListBytes.toString());
      }

      // Filter homes by owner's email
      const userHomes = homeList.filter(home => home.owner.email === email);

      return { isOk: true, userHomes };
    } catch (error) {
      return { isOk: false, message: error.message };
    }
  }

  async getHomeData(ctx, homeId, accessToken) {
    try {
      if (this.#isTokenValid(accessToken)) {
        throw new Error("Invalid access token");
      }

      const decoded = jwt.decode(accessToken);
      const email = decoded.email;
      const userAsBytes = await ctx.stub.getState(email);

      if (!userAsBytes) {
        throw new Error(`The user ${email} does not exist`);
      }

      const user = JSON.parse(userAsBytes.toString());

      if (user.role !== "service_provider") {
        throw new Error("Only service providers can add devices");
      }

      const homeAsBytes = await ctx.stub.getState(homeId);
      if (!homeAsBytes) {
        throw new Error(`The home ${homeId} does not exist`);
      }
      const home = JSON.parse(homeAsBytes.toString());
      return { isOk: true, home }


    } catch (error) {
      return { isOk: false, message: error.message };

    }

  }



  #isTokenValid(token) {
    try {
      const decodedToken = jwt.verify(token, this.#secret);
      const currentTimeInSeconds = Date.now() / 1000;
      return decodedToken.exp < currentTimeInSeconds;
    } catch (error) {
      // Token verification failed (invalid signature, expired, etc.)
      return true;
    }
  }
}



module.exports = UserAuthenticationContract;
