const graphql = require('graphql');
const Item = require('../models/item');
const Shop = require('../models/shop');
const SuggestedItem = require('../models/suggestedItem');

const { 
    GraphQLObjectType, GraphQLString, 
    GraphQLID, GraphQLSchema, 
    GraphQLList,GraphQLNonNull, GraphQLBoolean
} = graphql;


const ItemType = new GraphQLObjectType({
    name: 'Item',
    fields: () => ({
        id: { type: GraphQLID  },
        name: { type: GraphQLString },    
        completed: {type: GraphQLBoolean},
        ordered: {type: GraphQLBoolean},
        shop:{
            type: new GraphQLList(ShopType),
            resolve(parent,args){                                
                return Shop.find({ _id: parent.shopID });
            }
        }
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

const SuggestedItemType = new GraphQLObjectType({
    name: 'SuggestedItem',
    fields: () => ({
        id: { type: GraphQLID  },
        name: { type: GraphQLString },            
        isWeekly: {type: GraphQLBoolean},
        shop:{
            type: new GraphQLList(ShopType),
            resolve(parent,args){                                
                return Shop.find({ _id: parent.shopID });
            }
       }         
    })
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        item: {
            type: ItemType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return Item.findById(args.id);
            }
        },
        items:{
            type: new GraphQLList(ItemType),
            resolve(parent, args) {
                return Item.find({});
            }
        },
        suggestedItems:{
            type: new GraphQLList(SuggestedItemType),
            resolve(parent, args) {
                return SuggestedItem.find({});
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

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addShop_API: {
            type: ShopType,
            args: {                
                name: { type: new GraphQLNonNull(GraphQLString) },                
            },
            resolve(parent, args) {
                let shop = new Shop({
                    name: args.name,                
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
                    completed: false,
                    ordered: false               
                })
                return item.save()
            }
        },

        addSuggestedItem_API:{
            type:SuggestedItemType,
            args:{
                name: { type: new GraphQLNonNull(GraphQLString)},  
                isWeekly: {type: GraphQLBoolean},
                shopID: { type: GraphQLList(GraphQLString)},           
            },
            resolve(parent,args){                
                let suggestedItem = new SuggestedItem({
                    name:args.name,                    
                    shopID:args.shopID,                         
                    isWeekly: args.isWeekly               
                })
                return suggestedItem.save()
            }
        },

        updateCompletedItem:{
            type:ItemType,
            args:{
                _id: { type: new GraphQLNonNull(GraphQLString)},  
                completed: {type: new GraphQLNonNull(GraphQLBoolean)},         
                
            },
            resolve(parent,args){                              
               return Item.findByIdAndUpdate(args._id, {completed: args.completed});
            }
        },

        updateOrderedItem:{
            type:ItemType,
            args:{
                _id: { type: new GraphQLNonNull(GraphQLString)},               
                ordered: {type: new GraphQLNonNull(GraphQLBoolean)},         
                
            },
            resolve(parent,args){                   
               return Item.findByIdAndUpdate(args._id, {ordered: args.ordered});
            }
        },
        editItem:{
            type:ItemType,
            args:{
                _id: { type: new GraphQLNonNull(GraphQLString)},               
                name: { type: new GraphQLNonNull(GraphQLString)},                
                shopID: { type: GraphQLList(GraphQLString)},   
            },
            resolve(parent,args){                   
               return Item.findByIdAndUpdate(args._id, {
                   name: args.name,
                   shopID: args.shopID
                });
            }
        },


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

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation:Mutation
});