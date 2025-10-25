module.exports = {
  presets: [
    ["@babel/preset-react", { 
      runtime: "automatic",
      development: process.env.NODE_ENV === "development"
    }],
    "@babel/preset-typescript"
  ],
  plugins: []
};


