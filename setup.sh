#! /bin/bash
if [ ! -f .env ]; then
  echo "No '.env' file found!"
  return 1
fi

echo "Setting Fixer API Key"
export FIXER_KEY=$(<./.env)

if [ "$1" != "" ]; then
  echo "Setting environment to $1"
  export NODE_ENV=$1
else
  echo "Setting environment to dev"
  export NODE_ENV=dev
fi