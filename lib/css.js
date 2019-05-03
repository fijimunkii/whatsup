module.exports = `
  html { font-family: Arial, "Helvetica Neue", Helvetica, sans-serif; }
  .largefont u, .largefont table { font-size: 150%; }
  .fixed-width { min-width: 200px; }
  .container {
    display: grid;
    grid-template-columns: repeat(10, 1fr);
  }
  .column {
    grid-column: span 2;
    margin: 0 1em 0 1em;
  }
  @media (max-width: 1600px) {
    .column {
      grid-column: span 3;
    }
  }
  @media (max-width: 1000px) {
    .column {
      grid-column: span 5;
    }
  }
  @media (max-width: 600px) {
    .column {
      grid-column: span 10;
    }
  }
`;
