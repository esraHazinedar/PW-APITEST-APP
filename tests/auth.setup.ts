import {test as setup} from '@playwright/test';  //test as setup I am renamint it as setup


const authFile = '.auth/user.json' //named the file according to me we will save it in this file 
setup('authentication',async({page})=>{
    await page.goto('https://conduit.bondaracademy.com/');
   //await page.waitForTimeout(1000);
   await page.getByText('Sign in').click()
   await page.getByRole('textbox',{name:'Email'}).fill('esratest999@test.com')
   await page.getByRole('textbox',{name:'Password'}).fill('123456')
   await page.getByRole('button').click()
   // we need to make sure the whatever response is loaded  we can chhose the loaded state of the element to make sure it was loaded form api call
   await page.waitForResponse('https://conduit-api.bondaracademy.com/api/tags')

//want to save the state here and provide the file 
   await page.context().storageState({path:authFile})


   //after that we need to config the playwright.congig.ts to handle this setup method 
})