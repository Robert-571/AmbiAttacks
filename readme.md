# AmbiAttacks app for alt1 toolkit

how to use
```sh
#to initialize the repo and install dependencies
npm i
#build
npm run build
```

Open `dist\index.html` in the Alt1 browser and click the `add app` button that appears.

Or to use [this link](alt1://addapp/https://robert-571.github.io/appconfig.json) to add the pre-built app to alt1.

Known issues:<br/>
The app will not work correctly in Legacy Interface Mode as chatbox lines are not read at the correct time.<br/>
The timing of Black Stone Flames and Unstable Black Holes can be incorrect depending on if the Ambassador uses Magic or Melee attacks. The timings used by the app assume Melee attacks are used.<br/>
Only 10 Shadow Onslaughts will display (5 minutes).