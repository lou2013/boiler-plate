# socket base gateway

## Introduction

    this is the base gateway which all other gateways should extend this,and write their own event and handlers

## constructor params

    secured: it's a flag that make socket secure(default is false)

    logger: logger service that will inject by nest js engine

    configService: config service that will inject by nest js engine

## socket connection

    if the secured equal to true,socket is private and will need auth token that can be in either url query or bearer authorization header
    else the socket is public and everyone can access it

    if the token does not exist it'll return a 401 unAuth error and disconnect the client
    else it'll verify the token to find user

    if user not found it'll log that and disconnect the client
    else it'll log that and connect the client
