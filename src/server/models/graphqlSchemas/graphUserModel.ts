import {GraphQLObjectType, GraphQLID, GraphQLString, GraphQLBoolean, GraphQLSchema} from 'graphql';

import User from '../userModel';

const graphUserModel: GraphQLObjectType<any, any> = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    _id: {type: GraphQLID},
    email: {type: GraphQLString},
    password: {type: GraphQLString},
    role: {type: GraphQLString},
    isActivated: {type: GraphQLBoolean},
    activationLink: {type: GraphQLString},
    createData: {type: GraphQLString},
  }),
});

const userQuery: GraphQLObjectType<any, any> = new GraphQLObjectType({
  name: 'userQuery',
  fields: {
    user: {
      type: graphUserModel,
      args: {email: {type: GraphQLString}},
      resolve: (parent, args)=> {
        return User.findOne({email: args.email});
      },
    },
  },
});


export default new GraphQLSchema({
  query: userQuery,
});
