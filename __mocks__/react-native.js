const React = require("react");
const RN = jest.requireActual("react-native");

module.exports = {
  ...RN,
  PanResponder: {
    create: jest.fn(() => ({
      panHandlers: {
        onStartShouldSetPanResponder: jest.fn(() => true),
        onMoveShouldSetPanResponder: jest.fn(() => true),
        onPanResponderGrant: jest.fn(),
        onPanResponderMove: jest.fn(),
        onPanResponderRelease: jest.fn(),
        onPanResponderTerminate: jest.fn(),
      },
    })),
  },
  View: (props) => React.createElement("View", props, props.children),
  Text: (props) => React.createElement("Text", props, props.children),
};
