import {GraphQLBoolean, GraphQLList, GraphQLObjectType, GraphQLSchema, GraphQLString} from 'graphql'
import { checkAuth } from '../middleware/auth'
import { createTodo, deleteTodo, getSingleTodo, getTodos, updateTodo } from '../services/todoServices'
import { login } from '../services/userService'

import { deletedResponse, loginInput, todoInput, todoType } from './types'

const query = new GraphQLObjectType({
    name: "Query",
    description: "The root query",
    fields: () => ({
        hello: {
            type: GraphQLString,
            resolve: (parent, args, request) => request.header('auth')
        },
        getTodos: {
            type: new GraphQLList(todoType),
            description: "A list of all todos",
            args: {
                completed : {
                    type: GraphQLBoolean
                }
            },
            resolve: async(source, args, req) => {
                const user = await checkAuth(req.header('auth'))
                return await getTodos(args.completed, user)
            }
        },
        getSingleTodo: {
            type: todoType,
            description: "A single todo to be gotten by id",
            args: {
                id : {
                    type: GraphQLString,
                    description: " Id of the todo to be retrieved"
                }
            },
            resolve: async(parent, args, req) => {
                const user = await checkAuth(req.header('auth'))
                return await getSingleTodo(args.id, user)
            }
        }
    })
})

const mutation = new GraphQLObjectType({
    name: "Mutations",
    description: "Mutations to transfaorm the database",
    fields: () => ({
        login: {
            type: GraphQLString,
            description: "Run this to login a user",
            args: {
                user: {
                    type: loginInput,
                    description: "The user information to login with"
                }
            },
            resolve: async(parent, args) => await login(args.user)
        },
        postTodo: {
            type: todoType,
            description: "This creates a todo unto the database",
            args: {
                todo: {
                    type: todoInput,
                    description: " The input data to be updated with"
                }
            },
            resolve: async(parent, args, req) => { 
                const user = await checkAuth(req.header('auth'))
                return await createTodo(args.todo, user) 
            }
        },
        updateTodo: {
            type: todoType,
            description: "This updates a todo on the database",
            args: {
                id : {
                    type: GraphQLString,
                    description: " Id of the todo to be updated"
                },
                todo: {
                    type: todoInput,
                    description: " The input data to be updated with"
                },
                completed : {
                    type: GraphQLBoolean,
                    description: "Add this to update the status of the todo to true."
                }
            },
            resolve: async(parent, args, req) => { 
                const user = await checkAuth(req.header('auth'))
                console.log(args.completed, "argument")
                return await updateTodo(args.id, args.todo, args.completed) 
            }
        },
        deleteTodo: {
            type: deletedResponse,
            description: "This deletes a todo from the database by id",
            args: {
                id : {
                    type: GraphQLString,
                    description: " Id of the todo to be deleted"
                }
            },
            resolve: async(parent, args, req) => {
                const user = await checkAuth(req.header('auth'))
                return await deleteTodo(args.id)
            }
        }
    })
})

const schema = new GraphQLSchema({
    query,
    mutation
})

export default schema