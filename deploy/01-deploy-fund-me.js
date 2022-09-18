const { networkConfig } = require("../helper-hardhat-config")
const developmentChains = require("../helper-hardhat-config")
const { network } = require("hardhat")
const { verify } = require("../utils/verify")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log, get } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    let ethUsdPriceFeedAddress
    if (chainId == 31337) {
        const ethUsdAggregator = await get("MockV3Aggregator")
        ethUsdPriceFeedAddress = ethUsdAggregator.address
    } else {
        ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
    }
    const args = ethUsdPriceFeedAddress
    const fundMe = await deploy("FundMe", {
        from: deployer,
        args: [args],
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })
    log("-----------------------------")
    if (!chainId == 31337 && process.env.ETHERSCAN_API_KEY) {
        await verify(fundMe.address, [args])
    }
}

module.exports.tags = ["all", "fundme"]
