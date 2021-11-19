# simple web app using jwt authentication 
- express
- jsonwebtoken
- cookie-parser
- mongoose
- https://getbootstrap.com/docs/5.0

npm run dev
npm run start


the jwt token will expire in 50 seconds so user need to login again


https://stackoverflow.com/questions/45893368/files-uploaded-with-multer-disappears-when-the-heroku-server-restarts  
```
/api/file                POST to upload file  
/files/:uuid             GET  to view the   download link page
/files/download/:uuid    GET  to download the file  
```

file

maximum file(upload) size limit is set 10MB in `file.js` file for route `POST /api/file`

// https://www.gbmb.org/mb-to-bytes  
1MegaByte = 2¹⁰*2¹⁰ = 2²⁰ bytes = 1,048,576 bytes (when base is 2)  
1KiloByte =           2¹⁰ bytes =      1024 bytes (when base is 2)


__password reset feature__ user can enter her mail and one time password reset link will be mailed to her, from where she can reset passwrod  
JSONWEBTOKEN expiry is set to 2 minutes  

**login behind one time pwd reset link**  
use the old password as secret(along with the server jwt secret) whilt signing jwt token

so once we reset our password  
our pwd get changed on the db
and that reset link will not work therafter. 

