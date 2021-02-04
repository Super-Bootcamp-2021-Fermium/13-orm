const { createServer } = require('http');
const url = require('url');
const { stdout } = require('process');
const {
  postService,
  readWorkerService,
  deleteService,
} = require('../service/worker-service/worker-service');
const {
  addTaskService,
  finishService,
  cancelService,
  readService,
} = require('../service/task-service/task-service');

const server = createServer((req, res) => {
  let method = req.method;
  // route service
  let message = 'tidak ditemukan data';
  let statusCode = 200;
  const uri = url.parse(req.url, true);
  const respond = () => {
    res.statusCode = statusCode;
    res.write(message);
    res.end();
  };
  switch (true) {
    case uri.pathname === '/pekerja/store':
      if (method === 'POST') {
        postService(req, res);
      } else {
        message = 'Method tidak tersedia';
        respond();
      }
      break;
    case uri.pathname === '/pekerja/list':
      if (method === 'GET') {
        readWorkerService(req, res);
      } else {
        message = 'Method tidak tersedia';
        respond();
      }
      break;
    case /^\/pekerja\/delete\/\w+/.test(uri.pathname):
      if (method === 'DELETE') {
        deleteService(req, res);
      } else {
        message = 'Method tidak tersedia';
        respond();
      }
      break;
    case uri.pathname === '/pekerjaan/add':
      if (method === 'POST') {
        addTaskService(req, res);
      } else {
        message = 'Method tidak tersedia';
        respond();
      }
      break;
    case uri.pathname === '/pekerjaan/finish':
      if (method === 'POST') {
        finishService(req, res);
      } else {
        message = 'Method tidak tersedia';
        respond();
      }
      break;
    case uri.pathname === '/pekerjaan/cancel':
      if (method === 'POST') {
        cancelService(req, res);
      } else {
        message = 'Method tidak tersedia';
        respond();
      }
      break;
    case uri.pathname === '/pekerjaan/read':
      if (method === 'GET') {
        readService(req, res);
      } else {
        message = 'Method tidak tersedia';
        respond();
      }
      break;
    default:
      statusCode = 404;
      respond();
  }
});

function serve() {
  const PORT = 9999;
  server.listen(PORT, () => {
    stdout.write(`server listening on port ${PORT}\n`);
  });
}

module.exports = {
  serve,
};
