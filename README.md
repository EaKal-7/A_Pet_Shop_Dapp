# Pet Shop Truffle Box

DApp（Decentralized Application）去中心化应用，自 P2P 网络出现以来就已经存在，是一种运行在计算机 P2P 网络而不是单个计算机上的应用程序。DApp 以一种不受任何单个实体控制的方式存在于互联网中。在区块链技术产生之前，BitTorrent，Popcorn Time，BitMessage 等都是运行在 P2P 网络上的 DApp，随着区块链技术的产生和发展，DApp 有了全新的载体和更广阔的发展前景。DApp 应具备代码开源、激励机制、非中心化共识和无单点故障四个要素，而最为基本的 DApp 结构即为前端+智能合约形式。
本项目以以太坊为基础，使用Web3.0&&Solidity构建了一个简易的Pet Shop

## Installation

1. 全局安装 Truffle
    ```javascript
    npm install -g truffle
    ```

2. 下载项目模板（box）。
    ```javascript
    truffle unbox pet-shop
    ```

3. 运行开发控制台。
    ```javascript
    truffle develop
    ```

4. 编译和部署智能合约。请注意，在开发控制台中，我们不需要在命令前加上 `truffle`。
    ```javascript
    compile
    migrate
    ```

5. 运行 `liteserver` 开发服务器（在开发控制台之外），以实现前端的热重载。智能合约的更改需要手动重新编译和部署。
    ```javascript
    // Serves the front-end on http://localhost:3000
    npm run dev
    ```

## TODO

\- [X] 实现读取MateMask内容

\- [X] 较为优美的实现显示当前用户下收养的宠物个数和宠物信息

\- [X] 收养后的宠物再次出售（收养后在自己的收养宠物列表里面会变成sell,如果自己点了sell,就会回到原先所有队列当中，但是这只宠物不显示adopt而是buy了，如果其他账户想要获得这只宠物就得购买，默认金额为0.1eth）

\- [X] 收养和贩卖宠物要利用时间通知前端更新显示当前账户的余额

\- [X] 切换钱包可以直接切换用户

\- [  ] 为 DApp 加入 ETH 抵押机制



## ScreenShot

![Picture1](/home/eakal/Word/blockchain/lab6/lab/petshop/pic/Picture1.png)

![Picture2](/home/eakal/Word/blockchain/lab6/lab/petshop/pic/Picture2.png)

![Picture2](/home/eakal/Word/blockchain/lab6/lab/petshop/pic/Picture3.png)

![Picture2](/home/eakal/Word/blockchain/lab6/lab/petshop/pic/Picture4.png)

![Picture2](/home/eakal/Word/blockchain/lab6/lab/petshop/pic/Picture5.png)
