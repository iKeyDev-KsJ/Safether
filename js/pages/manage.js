(() => {

    function async_load() {

        for (let i = 0; i < document.head.children.length; i++) {if (document.head.children[i].type == "text/css") document.head.children[i].rel = "stylesheet"}
        element = [document.getElementById('coinbase'), document.getElementById('signout'), document.getElementById('deposit'), document.getElementById('reissue'), document.getElementById('cancel'), document.getElementById('donate')];

        // Checking if Web3 has been injected by the browser (Mist/MetaMask)
        if (typeof web3 !== 'undefined') {
            // Use Mist/MetaMask's provider
            web3js = new Web3(web3.currentProvider);
            web3js.eth.net.getId()
            .then((networkId) => {

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

                if (err) { alert(err); return location.replace('../'); }
                if (address === null) { alert('Please make sure the meta mask is logged in.'); return location.replace('../'); }
                document.getElementById('coinbase').innerText = address;

                etherSafe.methods.getDepositor().call({from: address}, (err, data) => {

                    if (err) { alert(err); return location.replace('../'); }
                    if (data[0] === '0') { location.replace('../'); }
                    document.getElementById('balance').innerText = 'Your holding asset is ' + web3js.utils.fromWei(data[2], 'ether') + ' ethers.';

                    setInterval(() => {

                        web3js.eth.getBlockNumber((err, number) => {

                            if (err) { alert(err); return location.replace('../'); }
                            document.getElementById('limit').innerText = 'Currunt Number is ' + number + ', Asset Limit Number is ' + data[1] + (((number >= data[1]) && (data[1] != 0)) ? '.\nYou can find asset using access token or try cancel contract.'  : '.\nYou can\'t find asset using access token. but, you can try cancel contract if you want.');

                        });

                    }, 1000);

                    element[0].addEventListener('click', () => {window.prompt('Copy to the clipboard via Ctrl + C.', document.getElementById('coinbase').innerText)});
                    element[1].addEventListener('click', () => {if (confirm('Are you sure you want to sign out?')) { location.replace('../'); }});
                    element[2].addEventListener('click', () => {deposit()});
                    element[3].addEventListener('click', () => {window.open('./token.html','token','width=480, height=640, resizable=no, scrollbars=no, location=no, status=no, menubar=no, toolbar=no;');});
                    element[4].addEventListener('click', () => {cancel()});
                    element[5].addEventListener('click', () => {donate()});

                });

            });

        } else {
            alert('Metamask is required to use the service.');
            location.replace('../');
            //console.log('No web3? You should consider trying MetaMask!')
            // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
            //web3js = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
        }

    }
    window.attachEvent ? window.attachEvent('onload', async_load) : window.addEventListener('load', async_load, false);

})();

function deposit() {

    var balance = prompt("Please enter the assets to hold. (Unit: Ether)");
    if (/^\d+(?:[.]\d+)?$/.test(balance) && balance > 0) {

        var limit = prompt("Please enter a block number for how long you want to limit your assets.\nNote) that 1 block is 15 seconds, and if you want to holding assets for 150 seconds, you can enter 10.");
        if (/^[0-9]*$/.test(limit) && limit > 0) {

            etherSafe.methods.deposit(limit).send({from: document.getElementById('coinbase').innerText, value: web3js.utils.toWei(balance, 'ether')})
            .on('transactionHash', (txid) => {

                alert('Please wait a few minutes as the page will refresh automatically once it is done.');
                var refreshIntervalId = setInterval(() => {

                    web3js.eth.getBlock('latest')
                    .then((data) => {

                        data.transactions.forEach((_txid) => {
                            if (txid == _txid) { clearInterval(refreshIntervalId); location.reload(true); } })

                    });

                }, 1000);

            });

        }
        else if (limit === null) {}
        else { alert('Invalid input. please try again.');  }

    }
    else if (balance === null) {}
    else { alert('Invalid input. please try again.'); }

}

function cancel() {

    if (confirm('Are you sure you want to cancel contract?')) {
        
        etherSafe.methods.cancel().send({from: document.getElementById('coinbase').innerText})
        .on('transactionHash', (txid) => {

            alert('Please wait a few minutes as the page will refresh automatically once it is done.');
            var refreshIntervalId = setInterval(() => {

                web3js.eth.getBlock('latest')
                .then((data) => {

                    data.transactions.forEach((_txid) => {
                        if (txid == _txid) { clearInterval(refreshIntervalId); alert('Thank you for using Safether services.'); location.replace('../'); } })

                });

            }, 1000);

        });

    }

}

function donate() {

    web3js.eth.getCoinbase((err, address) => {

        if (err) { return alert(err); }
        if (address === null) { return alert('Please make sure the meta mask is logged in.'); };

        var balance = prompt("Thank you for considering donation! Please enter as much as you want. (Unit: Ether)");
        if (/^\d+(?:[.]\d+)?$/.test(balance) && balance > 0) {

            web3js.eth.sendTransaction({from: address, to:'0x91ce6a3BeF0154B9Dade57898ee41dd3aa8475ce', value: web3js.utils.toWei(balance, 'ether')})
            .on('transactionHash', (txid) => { alert('Appreciate your donation. Thank you.'); });

        }
        else if (balance === null) {}
        else { alert('You have entered an incorrect amount.'); }

    });

}