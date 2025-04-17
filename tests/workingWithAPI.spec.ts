import { test, expect,request } from '@playwright/test';
import tags from '../test-data/tags.json'
// we pass the file name as tags

test.beforeEach( async ({ page }) => {

//we need to first provide the browser make a call to a certain api to configure properly
//we provide */**  wild cards to match the any pattern when we make the api call
//when we mock the api calls we need to use method pag.route and provide the api endpoitn we want to mock
//we need to define all routes before browser make certain api calls 
//because the browser will perform appi call to ge the text while the application is loaded 
//we created json object in the file to read the json from there 
//before we interact with the browser we should brovide it here 


 await page.route('*/**/api/tags',async route=>{
  


   await route.fulfill ({
     contentType: 'application/json',
     body: JSON.stringify(tags)
   })
  



 })
   await page.goto('https://conduit.bondaracademy.com/');
   
});


test('has title',async({page})=>{
  await page.route('*/**/api/articles*',async route=>{
    
    const response =await route.fetch()
  // we updated the response body 
     const responseBody= await response.json() // we return json body so we use json()
     responseBody.articles[0].title = "This is a MOCK test title"
     responseBody.articles[0].description = "This is a MOCK description"
  
  //we need to just fulfill the modified response as a desired reponse in the application
     await route.fulfill({
      body:JSON.stringify(responseBody)
     })
  
  })

await page.waitForTimeout(2000)
 await page.getByText('Global Feed').click()
await expect(page.locator('.navbar-brand')).toHaveText('conduit')
await expect(page.locator('app-article-list h1').first()).toContainText('This is a MOCK test title')
await expect(page.locator('app-article-list p').first()).toContainText('This is a MOCK description')
})




test('delete artcicle',async({page,request})=>{

// we need to make api call

// we need to first import request fxture from playwright library and inside the test 
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
//console.log(responseBody.user.token)
// I retrived the url by creating article on the page and got the url from response
const artcileResponse =await request.post('https://conduit-api.bondaracademy.com/api/articles/',{
//then I clicke the payload/view source
     data:{
        "article":{"title":"This is a test title","description":"test article","body":"article","tagList":[]}
     },
     headers :{
      Authorization:`Token ${accesToken}`
     }

    


})

//make assetion that the article created 

await page.waitForTimeout(5000)

expect(artcileResponse.status()).toEqual(201)

//then delete the article
await page.getByText('Global Feed').click()
await page.waitForTimeout(5000)
await page.getByText('This is a test title').click()
await page.waitForTimeout(5000)
await page.getByRole('button',{name:"Delete Article"}).first().click()
await page.waitForTimeout(5000)
await expect(page.locator('app-article-list h1').first()).not.toContainText('new article')

})


test('create article',async({page,request})=>{

await page.getByText('New Article').click()
await page.getByRole('textbox',{name:'Article Title'}).fill('Playwright is awesome')
//we use the backslah when there is a conflict for""
await page.getByRole('textbox',{name:'What\'s this article about?'}).fill('About the playwright')
await page.getByRole('textbox',{name:'Write your article (in markdown)'}).fill('blah blah')
await page.waitForTimeout(2000)
await page.getByRole("button",{name:'Publish Article'}).click()

//we will wait for the api response and we will use method 
const articleResponse =await page.waitForResponse('https://conduit-api.bondaracademy.com/api/articles/')
const responseBodyArticle = await articleResponse.json()
const slugId = responseBodyArticle.article.slug //unique id

await expect (page.locator('.article-page h1')).toContainText('Playwright is awesome')
await page.getByText('Home').click()
await page.getByText('Global Feed').click()
await expect(page.locator('app-article-list h1').first()).toContainText('Playwright is awesome')


//in order to delete it we need an acces token

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

   const deleteArticleRequest =await request.delete(`https://conduit-api.bondaracademy.com/api/articles/${slugId}`,{
      headers :{
         Authorization:`Token ${accesToken}`
        }
   
   })
      
   expect (deleteArticleRequest.status()).toEqual(204)
   





  
})
