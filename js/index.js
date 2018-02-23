(() => {

    function async_load() {

        for (let i = 0; i < document.head.children.length; i++) {if (document.head.children[i].type == "text/css") document.head.children[i].rel = "stylesheet"}
        element = [document.getElementById('sign'), document.getElementById('withdraw'), document.getElementById('donate')];

        if (typeof web3 !== 'undefined') {

            web3js = new Web3(web3.currentProvider);
            web3js.eth.net.getId()
            .then((networkId) => {

                if (contractABI[networkId] !== undefined) {
                    etherSafe = new web3js.eth.Contract(contractABI, contractAddress[networkId]);
                }
                else {
                    alert('Please make sure that Metamask RPC is set to Mainnet, Robsten, Kovan.');
                    for(var i = 0; i < element.length; i++)
                        element[i].addEventListener('click', () => {alert('Please make sure that Metamask RPC is set to Mainnet, Robsten, Kovan.')});
                    return;
                }

            });

            element[0].addEventListener('click', () => {sign()});
            element[1].addEventListener('click', () => {window.open('./pages/withdraw.html','','width=360, height=540, resizable=no, scrollbars=no, location=no, status=no, menubar=no, toolbar=no;')});
            element[2].addEventListener('click', () => {donate()});

        } else {
            alert('Metamask is required to use the service.');
            for(var i = 0; i < element.length; i++)
                element[i].addEventListener('click', () => {alert('Please make sure that the MetaMask is installed.')});
        }

    }
    window.attachEvent ? window.attachEvent('onload', async_load) : window.addEventListener('load', async_load, false);

})();

function sign() {

    web3js.eth.getCoinbase((err, address) => {

        if (err) { return alert(err); }
        etherSafe.methods.getDepositor().call({from: address}, (err, data) => {

            if (err) { return alert (err); }
            if (address === null) { return alert('Please make sure the meta mask is logged in.'); };
            if (data[0] !== '0') { location.replace('./pages/manage.html'); }
            else { 
                if (confirm('You are not registered. Do you want to sign up?')) { 
                    var child = window.open('./pages/token.html','','width=360, height=540, resizable=no, scrollbars=no, location=no, status=no, menubar=no, toolbar=no;');
                    child.document.getElementsByTagName('isReissue').value = false;
                }
            }

        });

    })

}

function moveManage(txid) {

    alert('Please wait a few minutes as the page will refresh automatically once it is done.');
    var refreshIntervalId = setInterval(() => {

        web3js.eth.getBlock('latest')
        .then((data) => {

            data.transactions.forEach((_txid) => {
                if (txid == _txid) { clearInterval(refreshIntervalId); location.replace('./pages/manage.html'); } })

        });

    }, 1000);

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

function openEtherScan(txid) { alert('A transaction has been issued.'); setTimeout(() => { window.open('https://etherscan.io/tx/' + txid,'_blank'); }, 1000); }