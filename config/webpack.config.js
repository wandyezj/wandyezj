const devCerts = require("office-addin-dev-certs");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

module.exports = async (env, options) => {
    const isDevelopment = options.mode === "development";
    const config = {
        devtool: isDevelopment ? "inline-source-map" : undefined,
        entry: {
            index: "./src/index.ts",
        },
        resolve: {
            extensions: [".ts", ".tsx", ".html", ".js"],
        },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    exclude: /node_modules/,
                    use: "ts-loader",
                },
                {
                    test: /\.(png|jpg|jpeg|gif)$/,
                    use: "assets/resources",
                },
            ],
        },
        plugins: [
            new CleanWebpackPlugin(),
            new HtmlWebpackPlugin({
                filename: "index.html",
                template: "./src/index.html",
                chunks: ["index"],
            }),
            new CopyWebpackPlugin({
                patterns: [
                    {
                        to: "index.css",
                        from: "./src/index.css",
                    },
                    {
                        to: "assets",
                        from: "./src/assets",
                    },
                    {
                        to: "favicon.ico",
                        from: "./src/assets/favicon.ico",
                    },
                    {
                        to: ".",
                        from: "./static",
                    },
                ],
            }),
        ],
        devServer: {
            static: {
                directory: path.join(__dirname, "..", "dist"),
            },
        },
    };

    //Only need to configure webserver in development mode
    if (options.mode === "development") {
        config.devServer = {
            ...config.devServer,
            open: ["/index.html"],
            port: 3000,
            server: {
                type: "https",
                options: await getHttpsOptions(),
            },
            headers: {
                "Access-Control-Allow-Origin": "*",
            },
        };
    }

    return config;
};

async function getHttpsOptions() {
    const options = await devCerts.getHttpsServerOptions();
    return options;
}
