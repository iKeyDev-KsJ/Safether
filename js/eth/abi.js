const contractAddress = '0x2322f82D952116D044eDD05B0BDcD098335502c3';
const contractABI = [
	{
		"constant": false,
		"inputs": [],
		"name": "register",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "depositor",
				"type": "address"
			},
			{
				"name": "token",
				"type": "bytes8"
			}
		],
		"name": "withdraw",
		"outputs": [],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "period",
				"type": "uint256"
			}
		],
		"name": "deposit",
		"outputs": [],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "getDepositor",
		"outputs": [
			{
				"name": "",
				"type": "bytes8"
			},
			{
				"name": "",
				"type": "uint256"
			},
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [],
		"name": "cancel",
		"outputs": [],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	}
];