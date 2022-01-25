FROM alpine:latest

# Add jq，output with JSON format
RUN apk add --no-cache jq

# get and install CLI tool
RUN wget https://aliyuncli.alicdn.com/aliyun-cli-linux-3.0.2-amd64.tgz
RUN tar -xvzf aliyun-cli-linux-3.0.2-amd64.tgz
RUN rm aliyun-cli-linux-3.0.2-amd64.tgz
RUN mv aliyun /usr/local/bin/