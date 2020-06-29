import React from "react";

const AccordionContext = React.createContext({
  activePost: null,
  togglePost: () => {},
});

export default AccordionContext;
