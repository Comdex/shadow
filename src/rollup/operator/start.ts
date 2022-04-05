import { createApp } from './operator';

Promise.resolve()
  .then(async () => {
    const app = await createApp();
    app.listen(8080, async () => {
      console.log('shadow app server started at port: 8080!');
    });
  })
  .catch((err) => {
    console.log('Server start failed!');
    console.log(err);
  });
