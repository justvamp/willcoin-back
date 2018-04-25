"use strict";

import async from "async";
import request from "request";
import { Response, Request, NextFunction } from "express";
import * as child from "child_process";
import * as solc from "solc";
import Web3 from "web3";
import { readFileSync } from "fs";

export let index = (req: Request, res: Response) => {
  res.render("home", {
    title: "Home"
  });
};

export let getApi = (req: Request, res: Response) => {
  res.render("api/index", {
    title: "API Examples"
  });
};

export let getSmartContract = (req: Request, res: Response) => {
  res.json({
    smartContract: readFileSync("src/contracts/WillCoin.sol", "utf8")
  });
};

export let deploySmartContract = (req: Request, res: Response) => {
    const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));

    const input = {
      "WillCoin.sol": readFileSync("src/contracts/WillCoin.sol", "utf8")
    };

    const output = solc.compile({ sources: input }, 1, function() {});

    const contractInfo = output.contracts["WillCoin.sol:WillCoin"];
    const abi = JSON.parse(contractInfo.interface);
    const contract = new web3.eth.Contract(abi);

    contract.deploy({
      data: "0x" + contractInfo.bytecode
    })
    .send({
      from: "0x61fbaef29eCFA323B9A14b7a3089806a5162afE9", // TODO: remove hardcode
      gas: 1500000,
      gasPrice: "300000000"
    })
    .then(function(newContractInstance: any) {
        //newContractInstance.createProposal("ADHD", "setOffspring", 2, {from: "0x61fbaef29eCFA323B9A14b7a3089806a5162afE9", gas: 3000000});

        res.json({deployedAddress: newContractInstance.options.address});
    });
};

export let runAction = (req: Request, res: Response) => {
    const smart = req.query.smart;
    const wallet = req.query.wallet;
    const action = req.query.action;
    const value = req.query.value.trim();

    console.log({
      smart: smart,
      wallet: wallet,
      action: action,
      value: value
    });

    const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));

    const input = {
      "WillCoin.sol": readFileSync("src/contracts/WillCoin.sol", "utf8")
    };

    const output = solc.compile({ sources: input }, 1, function() {});

    const contractInfo = output.contracts["WillCoin.sol:WillCoin"];
    const abi = JSON.parse(contractInfo.interface);
    const contract = new web3.eth.Contract(abi, smart);

    let promise;

    switch (action) {
      case "getBalance": {
        promise = contract.methods.getBalance(wallet).call({from: wallet});
        break;
      }
      case "setOffspring": {
        promise = contract.methods.setOffspring(value).send({from: wallet});
        break;
      }
      case "getOffspring": {
        promise = contract.methods.getOffspring(wallet).call({from: wallet});
        break;
      }
      case "setBlocksTillWill": {
        promise = contract.methods.setBlocksTillWill(value).send({from: wallet});
        break;
      }
      case "getBlocksTillWill": {
        promise = contract.methods.getBlocksTillWill(wallet).call({from: wallet});
        break;
      }
      case "getMoneyBags": {
        promise = contract.methods.getMoneyBags(wallet).call({from: wallet});
        break;
      }
      case "getLastActiveBlock": {
        promise = contract.methods.getLastActiveBlock(wallet).call({from: wallet});
        break;
      }
      case "performLastWill": {
        promise = contract.methods.performLastWill().send({from: wallet});
        break;
      }
      case "bringMeToLife": {
        promise = contract.methods.bringMeToLife().send({from: wallet});
        break;
      }
      case "emptyMoneyBag": {
        promise = contract.methods.emptyMoneyBag(value).send({from: wallet});
        break;
      }
      default: {
        res.json({
          error: "Unknown contract method",
          result: ""
        });
      }
    }

    promise.then((result: any) => {
      res.json({
        result: result
      });
    });
};
