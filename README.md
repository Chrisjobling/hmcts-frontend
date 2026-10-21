# HMCTS Dev Test Frontend

This will be the frontend for the brand new HMCTS case management system. As a potential candidate we are leaving
this in your hands. Please refer to the brief for the complete list of tasks! Complete as much as you can and be
as creative as you want.

To begin with, you should be able to run this by running:

1. `yarn install`
2. `yarn webpack`
3. `yarn start:dev` or navigate to package.json and run the script manually

You can change the structure however you like!

With the backend running on `http://localhost:4000`, open the frontend at
`https://localhost:3100` and select **Get example case**. The frontend requests
`GET http://localhost:4000/get-example-case` and displays the case details in a
summary list. If the request fails or times out after five seconds, an error
message is shown and the button can be used to try again.
