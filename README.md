# zhaw-four-wins
This documentation is also available via the following link: https://boostvolt.github.io/zhaw-four-wins/

# Team Setup
- Jan Kott (kottjan1)
- Denis Rykart (rykarden)
- Simon Brand (brandsi3)
- Roman Boassart(bossarom)

# Setup
Below are the different setups described.

## Local Setup
1. Navigate to the root drectory.
2. Run the following:
```sh
npm install
npm run dev
```
3. Open your browser on http://localhost:3000/ to access the game.

## Remote Setup
- Access the game via: https://boostvolt.github.io/zhaw-four-wins/public/
- Please note that server side saving and loading is not supported on the github pages hosted version.

# Implementation

## Overview of functions
- A new game can always be started using the "Neues Spiel" button
- After every move, you can go back using the "Rückgängig" button
- The state of the game can be persisted and loaded locally using the buttons "Lokal speichern" and "Lokal laden"
- The state of the game can also be persisted and loaded via a server using the buttons "Server speichern" and "Server laden"
- On top of the buttons, it is always visible who's turn it currently is

## Implementation Notes
- suiweb-1.1 was used
- At the start of the game, it checks if the server is available. If not, the server side buttons are disabled
- We have added own styles to make it look more appealing
- We followed a modularized approach during the implementation
- The game is using state hooks

# Screenshots
Initial start of the game:
![image](https://github.com/user-attachments/assets/b01e41ce-6aa3-4dcc-938f-bc17f334ebc7)

After setting a few fields:
![image](https://github.com/user-attachments/assets/bd128354-a9fd-425b-a460-03120db9e768)

Once a player has won:
![image](https://github.com/user-attachments/assets/68c88624-8ca9-4488-970a-788bc463b272)
