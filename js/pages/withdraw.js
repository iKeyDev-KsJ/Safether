(() => {

    function async_load() {

        for (let i = 0; i < document.head.children.length; i++) {if (document.head.children[i].type == "text/css") document.head.children[i].rel = "stylesheet"}

        // Checking if Web3 has been injected by the browser (Mist/MetaMask)
        if (typeof web3 !== 'undefined') {
            // Use Mist/MetaMask's provider
            web3js = new Web3(web3.currentProvider);
            etherSafe = new web3js.eth.Contract(contractABI, contractAddress);

            web3js.eth.getCoinbase((err, address) => {

                if (err) { alert(err); return window.close(); }
                if (address === null) { alert('Please make sure the meta mask is logged in.'); return window.close(); }
                document.getElementById('withdraw').addEventListener('click', () => {withdraw()});

            });

        } else {
            alert('Metamask is required to use the service.');
            window.close();
            //console.log('No web3? You should consider trying MetaMask!')
            // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
            //web3js = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
        }

    }
    window.attachEvent ? window.attachEvent('onload', async_load) : window.addEventListener('load', async_load, false);

})();

function withdraw() {

    web3js.eth.getCoinbase((err, address) => {

        if (err) { alert(err); return window.close(); }
        if (address === null) { alert('Please make sure the meta mask is logged in.'); return window.close(); }
        const token = Base64.decode(document.getElementById('token').value);
        var addressWord = '';

        for (var i=1; i<=16; i++)
            addressWord += document.getElementById('word' + i).value + ' ';

        addressWord = addressWord.trimRight();

        const depositor = '0x' + mnemonic.decode(addressWord);
        etherSafe.methods.withdraw(depositor, token).send({from: address})
        .on('transactionHash', (txid) => { opener.openEtherScan(txid); window.close(); });

    });

}