// Импортируем необходимые функции библиотеки graphql
import {GraphQLObjectType, GraphQLID, GraphQLString,
  GraphQLBoolean, GraphQLSchema, GraphQLList, GraphQLNonNull} from 'graphql';

// Импортируем модули
import User from './userModel';
import Token from './tokenModel';

// Стандартная graphql схема Пользователя - User
const graphUserModel: GraphQLObjectType<any, any> = new GraphQLObjectType({
  name: 'User',
  description: 'GraphQL model for User',
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

// Стандартная graphql схема Токена - Token
const graphTokenModel: GraphQLObjectType<any, any> = new GraphQLObjectType({
  name: 'Token',
  description: 'GraphQL model for Token',
  fields: () => ({
    _id: {type: GraphQLID},
    refreshToken: {type: GraphQLString},
    createData: {type: GraphQLString},
    user: {type: graphUserModel,
      resolve: (parent, args)=> {
        return User.findOne({_id: parent.user});
      },
    },
  }),
});

// Дефолтная Query для отправки запросов
const Query: GraphQLObjectType<any, any> = new GraphQLObjectType({
  name: 'Query',
  fields: {
    // Получение всех пользователей
    allUsers: {
      description: 'Getting all users',
      type: new GraphQLList(graphUserModel),
      resolve: (parent, args)=> {
        return User.find();
      },
    },
    // Получение пользователя по емайл
    userByEmail: {
      description: 'Getting user by email',
      type: graphUserModel,
      args: {email: {type: new GraphQLNonNull(GraphQLString)}},
      resolve: (parent, args)=> {
        return User.findOne({email: args.email});
      },
    },
    // Получение пользователя по айди
    userById: {
      description: 'Getting user by id',
      type: graphUserModel,
      args: {_id: {type: new GraphQLNonNull(GraphQLID)}},
      resolve: (parent, args)=> {
        return User.findById({_id: args._id});
      },
    },
    // Получение всех токенов
    allTokens: {
      description: 'Getting all tokens',
      type: new GraphQLList(graphTokenModel),
      resolve: (parent, args)=> {
        return Token.find();
      },
    },
    // Получение токена по айди
    tokenById: {
      description: 'Getting token by id',
      type: graphTokenModel,
      args: {_id: {type: new GraphQLNonNull(GraphQLID)}},
      resolve: (parent, args)=> {
        return Token.findOne({_id: args._id});
      },
    },
    // Получение токена по айди пользователя
    tokenByUser: {
      description: 'Getting token by user id',
      type: graphTokenModel,
      args: {user: {type: new GraphQLNonNull(GraphQLID)}},
      resolve: (parent, args)=> {
        return Token.findOne({user: args.user});
      },
    },
  },
});

// Дефолтная Mutation для отправки запросов
const Mutation: GraphQLObjectType<any, any> = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    // Добавление нового пользователя
    addUser: {
      description: 'Adding new User',
      type: graphUserModel,
      args: {
        email: {type: new GraphQLNonNull(GraphQLString)},
        password: {type: new GraphQLNonNull(GraphQLString)},
        role: {type: GraphQLString},
        isActivated: {type: GraphQLBoolean},
        activationLink: {type: GraphQLString},
      },
      resolve: async (parent, args)=> {
        const newUser = await User.create({
          email: args.email,
          password: args.password,
          role: args.role,
          isActivated: args.isActivated,
          activationLink: args.activationLink,
        });
        return await newUser.save();
      },
    },
    // Добавление нового Токена
    addToken: {
      description: 'Adding new Token',
      type: graphTokenModel,
      args: {
        refreshToken: {type: new GraphQLNonNull(GraphQLString)},
        user: {type: new GraphQLNonNull(GraphQLID)},
      },
      resolve: async (parent, args)=> {
        const newToken = await Token.create({
          refreshToken: args.refreshToken,
          user: args.user,
        });
        return await newToken.save();
      },
    },
    // Обновление старого пользователя
    updateUser: {
      description: 'Updating old User',
      type: graphUserModel,
      args: {
        _id: {type: GraphQLID},
        email: {type: GraphQLString},
        password: {type: GraphQLString},
        role: {type: GraphQLString},
        isActivated: {type: GraphQLBoolean},
        activationLink: {type: GraphQLString},
      },
      resolve: (parent, args)=> {
        return User.findByIdAndUpdate(args._id, {
          $set: {
            email: args.email,
            password: args.password,
            role: args.role,
            isActivated: args.isActivated,
            activationLink: args.activationLink,
          },
        }, {new: true});
      },
    },
    // Обновление старого токена
    updateToken: {
      description: 'Updating old Token',
      type: graphTokenModel,
      args: {
        _id: {type: GraphQLID},
        refreshToken: {type: GraphQLString},
        user: {type: GraphQLID},
      },
      resolve: (parent, args)=> {
        return Token.findByIdAndUpdate(args._id, {
          $set: {
            refreshToken: args.refreshToken,
            user: args.user,
          },
        }, {new: true});
      },
    },
    // Удаление пользователя для айди
    deleteUserById: {
      description: 'Deleting user by id',
      type: graphUserModel,
      args: {_id: {type: new GraphQLNonNull(GraphQLID)}},
      resolve: async (parent, args)=> {
        return User.findByIdAndDelete(args._id);
      },
    },
    // Удаление пользователя для емайл
    deleteUserByEmail: {
      description: 'Deleting user by email',
      type: graphUserModel,
      args: {email: {type: new GraphQLNonNull(GraphQLString)}},
      resolve: async (parent, args)=> {
        return User.findOneAndDelete(args.email);
      },
    },
    // Удаление токена для айди
    deleteTokenById: {
      description: 'Deleting token by id',
      type: graphTokenModel,
      args: {_id: {type: new GraphQLNonNull(GraphQLID)}},
      resolve: async (parent, args)=> {
        return Token.findByIdAndDelete(args._id);
      },
    },
    // Удаление токена для пользователю
    deleteTokenByUser: {
      description: 'Deleting token by user',
      type: graphTokenModel,
      args: {user: {type: new GraphQLNonNull(GraphQLID)}},
      resolve: async (parent, args)=> {
        return Token.findOneAndDelete(args.user);
      },
    },
  },
});

// Экспортируем данную дефолтную схему
export default new GraphQLSchema({
  query: Query,
  mutation: Mutation,
});
