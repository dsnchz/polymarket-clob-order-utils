# Polymarket CLOB Order Utils (@dschz)

[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)
[![npm](https://img.shields.io/npm/v/@dschz/polymarket-clob-order-utils?color=blue)](https://www.npmjs.com/package/@dschz/polymarket-clob-order-utils)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/@dschz/polymarket-clob-order-utils)](https://bundlephobia.com/package/@dschz/polymarket-clob-order-utils)
[![CI](https://github.com/dsnchz/polymarket-clob-order-utils/actions/workflows/ci.yaml/badge.svg)](https://github.com/dsnchz/polymarket-clob-order-utils/actions/workflows/ci.yaml)

Fork of [Polymarket CLOB Order Utils](https://github.com/Polymarket/clob-order-utils).

Typescript utilities used to generate and sign orders from Polymarket's Exchange

## Differences from Original

I am attempting to optimize the dependency chain of the TypeScript Polymarket CLOB Client (which I also made a fork of).

I am explicitly importing the exact `@ethersproject` dependencies that are required without bringing in all of the `ethers` library to reduce the total bundle size of the library.

## Installation

`bun add @dschz/polymarket-clob-order-utils`
