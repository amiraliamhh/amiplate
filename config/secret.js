module.exports = {
    
    mongodatabase: process.env.MongoDATABASE || 'mongodb://127.0.0.1:27017/starter-template-amirali-ameri',
    port: process.env.PORT || 3000,
    secret: process.env.SECRET || 'starter-template-amirali-ameri',
    
}