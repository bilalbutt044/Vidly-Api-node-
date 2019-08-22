const config = require("config");
const morgan = require("morgan");

module.exports = function(app) {
    if (app.get("env") === "development") {
        app.use(morgan("tiny"));
        console.log("morgan is running...");
      }
      
      if(!config.get('jwtPrivateKey')) {
        console.error('FATAL ERROR jwtPrivateKey is not defined');
        process.exit(1);
      }
         
}