const fs = require('fs');

class rpxo {
    constructor() {
        if (!fs.existsSync('./proxies.txt')) throw new Error('proxies.txt file not found, please create a new file.');

        this.raw = fs.readFileSync('./proxies.txt')
            .toString()
            .split('\n')
            .map(proxy => proxy.replace('\r', ''))
            .filter(proxy => !!proxy);

        if (!this.raw.length) console.warn(`⚠ Seems that your proxies.txt file is empty, bots gonna be launched with your IP! ⚠`);

        this.index = 0; // Using the index parameter so we gonna use all proxies without repeating.
        this.protocols = {
            http: require('https-proxy-agent'),
            https: require('https-proxy-agent'),
            socks4: require('socks-proxy-agent'),
            socks5: require('socks-proxy-agent')
        };

        this.fallback = 'http'; // The default protocol for unspecified proxy type.
        this.proxies = []; // The parsed proxies go here.

        this.prepare();
    }

    prepare() {
        let loading;

        for (let i = 0; i < this.raw.length; i++) {
            const proxy = this.raw[i];

            if (proxy.startsWith('#')) {
                loading = proxy
                    .replace('#', '')
                    .replace(/ +/g, '');

                if (!loading) loading = this.fallback;
                continue;
            }

            this.proxies.push(`${loading.toLowerCase()}://${proxy}`);
        }
    }

    get proxy() {
        if (this.index > this.proxies.length) this.index = 0;
        return this.proxies[this.index++];
    }

    get agent() {
        const proxy = this.proxies[(this.index < 0 ? 1 : this.index) - 1] || this.proxies[0];
        const protocol = proxy.split("://")[0] || this.fallback;

        return new this.protocols[protocol](proxy);
    }
};

module.exports = rpxo;