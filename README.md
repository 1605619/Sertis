`Blogging Project`

This is a blogging project built using Parcel, React, Redux, Node.js, and MongoDB. It provides a platform for users to register, login, and create blog posts.

Tech Stack : Parcel, React, Redux, MVC, Node JS, MongoDB

Features :
1. Login/Register flow using Email/password - Storing User data in `users` collection in MongoDB
    - Validate email id
    - using jwt tokens
    - Singleton pattern used for creating DB connection
2. Create Blogs with Title, Category, Content, Author, Status (`published` or `draft`) 
    - Blogs are stored in `blogs` collection in MongoDB.
    - User can create blogs only when they are loggedIn.
    - There's limit on size of `Title` (upto 10 words long) & `Content` (upto 2000 words long) - to ensure users don't dump large data
    - User Inputs are validated & Santized for XSS prevention
3. Edit blogs - User can edit Title, Content, Category, Status of Blogs they had created.
    - Users can't edit blogs posted by others.
    - Users need to be logged in to be able to do the Edit operation.
4. Delete Blogs - Users can delete blogs they had created 
    - Users can't delete blogs created by others.
    - Users need to be logged in to be able to do the delete operation.
5. Save as Draft - Users can save blogs as draft
    - It will be only visible to users who had created it on the `Activity` page
    - Click on `My Draft` chip on Activity page to see your drafts, or your drafts will be shown on Acitivity page (just to you).
    - You need to be logged in to be able to see your drafted blogs.
6. Pagination & Sorting 
    - Blogs on activity page are sorted based on posted time
    - Each page shows maximum 20 blogs
7. Top 10 categories are shown on `Acitvity` page with #posts associated with it.
8. MongoDB used for storing data as Database
    - `blogs` & `users` collections used for storing Blogs and Users data respectively.
9. `parcel` used for optimisations & HMR


To run the project in local:

1. `git clone https://github.com/1605619/Sertis.git`
2. Create a `.env` file in backend/ folder, and give DB & PORT

Frontend: 
1. `npm install`
2. `npx parcel index.html`
    - Parcel will run the project in local server at Port 1234
Backend: 
0. `cd backend/`
1. `npm install`
2. `node app.js `
    - Server will start running on Port 3000


For any issues kindly reach out to me on `priyanshuagarwalofficial@gmail.com`