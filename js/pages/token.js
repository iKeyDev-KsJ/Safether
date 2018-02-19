(() => {

    function async_load() {

        for (let i = 0; i < document.head.children.length; i++) {if (document.head.children[i].type == "text/css") document.head.children[i].rel = "stylesheet"}
        element = [document.getElementById('token'), document.getElementById('words')];

        // Checking if Web3 has been injected by the browser (Mist/MetaMask)
        if (typeof web3 !== 'undefined') {
            // Use Mist/MetaMask's provider
            web3js = new Web3(web3.currentProvider);
            etherSafe = new web3js.eth.Contract(contractABI, contractAddress);

            web3js.eth.getCoinbase((err, address) => {

                if (err) { window.close(); }
                if (address === null) { alert('Please make sure the meta mask is logged in.'); return window.close(); }
                etherSafe.methods.getDepositor().call({from: address}, (err, data) => {

                    if (err) { window.close(); }
                    if (data[0] === '0x0000000000000000') { window.close(); }
                    document.getElementById('token').innerText = Base64.encode(data[0]);
                    document.getElementById('words').innerText = mnemonic.encode(address.slice(2, 42));
                    element[0].addEventListener('click', () => {window.prompt('Copy to the clipboard via Ctrl + C.', document.getElementById('token').innerText)});
                    element[1].addEventListener('click', () => {window.prompt('Copy to the clipboard via Ctrl + C.', document.getElementById('words').innerText)});

                });

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
