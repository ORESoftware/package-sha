FROM node:11

USER root

WORKDIR /app

COPY package.json .

RUN npm i && ( mkdir -p .packageSHA/npm && echo "true" > .packageSHA/npm/installed.json )

CMD /bin/bash
