import { useState } from 'react';

export default function Home() {
  const [privateKey, setPrivateKey] = useState('');
  const [rpcUrl, setRpcUrl] = useState('');
  const [amount, setAmount] = useState('');
  const [wallets, setWallets] = useState('');
  const [log, setLog] = useState('');

  const handleDisperse = async () => {
    setLog('Processing...');
    const response = await fetch('/api/disperse', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ privateKey, rpcUrl, amount, wallets })
    });
    const data = await response.json();
    setLog(data.message);
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Base Token Disperse</h1>
      <textarea placeholder="Wallet Addresses (one per line)" rows="10" cols="50" value={wallets} onChange={(e) => setWallets(e.target.value)} />
      <br />
      <input type="text" placeholder="RPC URL" value={rpcUrl} onChange={(e) => setRpcUrl(e.target.value)} />
      <br />
      <input type="text" placeholder="Private Key" value={privateKey} onChange={(e) => setPrivateKey(e.target.value)} />
      <br />
      <input type="text" placeholder="Amount in BASE" value={amount} onChange={(e) => setAmount(e.target.value)} />
      <br />
      <button onClick={handleDisperse}>Disperse</button>
      <pre>{log}</pre>
    </div>
  );
}
