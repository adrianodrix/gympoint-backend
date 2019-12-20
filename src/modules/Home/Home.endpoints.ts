export default [
  {
    route: "/",
    method: "get",
    description: "get a quote message",
    "@controller": {
      method: "index",
      params: []
    }
  }
];
