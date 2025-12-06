import redis from "ioredis"

const redisConnection = new redis(process.env.REDIS_URL!,{
    maxRetriesPerRequest:null,
    enableReadyCheck:false, //sends ping to verify redis is ready before using
})

export default redisConnection