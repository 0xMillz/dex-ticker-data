import glob from "glob";

const index = async (exchange?: string) => {
    if (exchange) {
        startExchange(`${__dirname}/exchanges/${exchange}.js`)
    } else {
        const files = glob(__dirname + '/exchanges/*.js', {
            sync: true
        })
        for (const file of files) {
            startExchange(file)
        }
    }
}

const startExchange = (exchangeFilePath: string) => {
    console.debug('path::', exchangeFilePath);
    const Ticker = require(exchangeFilePath).default;
    const instance = new Ticker();
    void instance.start();
}

export default index;
