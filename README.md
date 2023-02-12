# Filmoteka
## JavaScript team project of stundets group BC-36 GoIT Academy

## [ Stack of technologies ]

![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![Firebase](https://img.shields.io/badge/firebase-ffca28?style=for-the-badge&logo=firebase&logoColor=black)
![SASS](https://img.shields.io/badge/Sass-CC6699?style=for-the-badge&logo=sass&logoColor=white)
![Handlebars](https://img.shields.io/badge/Handlebars.js-f0772b?style=for-the-badge&logo=handlebarsdotjs&logoColor=black)
![Git](https://img.shields.io/badge/git-%23F05033.svg?style=for-the-badge&logo=git&logoColor=white)
![GitHub](https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white)
![NPM](https://img.shields.io/badge/NPM-%23000000.svg?style=for-the-badge&logo=npm&logoColor=white)
![Figma](https://img.shields.io/badge/figma-%23F24E1E.svg?style=for-the-badge&logo=figma&logoColor=white)

## [ Repo information ]

![Repo size](https://img.shields.io/github/repo-size/Dima-Davidenko/filmoteka)
![GitHub top language](https://img.shields.io/github/languages/top/Dima-Davidenko/filmoteka)
![GitHub language count](https://img.shields.io/github/languages/count/Dima-Davidenko/filmoteka)
![GitHub last commit](https://img.shields.io/github/last-commit/Dima-Davidenko/filmoteka)
![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/Dima-Davidenko/filmoteka/.github/workflows/deploy.yml)

### Team members
<!-- markdownlint-disable -->
<!-- readme: contributors,ImgBotApp/- -start -->
<table>
<tr>
    <td align="center">
        <a href="https://github.com/Dima-Davidenko">
            <img src="https://avatars.githubusercontent.com/u/111860309?v=4" width="100;" alt="Maksim"/>
            <br />
            <sub><b>Dmytro Davidenko</b></sub>
            <br />
            <sub><b>🟨🟦</b></sub>
            <br />
            Team Lead
        </a>
    </td>
    <td align="center">
        <a href="https://github.com/Volin13">
            <img src="https://avatars.githubusercontent.com/u/110535249?v=4" width="100;" alt="masiuk-mykola"/>
            <br />
            <sub><b>Oleg Kuharyshyn</b></sub>
            <br />
            <sub><b>🟨🟦</b></sub>
            <br />
            Scrum Master
        </a>
    </td>
    <td align="center">
        <a href="https://github.com/VaninArtemOleksandrovich">
            <img src="https://avatars.githubusercontent.com/u/111682303?v=4" width="100;" alt="Yevhen"/>
            <br />
            <sub><b>Artem Vanin</b></sub>
            <br />
            <sub><b>🟨🟦</b></sub>
            <br />
            Developer
        </a>
    </td>
    <td align="center">
        <a href="https://github.com/AnnaDux">
            <img src="https://avatars.githubusercontent.com/u/111693184?v=4" width="100;" alt="Artem"/>
            <br />
            <sub><b>Anna Nakaryakova</b></sub>
            <br />
            <sub><b>🟨🟦</b></sub>
            <br />
            Developer
        </a>
    </td>
    <td align="center">
        <a href="https://github.com/win0rdie">
            <img src="https://avatars.githubusercontent.com/u/116904257?v=4" width="100;" alt="Sasha"/>
            <br />
            <sub><b>Rostyslav Hnatovskyi</b></sub>
            <br />
            <sub><b>🟨🟦</b></sub>
            <br />
            Developer
        </a>
    </td>
    </tr>
    
</table>
<!-- readme: contributors,ImgBotApp/- -end -->

## Project Features

- User registration through Firebase Authentication.
- Saving user's library localy and remotely to Firebase Realtime Database.
- User library data stored remotely is automatically synced across devices.
- All information about movies is received via REST API from TMDB server.
- Implemented movies's search.
- Implemented movies's filters.
- Implemented trailer search on YouTube.
- Implemented search for links to view on Google.
- Implemented light and dark color schemes.
- Implemented pagination and "infinite scroll".
- Implemented Up Button.


## Project description

The main goal of our app is to create your own library of watched movies and movies you want to watch. On the main page you are offered current popular films. Search results are displayed in a "pagination" view.

You can read information about a movie by hovering your mouse over it.

By clicking on the movie poster, you get access to additional features:
- Add to Watched: Adds the movie to the Watch Queue in the library. You can add movie to this library even without registration.
- Remove from Watched: Removes the movie from the Queue to watch in the library. Function works only when user is registered. This is done to correctly synchronize the data of the local and remote databases.
- Watch the original trailer if the information about it is present in the TMDB server response
- Find trailer on YouTube
- Find servers where you can watch the film. The search is made on the Google platform.

By clicking the "My Library" button, you get access to the films you have Watched and the films that are in the Queue for viewing.

Clicking the "Watch Something" button gives you access to a random list of high rated movies. This feature is only available to registered users. Search results are implemented as "infinite scrolling".

You can search for a movie by query using the "Movie Search" input form.
