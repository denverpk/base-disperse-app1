import Web3 from 'web3';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { privateKey, rpcUrl, amount, wallets } = req.body;
  const w3 = new Web3(new Web3.providers.HttpProvider(rpcUrl));
  const account = w3.eth.accounts.privateKeyToAccount(privateKey);
  const sender = account.address;

  const walletList = wallets.split('\n').map(addr => addr.trim()).filter(addr => w3.utils.isAddress(addr));
  if (walletList.length === 0) return res.status(400).json({ message: 'No valid addresses found.' });

  let nonce = await w3.eth.getTransactionCount(sender);
  const gasPrice = await w3.eth.getGasPrice();

  let logs = '';
  for (let i = 0; i < walletList.length; i++) {
    const to = walletList[i];
    const tx = {
      nonce: nonce,
      to: to,
      value: w3.utils.toWei(amount, 'ether'),
      gas: 21000,
      gasPrice: gasPrice,
      chainId: 8453
    };
    const signedTx = await w3.eth.accounts.signTransaction(tx, privateKey);
    const receipt = await w3.eth.sendSignedTransaction(signedTx.rawTransaction);
    logs += `[${i + 1}/${walletList.length}] Sent ${amount} BASE to ${to} TxHash: ${receipt.transactionHash}\n`;
    nonce++;
  }

  return res.status(200).json({ message: logs });
}
