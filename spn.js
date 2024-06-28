const readline = require('readline');
const Web3 = require('web3');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Enter your private key: ', (privateKey) => {
  rl.question('Enter recipient\'s address: ', (toAddress) => {
    rl.question('Enter range of amounts to transfer (e.g., 0.00001,0.0002): ', (amountRange) => {
      rl.question('Enter range of intervals in seconds (e.g., 10,15): ', (intervalRange) => {

        const [minAmount, maxAmount] = amountRange.split(',').map(Number);
        const [minInterval, maxInterval] = intervalRange.split(',').map(Number);

        const rpcURL = "https://testnet-rpc.superposition.so/";
        const web3 = new Web3(new Web3.providers.HttpProvider(rpcURL));

        function getRandomAmount(min, max) {
          return (Math.random() * (max - min) + min).toFixed(2);
        }

        function getRandomInterval(min, max) {
          return Math.floor(Math.random() * (max - min + 1) + min);
        }

        function sendTransaction() {
          const amount = getRandomAmount(minAmount, maxAmount);
          const interval = getRandomInterval(minInterval, maxInterval);

          const account = web3.eth.accounts.privateKeyToAccount(privateKey);
          web3.eth.accounts.wallet.add(account);
          web3.eth.defaultAccount = account.address;

          const tx = {
            from: web3.eth.defaultAccount,
            to: toAddress,
            value: web3.utils.toWei(amount, 'ether'),
            gas: 21000,
            gasPrice: web3.utils.toWei('1', 'gwei'),
            chainId: 98985
          };

          web3.eth.sendTransaction(tx)
            .then(receipt => {
              console.log(`Transaction successful with hash: ${receipt.transactionHash} | Amount sent: ${amount} ETH | Next transaction in: ${interval} seconds`);
            })
            .catch(err => {
              console.error('Error sending transaction:', err);
            });

          setTimeout(sendTransaction, interval * 1000);
        }

        sendTransaction();

        rl.close();
      });
    });
  });
});
