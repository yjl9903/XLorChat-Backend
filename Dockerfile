FROM node

RUN npm install -g yarn \
    && yarn global add typescript

ADD . /chatroom

WORKDIR /chatroom

RUN yarn install \
    && tsc

CMD ["node", "dist/index.js"]
