/* Resolves the following issues 
 *Source: https://stackoverflow.com/questions/60124435/however-this-package-itself-specifies-a-main-module-field-that-could-not-be-r 
 * Error: => However, this package itself specifies a `main` module field that could not be resolved
 *
*/
module.exports = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: false,
      },
    }),
  },
  resolver: {
    sourceExts: ["jsx", "js", "ts", "tsx", "cjs"],
  },
};