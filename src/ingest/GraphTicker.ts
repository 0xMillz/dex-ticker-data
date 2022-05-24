import {createApolloFetch, ApolloFetch} from "apollo-fetch";

export default abstract class GraphTicker {
    ethereumBlockHeightQuery: string;
    exchangeName: string;
    ethereumFetchClient: ApolloFetch;
    subgraphClient: ApolloFetch;

    constructor() {
        this.ethereumFetchClient = createApolloFetch({
            uri: 'https://api.thegraph.com/subgraphs/name/blocklytics/ethereum-blocks'
        })
        this.ethereumBlockHeightQuery = `query queryBlocks($timestamp_gt: String!) {
            blocks(first: 1, orderBy: timestamp, orderDirection: asc, where: 
            {
              timestamp_gt: $timestamp_gt
            }) {
              id
              number
              timestamp
            }
        }`
        this.subgraphClient = createApolloFetch({
            uri: this.getDEXSubGraphUri()
        })
    }

    async start() {
        console.info(`Starting ticker for ${this.exchangeName}`)
        await this.process()
    }

    async process() {
        const timestamp24HrsAgo = this.getTimestamp24HrsAgo()
        console.log('timestamp24HrsAgo:', timestamp24HrsAgo)
        const blockHeight24HoursAgo = await this.getBlockHeight24HrsAgo(timestamp24HrsAgo)
        console.log('blockHeight24HoursAgo', blockHeight24HoursAgo)

        /* The structure of this map is '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48:0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2': {
         *   currentData: [{ allTimeVolumeNow: 32342815512.84094, last: 0.000301056878224 }]
         *   volumes24hrsAgo: ['30342815512.84094', '25529248474.688953']
         *   pair: {
         *    base: 'USDC',
         *    quote: 'ETH'
         *   }
         */
        const pairDataMap = {}

        // The structure of this map is 'USDC/ETH': '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48:0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'
        // aka `${baseSymbol}/${quoteSymbol}`: `${baseId}/${quoteId}`
        const exchangeMarketIdToContractIdsMap = {}

        // TODO: find volumes at current height and blockHeight24HoursAgo
    }

    getDEXSubGraphUri() {
        return 'must_be_defined'
    }

    getTimestamp24HrsAgo() {
        const timestampNow = ~~(Date.now() / 1000)
        return timestampNow - 24 * 3600
    }

    async getBlockHeight24HrsAgo(timestamp24HrsAgo) {
        const {
            data: {blocks}
        } = await this.ethereumFetchClient({
            query: this.ethereumBlockHeightQuery,
            variables: {
                timestamp_gt: timestamp24HrsAgo.toString()
            }
        })

        return blocks[0].number
    }
}
