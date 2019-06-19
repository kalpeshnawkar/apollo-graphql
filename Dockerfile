FROM node:8

RUN mkdir -p /home/node/fundoo && chown -R node:node /home/node/fundoo


WORKDIR /home/node/fundoo

COPY package*.json ./

USER node
RUN npm install 

COPY --chown=node:node . . 

EXPOSE 4000

CMD npm start
