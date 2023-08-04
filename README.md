# trivia-game-night

**Github Repository**
- https://github.com/CatSnake59/trivia-game-night

-----------------------

**Co-authors (v.1.6.9)**

- Alisa Jin https://github.com/alisa-jin
- Trisha Duong https://github.com/trishanduong
- David Lee https://github.com/GomDave/
- Jaime de Venecia https://github.com/jdvplus
- Denton Wong https://github.com/dentonwong

-----------------------

**v.1.6.9 features:**

- Loading screen for a better user experience
- Incorporated Open Trivia API to generate random questions
- Implemented a honk button to communicate across the WebSocket connection
- Fixed style problems including uneven columns due to changing title sizes

----------------------

### Special notes

It is included in the gitignore
Need to create a file named ".env" in the root directory (same level as package.json)
Add the following variables:

JWT_KEY=

MONGO_URI=

----------------------

### Motivation and background

The group was looking for an opportunity to solve a real world issue while improving their full stack programming skills as part of the scratch project for the Codesmith Software Engineering Immersive Program (Cohort 59). The goal of the project was to create a trivia game in the style of Jeopardy with a 2 player feature. This project required the group to implement CRUD functionality, login functionality, route handling, implementation of Open Trivia API to generate dynamic questions/answers, and a basic implementation of WebSocket communication across client machines. All of which provides the application with a functional and entertaining trivia experience.

Our simple implementation of WebSocket technology served as a proof of concept for demonstrating the possibility of a future multiplayer trivia game experience across multiple machines. We chose to add a button that changed color and triggered audio on other clients' machines to illustrate our vision for developing the app further.

### Running the development server

Clone the repository and then run:
``` npm install ```

Then run development:
```npm run dev```

### Future iteration recommendations:

- Utilize websocket to pass state of the game between players
- Implement a way for different users to be connected to the server over the internet
- Multiple lobbies
- High score leaderboard