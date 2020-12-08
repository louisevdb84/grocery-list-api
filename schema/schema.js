const graphql = require('graphql');
const Item = require('../models/item');
const Shop = require('../models/shop');

const { 
    GraphQLObjectType, GraphQLString, 
    GraphQLID, GraphQLSchema, 
    GraphQLList,GraphQLNonNull 
} = graphql;

//Schema defines data on the Graph like object types(book type), relation between 
//these object types and describes how it can reach into the graph to interact with 
//the data to retrieve or mutate the data   

const ItemType = new GraphQLObjectType({
    name: 'Item',
    //We are wrapping fields in the function as we dont want to execute this ultil 
    //everything is inilized. For example below code will throw error ShopType not 
    //found if not wrapped in a function
    fields: () => ({
        id: { type: GraphQLID  },
        name: { type: GraphQLString },         
        shop:{
            type: new GraphQLList(ShopType),
            resolve(parent,args){                                
                return Shop.find({ _id: parent.shopID });
            }
        }
       
       
            // return Shop.findById(parent.shopID);
       
    })
});

const ShopType = new GraphQLObjectType({
    name: 'Shop',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },        
        item:{
            type: new GraphQLList(ItemType),
            resolve(parent,args){
                return Item.find({ shopID: parent.id });
            }
        }
    })
})

//RootQuery describe how users can use the graph and grab data.
//E.g Root query to get all authors, get all books, get a particular 
//book or get a particular author.
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        item: {
            type: ItemType,
            //argument passed by the user while making the query
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                //Here we define how to get data from database source

                //this will return the book with id passed in argument 
                //by the user
                return Item.findById(args.id);
            }
        },
        items:{
            type: new GraphQLList(ItemType),
            resolve(parent, args) {
                return Item.find({});
            }
        },
        shop:{
            type: ShopType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return Shop.findById(args.id);
            }
        },
        shops:{
            type: new GraphQLList(ShopType),
            resolve(parent, args) {
                return Shop.find({});
            }
        }
    }
});
 
//Very similar to RootQuery helps user to add/update to the database.
const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addShop_API: {
            type: ShopType,
            args: {
                //GraphQLNonNull make these field required
                name: { type: new GraphQLNonNull(GraphQLString) },                
            },
            resolve(parent, args) {
                let shop = new Shop({
                    name: args.name,
                    // age: args.age
                });
                return shop.save();
            }
        },
        addItem_API:{
            type:ItemType,
            args:{
                name: { type: new GraphQLNonNull(GraphQLString)},                
                shopID: { type: GraphQLList(GraphQLString)},                
            },
            resolve(parent,args){                
                let item = new Item({
                    name:args.name,                    
                    shopID:args.shopID,                    
                })
                return item.save()
            }
        },

        // async updateProduct(root, {_id, input}){
        //     return await Product.findOneAndUpdate({_id},input,{new: true})
        // },

        deleteItem:{
            type:ItemType,
            args:{
                _id: { type: new GraphQLNonNull(GraphQLString)},               
                
            },
            resolve(parent,args){                
               return Item.findByIdAndRemove(args._id);
            }
        }
    }
});

//Creating a new GraphQL Schema, with options query which defines query 
//we will allow users to use when they are making request.
module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation:Mutation
});