FROM alpine

WORKDIR /src

# Copy both folders into the image
COPY ./client ./client
COPY ./api ./api