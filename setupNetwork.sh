
cd
cd /home/malik/hlf/fabric-samples/test-network/

sudo ./network.sh down
sudo ./network.sh up -ca
sudo ./network.sh createChannel -c identitymanagement
sudo ./network.sh deployCC -ccn identity -ccp /home/malik/SmartHome/chaincode-javascript/ -ccl javascript -c identitymanagement




