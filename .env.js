const env = 'prod' // dev test rc prod 编译时候使用环境，需要修改该值

if(env === 'dev'){
    //开发环境
    var ENV_CONFIG = require('.env.dev.js');
}else if(env === 'test'){
    //测试环境
    var ENV_CONFIG = require('.env.test.js');
}else if(env === 'rc'){
    //rc环境
    var ENV_CONFIG = require('.env.rc.js');
}else if(env === 'prod'){
    //生产环境
    var ENV_CONFIG = require('.env.prod.js');
}
 
//给环境变量process.uniEnv赋值  使用 process.uniEnv.baseUrl
if (ENV_CONFIG) {
    process.uniEnv = {};
    for (let key in ENV_CONFIG) {
        process.uniEnv[key] = ENV_CONFIG[key];
    }
}