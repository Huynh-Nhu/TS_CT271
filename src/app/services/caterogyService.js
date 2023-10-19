const caterogy = require('../models/caterogyModel');
const {ObjectId} = require("mongodb")

class caterogyService{
    constructor(client) {
        this.registerRouter = client.db().collection("category");
    }
    async getAllCategory(){
      const  categories = await this.registerRouter.find().toArray();
      return  categories;
    }
    async findByName(name){
      const category = await this.registerRouter.findOne({name});
        return category;
        console.log(category);
      }


    async findById(id){
      return await this.registerRouter.findOne({
        _id: ObjectId.isValid(id) ? new ObjectId(id) :null,
      })
    }
   

    extractCaterogyFromDB(payload) {
        const caterogyModel = {
          name: payload.name,
         
        };
        
        Object.keys(caterogyModel).forEach(
          (key) => caterogyModel[key] === undefined && delete caterogyModel[key]
        );
        return caterogyModel;
      }
      
      async create(payload) {
        const caterogy = this. extractCaterogyFromDB(payload);
        console.log(caterogy);
        const result = await this.registerRouter.findOneAndUpdate(
            caterogy,
          { $set: caterogy  },
          { returnDocument: "after", upsert: true,  maxTimeMS: 30000 }
        );
        return result;
        // console.log(result);
      };
}

module.exports = caterogyService;