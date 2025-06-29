const React = require("react");

module.exports = {
  Image: ({ style, ...props }) =>
    React.createElement("View", { style, ...props }),
};
