#!/bin/bash


run() {
  echo "Run application DB"
  docker-compose -f dev-docker-compose.yml \
      --env-file ../env/.env \
      up --build

}

log(){
  docker logs -f -n 10 core
}

down() {
  docker-compose -f dev-docker-compose.yml --env-file ../env/.env down
}

# Main script logic
case "$1" in
run)
  run
  ;;
log)
  log
  ;;
down)
  down
  ;;
*)
  echo "Invalid command."
  exit 1
  ;;
esac