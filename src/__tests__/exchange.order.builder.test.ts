import { Wallet } from "@ethersproject/wallet";
import { beforeEach, describe, expect, it } from "bun:test";

import { ExchangeOrderBuilder } from "../exchange.order.builder";
import type { Order, OrderData } from "../model/order.model";
import { Side } from "../model/order-side.model";
import { generateOrderSalt } from "../utils";

describe("order builder", () => {
  describe("CTFexchange", () => {
    let wallet: Wallet;
    let exchangeOrderBuilder: ExchangeOrderBuilder;

    beforeEach(async () => {
      const chainId = 80002;

      // exchange address
      const exchangeAddress = "0xdFE02Eb6733538f8Ea35D585af8DE5958AD99E40";

      // publicly known private key
      const privateKey = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
      wallet = new Wallet(privateKey);

      exchangeOrderBuilder = new ExchangeOrderBuilder(
        exchangeAddress,
        chainId,
        wallet,
        generateOrderSalt,
      );
    });

    describe("buildOrder", () => {
      it("random salt", async () => {
        const order = await exchangeOrderBuilder.buildOrder({
          maker: wallet.address,
          taker: "0x0000000000000000000000000000000000000000",
          tokenId: "1234",
          makerAmount: "100000000",
          takerAmount: "50000000",
          side: Side.BUY,
          feeRateBps: "100",
          nonce: "0",
        } as OrderData);

        expect(order).not.toBeNull();
        expect(order).not.toBeUndefined();

        expect(order.salt).not.toBeEmpty();
        expect(order.maker).toEqual(wallet.address);
        expect(order.signer).toEqual(wallet.address);
        expect(order.taker).toEqual("0x0000000000000000000000000000000000000000");
        expect(order.tokenId).toEqual("1234");
        expect(order.makerAmount).toEqual("100000000");
        expect(order.takerAmount).toEqual("50000000");
        expect(order.side).toEqual(0);
        expect(order.expiration).toEqual("0");
        expect(order.nonce).toEqual("0");
        expect(order.feeRateBps).toEqual("100");
        expect(order.signatureType).toEqual(0);
      });

      it("specific salt", async () => {
        (exchangeOrderBuilder as any)["generateSalt"] = () => {
          return "479249096354";
        };

        const order = await exchangeOrderBuilder.buildOrder({
          maker: wallet.address,
          taker: "0x0000000000000000000000000000000000000000",
          tokenId: "1234",
          makerAmount: "100000000",
          takerAmount: "50000000",
          side: Side.BUY,
          feeRateBps: "100",
          nonce: "0",
        } as OrderData);

        expect(order).not.toBeNull();
        expect(order).not.toBeUndefined();

        expect(order).toEqual({
          salt: "479249096354",
          maker: wallet.address,
          signer: wallet.address,
          taker: "0x0000000000000000000000000000000000000000",
          tokenId: "1234",
          makerAmount: "100000000",
          takerAmount: "50000000",
          expiration: "0",
          nonce: "0",
          feeRateBps: "100",
          side: 0,
          signatureType: 0,
        } as Order);
      });
    });

    describe("buildLimitOrderTypedData", async () => {
      it("random salt", async () => {
        const order = await exchangeOrderBuilder.buildOrder({
          maker: wallet.address,
          taker: "0x0000000000000000000000000000000000000000",
          tokenId: "1234",
          makerAmount: "100000000",
          takerAmount: "50000000",
          side: Side.BUY,
          feeRateBps: "100",
          nonce: "0",
        } as OrderData);

        expect(order).not.toBeNull();
        expect(order).not.toBeUndefined();

        const orderTypedData = exchangeOrderBuilder.buildOrderTypedData(order);
        expect(orderTypedData).not.toBeNull();
        expect(orderTypedData).not.toBeUndefined();

        expect(orderTypedData).toEqual({
          primaryType: "Order",
          types: {
            EIP712Domain: [
              { name: "name", type: "string" },
              { name: "version", type: "string" },
              { name: "chainId", type: "uint256" },
              { name: "verifyingContract", type: "address" },
            ],
            Order: [
              { name: "salt", type: "uint256" },
              { name: "maker", type: "address" },
              { name: "signer", type: "address" },
              { name: "taker", type: "address" },
              { name: "tokenId", type: "uint256" },
              { name: "makerAmount", type: "uint256" },
              { name: "takerAmount", type: "uint256" },
              { name: "expiration", type: "uint256" },
              { name: "nonce", type: "uint256" },
              { name: "feeRateBps", type: "uint256" },
              { name: "side", type: "uint8" },
              { name: "signatureType", type: "uint8" },
            ],
          },
          domain: {
            name: "Polymarket CTF Exchange",
            version: "1",
            chainId: 80002,
            verifyingContract: "0xdFE02Eb6733538f8Ea35D585af8DE5958AD99E40",
          },
          message: {
            salt: orderTypedData.message.salt!,
            maker: wallet.address,
            signer: wallet.address,
            taker: "0x0000000000000000000000000000000000000000",
            tokenId: "1234",
            makerAmount: "100000000",
            takerAmount: "50000000",
            expiration: "0",
            nonce: "0",
            feeRateBps: "100",
            side: 0,
            signatureType: 0,
          },
        });
      });

      it("specific salt", async () => {
        (exchangeOrderBuilder as any)["generateSalt"] = () => {
          return "479249096354";
        };

        const order = await exchangeOrderBuilder.buildOrder({
          maker: wallet.address,
          taker: "0x0000000000000000000000000000000000000000",
          tokenId: "1234",
          makerAmount: "100000000",
          takerAmount: "50000000",
          side: Side.BUY,
          feeRateBps: "100",
          nonce: "0",
        } as OrderData);

        expect(order).not.toBeNull();
        expect(order).not.toBeUndefined();

        const orderTypedData = exchangeOrderBuilder.buildOrderTypedData(order);
        expect(orderTypedData).not.toBeNull();
        expect(orderTypedData).not.toBeUndefined();

        expect(orderTypedData).toEqual({
          primaryType: "Order",
          types: {
            EIP712Domain: [
              { name: "name", type: "string" },
              { name: "version", type: "string" },
              { name: "chainId", type: "uint256" },
              { name: "verifyingContract", type: "address" },
            ],
            Order: [
              { name: "salt", type: "uint256" },
              { name: "maker", type: "address" },
              { name: "signer", type: "address" },
              { name: "taker", type: "address" },
              { name: "tokenId", type: "uint256" },
              { name: "makerAmount", type: "uint256" },
              { name: "takerAmount", type: "uint256" },
              { name: "expiration", type: "uint256" },
              { name: "nonce", type: "uint256" },
              { name: "feeRateBps", type: "uint256" },
              { name: "side", type: "uint8" },
              { name: "signatureType", type: "uint8" },
            ],
          },
          domain: {
            name: "Polymarket CTF Exchange",
            version: "1",
            chainId: 80002,
            verifyingContract: "0xdFE02Eb6733538f8Ea35D585af8DE5958AD99E40",
          },
          message: {
            salt: "479249096354",
            maker: wallet.address,
            signer: wallet.address,
            taker: "0x0000000000000000000000000000000000000000",
            tokenId: "1234",
            makerAmount: "100000000",
            takerAmount: "50000000",
            expiration: "0",
            nonce: "0",
            feeRateBps: "100",
            side: 0,
            signatureType: 0,
          },
        });
      });
    });

    describe("buildOrderSignature", async () => {
      it("random salt", async () => {
        const order = await exchangeOrderBuilder.buildOrder({
          maker: wallet.address,
          taker: "0x0000000000000000000000000000000000000000",
          tokenId: "1234",
          makerAmount: "100000000",
          takerAmount: "50000000",
          side: Side.BUY,
          feeRateBps: "100",
          nonce: "0",
        } as OrderData);

        expect(order).not.toBeNull();
        expect(order).not.toBeUndefined();

        const orderTypedData = exchangeOrderBuilder.buildOrderTypedData(order);
        expect(orderTypedData).not.toBeNull();
        expect(orderTypedData).not.toBeUndefined();

        const orderSignature = await exchangeOrderBuilder.buildOrderSignature(orderTypedData);
        expect(orderSignature).not.toBeNull();
        expect(orderSignature).not.toBeUndefined();
        expect(orderSignature).not.toBeEmpty();
      });

      it("specific salt", async () => {
        (exchangeOrderBuilder as any)["generateSalt"] = () => {
          return "479249096354";
        };

        const order = await exchangeOrderBuilder.buildOrder({
          maker: wallet.address,
          taker: "0x0000000000000000000000000000000000000000",
          tokenId: "1234",
          makerAmount: "100000000",
          takerAmount: "50000000",
          side: Side.BUY,
          feeRateBps: "100",
          nonce: "0",
        } as OrderData);

        expect(order).not.toBeNull();
        expect(order).not.toBeUndefined();

        const orderTypedData = exchangeOrderBuilder.buildOrderTypedData(order);
        expect(orderTypedData).not.toBeNull();
        expect(orderTypedData).not.toBeUndefined();

        const orderSignature = await exchangeOrderBuilder.buildOrderSignature(orderTypedData);
        expect(orderSignature).not.toBeNull();
        expect(orderSignature).not.toBeUndefined();
        expect(orderSignature).not.toBeEmpty();

        expect(orderSignature).toEqual(
          "0x302cd9abd0b5fcaa202a344437ec0b6660da984e24ae9ad915a592a90facf5a51bb8a873cd8d270f070217fea1986531d5eec66f1162a81f66e026db653bf7ce1c",
        );
      });
    });

    describe("buildOrderHash", async () => {
      it("random salt", async () => {
        const order = await exchangeOrderBuilder.buildOrder({
          maker: wallet.address,
          taker: "0x0000000000000000000000000000000000000000",
          tokenId: "1234",
          makerAmount: "100000000",
          takerAmount: "50000000",
          side: Side.BUY,
          feeRateBps: "100",
          nonce: "0",
        } as OrderData);

        expect(order).not.toBeNull();
        expect(order).not.toBeUndefined();

        const orderTypedData = exchangeOrderBuilder.buildOrderTypedData(order);
        expect(orderTypedData).not.toBeNull();
        expect(orderTypedData).not.toBeUndefined();

        const orderHash = exchangeOrderBuilder.buildOrderHash(orderTypedData);
        expect(orderHash).not.toBeNull();
        expect(orderHash).not.toBeUndefined();
      });

      it("specific salt", async () => {
        (exchangeOrderBuilder as any)["generateSalt"] = () => {
          return "479249096354";
        };

        const order = await exchangeOrderBuilder.buildOrder({
          maker: wallet.address,
          taker: "0x0000000000000000000000000000000000000000",
          tokenId: "1234",
          makerAmount: "100000000",
          takerAmount: "50000000",
          side: Side.BUY,
          feeRateBps: "100",
          nonce: "0",
        } as OrderData);

        expect(order).not.toBeNull();
        expect(order).not.toBeUndefined();

        const orderTypedData = exchangeOrderBuilder.buildOrderTypedData(order);
        expect(orderTypedData).not.toBeNull();
        expect(orderTypedData).not.toBeUndefined();

        const orderHash = exchangeOrderBuilder.buildOrderHash(orderTypedData);
        expect(orderHash).not.toBeNull();
        expect(orderHash).not.toBeUndefined();

        expect(orderHash).toEqual(
          "0x02ca1d1aa31103804173ad1acd70066cb6c1258a4be6dada055111f9a7ea4e55",
        );
      });
    });

    describe("buildSignedOrder", async () => {
      it("random salt", async () => {
        const signedOrder = await exchangeOrderBuilder.buildSignedOrder({
          maker: wallet.address,
          taker: "0x0000000000000000000000000000000000000000",
          tokenId: "1234",
          makerAmount: "100000000",
          takerAmount: "50000000",
          side: Side.BUY,
          feeRateBps: "100",
          nonce: "0",
        } as OrderData);
        expect(signedOrder).not.toBeNull();
        expect(signedOrder).not.toBeUndefined();

        expect(signedOrder.salt).not.toBeEmpty();
        expect(signedOrder.maker).toEqual(wallet.address);
        expect(signedOrder.signer).toEqual(wallet.address);
        expect(signedOrder.taker).toEqual("0x0000000000000000000000000000000000000000");
        expect(signedOrder.tokenId).toEqual("1234");
        expect(signedOrder.makerAmount).toEqual("100000000");
        expect(signedOrder.takerAmount).toEqual("50000000");
        expect(signedOrder.side).toEqual(0);
        expect(signedOrder.expiration).toEqual("0");
        expect(signedOrder.nonce).toEqual("0");
        expect(signedOrder.feeRateBps).toEqual("100");
        expect(signedOrder.signatureType).toEqual(0);
        expect(signedOrder.signature).not.toBeEmpty();
      });

      it("specific salt", async () => {
        (exchangeOrderBuilder as any)["generateSalt"] = () => {
          return "479249096354";
        };

        const signedOrder = await exchangeOrderBuilder.buildSignedOrder({
          maker: wallet.address,
          taker: "0x0000000000000000000000000000000000000000",
          tokenId: "1234",
          makerAmount: "100000000",
          takerAmount: "50000000",
          side: Side.BUY,
          feeRateBps: "100",
          nonce: "0",
        } as OrderData);
        expect(signedOrder).not.toBeNull();
        expect(signedOrder).not.toBeUndefined();

        expect(signedOrder).toEqual({
          salt: "479249096354",
          maker: wallet.address,
          signer: wallet.address,
          taker: "0x0000000000000000000000000000000000000000",
          tokenId: "1234",
          makerAmount: "100000000",
          takerAmount: "50000000",
          side: 0,
          expiration: "0",
          nonce: "0",
          feeRateBps: "100",
          signatureType: 0,
          signature:
            "0x302cd9abd0b5fcaa202a344437ec0b6660da984e24ae9ad915a592a90facf5a51bb8a873cd8d270f070217fea1986531d5eec66f1162a81f66e026db653bf7ce1c",
        });
      });
    });
  });

  describe("Neg Risk CTFExchange", () => {
    let wallet: Wallet;
    let exchangeOrderBuilder: ExchangeOrderBuilder;

    beforeEach(async () => {
      const chainId = 80002;

      // exchange address
      const negRiskExchangeAddress = "0xC5d563A36AE78145C45a50134d48A1215220f80a";

      // publicly known private key
      const privateKey = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
      wallet = new Wallet(privateKey);

      exchangeOrderBuilder = new ExchangeOrderBuilder(
        negRiskExchangeAddress,
        chainId,
        wallet,
        generateOrderSalt,
      );
    });

    describe("buildOrder", () => {
      it("random salt", async () => {
        const order = await exchangeOrderBuilder.buildOrder({
          maker: wallet.address,
          taker: "0x0000000000000000000000000000000000000000",
          tokenId: "1234",
          makerAmount: "100000000",
          takerAmount: "50000000",
          side: Side.BUY,
          feeRateBps: "100",
          nonce: "0",
        } as OrderData);

        expect(order).not.toBeNull();
        expect(order).not.toBeUndefined();

        expect(order.salt).not.toBeEmpty();
        expect(order.maker).toEqual(wallet.address);
        expect(order.signer).toEqual(wallet.address);
        expect(order.taker).toEqual("0x0000000000000000000000000000000000000000");
        expect(order.tokenId).toEqual("1234");
        expect(order.makerAmount).toEqual("100000000");
        expect(order.takerAmount).toEqual("50000000");
        expect(order.side).toEqual(0);
        expect(order.expiration).toEqual("0");
        expect(order.nonce).toEqual("0");
        expect(order.feeRateBps).toEqual("100");
        expect(order.signatureType).toEqual(0);
      });

      it("specific salt", async () => {
        (exchangeOrderBuilder as any)["generateSalt"] = () => {
          return "479249096354";
        };

        const order = await exchangeOrderBuilder.buildOrder({
          maker: wallet.address,
          taker: "0x0000000000000000000000000000000000000000",
          tokenId: "1234",
          makerAmount: "100000000",
          takerAmount: "50000000",
          side: Side.BUY,
          feeRateBps: "100",
          nonce: "0",
        } as OrderData);

        expect(order).not.toBeNull();
        expect(order).not.toBeUndefined();

        expect(order).toEqual({
          salt: "479249096354",
          maker: wallet.address,
          signer: wallet.address,
          taker: "0x0000000000000000000000000000000000000000",
          tokenId: "1234",
          makerAmount: "100000000",
          takerAmount: "50000000",
          expiration: "0",
          nonce: "0",
          feeRateBps: "100",
          side: 0,
          signatureType: 0,
        } as Order);
      });
    });

    describe("buildLimitOrderTypedData", async () => {
      it("random salt", async () => {
        const order = await exchangeOrderBuilder.buildOrder({
          maker: wallet.address,
          taker: "0x0000000000000000000000000000000000000000",
          tokenId: "1234",
          makerAmount: "100000000",
          takerAmount: "50000000",
          side: Side.BUY,
          feeRateBps: "100",
          nonce: "0",
        } as OrderData);

        expect(order).not.toBeNull();
        expect(order).not.toBeUndefined();

        const orderTypedData = exchangeOrderBuilder.buildOrderTypedData(order);
        expect(orderTypedData).not.toBeNull();
        expect(orderTypedData).not.toBeUndefined();

        expect(orderTypedData).toEqual({
          primaryType: "Order",
          types: {
            EIP712Domain: [
              { name: "name", type: "string" },
              { name: "version", type: "string" },
              { name: "chainId", type: "uint256" },
              { name: "verifyingContract", type: "address" },
            ],
            Order: [
              { name: "salt", type: "uint256" },
              { name: "maker", type: "address" },
              { name: "signer", type: "address" },
              { name: "taker", type: "address" },
              { name: "tokenId", type: "uint256" },
              { name: "makerAmount", type: "uint256" },
              { name: "takerAmount", type: "uint256" },
              { name: "expiration", type: "uint256" },
              { name: "nonce", type: "uint256" },
              { name: "feeRateBps", type: "uint256" },
              { name: "side", type: "uint8" },
              { name: "signatureType", type: "uint8" },
            ],
          },
          domain: {
            name: "Polymarket CTF Exchange",
            version: "1",
            chainId: 80002,
            verifyingContract: "0xC5d563A36AE78145C45a50134d48A1215220f80a",
          },
          message: {
            salt: orderTypedData.message.salt!,
            maker: wallet.address,
            signer: wallet.address,
            taker: "0x0000000000000000000000000000000000000000",
            tokenId: "1234",
            makerAmount: "100000000",
            takerAmount: "50000000",
            expiration: "0",
            nonce: "0",
            feeRateBps: "100",
            side: 0,
            signatureType: 0,
          },
        });
      });

      it("specific salt", async () => {
        (exchangeOrderBuilder as any)["generateSalt"] = () => {
          return "479249096354";
        };

        const order = await exchangeOrderBuilder.buildOrder({
          maker: wallet.address,
          taker: "0x0000000000000000000000000000000000000000",
          tokenId: "1234",
          makerAmount: "100000000",
          takerAmount: "50000000",
          side: Side.BUY,
          feeRateBps: "100",
          nonce: "0",
        } as OrderData);

        expect(order).not.toBeNull();
        expect(order).not.toBeUndefined();

        const orderTypedData = exchangeOrderBuilder.buildOrderTypedData(order);
        expect(orderTypedData).not.toBeNull();
        expect(orderTypedData).not.toBeUndefined();

        expect(orderTypedData).toEqual({
          primaryType: "Order",
          types: {
            EIP712Domain: [
              { name: "name", type: "string" },
              { name: "version", type: "string" },
              { name: "chainId", type: "uint256" },
              { name: "verifyingContract", type: "address" },
            ],
            Order: [
              { name: "salt", type: "uint256" },
              { name: "maker", type: "address" },
              { name: "signer", type: "address" },
              { name: "taker", type: "address" },
              { name: "tokenId", type: "uint256" },
              { name: "makerAmount", type: "uint256" },
              { name: "takerAmount", type: "uint256" },
              { name: "expiration", type: "uint256" },
              { name: "nonce", type: "uint256" },
              { name: "feeRateBps", type: "uint256" },
              { name: "side", type: "uint8" },
              { name: "signatureType", type: "uint8" },
            ],
          },
          domain: {
            name: "Polymarket CTF Exchange",
            version: "1",
            chainId: 80002,
            verifyingContract: "0xC5d563A36AE78145C45a50134d48A1215220f80a",
          },
          message: {
            salt: "479249096354",
            maker: wallet.address,
            signer: wallet.address,
            taker: "0x0000000000000000000000000000000000000000",
            tokenId: "1234",
            makerAmount: "100000000",
            takerAmount: "50000000",
            expiration: "0",
            nonce: "0",
            feeRateBps: "100",
            side: 0,
            signatureType: 0,
          },
        });
      });
    });

    describe("buildOrderSignature", async () => {
      it("random salt", async () => {
        const order = await exchangeOrderBuilder.buildOrder({
          maker: wallet.address,
          taker: "0x0000000000000000000000000000000000000000",
          tokenId: "1234",
          makerAmount: "100000000",
          takerAmount: "50000000",
          side: Side.BUY,
          feeRateBps: "100",
          nonce: "0",
        } as OrderData);

        expect(order).not.toBeNull();
        expect(order).not.toBeUndefined();

        const orderTypedData = exchangeOrderBuilder.buildOrderTypedData(order);
        expect(orderTypedData).not.toBeNull();
        expect(orderTypedData).not.toBeUndefined();

        const orderSignature = await exchangeOrderBuilder.buildOrderSignature(orderTypedData);
        expect(orderSignature).not.toBeNull();
        expect(orderSignature).not.toBeUndefined();
        expect(orderSignature).not.toBeEmpty();
      });

      it("specific salt", async () => {
        (exchangeOrderBuilder as any)["generateSalt"] = () => {
          return "479249096354";
        };

        const order = await exchangeOrderBuilder.buildOrder({
          maker: wallet.address,
          taker: "0x0000000000000000000000000000000000000000",
          tokenId: "1234",
          makerAmount: "100000000",
          takerAmount: "50000000",
          side: Side.BUY,
          feeRateBps: "100",
          nonce: "0",
        } as OrderData);

        expect(order).not.toBeNull();
        expect(order).not.toBeUndefined();

        const orderTypedData = exchangeOrderBuilder.buildOrderTypedData(order);
        expect(orderTypedData).not.toBeNull();
        expect(orderTypedData).not.toBeUndefined();

        const orderSignature = await exchangeOrderBuilder.buildOrderSignature(orderTypedData);
        expect(orderSignature).not.toBeNull();
        expect(orderSignature).not.toBeUndefined();
        expect(orderSignature).not.toBeEmpty();

        expect(orderSignature).toEqual(
          "0x1b3646ef347e5bd144c65bd3357ba19c12c12abaeedae733cf8579bc51a2752c0454c3bc6b236957e393637982c769b8dc0706c0f5c399983d933850afd1cbcd1c",
        );
      });
    });

    describe("buildOrderHash", async () => {
      it("random salt", async () => {
        const order = await exchangeOrderBuilder.buildOrder({
          maker: wallet.address,
          taker: "0x0000000000000000000000000000000000000000",
          tokenId: "1234",
          makerAmount: "100000000",
          takerAmount: "50000000",
          side: Side.BUY,
          feeRateBps: "100",
          nonce: "0",
        } as OrderData);

        expect(order).not.toBeNull();
        expect(order).not.toBeUndefined();

        const orderTypedData = exchangeOrderBuilder.buildOrderTypedData(order);
        expect(orderTypedData).not.toBeNull();
        expect(orderTypedData).not.toBeUndefined();

        const orderHash = exchangeOrderBuilder.buildOrderHash(orderTypedData);
        expect(orderHash).not.toBeNull();
        expect(orderHash).not.toBeUndefined();
      });

      it("specific salt", async () => {
        (exchangeOrderBuilder as any)["generateSalt"] = () => {
          return "479249096354";
        };

        const order = await exchangeOrderBuilder.buildOrder({
          maker: wallet.address,
          taker: "0x0000000000000000000000000000000000000000",
          tokenId: "1234",
          makerAmount: "100000000",
          takerAmount: "50000000",
          side: Side.BUY,
          feeRateBps: "100",
          nonce: "0",
        } as OrderData);

        expect(order).not.toBeNull();
        expect(order).not.toBeUndefined();

        const orderTypedData = exchangeOrderBuilder.buildOrderTypedData(order);
        expect(orderTypedData).not.toBeNull();
        expect(orderTypedData).not.toBeUndefined();

        const orderHash = exchangeOrderBuilder.buildOrderHash(orderTypedData);
        expect(orderHash).not.toBeNull();
        expect(orderHash).not.toBeUndefined();

        expect(orderHash).toEqual(
          "0xf15790d3edc4b5aed427b0b543a9206fcf4b1a13dfed016d33bfb313076263b8",
        );
      });
    });

    describe("buildSignedOrder", async () => {
      it("random salt", async () => {
        const signedOrder = await exchangeOrderBuilder.buildSignedOrder({
          maker: wallet.address,
          taker: "0x0000000000000000000000000000000000000000",
          tokenId: "1234",
          makerAmount: "100000000",
          takerAmount: "50000000",
          side: Side.BUY,
          feeRateBps: "100",
          nonce: "0",
        } as OrderData);
        expect(signedOrder).not.toBeNull();
        expect(signedOrder).not.toBeUndefined();

        expect(signedOrder.salt).not.toBeEmpty();
        expect(signedOrder.maker).toEqual(wallet.address);
        expect(signedOrder.signer).toEqual(wallet.address);
        expect(signedOrder.taker).toEqual("0x0000000000000000000000000000000000000000");
        expect(signedOrder.tokenId).toEqual("1234");
        expect(signedOrder.makerAmount).toEqual("100000000");
        expect(signedOrder.takerAmount).toEqual("50000000");
        expect(signedOrder.side).toEqual(0);
        expect(signedOrder.expiration).toEqual("0");
        expect(signedOrder.nonce).toEqual("0");
        expect(signedOrder.feeRateBps).toEqual("100");
        expect(signedOrder.signatureType).toEqual(0);
        expect(signedOrder.signature).not.toBeEmpty();
      });

      it("specific salt", async () => {
        (exchangeOrderBuilder as any)["generateSalt"] = () => {
          return "479249096354";
        };

        const signedOrder = await exchangeOrderBuilder.buildSignedOrder({
          maker: wallet.address,
          taker: "0x0000000000000000000000000000000000000000",
          tokenId: "1234",
          makerAmount: "100000000",
          takerAmount: "50000000",
          side: Side.BUY,
          feeRateBps: "100",
          nonce: "0",
        } as OrderData);
        expect(signedOrder).not.toBeNull();
        expect(signedOrder).not.toBeUndefined();

        expect(signedOrder).toEqual({
          salt: "479249096354",
          maker: wallet.address,
          signer: wallet.address,
          taker: "0x0000000000000000000000000000000000000000",
          tokenId: "1234",
          makerAmount: "100000000",
          takerAmount: "50000000",
          side: 0,
          expiration: "0",
          nonce: "0",
          feeRateBps: "100",
          signatureType: 0,
          signature:
            "0x1b3646ef347e5bd144c65bd3357ba19c12c12abaeedae733cf8579bc51a2752c0454c3bc6b236957e393637982c769b8dc0706c0f5c399983d933850afd1cbcd1c",
        });
      });
    });
  });
});
