# Kahoot Clone Demo App

## How to run it with Apollo Router

- Launch quiz and player subgraphs

```shell
# Run the player subgraph (by default it listens on port 4006)
cd quiz_subgraphs/player
cargo run
cd -
# Run the quiz subgraph (by default it listens on port 4005)
cd quiz_subgraphs/quiz
cargo run
cd -
```

- Launch the router (listening on port 4000 by default)

```shell
export APOLLO_KEY=XXX
export APOLLO_GRAPH_REF=XXX
./router --supergraph supergraph.graphql --config router-config.yaml --hot-reload
```
