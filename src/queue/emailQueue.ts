//list of jobs waiting to process asynchronously
import {Queue} from 'bullmq'
import redisConnection from 'src/config/redisConfig'


export const emailQueue = new Queue('email',{
    connection:redisConnection, //this tells bullmq where to store and read queue data from
    defaultJobOptions:{
        attempts:3,
        //defines how bullmq delays retries after failure
        backoff:{type:'exponential', delay:5000},  //exponential -> backoff strategy -> start from 5sec
        removeOnComplete:true, //delete job from redis
        removeOnFail:100 //keep 100 failed jobs in redis
    }
});












//types of backoff strategy:
//fixed -> always same delay
//exponential -> increasing delay
//custom -> function for delay