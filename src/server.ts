import Koa from 'koa';
import bodyParser = require('koa-bodyparser');
import Router from 'koa-router';
const path = require('path');

const router = new Router();
const app = new Koa();
const cors = require('@koa/cors');
const multer = require('@koa/multer');
const serve = require('koa-static');
const mount = require('koa-mount');
const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, __dirname + '/uploads/');
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    },
  }),
});

app.use(bodyParser()).use(router.routes()).use(router.allowedMethods()).use(cors());

// Serve image assets
const imagePath = path.join(__dirname, '/uploads');
app.use(mount('/files', serve(imagePath)));

router.post('/upload', upload.single('file'), (ctx) => {
  const { date, house_id, line_id, camera_num, location_num } = ctx.request.body;
  const link = `${ctx.request.protocol}://${ctx.request.host}/files/${ctx.request.file.originalname}`
  const result =  { ok: true, file: ctx.request.file, link: link, date:date,house_id: house_id, line_id:line_id ,camera_num:camera_num ,location_num: location_num };
  console.log(result);
  ctx.body = result;
});


app.listen(5050, () => console.log('server up!'));
