import {test as setup} from '@playwright/test';  //test as setup I am renamint it as setup
import user from '../.auth/user.json'
import fs from'fs'


const authFile = '.auth/user.json' //named the file according to me we will save it in this file 
setup('authentication',async({request})=>{
   // await page.goto('https://conduit.bondaracademy.com/');
   //await page.waitForTimeout(1000);
   //await page.getByText('Sign in').click()
  // await page.getByRole('textbox',{name:'Email'}).fill('esratest999@test.com')
  // await page.getByRole('textbox',{name:'Password'}).fill('123456')
 //  await page.getByRole('button').click()
   // we need to make sure the whatever response is loaded  we can chhose the loaded state of the element to make sure it was loaded form api call
  // await page.waitForResponse('https://conduit-api.bondaracademy.com/api/tags')

//want to save the state here and provide the file 
//   await page.context().storageState({path:authFile})


   //after that we need to config the playwright.congig.ts to handle this setup method 
   const response=await request.post('https://conduit-api.bondaracademy.com/api/users/login',{

      //request body is clalled data in playwright
      //I got the url when I first oggid in the webpage 
      data:{
        "user": {email: "esratest999@test.com", password: "123456"}
      }
      
      })
      // we made first api clall to retrive the token
      const responseBody = await response.json()
      const accesToken= responseBody.user.token
      user.origins[0].localStorage[0].value =accesToken
      //we need to update this user object the arrived canges into theis authfile with fs by fiirst path to the file as an arguemant , the second arguement user object itsel
      fs.writeFileSync(authFile,JSON.stringify(user))


      process.env['ACCESS_TOKEN'] = accesToken

      //now goto the use block which is not inside the projects 
      
})