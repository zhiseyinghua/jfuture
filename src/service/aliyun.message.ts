const Core = require('@alicloud/pop-core');

var client = new Core({
  accessKeyId: '<accessKeyId>',
  accessKeySecret: '<accessSecret>',
  endpoint: 'https://dysmsapi.aliyuncs.com',
  apiVersion: '2017-05-25',
});

var params = {
  RegionId: 'cn-hangzhou',
};

var requestOption = {
  method: 'POST',
};

client.request('AddShortUrl', params, requestOption).then(
  (result) => {
    console.log(JSON.stringify(result));
  },
  (ex) => {
    console.log(ex);
  },
);
