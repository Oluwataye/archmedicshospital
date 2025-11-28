"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vite_1 = require("vite");
var plugin_react_swc_1 = require("@vitejs/plugin-react-swc");
var path_1 = require("path");
// https://vitejs.dev/config/
exports.default = (0, vite_1.defineConfig)(function (_a) {
    var mode = _a.mode;
    return ({
        server: {
            host: "::",
            port: 8080,
        },
        plugins: [
            (0, plugin_react_swc_1.default)(),
        ].filter(Boolean),
        resolve: {
            alias: {
                '@': path_1.default.resolve(__dirname, 'src'),
                '@/*': path_1.default.resolve(__dirname, 'src/*'),
            },
        },
        esbuild: {
            jsxFactory: 'jsx',
        },
        define: {
            'process.env.NODE_ENV': JSON.stringify(mode),
        },
        // Production build optimization
        build: {
            outDir: 'dist',
            sourcemap: mode === 'development',
            minify: mode === 'production' ? 'esbuild' : false,
            rollupOptions: {
                output: {
                    manualChunks: {
                        'react-vendor': ['react', 'react-dom', 'react-router-dom'],
                        'ui-vendor': ['lucide-react', 'sonner'],
                    },
                },
            },
        },
    });
});
