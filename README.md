# TinyApp Project

TinyApp is a full stack web application built with Node and Express that allows users to shorten long URLs (à la bit.ly).

## Final Product

!["The urls page img with Login and Register buttons"](/docs/urls.png "urls page")
- This is the page when the users first login to the '/urls', they can do Register or Login with the buttons.

#### The page reacts differently with Not Login and Login
!["Scrolling down the Menu Bar in urls page when users not login"](/docs/urls_scrolldown.png )
- There are 2 links when the users scroll the Menu Bar down: 'My URLS' and 'Create New URL'

!["The 'Create New URL' goes to its page but with Login text"](/docs/urls:new.png)
- The "My URLS" is being redirected to the same page; the "Create New URL" will goes to its own page and does not show any URL but a Error Messaeg like above.

!["The Login page"](/docs/:login.png)
- The above picture is the Login page which is the destination page of Login buttons in the '/urls' page.

!["The Register page"](/docs/:register.png)
- The above picture is the Register page which is the destination page of Register buttons in the '/urls' page.


#### After registering / Loging in an account
!["The Urls page after registering an account"](/docs/after_L:R/urls.png)
- The app will lead the users to their own URLS














## Dependencies

- Node.js
- Express
- EJS
- bcrypt
- body-parser
- cookie-session

## Getting Started

- Install all dependencies (using the `npm install` command).
- Run the development web server using the `node express_server.js` command.