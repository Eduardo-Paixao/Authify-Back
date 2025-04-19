import app from '../src/index'
import awsLambdaFastify from '@fastify/aws-lambda'

const proxy = awsLambdaFastify(app)

export const handler = proxy