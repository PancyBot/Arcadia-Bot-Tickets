FROM node:16
# Create the bot's directory 
RUN mkdir -p /usr/src/bot3
WORKDIR /usr/src/bot3

COPY package.json /usr/src/bot3
RUN npm install
 
COPY . /usr/src/bot3

#Puerto abierto
EXPOSE 3000

# Start the bot.
CMD ["node", "."]

