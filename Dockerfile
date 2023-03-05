FROM keymetrics/pm2:18-jessie

RUN pm2 install pm2-logrotate && \
    pm2 set pm2-logrotate:max_size 1G && \
    pm2 set pm2-logrotate:compress true && \
    pm2 set pm2-logrotate:rotateInterval '59 59 23 * * *' && \
    pm2 set pm2-logrotate:retain 30 && \
    pm2 set pm2-logrotate:dateFormat 'YYYY-MM-DD'

ARG PORT=3456

ENV PORT $PORT

EXPOSE $PORT

WORKDIR /app

COPY package.json yarn.lock nest-cli.json tsconfig.build.json tsconfig.json /app/
COPY src/ /app/src

RUN yarn install \
    && yarn build

COPY up.yml /app/

CMD [ "yarn", "run", "pm2-docker-prod" ]