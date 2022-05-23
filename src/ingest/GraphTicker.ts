import { createApolloFetch, ApolloFetch } from "apollo-fetch";

export default abstract class GraphTicker {
    ethereumFetchClient: ApolloFetch;
    ethereumBlockHeightQuery: string;
    exchangeName: string;

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
        // TODO: find volumes at current height and blockHeight24HoursAgo
    }

    getTimestamp24HrsAgo() {
        const timestampNow = ~~(Date.now() / 1000)
        return timestampNow - 24 * 3600
    }

    async getBlockHeight24HrsAgo(timestamp24HrsAgo) {
        const {
            data: { blocks }
        } = await this.ethereumFetchClient({
            query: this.ethereumBlockHeightQuery,
            variables: {
                timestamp_gt: timestamp24HrsAgo.toString()
            }
        })

        return blocks[0].number
    }
}
