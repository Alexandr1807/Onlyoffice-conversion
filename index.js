const express = require('express');
const app = express();
const axios = require('axios');
const jwt = require('jsonwebtoken');
const path = require('path');
const multer = require("multer");
const options = { algorithm: "HS256", expiresIn: "5m" };
const secret = "tkTdGrLOH7Oaw8LdcItkk5ymwTh4OL";
const upload = multer({ dest: './uploads/' });
const PORT = 3000;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use('/uploads', express.static('uploads'));
app.use(express.static(__dirname + '/public'));



app.get('/', function (req, res) {
    res.render('index', {})
})

app.post('/converter', upload.single('uploaded_file'), function (req, response) {
    let filedata = req.file;
    let fileExt = path.parse(filedata.originalname).ext.slice(1)

    let key = () => {
        var key = '';
        var str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' +
            'abcdefghijklmnopqrstuvwxyz0123456789';

        for (let i = 1; i <= 12; i++) {
            var char = Math.floor(Math.random()
                * str.length + 1);

            key += str.charAt(char);
        }

        return key;
    };

    const payload = {
        "async": false,
        "filetype": fileExt,
        "key": key(),
        "outputtype": 'pdf',
        "title": `${filedata.originalname}`,
        "url": `http://localhost:3000/uploads/${filedata.filename}`
    }

    let token = jwt.sign(payload, secret, options);

    axios.post(
        'http://127.0.0.1:80/ConvertService.ashx',
        {
            "token": token
        })
        .then((res) => {
            response.render('converter', {
                link: res.data.fileUrl
            })
        })
});

app.listen(PORT, () => console.log(`The server is up and running on port ${PORT}`));