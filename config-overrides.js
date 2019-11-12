module.exports = function override(config, env) {
        config.module.rules.push({
                test: /\.worker\.js$/i,
                use: [
                        {
                                loader: 'worker-loader'
                        }, {
                                loader: 'babel-loader'
                        }
                ]
        });
        config.output['globalObject'] = 'this';

        return config;
}
