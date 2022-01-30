FROM node:current-alpine


WORKDIR /app

COPY package.json .
#COPY package-lock.json .

#RUN apk add --update \
#libc6-compat

RUN npm install --production

#RUN cd node_modules/uws
#RUN npm install

COPY . .
ENV PORT=8080
EXPOSE 8080
EXPOSE 8081

CMD [ "node","--inspect=0.0.0.0:8081", "server.js" ]
#CMD [ "node", "server.js" ]
#CMD variable=`node --inspect=0.0.0.0:8081 server.js`
#cmd npm start
