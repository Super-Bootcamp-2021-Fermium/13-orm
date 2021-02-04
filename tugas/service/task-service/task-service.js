const Busboy = require('busboy');
const { Writable } = require('stream');
const { saveFile } = require('../../lib/storage');
const { writeTask } = require('../../lib/orm/main');

async function addTaskService(req, res) {
  const busboy = new Busboy({ headers: req.headers });
  // let data = JSON.parse(await getData('data-pekerjaan'));
  let formData = new Map();

  // if (!data) {
  //   data = { pekerjaan: [] };
  // }

  function abort() {
    req.unpipe(busboy);
    if (!req.aborted) {
      res.statusCode = 413;
      res.end();
    }
  }

  busboy.on('file', async (fieldname, file, filename, encoding, mimetype) => {
    switch (fieldname) {
      case 'attachment':
        {
          try {
            const attachment = await saveFile(file, mimetype, fieldname);
            formData.set(fieldname, attachment);
          } catch (err) {
            abort();
          }
        }
        break;
      default: {
        const noop = new Writable({
          write(chunk, encding, callback) {
            setImmediate(callback);
          },
        });
        file.pipe(noop);
      }
    }
  });

  busboy.on('field', async (fieldname, val) => {
    formData.set(fieldname, val);
  });

  busboy.on('finish', async () => {
    formData.set('status', 'belum selesai');
    // let obj = Object.fromEntries(formData);
    // data.pekerjaan.push(obj);
    // await setData('data-pekerjaan', JSON.stringify(data));
    await writeTask({ job: 'makan', assignee: 1 });
    res.write('data pekerjaan berhasil disimpan');
    res.end();
  });

  req.on('aborted', abort);
  busboy.on('error', abort);

  req.pipe(busboy);
}

async function finishService(req, res) {
  const busboy = new Busboy({ headers: req.headers });
  let name;

  function abort() {
    req.unpipe(busboy);
    if (!req.aborted) {
      res.statusCode = 413;
      res.end();
    }
  }

  busboy.on('field', async (fieldname, val) => {
    name = val;
  });

  busboy.on('finish', async () => {
    // const data = JSON.parse(await getData('data-pekerjaan'));

    // for (let i = 0; i < data.pekerjaan.length; i++) {
    //   if (data.pekerjaan[i].nama === name) {
    //     data.pekerjaan[i].status = 'sudah selesai';
    //   }
    // }
    // await setData('data-pekerjaan', JSON.stringify(data));
    res.statusCode = 200;
    res.write(`pekerjaan ${name} berhasil diselesaikan`);
    res.end();
  });

  req.on('aborted', abort);
  busboy.on('error', abort);

  req.pipe(busboy);
}

async function cancelService(req, res) {
  const busboy = new Busboy({ headers: req.headers });
  let name;

  function abort() {
    req.unpipe(busboy);
    if (!req.aborted) {
      res.statusCode = 413;
      res.end();
    }
  }

  busboy.on('field', async (fieldname, val) => {
    name = val;
  });

  busboy.on('finish', async () => {
    // const data = JSON.parse(await getData('data-pekerjaan'));

    // for (let i = 0; i < data.pekerjaan.length; i++) {
    //   if (data.pekerjaan[i].nama === name) {
    //     data.pekerjaan[i].status = 'dibatalkan';
    //   }
    // }
    // await setData('data-pekerjaan', JSON.stringify(data));
    res.statusCode = 200;
    res.write(`pekerjaan ${name} telah dibatalkan`);
    res.end();
  });

  req.on('aborted', abort);
  busboy.on('error', abort);

  req.pipe(busboy);
}

async function readService(req, res) {
  // const data = await getData('data-pekerjaan');
  res.setHeader('Content-Type', 'application/json');
  // res.write(data);
  res.statusCode = 200;
  res.end();
}

module.exports = {
  addTaskService,
  readService,
  finishService,
  cancelService,
};
