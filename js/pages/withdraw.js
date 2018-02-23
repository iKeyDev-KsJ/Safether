(() => {

    function async_load() {

        for (let i = 0; i < document.head.children.length; i++) {if (document.head.children[i].type == "text/css") document.head.children[i].rel = "stylesheet"}

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

            web3js.eth.getCoinbase((err, address) => {

                if (err) { alert(err); return window.close(); }
                if (address === null) { alert('Please make sure the meta mask is logged in.'); return window.close(); }
                document.getElementById('withdraw').addEventListener('click', () => {withdraw()});

            });

        } else {
            alert('Metamask is required to use the service.');
            window.close();
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