const contractAddress = {0: '0xa9d68bcCA2ebFb5293EA9102Cf4ea0090c3133Cb', 3: '0x0662F9eB3A41654657da1d6A59594c6E9a36f8F0', 42: '0xF2fDB10ad55be2A55e211a08e362796d622fE17f'};
const contractABI = [
	{
		"constant": true,
		"inputs": [],
		"name": "getDepositor",
		"outputs": [
			{
				"name": "",
				"type": "uint256[3]"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "token",
				"type": "bytes8"
			}
		],
		"name": "authentication",
		"outputs": [
			{
				"name": "",
				"type": "bool"
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
		"constant": false,
		"inputs": [
			{
				"name": "password",
				"type": "bytes7"
			}
		],
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
	}
];