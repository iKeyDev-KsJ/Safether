(() => {

    function async_load() {

        for (let i = 0; i < document.head.children.length; i++) {if (document.head.children[i].type == "text/css") document.head.children[i].rel = "stylesheet"}
        document.getElementsByTagName('title')[0].innerText = (window.name == 'token') ? "Safether - Issue Access Token." : "Safether - Sign Up.";
        document.getElementById('warning').innerHTML = (window.name == 'token') ? "Please enter your secure password for verification." : "Enter your password (6 digits + 1 digit english) for your safe.<p>ex) 123456K or 123456p";

        // Checking if Web3 has been injected by the browser (Mist/MetaMask)
        if (typeof web3 !== 'undefined') {
            // Use Mist/MetaMask's provider
            web3js = new Web3(web3.currentProvider);
            web3js.eth.net.getId((networkId) => {

                if (networkId == 1) {
                    etherSafe = new web3js.eth.Contract(contractABI, contractAddress[0]);
                }
                else if (networkId == 3) {
                    etherSafe = new web3js.eth.Contract(contractABI, contractAddress[1]);
                }
                else if (networkId == 42) {
                    etherSafe = new web3js.eth.Contract(contractABI, contractAddress[2]);
                }
                else {
                    alert('Please make sure that Metamask RPC is set to Mainnet, Robsten, Kovan.');
                    for(var i = 0; i < element.length; i++)
                        element[i].addEventListener('click', () => {alert('Please make sure that Metamask RPC is set to Mainnet, Robsten, Kovan.')});
                    return;
                }

            });

            web3js.eth.getCoinbase((err, address) => {

                if (err) { window.close(); }
                if (address === null) { alert('Please make sure the meta mask is logged in.'); return window.close(); }
                document.getElementById('authentication').addEventListener('click', () => {getToken()});

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

function getToken() {

    web3js.eth.getCoinbase((err, address) => {

        if (err) { window.close(); }
        if (address === null) { alert('Please make sure the meta mask is logged in.'); return window.close(); }

        var password = document.getElementById('password').value;

        if (/^[0-9]{6}([a-z]|[A-Z])$/.test(password) && password.length == 7) {

            var bytePWD = '0x';

            for (var i=0; i<password.length; i++)
                bytePWD += parseInt(password.charCodeAt(i), 10).toString(16);

            if (window.name == 'token') {

                etherSafe.methods.getDepositor().call({from: address}, (err, data) => {

                    if (err) { alert(err); return location.replace('../'); }
                    if (data[0] === '0') { location.replace('../'); }

                    var token = web3js.utils.sha3('0x' + web3js.utils.leftPad(web3js.utils.toHex(parseInt(data[0], 10)).slice(2), 64, 0) + address.slice(2, 42) + bytePWD.slice(2)).slice(0, 18);
                    etherSafe.methods.authentication(token).call({from: address}, (err, auth) => {

                        if (err) { window.close(); }
                        if (!auth) { alert('Invalid password. please try again.'); window.close(); }
    
                        document.getElementById('token').innerText = Base64.encode(token);
                        document.getElementById('words').innerText = mnemonic.encode(address.slice(2, 42));
                        document.getElementById('token').addEventListener('click', () => {window.prompt('Copy to the clipboard via Ctrl + C.', document.getElementById('token').innerText)});
                        document.getElementById('words').addEventListener('click', () => {window.prompt('Copy to the clipboard via Ctrl + C.', document.getElementById('words').innerText)});
    
                        document.getElementById('auth').hidden = true;
                        document.getElementById('reissue').hidden = false;
    
                    });

                });

            }
            else {

                etherSafe.methods.register(bytePWD).send({from: address})
                .on('transactionHash', (txid) => { opener.moveManage(txid); window.close(); });

            }

        }
        else if (password === null) {}
        else { alert('The entered password can not be used. please try again.'); }

    });

}
