FROM node:10.2.1-alpine

WORKDIR usr
ADD . .
RUN ls
RUN yarn
CMD yarn start