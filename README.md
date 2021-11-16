<h2>MASHER-MAN a SPA APIGATE (WsO2) Manager</h2>

# Introduction

MasherMan is a APIGATE (WsO2) client for easy managing multi account of publisher and store. With Single Page Application You can manage API such as Publising, Editing, Make a copy and replublish to other environment.
Also, you can manage Application such as add or update application, subscribe and unsubscriber API, approve subscription (using publisher account). And the last of course you can test Your published API via API Console which also available on this SPA.

# Live Demo

[https://masher-man.web.app](https://masher-man.web.app)

# Screenshot

Please goto src/assets/screenshot

# Run this project

This project build with Angular 12 and tailwindcss 2.x and many other awesome dependencies, you can find out on package.json file.

With angular CLI:

```shell
ng serve
```
then you can access http://localhost:4200 from your browser

# Build

```shell
ng build --configuration production
```

# Deploy

## firebase hosting
for detail please follow this [blog](https://www.positronx.io/deploy-angular-app-to-production-with-firebase-hosting/)

```shell
firebase deploy
```

## web hosting
after done build project, copy all file inside dist/vex to your public_html folder

# Common Error

- Can't resolve 'swagger-schema-official/schema
  you can refer this [github issues](https://github.com/apigee-127/sway/issues/180).

# Further help

If you have any specific questions about this project, you can contact us anytime on our support email ([hwahyudi@xl.co.id](mailto:hwahyudi@xl.co.id))
