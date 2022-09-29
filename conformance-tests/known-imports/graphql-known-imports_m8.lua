-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/known-imports/graphql-known-imports_m8.js
local Packages --[[ ROBLOX comment: must define Packages module ]]
local apolloClientModule = require(Packages.ApolloClient)
local useQuery = apolloClientModule.useQuery
local useMutation = apolloClientModule.useMutation
local gql = require(Packages.GraphqlTag).gql
local graphqlModule = require(Packages.GraphQL)
local graphql = graphqlModule.graphql
local GraphQLSchema = graphqlModule.GraphQLSchema
local GraphQLObjectType = graphqlModule.GraphQLObjectType
local GraphQLString = graphqlModule.GraphQLString
