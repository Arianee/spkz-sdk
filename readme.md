A node server


UNIT TESTING: with jest.




* environments (dir)
   * environment.prod.ts
   * environment.dev.ts
* .travis.yml
* .gitignore
* readme.md
* eslint.rc
* dist <- compiled javascript
   * environments
   * src
* src
   * middlewares
      * middlewareName
         * index.ts
         * libs (dir)
   * services
      * featureFlipService
      * databaseService (dir)
         * index.ts
      * brietlingService (dir)
      * facebookService
      * branchioService
      * batchService
      * blockchainListenersService
   * index.ts => implements routing or plug with firebase
   * routes (dir)
      * featureName (dir)
         * index.ts
         * routes.ts
         * libs (dir)




routes/hello/hello.ts
app.get(‘/hello’, (req,res)=>{
res.send(‘World’);
})


routes.ts
{libExample} from ‘./libs’;
app.get(‘/hello’, authMiddleWare, (req,res)=>{


const {myParam}= req.body.queryParams


const result=libExample(myParam);
if(result){
res.sendStatus(200)
}
else{
res.sendStatus(500)
}


});
