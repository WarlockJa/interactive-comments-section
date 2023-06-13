# Frontend Mentor - Interactive comments section solution

This is a solution to the [Interactive comments section challenge on Frontend Mentor](https://www.frontendmentor.io/challenges/interactive-comments-section-iG1RugEG9). Frontend Mentor challenges help you improve your coding skills by building realistic projects.

## Table of contents

-   [Overview](#overview)
    -   [The challenge](#the-challenge)
    -   [Screenshot](#screenshot)
    -   [Links](#links)
-   [My process](#my-process)
    -   [Built with](#built-with)
    -   [What I learned](#what-i-learned)
    -   [Continued development](#continued-development)
    -   [Useful resources](#useful-resources)
-   [Author](#author)

## Overview

### The challenge

Users should be able to:

-   View the optimal layout for the app depending on their device's screen size
-   See hover states for all interactive elements on the page
-   Create, Read, Update, and Delete comments and replies
-   Upvote and downvote comments
-   **Bonus**: If you're building a purely front-end project, use `localStorage` to save the current state in the browser that persists when the browser is refreshed.
-   **Bonus**: Instead of using the `createdAt` strings from the `data.json` file, try using timestamps and dynamically track the time since the comment or reply was posted.

### Screenshot

![](./public/images/screenshot.png)

### Links

-   Solution URL: [Add solution URL here](https://your-solution-url.com)
-   Live Site URL: [Add live site URL here](https://your-live-site-url.com)

## My process

### Built with

-   Semantic HTML5 markup
-   CSS custom properties
-   Flexbox
-   CSS Grid
-   Mobile-first workflow
-   Typescript
-   [React](https://reactjs.org/) - JS library
-   [Next.js](https://nextjs.org/) - React framework
-   [SCSS](https://sass-lang.com/) - CSS extension
-   [Zustand](https://github.com/pmndrs/zustand) - State manager
-   [TS-JEST](https://jestjs.io/) - Testing library
-   [MongoDB](https://www.mongodb.com/) - Non-relational database
-   [Prisma](https://www.prisma.io/) - ORM
-   [date-fns](https://date-fns.org/) - Date utility library

### What I learned

In this project I've tried to go for as many new things as possible such as NextJS app routes AND NextJS server actions. MongoDB working through Prisma. NextJS fetch cache and tags. React cache with use hook. This ended up very educational indeed, if not production ready.

My conclusions:

-   Prisma does not work well with MongoDB. It "supports" it. But I ended up dismantling original DB model and recreating relational-style set of collections in MongoDB in order to use Prisma functions like @updatedAt and @unique which is not what MongoDB was made for. In short you have an SQL db? Go for Prisma. With MongoDB stick to the native syntax.
-   React cache and use hooks have trouble dealing with cache invalidation, as in you can't do it. On top of that NextJS does not like cache hook, or indeed use hook and will throw errors while still working. Stick to SWR or React Query.
-   NextJS caching for fetch didn't work for me in this project. I've made it to somewhat work in the testing environment but even there there were issues with tags invalidation causing excessive glitches when reapplying css during rerendering and fetch request being fired anyway despite tags present. In the end I've conceded to a not pretty solution of storing data in Zustand store on the first fetch, which worked. Redux-query would make this a much better solution.
-   App routes and server actions. Both worked as expected, no issues to speak of. I would like to try making a project using server actions only, so it does not requre any js on the client side at all to fetch data.

## Author

-   Website - [warlockja](https://warlockja.ru)
-   Frontend Mentor - [@warlockja](https://www.frontendmentor.io/profile/WarlockJa)
